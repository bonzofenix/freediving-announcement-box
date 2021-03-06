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

let contractInstance = undefined

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      announcements: [],
      announcementBoxInstance: null,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then(results => {
      this.setState({ web3: results.web3 })
      console.log('been here')
      this.instantiateContract()
    })

    .catch(() => {
      console.log('Error finding web3.')
    })
  }


  instantiateContract = async () => {
    const contract = require('truffle-contract')
    const announcementBox = contract(AnnouncementBox)
    announcementBox.setProvider(this.state.web3.currentProvider)
    contractInstance = await announcementBox.deployed()

    const { 
      LogNewAnnouncement,
      allEvents,
      owner: getOwner,
      competitorsCount: getCompetitorsCount,
      competitors: getCompetitor,
      announcements: getAnnouncement
    } = contractInstance
      
    LogNewAnnouncement().watch( (err, log) => { 
      this.setState({announcements: [...this.state.announcements, {name: log.args.name, meters: log.args.meters}]})
    })
    // Or pass a callback to start watching immediately
    allEvents((error, log) =>{
      if(!error)
        console.log(log)
    })

    this.setState({ owner: await getOwner.call() })

    const competitorsCount = await getCompetitorsCount.call()

    for (var i = 0; i < parseInt(competitorsCount.toString(),10); i ++) {
      const address = await getCompetitor.call(i)
      const meters = await getAnnouncement.call(address)
      this.setState({announcements: [...this.state.announcements, {meters}]})
    }
  }

  onSubmit = (name, meters) => {
		this.state.web3.eth.getAccounts((error, accounts) => {
			console.log(error)
			return contractInstance.sendAnnouncement(name, meters.toString(), {from: accounts[0]}) 
    })
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
          <Competitor onSubmit={this.onSubmit} announcements={this.state.announcements}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App
