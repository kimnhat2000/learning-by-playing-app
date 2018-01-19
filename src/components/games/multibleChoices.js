import React from 'react';
import {connect} from 'react-redux';
import {shuffle, randomNum, reziseAndStyleBigCard} from '../../tools/tools';
import {BigCard} from '../card';
import {Link} from 'react-router-dom';
import { addToken } from '../../actions/tokenActions';

class MultibleChoices extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showinfo:false,
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
        const cards=addCards.map(c=>c={...c,showInfo:true, name:'this card name is hidden'})
        this.setState({card, cards, showinfo:true})
    }

    onCardClick=(card)=>{
        const {score}=this.state
        let scoreTract=score

        if(scoreTract===10) {
            this.setState({playButton:'play again', text:'you win the game, you earn 2 tokens'})
            this.props.dispatch(addToken(2))
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
                    <div className='stack-info'>
                        <div className='stack-name'>
                            {this.props.selectedStack &&
                                <h3>{this.props.selectedStack.name}</h3>
                            }
                        </div>

                        <div 
                            className ='token-container' 
                            onMouseOver={()=>this.setState({showIntruction:true})}
                            onMouseOut={()=>this.setState({showIntruction:false})}
                        >
                            <div className='token'/>
                            <h2>{this.props.tokens}</h2>
                        </div>
                    </div>

                    <div className='header-menu'>
                        <button onClick={this.randomCard} className='play'>{this.state.playButton}</button>
                        <button onClick={this.test}>test</button>
                        <Link to='/selectCard'><button className='return'>return</button></Link>
                    </div>
                </div>

                {this.state.showinfo &&
                <div className='game-info'>
                    <h3>your score is: {this.state.score}</h3>
                    <h3>{this.state.text}</h3>
                    <h3>you have {this.props.tokens} tokens</h3>
                </div>
                }

                {this.state.showinfo &&
                <div>
                    <BigCard
                        style={style}
                        card={this.state.card}
                        showButtons={false}
                        bigCardClick={false}
                    />
                </div>
                }

                <div className='cards'>
                    {allCards}
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    selectedCards:state.selectCardsReducer.cards,
    tokens:state.tokenReducer.totalTokens,
    selectedStack:state.cardStackReducer.selectedStack
})

export default connect(mapStateToProps)(MultibleChoices)