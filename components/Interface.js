import React from 'react'
const Outcome = require('./Outcome')

var Interface = React.createClass({

	getDefaultProps: function(){
		return {
			status: 'new'
		}
	},

	render: function(){
		return(
			<div className='panel interface'>
				<Outcome status={this.props.status}/>
				<div className="btn-group btn-group-justified" role="group" aria-label="score">
					<a className="btn btn-default">Dealer Score: {this.props.dealerScore}</a>
					<a className="btn btn-default">Player Score: {this.props.playerScore}</a>
				</div>
				<br/>
        <div className="btn-group btn-group-justified" role="group" aria-label="game">
            <div className="btn-group" role="group">
                {/* received as props to the Interface component the handleDeal function is now bound to the onClick event */}
                <button onClick={this.props.deal} type="button" className="btn btn-info">Deal</button>
            </div>
            <div className="btn-group" role="group">
                <button onClick={this.props.hit} type="button" className="btn btn-success">Hit</button>
            </div>
            <div className="btn-group" role="group">
                <button onClick={this.props.stand} type="button" className="btn btn-danger">Stand</button>
            </div>
        </div>
			</div>
		);
	}
});

module.exports = Interface