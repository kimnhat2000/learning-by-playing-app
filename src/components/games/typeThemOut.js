import React from 'react';
import {randomNum, reziseAndStyleBigCard} from '../../tools/tools'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {BigCard} from '../card';
import { addToken } from '../../actions/tokenActions';

class TypeThemOut extends React.Component{
    constructor(props){
        super(props);
        this.state={
            card:'',
            showCard:'',
            playButton:'play',
            input:'',
            warning:'',
            score:2
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

    test=()=>{
        const {card, input, showCard}=this.state
        console.log(card, showCard)
        // console.log(this.randomCard())
    }

    render(){
        const style=reziseAndStyleBigCard('350px', '250px', 17, 'pictures/backgroundPics/', 'jpg')
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
                    <button onClick={this.onPlayClick} className='play'>{this.state.playButton}</button>
                    <button onClick={this.test}>test</button>
                    <Link to='/selectCard'><button className='return'>return</button></Link>
                </div>
            </div>

            {this.state.card &&
                <div>
                    <div className='game-info'>
                        <h3>your score is {this.state.score}</h3>
                        <h3>{this.state.warning}</h3>
                        <h3>you have {this.props.tokens} tokens</h3>
                    </div>

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