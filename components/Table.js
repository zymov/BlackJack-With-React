import React from 'react'
const Hand = require('./Hand')
const Interface = require('./Interface')

var Table = React.createClass({

	getInitialState: function(){

		var shuffled = _.shuffle(this.props.deck);
		return {
			deck: shuffled
		}
		
	},
	
	handleScore: function(hand){

		if(!hand){
			hand = [];
		}
		var score = 0;

		for(var i=0; i < hand.length; i++){
			score += hand[i].v
		}


		if(score > 21){
			var aces = _.countBy(hand, {v: 11}).true;  //check if aces is in hand or not 
			while(score > 21 && aces > 0){
				score -= 10;
				aces -= 1;
			}
		}
		return score;
	},
	
	handleDealClick: function(){

		var deck = this.state.deck;
		var [playerHand, dealerHand] = [[], []];

		if(deck.length < 5){
			deck = _.shuffle(this.props.deck);
		}

		playerHand.push(deck.pop());
		dealerHand.push(deck.pop());

		deck.pop();

		dealerHand.push(deck.pop());

		this.setState({
			player: playerHand,
			dealer: dealerHand,
			deck: deck,
			status: 'playing'			
		});

	},

	handleHitClick: function(){
		
		var newStatus = this.state.status;
		var playerHand = this.state.player;

		if(this.state.deck.length < 5){
			this.state.deck = _.shuffle(this.props.deck);
		}

		var shuffledDeck = _.shuffle(this.props.deck);

		playerHand.push(shuffledDeck.pop());

		var newScore = this.handleScore(playerHand);

		if(newScore > 21){
			newStatus = 'lose';
		}
		if(newScore < 21 && playerHand.length > 5){
			newStatus = 'win';
		}

		this.setState({
			player: playerHand,
			playerScore: newScore,
			deck: shuffledDeck,
			status: newStatus
		});

	},

	handleStandClick: function(){

		var dealerHand = this.state.dealer;
		var deck = this.state.deck;

		if(deck.length < 5) {
      deck = _.shuffle(this.props.deck);
    }

    var shuffled = _.shuffle(deck);

    var dealerScore = this.handleScore(dealerHand);
    var playerScore = this.handleScore(this.state.player);

    var dealerHasCharlie = false;

    while (dealerScore < playerScore || dealerScore <= 17) {

      // deal a card
      dealerHand.push(shuffled.pop());
      dealerScore = this.handleScore(dealerHand);

      if(dealerScore < 21 && dealerHand.length == 5){
          // five card charlie
          dealerHasCharlie = true;
          break;
      }
    }

    this.setState({
      dealer :  dealerHand,
      deck : shuffled,
      // compute game status
      status : (dealerScore < 21 || dealerHasCharlie) ? 'lose' : 'win'
    });

	},

	render: function(){
		return(
			<div clasName="table-board">
				<Hand showDeck={true} hand={this.state.dealer} />
				<Interface 
					playerScore={this.handleScore(this.state.player)} 
					dealerScore={this.handleScore(this.state.dealer)} 
					deal={this.handleDealClick} 
					hit={this.handleHitClick} 
					stand={this.handleStandClick} 
					status={this.state.status} 
				/>
				<Hand hand={this.state.player} />
			</div>	
		);
	}
});

module.exports = Table