import React from 'react';
import {randomNum, shuffle, randomColor, reziseAndStyleBigCard} from '../../tools/tools';
import {connect} from 'react-redux';
import {Card, BigCard} from '../card';
import {Link} from 'react-router-dom';
import '../../style/betThemDown.css';

class BetThemDown extends React.Component{
    constructor(props){
        super(props);
        this.state={
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

    onPlayClick=()=>{
        this.randomComCards()
        this.randomPlayerCards()
        this.setState({playButton:'restart'})
    }

    onCardClick=(card)=>{
        const comCard=this.state.comCards[randomNum(this.state.comCards.length)]
        const playerCard=card
        this.setState({comCard, playerCard, showingButtons:true, warning:''})
    }

    randomComCards=()=>{
        const valueNum=randomNum(this.props.selectedCards.length*5)
        const addValue=this.props.selectedCards.map(c=>c={cardValue:randomNum(this.props.selectedCards.length*5),...c})
        const comCards=shuffle(addValue)
        this.setState({comCards})
    }

    randomPlayerCards=()=>{
        const valueNum=randomNum(this.props.selectedCards.length*5)
        const addValue=this.props.selectedCards.map(c=>c={cardValue:randomNum(this.props.selectedCards.length*5),...c})
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
            this.setState({warning:'you win the game'})
            this.setState({showingButtons:false})
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
        const style={backgroundColor:`rgb(${r1}, ${r2}, ${r3})`}

        const cardstyle=reziseAndStyleBigCard('350px', '250px', 17, 'pictures/backgroundPics/', 'jpg')

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
                    <Link to='/selectCard'><button>return to selected cards page</button></Link>
                    <button onClick={this.onPlayClick}>{this.state.playButton}</button>
                    <button onClick={this.test}>test</button>
                </div>

                <div className='bet-game-container'>

                    <div className='player-cards'>
                        <h3>player cards</h3>
                        <div  className='playerCards'>{playerCards}</div>
                    </div>

                    {this.state.playerCard && 
                    <div className='battlefield'>
                        <h3>your score is {this.state.playerScore}</h3>
                        <h3>computer score is {this.state.comScore}</h3>
                        <div className='battle-card'>
                            <BigCard
                                style={cardstyle}
                                card={this.state.playerCard}
                                bigCardClick={this.onBigCardClick}
                                showButtons={false}
                            />
                            <h1>VS</h1>
                            <BigCard
                                style={cardstyle}
                                card={this.state.comCard}
                                bigCardClick={this.onComBigCardClick}
                                showButtons={false}
                            />
                        </div>
                        <h3>{this.state.warning}</h3>
                        {this.state.showingButtons &&
                            <div>
                                <button onClick={()=>this.onBattleClick(true)}>ATTACT</button>
                                <button onClick={()=>this.onBattleClick(false)}>DEFEND</button>
                            </div>  
                        }
                        
                    </div>   
                    }

                    <div className='computer-cards'>
                        <h3>computer cards</h3>
                        <div  className='comcard'>{comCards}</div>
                    </div>
                    
                </div>
            
            </div>
        )
    }   
}

const mapStateToProps=(state)=>({
    selectedCards:state.selectCardsReducer.cards
})

export default connect(mapStateToProps)(BetThemDown)