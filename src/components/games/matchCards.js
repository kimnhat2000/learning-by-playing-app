import React from 'react';
import {connect} from 'react-redux';
import {Card} from '../card';
import {shuffle} from '../../tools/tools';
import {Link} from 'react-router-dom';

class WackACard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            cards:[],
            noClick:false
        }
    }

    play=()=>{
        const hideCards=this.props.selectedCards.map((c,i)=>c={...c,showCard:false,match:false});
        const doubleCards=shuffle(hideCards.concat(hideCards));
        const cards=doubleCards.map((c,i)=>c={showingId:i,...c})
        this.setState({cards})
    }

    onCardClick=(card)=>{
        const clickedCard=this.state.cards.find(c=>c.showingId===card.showingId)

        if(this.state.noClick || clickedCard.showCard === true || clickedCard.match === true) {
            return;
        }

        let noClick=false;
        let cards=this.state.cards.map(c=>c.showingId===card.showingId?c={...c,showCard:true}:c)
        const showingCards=cards.filter(c=>c.showCard===true && c.match===false);

        if(showingCards.length===2 && showingCards[0].id === showingCards[1].id) {          
            cards=cards.map(c=>c.id===card.id?c={...c,showCard:true, match:true}:c)

        } else if (showingCards.length===2) {
            let hidingcards=cards.map(c=>c.match !== true ? c={...c,showCard:false}:c)
            noClick=true;

            this.setState({cards,noClick})
            setTimeout(()=>{
                this.setState({cards:hidingcards, noClick:false});
            },800);
            
            return;
        }
        this.setState({cards,noClick});
    }

    test=()=>{
        const {cards, selectedCard}=this.state
        // this.props.gameCards.map(c=>console.log(c.showCard))
        console.log(cards)
    }

    render(){
        const cards = this.state.cards.map((c,i)=>(
                <Card
                    className='card'
                    key={i}
                    card={c}
                    cardClick={this.onCardClick}
                />
        ))
        return(
            <div>
                <div>
                    <button onClick={this.play}>play</button>
                    <button onClick={this.test}>test</button>
                    <Link to = '/selectCard'>return to select game page</Link>
                </div>
                <div className='match-cards'>
                    {cards}
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    selectedCards:state.selectCardsReducer.cards
})

export default connect(mapStateToProps)(WackACard) 