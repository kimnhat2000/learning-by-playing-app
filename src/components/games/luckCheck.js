import React from 'react';
import {connect} from  'react-redux';
import {Card, BigCard} from '../card';
import {shuffle, randomNum, randomColor, reziseAndStyleBigCard} from '../../tools/tools';
import {Link} from 'react-router-dom';
import '../../style/luckCheck.css'
import { addToken } from '../../actions/tokenActions';

class LuckCheck extends React.Component{
    constructor(props){
        super(props);
        this.state={
            targetCard:'',
            cards:[],
            cardsShow:1,
            warning:'',
            score:5,
            noClick:false,
            playButton:'play'
        }
    }

    onPlayClick=()=>{
        this.setState({playButton:'restart', score:5, warning:''})
        this.targetCard()
    }

    cardNum=(e)=>{
        const cardsShow=Number(e.target.value)
        this.setState({cardsShow, warning:`you will get ${cardsShow*29-26} tokens if you win, click restart to apply new cards set`})
    }

    targetCard=()=>{

        const {selectedCards}=this.props
        //the winning card
        const targetCard=selectedCards[randomNum(selectedCards.length)]
        //the cards in the array, without the winning card
        const remainCards=selectedCards.filter(c=>c.id !== targetCard.id)
        //the number of cards to play in the game
        const randomOddCards=new Array(this.state.cardsShow).fill().map(()=>remainCards[randomNum(remainCards.length)])
        //shuffle all the cards
        const allCards=shuffle([...randomOddCards,targetCard])
        //turn the state of the cards to hide
        const cards=allCards.map(c=>({...c,showCard:false}))
        this.setState({targetCard, cards})
    }

    onCardClick=(card)=>{
        const {targetCard, warning, score, cards, noClick}=this.state
        const scoreTrack=score
        const showCard=cards.map(c=>c.id===card.id?{...c,showCard:false}:c)
        this.setState({cards:showCard})

        if(score===10 || score===0 || noClick){
            return;
        }

        if(card.id===targetCard.id){
            this.setState({warning:'YOU WIN', score:scoreTrack+1})
            if(score===9){
                this.setState({warning:`YOU WIN ${this.state.cardsShow*29-26} TOKENS, play again?`, playButton:'play again?'})
                this.props.dispatch(addToken(this.state.cardsShow*29-26))
                return;
            }
            this.setState({cards:this.state.cards.map(c=>c={...c,showCard:true})})
            this.setState({noClick:true})

            setTimeout(()=>{
                this.targetCard()
                this.setState({noClick:false, warning:'select a card'})
            },1000)
                
            return;
            
        }else if (card.id !== targetCard.id){
            this.setState({warning:'sorry, try again', score:scoreTrack-1})
            if(score===1){
                this.setState({warning:'sorry, you lose the game, try again?', playButton:'play again?'})
                return;
            }
            this.setState({cards:this.state.cards.map(c=>c={...c,showCard:true})})
            this.setState({noClick:true})

            setTimeout(()=>{
                this.targetCard()
                this.setState({noClick:false, warning:'select a card'})
            },1000)

            return;
        }
    }

    onBigCardClick=()=>{
        const {targetCard}=this.state
        this.setState({targetCard:{...targetCard,showInfo:!targetCard.showInfo}})
    }

    test=()=>{
        const {tokens}=this.props
        console.log(tokens)
        // console.log(this.props.selectedCards)
        // console.log('the target cards is: ', this.state.targetCard.showInfo)
    }

    render(){
        const r1=randomColor();
        const r2=randomColor();
        const r3=randomColor();
        const style={backgroundColor:`rgb(${r1}, ${r2}, ${r3})`}
        const bigCardStyle=reziseAndStyleBigCard('350px', '250px', 17, 'pictures/backgroundPics/', 'jpg')
        return(
            <div>
                <div className='header'>
                
                    <select onChange={this.cardNum}>
                        <option value="1" autoFocus>cards to play</option>
                        <option value="1" >2 'normal'</option>
                        <option value="2">3 'I feel lucky'</option>
                        <option value="3">4 'today is my day'</option>
                        <option value="4">5 'I am very lucky'</option>
                        <option value="5">6 'Luck god is smiling'</option>
                    </select>

                    <button onClick={this.onPlayClick}>{this.state.playButton}</button>
                    <button onClick={this.test}>test</button>
                    <Link to='/selectCard'><button>return</button></Link>

                </div> 
     
                {this.state.targetCard&&
                <div>

                    <div className='game-info'>
                        <h3>your score is {this.state.score}</h3>
                        <div>
                            <h3>the winning card is</h3>
                            <h3>{this.state.warning}</h3>
                        </div>
                        <h3>your have {this.props.tokens} tokens</h3>
                    </div>

                    <BigCard 
                        style={bigCardStyle}
                        card={this.state.targetCard}
                        showButton={false}
                        bigCardClick={this.onBigCardClick}
                    />
                </div>
                } 
                
                <div className='random-cards'>
                    {this.state.cards &&
                    this.state.cards.map((c,i)=>(
                        <div key={i} className='hide-card'>
                            <Card
                                style={style}  
                                card={c}
                                cardClick={this.onCardClick}
                            />
                        </div>
                        ))}
                </div> 

            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    selectedCards:state.selectCardsReducer.cards,
    tokens:state.tokenReducer.totalTokens
})

export default connect(mapStateToProps)(LuckCheck) 

