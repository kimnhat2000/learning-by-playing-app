import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Card, BigCard} from './card';
import {editCard} from '../actions/flashCardActions';
import {randomColor} from '../tools/tools';
import {selectOtherApproach, storeSelectedCards} from '../actions/selectCardsActions';
import { buyAGame } from '../actions/tokenActions';
import '../style/selectCards.css';


class SelectCards extends React.Component{
    constructor(props){
        super(props);
        const cards=this.props.cards;
        const tokens=this.props.tokens.totalTokens;
        const selectGames=this.props.tokens.gamesRemain;
        const buyGames=this.props.tokens.gamesBought
        this.state={
            cards,
            tokens,
            selectGames,
            buyGames,
            selectCards:[],
            warning:false,
            text:'',
            dicisionCard:''
        }
    }

    // componentDidUpdate(prevProps, prevState){
    //     if (prevProps.selectCards !== this.props.selectCards) {
    //         const json =JSON.stringify(this.props.selectCards);
    //         localStorage.setItem('selectCards', json);
    //     }
    // }

    // componentDidMount(){
    //     try{
    //         const json=localStorage.getItem('selectCards');
    //         const selectCards= JSON.parse(json);
    //         if(selectCards){
    //             this.props.dispatch(storeSelectedCards(selectCards))
    //         }
    //     }catch(error){
    //         //do nothing
    //     }
    // }

    onCardClick=(card)=>{
        const cards=this.state.cards.filter(c=>c.id!==card.id)
        const selectCards=[...this.state.selectCards,card]
        this.setState({cards, selectCards})
        this.props.dispatch(selectOtherApproach(selectCards))
    }

    onSelectedCardClick=(card)=>{
        const cards=[...this.state.cards, card]
        const selectCards=this.state.selectCards.filter(c=>c.id!==card.id)
        this.setState({selectCards, cards})
        this.props.dispatch(selectOtherApproach(selectCards))
    }

    selectAll=(pass)=>{
        if(pass){
            const selectedCards=this.props.cards;
            this.setState({selectCards:this.props.cards, cards:[]})
            this.props.dispatch(selectOtherApproach(selectedCards))
            return;
        }else{
            this.setState({selectCards:[], cards:this.props.cards})
            this.props.dispatch(selectOtherApproach([]))
            return;
        }
    }

    onGameClick=(game)=>{
        this.setState({
            text:`are you sure you want to buy this ${game.name} game for 100 tokens?`, 
            warning:true,
            dicisionCard:game
        })
    }

    makeDesicion=(pass)=>{
        if(pass){
            const tokens=this.state.tokens-100
            const dicisionCard=this.state.dicisionCard
            const selectGames=this.state.selectGames.filter(g=>g.id!==dicisionCard.id)
            const buyGames=[...this.state.buyGames, {...dicisionCard,buy:true}]
            this.setState({tokens, warning:false, buyGames, selectGames})
            this.props.dispatch(buyAGame(dicisionCard))
            return;
        }else {
            this.setState({warning:false})
            return;
        }
    }

    test=()=>{
        const {totalTokens, games, gamesBought, gamesRemain}= this.props.tokens
        const {buyGames}= this.state
        console.log('games: ',games)
        console.log('tokens: ',totalTokens)
        console.log('gamesBought: ',gamesBought)
        console.log('gamesRemain: ',gamesRemain)
        console.log(this.props.cards.length===0)

        // localStorage.clear('selectCards');
    }

    render(){
        const r1=randomColor();
        const r2=randomColor();
        const r3=randomColor();
        const style={backgroundColor:`rgb(${r1}, ${r2}, ${r3})`}

        const allCards=this.state.cards.map((c,i)=>(
            <Card
                key={i}
                card={c}
                cardClick={this.onCardClick}
            />
        ))

        const selectedCards=this.state.selectCards && this.state.selectCards.map((c,i)=>(
            <Card
                key={i}
                style={style}
                card={c}
                cardClick={this.onSelectedCardClick}
            />
        ))

        const grammarCheck=this.state.selectCards.length===1?'card':'cards';

        const buttonGrammar=4-this.state.selectCards.length === 1? 'card': 'cards';

        const boughtGames=this.state.buyGames.map((g,i)=>(
            <div key={i}>
                <Link to ={g.path}><button>{g.name}</button></Link>
            </div>
        ))
    
        const buttonsShow = this.state.selectCards.length < 4  ? 
            <h3>you need to select at least {4-this.state.selectCards.length} more {buttonGrammar} to play games</h3> : 
            <div>
                <h3>what games do you want to play?</h3>

                <div  className='buttons'>{boughtGames}</div>
    
            </div> 
        
        const games=this.state.selectGames.map((g,i)=>(
            <div key={i} className='buttons'>
                <button onClick={()=>this.onGameClick(g)}>{g.name}</button>
            </div>
        ))

        return(
            <div>
                <div className='header'>
                    <div className='stack-info'>
                        {this.props.selectedStack &&
                            <h3>{this.props.selectedStack.name}</h3>
                        }
                    </div>

                    <div className='header-menu'>     
                        <button onClick={this.test}>test</button>
                        <button onClick={()=>this.selectAll(false)}>unselect all cards</button>
                        <button onClick={()=>this.selectAll(true)}>select all cards</button>
                        <Link to='/flashCard'><button>return home</button></Link>
                    </div>
                </div>

            {this.props.cards.length === 0 ?
                <h3>you do not have any cards, please enter at least 4 cards to play games</h3>:
                <div>
                    <div className='game-info'> 
                        {grammarCheck &&
                            <h3>you have selected {this.state.selectCards.length} {grammarCheck}</h3>
                        }
                        <h3>you have {this.state.tokens} tokens</h3>
                    </div>
                
                    {this.state.warning && 
                        <div>
                            <h3>{this.state.text}</h3>
                            <div className='warning-buttons'>
                                <button onClick={()=>this.makeDesicion(true)}>YES</button>
                                <button onClick={()=>this.makeDesicion(false)}>NO</button>
                            </div>
                        </div>
                    }

                    <div className='cards'>{allCards}</div>

                    <div className='cards'>{selectedCards}</div>

                    <div className='buttons'>{buttonsShow}</div>
                
                    {this.state.tokens >= 100 &&
                    <div>
                        <h3>do you want to buy a card for 100 tokens?</h3>
                        <div className='games-select'>{games}</div>
                    </div>
                    }
                </div>
            }   
            </div> 
        )
    }
}
    
const mapStateToProps=(state)=>({
    cards:state.flashCardReducer.stackCards,
    selectCards:state.selectCardsReducer.cards,
    selectedStack:state.cardStackReducer.selectedStack,
    tokens:state.tokenReducer
})

export default connect(mapStateToProps)(SelectCards)