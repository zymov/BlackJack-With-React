import React from 'react'

var App = React.createClass({

	mixins: [CascadedMixin],

	getInitialState: function(){
		return {
			deck: [
        {v:11,f:"c1"},{v:2,f:"c2"},{v:3,f:"c3"},{v:4,f:"c4"},{v:5,f:"c5"},{v:6,f:"c6"},
        {v:7,f:"c7"},{v:8,f:"c8"},{v:9,f:"c9"},{v:10,f:"c10"},{v:10,f:"c11"},{v:10,f:"c12"},{v:10,f:"c13"},
        {v:11,f:"h1"},{v:2,f:"h2"},{v:3,f:"h3"},{v:4,f:"h4"},{v:5,f:"h5"},{v:6,f:"h6"},
        {v:7,f:"h7"},{v:8,f:"h8"},{v:9,f:"h9"},{v:10,f:"h10"},{v:10,f:"h11"},{v:10,f:"h12"},{v:10,f:"h13"},
        {v:11,f:"s1"},{v:2,f:"s2"},{v:3,f:"s3"},{v:4,f:"s4"},{v:5,f:"s5"},{v:6,f:"s6"},
        {v:7,f:"s7"},{v:8,f:"s8"},{v:9,f:"s9"},{v:10,f:"s10"},{v:10,f:"s11"},{v:10,f:"s12"},{v:10,f:"s13"},
        {v:11,f:"d1"},{v:2,f:"d2"},{v:3,f:"d3"},{v:4,f:"d4"},{v:5,f:"d5"},{v:6,f:"d6"},
        {v:7,f:"d7"},{v:8,f:"d8"},{v:9,f:"d9"},{v:10,f:"d10"},{v:10,f:"d11"},{v:10,f:"d12"},{v:10,f:"d13"}
			]
		}
	},

	// shuffle the deck before starting the game.
	shuffleDeck: function(deck){
		return _.shuffle(_.shuffle(_.shuffle(_.shuffle(deck))));
	},

	render: function(){
		return(
			<Table deck={this.shuffleDeck(this.state.deck)} />
		);
	}

});


var UselessMixin = {
    componentDidMount: function () {
        console.log("Just mounted !");
    }
};

var CascadedMixin = {
    mixins: [UselessMixin]
};




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


		// var score = _.sum(hand, 'v');
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

var Card = React.createClass({
	render: function(){

		var bgUrl = this.props.hidden ? 'url(img/hidden.png)' : 'url(img/' + this.props.face + '.png)';
		
		var cardStyle = {backgroundImage: bgUrl};

		return (
			<div className='card' style={cardStyle}/>
		);
	}
});

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

var Outcome = React.createClass({
  getDefaultProps : function(){
      return {
          status : "playing",
      }
  },
  render: function() {
    /* nothing fancy happening here , displaying a bootstrap alert representing the game status */
    switch(this.props.status) {
        case "playing":
            return (<div className="alert alert-info" role="alert">Hit or Stand</div>);
            break;
        case "win":
            return (<div className="alert alert-success" role="alert">Win Win Win</div>);
            break;
        case "lose":
            return (<div className="alert alert-danger" role="alert">You Lose</div>);
            break;
        default:
            return(<div className="alert alert-info" role="alert">Click Deal to Start ! </div>);
            break;
    }
  }
});

export default App
