import React from 'react';
import {connect} from  'react-redux';
import {Card, BigCard} from '../card';
import {shuffle, randomNum, randomColor} from '../../tools/tools';
import {Link} from 'react-router-dom';

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
            playButton:true
        }
    }

    onPlayClick=()=>{
        this.setState({playButton:false, score:5, warning:''})
        this.targetCard()
    }

    cardNum=(e)=>{
        this.setState({cardsShow:Number(e.target.value)})
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
        const showCard=cards.map(c=>c.id===card.id?{...c,showCard:true}:c)
        this.setState({cards:showCard})

        if(score===10 || score===0 || noClick){
            return;
        }

        if(card.id===targetCard.id){
            this.setState({warning:'YOU WIN', score:scoreTrack+1})
            if(score===9){
                this.setState({warning:'YOU WIN A TOKEN'})
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
                this.setState({warning:'sorry, you lose the game, try again?'})
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
        console.log(this.state.cards)
        // console.log(this.props.selectedCards)
        // console.log('the target cards is: ', this.state.targetCard.showInfo)
    }

    render(){
        const r1=randomColor();
        const r2=randomColor();
        const r3=randomColor();
        const style={backgroundColor:`rgb(${r1}, ${r2}, ${r3})`}
        return(
            <div>
                <div>
                    <button onClick={this.onPlayClick}>{this.state.playButton?'Play':'restart'}</button>
                    <Link to='/'><div>LuckCheck game</div></Link>
                    <button onClick={this.test}>test</button>
                    <label>how many cards do you want to play?</label>
                    <select onChange={this.cardNum}>
                        <option value="1" autoFocus>2 'normal'</option>
                        <option value="2">3 'I feel lucky'</option>
                        <option value="3">4 'today is my day'</option>
                        <option value="4">5 'I am very lucky'</option>
                        <option value="5">6 'Luck god is smiling'</option>
                    </select>
                </div> 
                <h2>your score is {this.state.score}</h2>
                {this.state.targetCard&&
                <div>
                    <h2>the winning card is</h2>
                    <div><BigCard 
                        card={this.state.targetCard}
                        showButton={false}
                        bigCardClick={this.onBigCardClick}
                    /></div>
                </div>}

                <h2>{this.state.warning}</h2>
            
                <div className='luck-card'>
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
    selectedCards:state.selectCardsReducer.cards
})

export default connect(mapStateToProps)(LuckCheck) 