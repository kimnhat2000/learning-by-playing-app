import React from 'react';
import {randomNum, reziseAndStyleBigCard} from '../../tools/tools'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {BigCard} from '../card';
import { addToken } from '../../actions/tokenActions';
import '../../style/typeThemOut.css';

class TypeThemOut extends React.Component{
    constructor(props){
        super(props);
        this.state={
            card:'',
            showCard:'',
            playButton:'play',
            input:'',
            warning:'',
            score:2,
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

    onPlayClick=()=>{
        const card=this.randomCard()
        const showCard={...card, name:'this card name is hidden'}
        this.setState({playButton:'restart', card, showCard, score:2, input:''})
    }
    
    onInputChange=(e)=>{
        this.setState({input:e.target.value})
    }

    randomCard=()=>{
        const {selectedCards}=this.props
        const randomCard=selectedCards[randomNum(selectedCards.length)]
        const card={...randomCard,showInfo:true}
        return card;
    }

    onSubmit=(e)=>{
        e.preventDefault()
        const {input, card, score, showCard}=this.state
        let scoreTrack=score

        const setCard=this.randomCard()
        const setShowCard={...setCard, name:'this card name is hidden'}

        const text=input.toLowerCase()
        const cardName=card.name.toLowerCase()

        if(scoreTrack===5 || scoreTrack === 0){
            return
        }

        if(text===cardName){       
            this.setState({warning:'correct', score:score+1, card:setCard, showCard:setShowCard, input:''})
            scoreTrack=scoreTrack+1;
            if(scoreTrack===5){
                this.setState({warning:'congrat you win 2 tokens, play again?', playButton:'play again?'})
                this.props.dispatch(addToken(2))

            }
            return;
        }else{       
            this.setState({warning:'wrong', score:score-1, card:setCard, showCard:setShowCard, input:''})
            scoreTrack=scoreTrack-1;
            if(scoreTrack===0){
                this.setState({warning:'you lose'})
            }
            return;
        }
    }

    render(){
        const style=reziseAndStyleBigCard('350px', '250px', 17, 'pictures/backgroundPics/', 'jpg', '1em')
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

                <h3 className='game-end'>{this.state.warning}</h3>

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

            {this.state.card &&
                <div>                                        
                    <div className='type-game'>
                        <BigCard
                            style={style}
                            card={this.state.showCard}
                            showButtons={false}
                        />

                        <form>
                            <div className='type-game-form'>
                                <input
                                    type='text'
                                    placeholder='what card is it?'
                                    value={this.state.input}
                                    onChange={this.onInputChange}
                                />
                                <button
                                    onClick={this.onSubmit}
                                >done</button>
                            </div>
                        </form>

                    </div>
                </div>
            }

            {this.state.returnHome &&
                <div className='return-home-warning'>
                    <Link to='/'><h3>you need to choose a stack to see cards, click here to go to stacks selection page</h3></Link>
                </div>
            }

            <div className='gamePlayInstruction'>
                {this.state.gamePlayInstruction &&
                    <div className='instruction'>
                        <h3>click the correct card to win, the more cards you play, the more tokens you get if you win</h3>
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

const mapStateToProps =(state)=>({
    selectedCards:state.selectCardsReducer.cards,
    tokens:state.tokenReducer.totalTokens,
    selectedStack:state.cardStackReducer.selectedStack
})

export default connect(mapStateToProps)(TypeThemOut)