import React from 'react';
import {connect} from 'react-redux';
import {shuffle, randomNum} from '../../tools/tools';
import {BigCard} from '../card';
import {Link} from 'react-router-dom';
import '../../style/multibleChoices.css';

class MultibleChoices extends React.Component{
    constructor(props){
        super(props);
        this.state={
            cards:[],
            card:{},
            score:5,
            text:'',
            playButton:'play'
        }
    }

    randomCard=()=>{
        const card=this.props.selectedCards[randomNum(this.props.selectedCards.length)]
        const allCards=shuffle(this.props.selectedCards.filter(c=>c.id !== card.id))
        //this line is to select randomly 3 cards and concat them with the random chosen card
        const newCards=allCards.slice(0,3)
        const addCards=shuffle([...allCards,card])
        const cards=addCards.map(c=>c={...c,showInfo:true})
        this.setState({card, cards})
    }

    onCardClick=(card)=>{
        const {score}=this.state
        let scoreTract=score

        if(scoreTract===10) {
            this.setState({playButton:'play again', text:'you win the game'})
            return;
        }else if (scoreTract===0){
            this.setState({playButton:'play again', text:'you lose the game'})
            return;
        }

        card.id===this.state.card.id?
        this.setState({score:scoreTract+1, text:'you are correct'}):
        this.setState({score:scoreTract-1, text:'you are wrong, try again'})
        this.randomCard();
    }

    test=()=>{
        this.randomCard();
        const {card, cards}= this.state
        console.log(card, cards)
    }

    render(){
        const {cards}=this.state
        const allCards=cards.map((c,i)=>(
            <BigCard
                key={i}
                card={c}
                showButtons={false}
                bigCardClick={()=>this.onCardClick(c)}
            />
        ))
        return(
            <div>
                <div>
                    <button onClick={this.randomCard}>{this.state.playButton}</button>
                    <button onClick={this.test}>test</button>
                    <Link to='/selectCard'>return to select card page</Link>
                </div>

                <div>{this.state.score}</div>

                <div>
                    <BigCard
                        card={this.state.card}
                        showButtons={false}
                        bigCardClick={false}
                    />
                </div>

                <div>{this.state.text}</div>

                <div className='cards'>
                    {allCards}
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    selectedCards:state.flashCardReducer.cards
})

export default connect(mapStateToProps)(MultibleChoices)