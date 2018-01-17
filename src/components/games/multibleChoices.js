import React from 'react';
import {connect} from 'react-redux';
import {shuffle, randomNum, reziseAndStyleBigCard} from '../../tools/tools';
import {BigCard} from '../card';
import {Link} from 'react-router-dom';

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
        const style=reziseAndStyleBigCard('250px', '150px', 17, 'pictures/backgroundPics/', 'jpg', '0.8em', '10px')
        const allCards=cards.map((c,i)=>(
            <BigCard
                key={i}
                style={style}
                card={c}
                bigCardClick={()=>this.onCardClick(c)}
            />
        ))
        return(
            <div>
                <div className='header'>
                    <button onClick={this.randomCard}>{this.state.playButton}</button>
                    <button onClick={this.test}>test</button>
                    <Link to='/selectCard'><button>return</button></Link>
                </div>

                <div>
                    <h3>your score is: {this.state.score}</h3>
                    <h3>{this.state.text}</h3>
                </div>

                <div>
                    <BigCard
                        style={style}
                        card={this.state.card}
                        showButtons={false}
                        bigCardClick={false}
                    />
                </div>

                <div className='cards'>
                    {allCards}
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    selectedCards:state.selectCardsReducer.cards
})

export default connect(mapStateToProps)(MultibleChoices)