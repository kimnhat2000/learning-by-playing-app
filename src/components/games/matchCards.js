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

    onPlay=()=>{
        const allCards=shuffle(this.props.selectedCards);
        const selectCards=allCards.slice(0,18)
        const hideCards=selectCards.map((c,i)=>c={...c,showCard:false,match:false});
        const doubleCards=shuffle(hideCards.concat(hideCards));
        const cards=doubleCards.map((c,i)=>c={showingId:i,...c})
        this.setState({cards, playButton:'restart', text:'', countDown:Math.round(selectCards.length*3.5)})
    }

    onCardClick=(card)=>{
        const clickedCard=this.state.cards.find(c=>c.showingId===card.showingId)
        let countDown=this.state.countDown;
        const winCheck=this.state.cards.map(c=>c.showCard===false?1:0)
        
        if(winCheck.includes(1)){

        }else {
            this.setState({text:'you win!', playButton:'play again?'})
            this.props.dispatch(addToken(countDown))
            return;
        }
        
        if(countDown===0){
            this.setState({text:'you lose', playButton:'play again?'})
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
        const style={backgroundColor:`rgba(${r1}, ${r2}, ${r3}, 0.6)`}
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
                            <img className='token-img'src='pictures/myLogo.png'/>
                            <h2>{this.props.tokens}</h2>
                        </div>
                    </div>

                    <div className='game-info'>
                        <img src='pictures/icons/click.png'/>
                        <h3>{this.state.countDown}</h3>
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
                        <Link to='/'><button className='return-home'>return</button></Link>
                    </div>
                </div>

                <div className='match-cards'>
                    {cards}
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

const mapStateToProps=(state)=>({
    selectedCards:state.selectCardsReducer.cards,
    tokens:state.tokenReducer.totalTokens,
    selectedStack:state.cardStackReducer.selectedStack
})

export default connect(mapStateToProps)(WackACard) 