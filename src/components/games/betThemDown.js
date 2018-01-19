import React from 'react';
import {randomNum, shuffle, randomColor, reziseAndStyleBigCard} from '../../tools/tools';
import {connect} from 'react-redux';
import {Card, BigCard} from '../card';
import {Link} from 'react-router-dom';
import { addToken } from '../../actions/tokenActions';
import '../../style/betThemDown.css';

class BetThemDown extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showinfo:false,
            comCards:[],
            playerCards:[],
            comCard:'',
            playerCard:'',
            playButton:'play',
            warning:'',
            playerScore:5,
            comScore:5,
            showingButtons:true
        }
    }

    onPlay=()=>{
        this.randomComCards()
        this.randomPlayerCards()
        this.setState({playButton:'restart', showinfo:true})
    }

    onCardClick=(card)=>{
        const comCard=this.state.comCards[randomNum(this.state.comCards.length)]
        const playerCard=card
        this.setState({comCard, playerCard, showingButtons:true, warning:''})
    }

    randomComCards=()=>{
        const allCards=shuffle(this.props.selectedCards)
        const selectCards=allCards.slice(0,8)
        const addValue=selectCards.map(c=>c={cardValue:randomNum(selectCards.length*6),...c})
        const comCards=shuffle(addValue)
        this.setState({comCards})
    }

    randomPlayerCards=()=>{
        const allCards=shuffle(this.props.selectedCards)
        const selectCards=allCards.slice(0,8)
        const addValue=selectCards.map(c=>c={cardValue:randomNum(selectCards.length*6),...c})
        const newCards=addValue .map(c=>c={...c,name:`power ${c.cardValue}`})
        const playerCards=shuffle(newCards)
        this.setState({playerCards})
    }

    onBigCardClick=()=>{
        const {playerCard}=this.state
        const newCard={...playerCard,showInfo:!playerCard.showInfo}
        this.setState({playerCard:newCard})
    }

    onComBigCardClick=()=>{
        const {comCard}=this.state
        const newCard={...comCard,showInfo:!comCard.showInfo}
        this.setState({comCard:newCard})
    }

    onBattleClick=(action)=>{
        let showingButtons=false
        const comCard=this.state.comCard
        const playerCard=this.state.playerCard
        let playerScoreTrack=this.state.playerScore
        let comScoreTrack=this.state.comScore
        const comCards=this.state.comCards.filter(c=>c.id !== comCard.id)
        const playerCards=this.state.playerCards.filter(c=>c.id !== playerCard.id)

        if(playerScoreTrack <= 0){
            this.setState({warning:'you lose the game'})
            this.setState({showingButtons:false})
            return;
        }else if(playerScoreTrack >= 10){
            this.setState({warning:'you win the game'})
            this.setState({showingButtons:false})
            this.props.dispatch(addToken(5))
            return;
        }

        if(action){
            if(playerCard.cardValue > comCard.cardValue){
                playerScoreTrack++
                this.setState({
                    warning:`you win, your rival card power is ${comCard.cardValue}`, 
                    playerScore:playerScoreTrack, 
                    comScore:comScoreTrack-1, 
                    comCards, 
                    playerCards, 
                    showingButtons
                })

            }else if (playerCard.cardValue === comCard.cardValue){
                playerScoreTrack
                this.setState({
                    warning:`it is a draw, your card has the same power as computer's card`, 
                    playerScore:playerScoreTrack, 
                    comScore:comScoreTrack, 
                    comCards, 
                    playerCards, 
                    showingButtons
                })

            }else if (playerCard.cardValue < comCard.cardValue){
                playerScoreTrack--
                this.setState({
                    warning:`you lose, your rival card power is ${comCard.cardValue}`, 
                    playerScore:playerScoreTrack, 
                    comScore:comScoreTrack+1, 
                    comCards, 
                    playerCards, 
                    showingButtons
                })
            }

        }else {
            playerScoreTrack-0.5
            this.setState({
                warning:`your rival card power is ${comCard.cardValue}`, 
                playerScore:playerScoreTrack-0.5, 
                comScore:comScoreTrack+0.5, 
                comCards, 
                playerCards, 
                showingButtons
            })
        }

        if(playerScoreTrack <= 0){
            this.setState({warning:'you lose the game'})
            this.setState({showingButtons:false})
            return;
        }else if(playerScoreTrack >= 10){
            this.setState({warning:'you win the game, you earn 5 tokens'})
            this.setState({showingButtons:false})
            this.props.dispatch(addToken(5))
            return;
        }

        if(playerCards.length===0){
            this.randomComCards()
            this.randomPlayerCards()
            return;
        }
        return
    }

    test=()=>{
        console.log(this.state.playerCards)
    }

    render(){
        const r1=randomColor();
        const r2=randomColor();
        const r3=randomColor();
        const style={backgroundColor:`rgba(${r1}, ${r2}, ${r3}, 0.4)`}

        const cardstyle=reziseAndStyleBigCard('350px', '250px', 17, 'pictures/backgroundPics/', 'jpg', '1em', '20px', 'hidden')

        const comCards=this.state.comCards.map((c,i)=>(
            <Card 
                style={style}
                key={i}
                card={c}
            />
        ))

        const playerCards=this.state.playerCards.map((c,i)=>(
            <Card 
                style={style}
                key={i}
                card={c}
                cardClick={this.onCardClick}
            />
        ))

        return (
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
                        <button onClick={this.onPlay} className='play'>{this.state.playButton}</button>
                        <button onClick={this.test}>test</button>
                        <Link to='/selectCard'><button className='return'>return</button></Link>
                    </div>
                </div>

                <div className='bet-game-container'>

                    <div className='player-cards'>
                        {this.state.showinfo &&
                        <h3>player cards</h3>
                        }
                        <div  className='playerCards'>{playerCards}</div>
                    </div>

                    {this.state.playerCard && 
                    <div className='battlefield'>
                        <div className='game-info'>
                            <h3>your score is {this.state.playerScore}</h3>                            
                            <h3>you have {this.props.tokens} tokens</h3>
                            <h3>computer score is {this.state.comScore}</h3>
                        </div>
                        <div className='battle-card'>
                            <BigCard
                                style={cardstyle}
                                card={this.state.playerCard}
                                bigCardClick={this.onBigCardClick}
                                showButtons={false}
                            />
                            <BigCard
                                style={cardstyle}
                                card={this.state.comCard}
                                bigCardClick={this.onComBigCardClick}
                                showButtons={false}
                            />
                        </div>
                        <h1>VS</h1>
                        <h3>{this.state.warning}</h3>
                        {this.state.showingButtons &&
                            <div className='buttons'>
                                <button className='attact' onClick={()=>this.onBattleClick(true)}>ATTACT</button>
                                <button className='defend' onClick={()=>this.onBattleClick(false)}>DEFEND</button>
                            </div>  
                        }
                        
                    </div>   
                    }

                    <div className='computer-cards'>
                        {this.state.showinfo &&
                        <h3>computer cards</h3>
                        }
                        <div  className='comCards'>{comCards}</div>
                    </div>
                    
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

export default connect(mapStateToProps)(BetThemDown)