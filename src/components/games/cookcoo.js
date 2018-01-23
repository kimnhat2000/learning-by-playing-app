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
            showCard:false,
            showIntruction:false,
            returnHome: false,
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
        const style1=reziseAndStyleBigCard('350px', '200px', 17, 'pictures/backgroundPics/', 'jpg', '0.8em', '0', 'hidden')
        const style2=reziseAndStyleBigCard('250px', '200px', 17, 'pictures/backgroundPics/', 'jpg', '0.8em', '10px', 'hidden')

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
                            <img className='token-img'src='pictures/myLogo.png'/>
                            <h2>{this.props.tokens}</h2>
                        </div>
                        
                    </div>

                    <div className='game-info'>
                        <img src='pictures/icons/score.png'/>
                        <h3>{this.state.score}</h3>
                    </div>

                    <h3 className='game-end'>{this.state.text}</h3>

                    <div className='header-menu'>
                        {!this.state.returnHome &&
                            <div>
                                <button onClick={this.onPlay} className='play'>{this.state.playButton}</button>
                                <button onClick={this.test}>test</button>
                                <Link to='/selectCard'><button className='return'>return</button></Link>
                            </div>
                        }
                        <Link to='/'><button className='return-home'>return home</button></Link>
                    </div>
                </div>

                <div className='cookcoo-all-cards'>

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
                            />
                        }
                        </div>
                    }
                
                    <div className='cookcoo-card-catched'>
                        {this.state.showinfo &&
                            <div className='card-catch-text'>
                                <img src='/pictures/icons/hunter.png'/>
                                <h3>card hunt</h3>
                            </div>   
                        }    
                        <div className='cards-catched'>{cards}</div>
                    </div>
                </div>
                
                {this.state.returnHome &&
                    <div className='return-home-warning'>
                        <Link to='/'><h3>you need to choose a stack to see cards, click here to go to stacks selection page</h3></Link>
                    </div>
                }

                {this.state.showIntruction &&
                    <div className='instruction'>
                        <h4>tokens you get from winning games, collect 100 tokens and you can buy new games</h4>
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