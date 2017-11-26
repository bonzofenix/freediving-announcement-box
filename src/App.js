import React, { Component } from 'react'
import AnnouncementBox from '../build/contracts/AnnouncementBox.json'
import getWeb3 from './utils/getWeb3'

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

    console.log('banana 1 - a')

    announcementBox.deployed().then((instance) => {
      console.log('banana 3')
      this.setState({announcementBoxInstance: instance})
      return instance
    }).then((result) => {
      console.log('banana 4')
      return this.state.announcementBoxInstance.owner.call()
    }).then((result) => {
      return this.setState({ owner: result })
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <p>This contract was deployed by: {this.state.owner}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
