import React from 'react';
import {connect} from 'react-redux';
import {shuffle, randomNum, randomColor} from '../../tools/tools'
import {gotHit} from '../../tools/cookcooproms';
import {Link} from 'react-router-dom';
import {Card} from '../card';
import { addToken } from '../../actions/tokenActions';

class WackACard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showinfo:false,
            cards:[],
            score:5,
            text:'',
            countDown:8,
            timeControl:null,
            countDownControl:null,
            playButton:'play'
        }
    }

    componentDidUpdate(prevProps, prevStates){
        if(prevProps.tokens !== this.props.tokens){
            const json=JSON.stringify(this.props.tokens)
            localStorage.setItem('tokens', json)
        }
    }

    componentWillUnmount(){
        clearTimeout(this.state.timeControl);
        clearInterval(this.state.countDownControl);
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
        this.setState({score:5, countDown:5, showinfo:true})

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
            this.setState({text:'congrat, you win the game with 2 tokens, play again?', playButton:'play again?'})
            this.props.dispatch(addToken(2))
            return;
        }else if(score===0){
            clearTimeout(this.state.timeControl)
            this.setState({text:'sorry, you lose the game, play again?', playButton:'play again?'})
            return;
        }else if (countDown===0){
            this.setState({text:'sorry, time is up, play again?', playButton:'play again?'})
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
        const style={backgroundColor:`rgba(${r},${g},${b}, 0.4)`}

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

                {this.state.showinfo &&
                <div className='game-info'>
                    <h3>your score is: {this.state.score}</h3>
                    <div>
                        <h3>time: {this.state.countDown}</h3>
                        <h3>{this.state.text}</h3>
                    </div>
                    <h3>you have {this.props.tokens} tokens</h3>
                </div>
                }
                
                <div className='wack-game-cards'>
                    {cards}
                </div>

            </div>
        )
    }
}

const mapStateToPtops=state=>({
    selectedCards:state.selectCardsReducer.cards,
    tokens:state.tokenReducer.totalTokens,
    selectedStack:state.cardStackReducer.selectedStack
})

export default connect(mapStateToPtops)(WackACard) 