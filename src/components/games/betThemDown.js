import React from 'react';
import {randomNum, shuffle} from '../../tools/tools';
import {connect} from 'react-redux';
import {Card, BigCard} from '../card';
import {Link} from 'react-router-dom';
import '../../style/betThemDown.css'

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
        this.setState({comCard, playerCard, showingButtons:true})
        console.log('com card: ',comCard)
        console.log('player Card:', card)

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
        const newCards=addValue .map(c=>c={...c,name:`your card value is ${c.cardValue}`})
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
        console.log('big card: ',newCard)
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
                    warning:`you win, your component card value is ${comCard.cardValue}`, 
                    playerScore:playerScoreTrack, 
                    comScore:comScoreTrack-1, 
                    comCards, 
                    playerCards, 
                    showingButtons
                })

            }else if (playerCard.cardValue === comCard.cardValue){
                playerScoreTrack
                this.setState({
                    warning:`it is a draw, your card has the same value as computer's card`, 
                    playerScore:playerScoreTrack, 
                    comScore:comScoreTrack, 
                    comCards, 
                    playerCards, 
                    showingButtons
                })

            }else if (playerCard.cardValue < comCard.cardValue){
                playerScoreTrack--
                this.setState({
                    warning:`you lose, your component card value is ${comCard.cardValue}`, 
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
                warning:`your component card value is ${comCard.cardValue}`, 
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

        const comCards=this.state.comCards.map((c,i)=>(
            <Card 
                key={i}
                card={c}
            />
        ))

        const playerCards=this.state.playerCards.map((c,i)=>(
            <Card 
                key={i}
                card={c}
                cardClick={this.onCardClick}
            />
        ))

        return (
            <div>
                <div>
                    <button onClick={this.onPlayClick}>{this.state.playButton}</button>
                    <button onClick={this.test}>test</button>
                    <Link to='/selectCard'>return to selected cards page</Link>
                </div>

                <div>
                    <label>computer cards</label>
                    <div  className='comcard'>{comCards}</div>
                </div>

                {this.state.playerCard && 
                <div>
                <h3>your score is {this.state.playerScore}</h3>
                <h3>computer score is {this.state.comScore}</h3>
                    <div className='battle-card'>
                        <BigCard
                            card={this.state.playerCard}
                            bigCardClick={this.onBigCardClick}
                            showButtons={false}
                        />
                        <h1>VS</h1>
                        <BigCard
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

                <div>
                    <label>player cards</label>
                    <div  className='playerCards'>{playerCards}</div>
                </div>

                <div>bet them down game</div>
            </div>
        )
    }   
}

const mapStateToProps=(state)=>({
    selectedCards:state.flashCardReducer.cards
})

export default connect(mapStateToProps)(BetThemDown)