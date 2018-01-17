import React from 'react';
import {connect} from 'react-redux';
import {shuffle, randomNum, randomColor} from '../../tools/tools'
import {gotHit} from '../../tools/cookcooproms';
import {Link} from 'react-router-dom';
import {Card} from '../card';
import '../../style/wackACard.css'

class WackACard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            cards:[],
            score:5,
            text:'',
            countDown:8,
            timeControl:null,
            countDownControl:null,
            playButton:'play'
        }
    }

    randomCards=()=>{
        const allCards=shuffle(this.props.selectedCards);
        const selected=allCards.slice(0,(randomNum(4)+1));
        const emptySlots=new Array(6-selected.length).fill(' ')
        const cards=shuffle(selected.concat(emptySlots))
        this.setState({cards})
    }

    gameStart=()=>{
        
        this.state.timeControl;
        this.state.countDownControl;
        clearTimeout(this.state.timeControl);
        clearInterval(this.state.countDownControl);
        this.setState({score:5, countDown:5})

        let countDown=5;
        this.state.countDownControl=setInterval(()=>{
            countDown--;
            this.setState({countDown})
            if(countDown===0){
                this.setState({text:'sorry, time is up', playButton:'play again?'});
                clearInterval(this.state.countDownControl)
                clearTimeout(this.state.timeControl)
            }
            return;
        }, 1000)

        this.randomCards()
        this.setState({playButton:'restart'})
        let that=this;
        (function loop(){
            that.state.timeControl=setTimeout(()=>{
                that.randomCards()
                loop()
            },700)
        })()
    }

    onPlay=()=>{
        this.setState({text:''})
        this.gameStart()
    }

    onCarkClick=(card)=>{
        let score=this.state.score
        let countDown=this.state.countDown
        const text=gotHit[randomNum(gotHit.length-1)]

        if(score===10){
            clearTimeout(this.state.timeControl)
            this.setState({text:'congrat, you win the game', playButton:'play again?'})
            return;
        }else if(score===0){
            clearTimeout(this.state.timeControl)
            this.setState({text:'sorry, you lose the game', playButton:'play again?'})
            return;
        }else if (countDown===0){
            return;
        }

        if(card.name){
            score++
            this.setState({score, text})
            setTimeout(()=>{
                this.setState({text:''})
            },1000) 
            return;          
        }else{
            score--
            this.setState({score})
            return;
        }
    }

    test=()=>{
        this.randomCards()
        console.log(this.props.selectedCards.slice(0,3));
    }

    render(){

        const r=randomColor()
        const g=randomColor()
        const b=randomColor()
        const style={backgroundColor:`rgb(${r},${g},${b}`}

        const cards=this.state.cards.map((c,i)=>(
            <Card
                className='card'
                style={style}
                key={i}
                card={c}
                cardClick={this.onCarkClick}
            />
        ))
        return(
            <div>
                <div className='header'>
                    <button onClick={this.onPlay}>{this.state.playButton}</button>
                    <button onClick={this.test}>test</button>
                    <Link to='/selectCard'><button>return</button></Link>
                </div>

                <h3>time: {this.state.countDown}</h3>
                <h3>your score is: {this.state.score}</h3>
                <h3>{this.state.text}</h3>

                <div className='wack-game-cards'>
                    {cards}
                </div>

            </div>
        )
    }
}

const mapStateToPtops=state=>({
    selectedCards:state.selectCardsReducer.cards
})

export default connect(mapStateToPtops)(WackACard) 