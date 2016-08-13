import React from 'react'

const Card = require('./Card')

var Hand = React.createClass({

	getDefaultProps: function(){
		return {
			hand: []
		}
	},

	render: function(){
		return(
			<div className='hand'>

				{this.props.showDeck ? <Card hidden={true}/> : ''}
				{this.props.hand.map(function(card, i){
						return <Card face={card.f} value={card.v} key={i}/>
					})
				}
			</div>
		);
	}
});

module.exports = Hand