import React from 'react';
import {connect} from 'react-redux';
import {shuffle, randomNum, randomColor} from '../../tools/tools'
import {gotHit} from '../../tools/cookcooproms';
import {Link} from 'react-router-dom';
import {Card} from '../card';
import { addToken } from '../../actions/tokenActions';
import '../../style/wackACard.css';

class WackACard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showinfo:false,
            cards:[],
            score:5,
            text:'',
            countDown:10,
            timeControl:null,
            countDownControl:null,
            playButton:'play',
            showIntruction:false,
            returnHome: false,
            gamePlayInstruction: false,
        }
    }

    componentDidMount() {
        if (!this.props.selectedStack) {
            this.setState({ returnHome: true })
            return;
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
        this.setState({score:5, countDown:10, showinfo:true})

        let countDown=10;
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

    render(){

        const r=randomColor()
        const g=randomColor()
        const b=randomColor()
        const style={backgroundColor:`rgba(${r},${g},${b}, 0.6)`}

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
                            <img className='token-img'src='pictures/myLogo.png'/>
                            <h2>{this.props.tokens}</h2>
                        </div>
                    </div>

                    {this.state.showinfo &&
                    <div className='game-info'>
                        <img src='pictures/icons/score.png'/>
                        <h3>{this.state.score}</h3>
                    </div>
                    }

                    {this.state.showinfo &&
                    <div className='game-info'>
                        <img src='pictures/icons/hourGlass.png'/>
                        <h3>{this.state.countDown}</h3>
                    </div>
                    }

                    {this.state.showinfo &&
                    <h3 className='game-end'>{this.state.text}</h3>
                    }

                    <div className='header-menu'>
                        {!this.state.returnHome &&
                        <div>
                            <button
                                onMouseOver={() => this.setState({ gamePlayInstruction: true })}
                                onMouseOut={() => this.setState({ gamePlayInstruction: false })}
                                className='gamePlayInstruction'
                            />
                            <button onClick={this.onPlay} className='play'>{this.state.playButton}</button>
                            <Link to='/selectCard'><button className='return'>return</button></Link>
                        </div>
                        }
                        <Link to='/'><button className='return-home'>return home</button></Link>
                    </div>
                </div>
                
                <div className='wack-game-cards'>
                    {cards}
                </div>

                {this.state.returnHome &&
                    <div className='return-home-warning'>
                        <Link to='/'><h3>you need to choose a stack to see cards, click here to go to stacks selection page</h3></Link>
                    </div>
                }

                <div className='gamePlayInstruction'>
                    {this.state.gamePlayInstruction &&
                        <div className='instruction'>
                            <h3>click the cards when it appear and get point, get 10 point before timeout to win</h3>
                        </div>
                    }
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

const mapStateToPtops=state=>({
    selectedCards:state.selectCardsReducer.cards,
    tokens:state.tokenReducer.totalTokens,
    selectedStack:state.cardStackReducer.selectedStack
})

export default connect(mapStateToPtops)(WackACard) 