import React from 'react';
import {connect} from 'react-redux';
import {shuffle} from '../../tools/tools';
import {BigCard} from '../card';
import '../../style/pairThemUp.css'

class PairThemUp extends React.Component{
    constructor(props){
        super(props);
        this.state={
            cardplay:4,
            cards1:[],
            cards2:[],
            cardsCheck:[],
            score:5,
            text:'',
            playButton:'play'
        }
    }

    shuffleCards=()=>{
        const {score, text, playButton}=this.state
        const cards=this.props.selectedCards.slice(0,this.state.cardplay)
        const cards1=shuffle(cards.map(c=>c={...c,match:false, line:1}))
        const cards2=shuffle(cards.map(c=>c={...c,match:false, line:2}))
        this.setState({cards1, cards2, playButton:'restart', score, text})
    }

    onCardClick=(card, line)=>{
        let scoreTrack=this.state.score
        let cards1=this.state.cards1;
        let cards2=this.state.cards2;
        const array=this.state.cardsCheck;
        let cardsCheck=[...array,card];
        this.setState({cardsCheck})

        if(scoreTrack===10){
            this.setState({text:'you win the game', playButton:'play gain?'})
            return;
        }else if(scoreTrack===0){
            this.setState({text:'you lose the game', playButton:'play again?'})
            return;
        }

        if(card.match===true){
            return;
        }
        console.log(cardsCheck)
        if (cardsCheck.length===2){
            if(cardsCheck[0].line===cardsCheck[1].line){
                this.setState({cardsCheck:[]})
                return;
            }else if(cardsCheck[0].id===cardsCheck[1].id){
                cards1=cards1.map(c=>c.id===cardsCheck[0].id?c={...c,match:true}:c)
                cards2=cards2.map(c=>c.id===cardsCheck[0].id?c={...c,match:true}:c)
                scoreTrack++
                this.setState({cards1,cards2, score:scoreTrack, cardsCheck:[], text:'correct'})
                setTimeout(()=>{
                    this.setState({text:''})
                },1500)
                console.log(scoreTrack)
                return;
            }else {
                scoreTrack--
                this.setState({score:scoreTrack, text:'wrong, try again', cardsCheck:[]})
                setTimeout(()=>{
                    this.setState({text:''})
                },1500)
                return;
            }
        }
    }

    test=()=>{
        const {cards1, cards2, score}= this.state
        console.log(cards1, cards2, score)
    }

    render(){
        const cardSet1= this.state.cards1.map((c,i)=>(
            <BigCard
                key={i}
                card={c}
                showButtons={false}
                bigCardClick={()=>this.onCardClick(c, c.line)}
            />
        ))
        const cardSet2= this.state.cards2.map((c,i)=>(
            <BigCard
                key={i}
                card={{...c,showInfo:true}}
                showButtons={false}
                bigCardClick={()=>this.onCardClick(c, c.line)}
            />
        ))
        return(
            <div>
                <div>
                    <button onClick={this.shuffleCards}>{this.state.playButton}</button>
                    <button onClick={this.test}>test</button>
                </div>

                <div>
                    <h3>{this.state.score}</h3>
                    <h2>{this.state.text}</h2> 
                </div>

                <div className='card1'>
                    {cardSet1}
                </div>

                <div className='card1'>
                    {cardSet2}
                </div>

            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    selectedCards:state.flashCardReducer.cards
})

export default connect(mapStateToProps)(PairThemUp) 