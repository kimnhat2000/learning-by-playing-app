import React from 'react';
import {randomNum} from '../../tools/tools'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {BigCard} from '../card';
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
            score:2
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
            this.setState({warning:'congrat', score:score+1, warning:'', card:setCard, showCard:setShowCard, input:''})
            scoreTrack=scoreTrack+1;
            if(scoreTrack===5){
                this.setState({warning:'congrat you have a token', playButton:'play again?'})
            }
            return;
        }else{       
            this.setState({warning:'sorry', score:score-1, warning:'', card:setCard, showCard:setShowCard, input:''})
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
        return(
            <div>
                <Link to='/selectCard'>return to select cards page</Link>
                <button onClick={this.onPlayClick}>{this.state.playButton}</button>
                <button onClick={this.test}>test</button>

            {this.state.card &&
                <div>
                    <div>
                        <h3>your score is {this.state.score}</h3>
                        <h3>{this.state.warning}</h3>
                    </div>

                    <div className='type-game'>
                        <BigCard
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
    selectedCards:state.selectCardsReducer.cards
})

export default connect(mapStateToProps)(TypeThemOut)