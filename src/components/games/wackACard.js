import React from 'react';
import {connect} from 'react-redux';
import {shuffle, randomNum} from '../../tools/tools'
import {gotHit} from '../../tools/cookcooproms';
import {Link} from 'react-router-dom';
import {Card} from '../card';
import '../../style/wackACard.css';

class WackACard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            cards:[],
            score:5,
            text:'',
            timeControl:null
        }
    }

    randomCards=()=>{
        const allCards=shuffle(this.props.selectedCards);
        const selected=allCards.slice(0,(randomNum(4)+1));
        const emptySlots=new Array(6-selected.length).fill(' ')
        const cards=shuffle(selected.concat(emptySlots))
        this.setState({cards})
    }

    onPlay=()=>{
        clearTimeout(this.state.timeControl)
        this.randomCards()
        let that=this;
        (function loop(){
            that.state.timeControl=setTimeout(()=>{
                that.randomCards()
                loop()
            },700)
        })()
    }

    onCarkClick=(card)=>{
        let score=this.state.score
        const text=gotHit[randomNum(gotHit.length-1)]

        if(score===10){
            this.setState({text:'congrat, you win the game'})
            return;
        }else if(score===0){
            this.setState({text:'sorry, you lose the game'})
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
        const cards=this.state.cards.map((c,i)=>(
            <Card
                className='card'
                key={i}
                card={c}
                cardClick={this.onCarkClick}
            />
        ))
        return(
            <div>
                <div>
                    <button onClick={this.onPlay}>play</button>
                    <button onClick={this.test}>test</button>
                </div>

                <h3>{this.state.score}</h3>

                <div className='cards'>
                    {cards}
                </div>

                <h3>{this.state.text}</h3>

            </div>
        )
    }
}

const mapStateToPtops=state=>({
    selectedCards:state.flashCardReducer.cards
})

export default connect(mapStateToPtops)(WackACard) 