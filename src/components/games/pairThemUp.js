import React from 'react';
import {connect} from 'react-redux';
import {shuffle, reziseAndStyleBigCard} from '../../tools/tools';
import {BigCard} from '../card';
import {Link} from 'react-router-dom';
import { addToken } from '../../actions/tokenActions';

class PairThemUp extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showinfo:false,
            cardplay:4,
            cards1:[],
            cards2:[],
            cardsCheck:[],
            score:5,
            text:'',
            playButton:'play',
            showIntruction:false
        }
    }

    componentDidUpdate(prevProps, prevStates){
        if(prevProps.tokens !== this.props.tokens){
            const json=JSON.stringify(this.props.tokens)
            localStorage.setItem('tokens', json)
        }
    }

    shuffleCards=()=>{
        const {text, playButton}=this.state
        const cards=this.props.selectedCards.slice(0,this.state.cardplay)
        const cards1=shuffle(cards.map(c=>c={...c, line:1}))
        const cards2=shuffle(cards.map(c=>c={...c,name:'this card name is hiden', line:2}))
        this.setState({cards1, cards2, playButton:'restart', text})
    }

    onPlay=()=>{
        this.shuffleCards()
        this.setState({text:'', score:5, showinfo:true, cardsCheck:[]})
    }

    onCardClick=(card)=>{
        let score=this.state.score;
        let cards1=this.state.cards1;
        let cards2=this.state.cards2;

        const cardsCheck=[...this.state.cardsCheck, card]
        this.setState({cardsCheck})

        if(score===10 || score === 0){
            return;
        }

        if(cardsCheck.length===2){
            if(cardsCheck[0].id===cardsCheck[1].id){
                score++
                cards1 = cards1.filter(c=>c.id !== card.id)
                cards2 = cards2.filter(c=>c.id !== card.id)
                this.setState({text:'correct', score, cards1, cards2, cardsCheck:[]})
                if(cards1.length===0){
                    this.shuffleCards()
                    return;
                }else if(score===10){
                    this.setState({text:'you win the game, you earn 2 tokens', playButton:'play again?'})
                    this.props.dispatch(addToken(2))
                    return;
                }
                return;
            }else {
                score--
                this.setState({text:'wrong', score, cardsCheck:[]})
                if(score===0){
                    this.setState({text:'sorry, you lose the game', playButton:'play again?'})
                    return;
                }
                return;
            }
            return;
        }}

    test=()=>{
        const {cards1, cards2, score, cardsCheck}= this.state
        const {selectedCards}=this.props
        console.log(cardsCheck)
    }

    render(){
        const style=reziseAndStyleBigCard('250px', '200px', 17, 'pictures/backgroundPics/', 'jpg', '0.8em', '15px', 'hidden')
        const cardSet1= this.state.cards1.map((c,i)=>(
            <div 
                className='card1'
                key={i}>
                <BigCard
                    style={style}
                    card={c}
                    bigCardClick={()=>this.onCardClick(c, c.line)}
                />
            </div> 
        ))
        const cardSet2= this.state.cards2.map((c,i)=>(
            <div 
                className='card2'
                key={i}>
                <BigCard
                    style={style}
                    card={{...c,showInfo:true}}
                    bigCardClick={()=>this.onCardClick(c, c.line)}
                />
            </div>
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
                            <img className='token-img'src='pictures/myLogo.png'/>
                            <h2>{this.props.tokens}</h2>
                        </div>
                    </div>

                    <div className='header-menu'>
                        <button onClick={this.onPlay} className='play'>{this.state.playButton}</button>
                        <button onClick={this.test}>test</button>
                        <Link to='/selectCard'><button className='return'>return</button></Link>
                    </div>
                </div>

                {this.state.showinfo &&
                <div className='game-info'>
                    <h3>your score is {this.state.score}</h3>
                    <h3>{this.state.text}</h3> 
                    <h3>you have {this.props.tokens} tokens</h3>
                </div>
                }

                <div className='cards1'>
                    {cardSet1}
                </div>

                <div className='cards2'>
                    {cardSet2}
                </div>
                {this.state.showIntruction &&
                    <div className='instruction'>
                        <h4>tokens you get from winning games, collect 100 tokens and you can buy new games</h4>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    selectedCards:state.selectCardsReducer.cards,
    tokens:state.tokenReducer.totalTokens,
    selectedStack:state.cardStackReducer.selectedStack
})

export default connect(mapStateToProps)(PairThemUp) 