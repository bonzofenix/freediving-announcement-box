import React, { Component } from 'react'
import AnnouncementBox from '../build/contracts/AnnouncementBox.json'
import getWeb3 from './utils/getWeb3'

import logo from './logo.png'

// Components
import Competitor from './Competitor.js'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      secretAnnouncements: [],
      announcementBoxInstance: null,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }


  instantiateContract() {
    const contract = require('truffle-contract')
    const announcementBox = contract(AnnouncementBox)
    announcementBox.setProvider(this.state.web3.currentProvider)

    announcementBox.deployed().then((instance) => {
      this.setState({announcementBoxInstance: instance})
      return instance
    }).then((result) => {
      return this.state.announcementBoxInstance.owner.call()
    }).then((result) => {
      return this.setState({ owner: result })
    })
  }

  onSubmit = (name, meters) => {
    console.log(name, meters)
  }

  render() {
    return (
      <MuiThemeProvider>
        <div style={{ padding: '0 200px', textAlign: 'center' }}>
					<p>This contract was deployed by: {this.state.owner}</p>
          <header style={{ height: '150px', padding: '20px' }} >
            <img src={logo} style={{ height: '100px' }} alt="logo" />
            <h1>Free Diving Announcements</h1>
          </header>
          <Competitor onSubmit={this.onSubmit}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App
