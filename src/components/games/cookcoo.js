import React from 'react';
import {teasing, gotHit, miss} from '../../tools/cookcooproms';
import {BigCard} from '../card';
import {randomNum, reziseAndStyleBigCard} from '../../tools/tools';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { addToken } from '../../actions/tokenActions';
import '../../style/cookcoo.css';

class Cookcoo extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showinfo:false,
            card:{},
            cardCatched:[],
            score:5,
            show:false,
            text:'',
            playButton:'play',
            test:null,
            showCard:false
        }
    }

    componentDidUpdate(prevProps, prevStates){
        if(prevProps.tokens !== this.props.tokens){
            const json=JSON.stringify(this.props.tokens)
            localStorage.setItem('tokens', json)
        }
    }

    componentWillUnmount(){
        clearTimeout(this.state.test)
    }

    randomCard=()=>{
        const {appear}=this.state
        const {selectedCards} =this.props
        const card=selectedCards[randomNum(selectedCards.length)]
        this.setState({card})
    }

    onPlay=()=>{
        this.setState({card:{}, cardCatched:[], score:5, show: false, text:'', showCard:true, playButton:'restart', showinfo:true})
        clearTimeout(this.state.test)
        let that=this;
        (function loop() {
            that.randomCard();
            
            const scoreTrack=that.state.score;
            if (scoreTrack===0||scoreTrack===10){
                return;
            }
            let randomTime = Math.round(Math.random() * randomNum(4000)) + 1000;
            that.state.test=setTimeout(()=> {
                that.setState({show:true});
                setTimeout(()=>{that.setState({show:false, text:teasing[randomNum(teasing.length)]})},500)
                loop();
            }, randomTime);
        })();
    }

    onCardClick=()=>{
        const {show, cardCatched, card, score}=this.state;
        let scoreTrack = score;

        if(scoreTrack===10){
            this.setState({text:'Congrat, you win the game and 3 tokens'})
            this.props.dispatch(addToken(3))
            return;

        }else if(scoreTrack===0){
            this.setState({text:'sorry, you lose the game'})
            return;
        }

        if (show){
            this.setState({score:this.state.score+1, text:gotHit[randomNum(gotHit.length)], cardCatched:[...cardCatched, card]})
            setTimeout(()=>{this.setState({text:''})},700)
            return;
        } else{
            this.setState({score:this.state.score-1, text:miss[randomNum(gotHit.length)]})
            setTimeout(()=>{this.setState({text:''})},700)
            return;
        }
    }

    catchedCardClick=(card)=>{
        const cards = this.state.cardCatched
        const cardCatched = cards.map(c=>c.id===card.id?c={...c,showInfo:!card.showInfo}:c)
        this.setState({cardCatched})
    }

    test=()=>{ 
        const {cardCatched}=this.state
        console.log(cardCatched)
    }
    render(){
        const style1=reziseAndStyleBigCard('200px', '150px', 17, 'pictures/backgroundPics/', 'jpg', '0.8em', '0', 'hidden')
        const style2=reziseAndStyleBigCard('300px', '200px', 17, 'pictures/backgroundPics/', 'jpg', '0.8em', '10px', 'hidden')

        const {cardCatched} = this.state
        const cards = cardCatched.map((c,i)=>(
            <BigCard
                style={style2}
                key={i}
                card={c}
                bigCardClick={()=>this.catchedCardClick(c)}
                showButtons={false}
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
                    <h3>score: {this.state.score}</h3>
                    <h3>{this.state.text}</h3>
                    <h3>you have {this.props.tokens} tokens</h3>
                </div>
                }
            
                {this.state.showCard &&
                <div className='next-card'>
                    {this.state.show?
                    <BigCard
                        style={style1}
                        bigCardClick={this.onCardClick}
                        card={this.state.card}
                        showButtons={false}
                    />:
                    <div 
                        className='empty-card'
                        onClick={this.onCardClick}
                    >
                        <h3>ready</h3>
                    </div>}
                    <div>
                        <h3>It is me that appears</h3>
                        <BigCard
                            style={style1}
                            bigCardClick={false}
                            card={this.state.card}
                            showButtons={false}
                        />
                    </div>
                </div>
                }
            
            {this.state.cardCatched &&
                <div>
                    {this.state.showinfo &&
                    <h3>cards you catched</h3>
                    }
                    <div>
                        <div className='cards-catched'  >{cards}</div>
                    </div>
                </div>   
            }
            
            </div>
        )
    }
}
    
const mapStateToProps =(state)=>({
    selectedCards:state.selectCardsReducer.cards,
    tokens:state.tokenReducer.totalTokens,
    selectedStack:state.cardStackReducer.selectedStack
})

export default connect(mapStateToProps)(Cookcoo)