import React from 'react';
import {connect} from 'react-redux';
import {Card} from '../card';
import {shuffle} from '../../tools/tools';
import {Link} from 'react-router-dom';
import {randomColor} from '../../tools/tools';
import { addToken } from '../../actions/tokenActions';
import '../../style/matchCards.css';

class WackACard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            cards:[],
            noClick:false,
            countDown:'',
            text:'',
            playButton:'play',
        }
    }

    onPlay=()=>{
        const allCards=shuffle(this.props.selectedCards);
        const selectCards=allCards.slice(0,18)
        const hideCards=selectCards.map((c,i)=>c={...c,showCard:false,match:false});
        const doubleCards=shuffle(hideCards.concat(hideCards));
        const cards=doubleCards.map((c,i)=>c={showingId:i,...c})
        this.setState({cards, playButton:'restart', countDown:Math.round(selectCards.length*3.5)})
    }

    onCardClick=(card)=>{
        const clickedCard=this.state.cards.find(c=>c.showingId===card.showingId)
        let countDown=this.state.countDown;
        const winCheck=this.state.cards.map(c=>c.showCard===false?1:0)
        const text=`you win the game, you have ${countDown} ${countDown===1?'token':'tokens'}`;
        
        if(winCheck.includes(1)){

        }else {
            this.setState({text, playButton:'play again?'})
            this.props.dispatch(addToken(countDown))
            return;
        }
        
        if(countDown===0){
            this.setState({text:'sorry, you lose the game', playButton:'play again?'})
            return;
        }else if (this.state.noClick || clickedCard.showCard === true || clickedCard.match === true || countDown===0) {
            return;
        }

        countDown--
        let noClick=false;
        let cards=this.state.cards.map(c=>c.showingId===card.showingId?c={...c,showCard:true}:c)
        const showingCards=cards.filter(c=>c.showCard===true && c.match===false);

        if(showingCards.length===2 && showingCards[0].id === showingCards[1].id) {          
            cards=cards.map(c=>c.id===card.id?c={...c,showCard:true, match:true}:c)

        } else if (showingCards.length===2) {
            let hidingcards=cards.map(c=>c.match !== true ? c={...c,showCard:false}:c)
            noClick=true;

            this.setState({cards,noClick})
            setTimeout(()=>{
                this.setState({cards:hidingcards, noClick:false});
            },800);
            
            return;
        }
        this.setState({cards,noClick, countDown});
    }

    test=()=>{
        const {cards, selectedCard}=this.state
        const {selectedCards, tokens}=this.props
        // this.props.gameCards.map(c=>console.log(c.showCard))
        console.log(tokens)
    }

    render(){
        const grammarCheck=this.state.countDown===1?'time':'times'
        const r1=randomColor();
        const r2=randomColor();
        const r3=randomColor();
        const style={backgroundColor:`rgba(${r1}, ${r2}, ${r3}, 0.4)`}
        const cards = this.state.cards.map((c,i)=>(
                <Card
                    style={style}
                    key={i}
                    card={c}
                    cardClick={this.onCardClick}
                />
        ))
        return(
            <div className='matchCard'>

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

                {this.state.countDown&&
                    <div className='game-info'>
                        <h3>you can click {this.state.countDown} {grammarCheck}</h3>
                        <h3>you have {this.props.tokens} tokens</h3>
                    </div>
                }
                    <h3>{this.state.text}</h3>
                

                <div className='match-cards'>
                    {cards}
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    selectedCards:state.selectCardsReducer.cards,
    tokens:state.tokenReducer.totalTokens,
    selectedStack:state.cardStackReducer.selectedStack
})

export default connect(mapStateToProps)(WackACard) 