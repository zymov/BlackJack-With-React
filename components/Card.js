import React from 'react'

var Card = React.createClass({
	render: function(){

		var bgUrl = this.props.hidden ? 'url(img/hidden.png)' : 'url(img/' + this.props.face + '.png)';
		
		var cardStyle = {backgroundImage: bgUrl};

		return (
			<div className='card' style={cardStyle}/>
		);
	}
});

module.exports = Card