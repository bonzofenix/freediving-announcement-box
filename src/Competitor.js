import React, { Component } from 'react'

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton';

const mock = {
	form: {
		name: 'Mathias',
		meters: 33
	},
	date: Date.now(),
	open: true,
	announcements: [
		{ name: 'John', meters: 15},
		{ name: 'Tim', meters: 30},
		{ name: 'Steve', meters: 7},
		{ name: 'Mathew', meters: 55}
	]
}

class Competitor extends Component {

  state = { name: undefined, meters: undefined }

  add = task => this.setState({ tasks: [...this.state.tasks, task] })

  renderDate = () => {
  	const date = new Date(mock.date)
  	return <span>{`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}</span>
  }

  renderMeters = () => {
  	let meters = [...Array(200).keys()]
  	meters.splice(0, 1)
  	return meters.map(m => <MenuItem key={m} value={m} primaryText={`${m} meters`}/>)
  }

  renderAnnouncements = () => {
		const {announcements = [] } = this.props

  	return announcements 
  		.sort((a,b) => a.meters > b.meters)
  		.map(a => {
				return <ListItem primaryText={
		  		<div style={{ padding: '0 0 14px' }}>
		  			<span style={{ float: 'left'}}>{a.name}</span>
		  			<span style={{ float: 'right'}}>{a.meters}</span>
		  		</div> } 
	  		/>
			})
  }

  renderNameError = () => {
  	return this.state.trySubmit && !this.state.name ? 'This field is required' : ''
  }

  renderMetersError = () => {
  	return this.state.trySubmit && !this.state.meters ? 'This field is required' : ''
  }

  onName = (event, name) => this.setState({ name })
  onMeters = (event, key, meters) => this.setState({ meters })

  onSubmit = () => {
    const { name, meters } = this.state

  	name && meters 
      ? this.props.onSubmit( name, meters )
      : this.setState({ trySubmit: true })	
  }
  
  render() {
    return (
	    <div >
	    	<Paper style={{ width: '300px', marginTop: '50px', float: 'left' }}>
	    		<div style={{ padding: '20px' }}>
	    			{this.renderDate()}
	    			<span>{mock.open ? ' - OPEN' : ' - CLOSE'}</span>
	    		</div>
	    		<Divider />
	    		<div style={{ padding: '20px' }}>
		    		<TextField  onChange={this.onName} value={this.state.name} hintText="Full Name" errorText={this.renderNameError()}/>
		    		<br /><br />
		    		<SelectField onChange={this.onMeters} value={this.state.meters} errorText={this.renderMetersError()}>{this.renderMeters()}</SelectField>
		    		<br />
		    		<FlatButton onClick={this.onSubmit} label="Submit" />
	    		</div>
	    	</Paper>

	    	<Paper style={{ width: '300px', marginTop: '50px', float: 'right' }}>
	    		<div style={{ padding: '20px' }}>Announcements</div>
	    		<Divider />
	    		<List>{this.renderAnnouncements()}</List>
	    	</Paper>
	    	
	    </div>
	)
  }
}

export default Competitor
