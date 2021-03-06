import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Card, BigCard} from './card';
import {editCard} from '../actions/flashCardActions';
import { randomColor, filter2arrays} from '../tools/tools';
import {selectOtherApproach, storeSelectedCards} from '../actions/selectCardsActions';
import { buyAGame, saveGameBought } from '../actions/tokenActions';
import _ from 'lodash';
import '../style/selectCards.css';
import { selectedStack } from '../actions/cardStackActions';

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
            gameWant:'',
            findCard:'',
            showInstruction:false,   
            buyGameInstruction:false,      
            playGameInstruction:false,
            cardSelectInstruction:false,  
            returnHome: false,
            gamesToPlayInstruction:false,
            addButtonIntruction:false,
            unSelectAll:false,
        }
    }

    componentDidUpdate(prevProps, prevState){
        if (prevState.buyGames.length !== this.state.buyGames.length) {
            const json =JSON.stringify(this.state.buyGames);
            const json1 =JSON.stringify(this.state.selectGames);
            localStorage.setItem('boughtGames', json);
            localStorage.setItem('remainGames', json1);
            console.log('buy a game')

        }
        if(prevProps.tokens.totalTokens !== this.props.tokens.totalTokens){
            const json=JSON.stringify(this.props.tokens.totalTokens)
            localStorage.setItem('tokens', json)
            console.log('got more token')
            return;
        }
    }

    componentDidMount(){
        try{

            if (!this.props.selectedStack) {
                this.setState({ returnHome: true })
                return;
            }

            if(localStorage.getItem('boughtGames')===null){
                return;
            }else{
            const json=localStorage.getItem('boughtGames');
            const json1=localStorage.getItem('remainGames');
            const gamesBought= JSON.parse(json);
            const gamesRemain=JSON.parse(json1)
            this.props.dispatch(saveGameBought(gamesBought, gamesRemain))
            this.setState({buyGames:gamesBought, selectGames:gamesRemain})
            }

        }catch(error){
            //do nothing
        }
    }

    onFilterTextChange=(e)=>{
        const findCard=e.target.value
        this.setState({findCard})
    }

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
            gameWant:game
        })
    }

    makeDesicion=(pass)=>{
        if(pass){
            const tokens=this.state.tokens-100
            const gameWant=this.state.gameWant
            const selectGames=this.state.selectGames.filter(g=>g.id!==gameWant.id)
            const buyGames=[...this.state.buyGames, {...gameWant,buy:true}]
            this.setState({tokens, warning:false, buyGames, selectGames})
            this.props.dispatch(buyAGame(gameWant))

            const gamesBought = JSON.stringify(this.props.tokens.gamesBought)
            const gamesRemain = JSON.stringify(this.props.tokens.gamesRemain)
            
            localStorage.setItem('gamesBought',gamesBought)
            localStorage.setItem('gamesRemain',gamesRemain)
            return;
        }else {
            this.setState({warning:false})
            return;
        }
    }

    render(){
        const r1=randomColor();
        const r2=randomColor();
        const r3=randomColor();
        const style={backgroundColor:`rgba(${r1}, ${r2}, ${r3}, 0.9)`}

        const cards=this.state.findCard && this.state.cards.filter(c=>c.name.includes(this.state.findCard));
        const findSelectCards=this.state.findCard && this.state.selectCards.filter(c=>c.name.includes(this.state.findCard));

        let allCards =[];
        let selectedCards=[];

        if(this.state.findCard){
            allCards=cards.length !== 0 && cards.map((c,i)=>(
                <Card
                    key={i}
                    card={c}
                    cardClick={this.onCardClick}
                />
            ))

            selectedCards=findSelectCards.length !== 0 && findSelectCards.map((c,i)=>(
                <Card
                    key={i}
                    style={style}
                    card={c}
                    cardClick={this.onSelectedCardClick}
                />
            ))
        }else{
            allCards=this.state.cards.map((c,i)=>(
                <Card
                    key={i}
                    card={c}
                    cardClick={this.onCardClick}
                />
            ))

            selectedCards=this.state.selectCards && this.state.selectCards.map((c,i)=>(
                <Card
                    key={i}
                    style={style}
                    card={c}
                    cardClick={this.onSelectedCardClick}
                />
            ))
        }

        const grammarCheck=this.state.selectCards.length===1?'card':'cards';

        const buttonGrammar=4-this.state.selectCards.length === 1? 'card': 'cards';

        const boughtGames=this.state.buyGames.map((g,i)=>g.buy && (
            <div key={i}>
                <Link to ={g.path}><button className='games-button'>{g.name}</button></Link>
            </div>
        ))
    
        const buttonsShow = this.state.selectCards.length < 4  ? 
            <div className='game-info'>
                <img 
                    onMouseOver={()=>this.setState({playGameInstruction:true})}
                    onMouseOut={()=>this.setState({playGameInstruction:false})}
                    src='/pictures/icons/gameIcon.png'
                />
                <h3>{4-this.state.selectCards.length}/{this.state.selectCards.length}</h3>
            </div>:
            <div className='game-info'>
                <img
                    className='games-can-play'
                    onMouseOver={() => this.setState({ gamesToPlayInstruction: true })}
                    onMouseOut={() => this.setState({ gamesToPlayInstruction: false })}
                    src='/pictures/icons/gameIcon.png'
                />
                <div  className='buttons'>{boughtGames}</div>   
            </div> 
        
        const games=this.state.selectGames.map((g,i)=> (
            <div key={i} className='buttons'>
                <button onClick={()=>this.onGameClick(g)}>{g.name}</button>
            </div>
        ))

        return(
            <div className='selectCards-container'> 
                <div className='header'>
                    <div className='stack-info'>
                        <div className='stack-name'>
                            {this.props.selectedStack &&
                                <h3>{this.props.selectedStack.name}</h3>
                            }
                        </div>

                        <div 
                            className ='token-container' 
                            onMouseOver={()=>this.setState({showInstruction:true})}
                            onMouseOut={()=>this.setState({showInstruction:false})}
                        >
                            <div className='token'/>
                            <img className='token-img'src='pictures/myLogo.png'/>
                            <h2>{this.props.tokens.totalTokens}</h2>
                        </div>
                    </div>

                    <div className='game-info'>
                        <img 
                            onMouseOver={()=>this.setState({cardSelectInstruction:true})}
                            onMouseOut={()=>this.setState({cardSelectInstruction:false})}
                            src='pictures/icons/cards.png'
                        />
                        <h3>{this.state.selectCards.length}</h3>
                    </div>

                    <div className='header-menu'> 
                        {!this.state.returnHome &&
                        <div>
                            <input
                                className='selectCard-input'
                                type='text'
                                placeholder='find cards by name'
                                value={this.state.findCard}
                                onChange={this.onFilterTextChange}
                            />

                            <button 
                                onMouseOver={() => this.setState({ addButtonIntruction: true })}
                                onMouseOut={() => this.setState({ addButtonIntruction: false })}
                                onClick={() => this.selectAll(true)} className='add'
                            >+ All</button>

                            <button 
                                onMouseOver={() => this.setState({ unSelectAll: true })}
                                onMouseOut={() => this.setState({ unSelectAll: false })}
                                onClick={() => this.selectAll(false)} className='delete'
                            >- All</button>

                            <Link to='/flashCard'><button className='return'>return</button></Link>
                        </div>    
                        }
                        <Link to='/'><button className='return-home'>return home</button></Link>
                    </div>
                </div>

            {this.props.cards.length === 0 ?
                <h3>create at least 4 cards to play games</h3>:
                <div className='select-page-container'>
                
                    <div>
                        {this.state.warning && 
                        <div className='warning-show'>
                            <h3>do you want to buy this game for 100 tokens?</h3>
                            <div className='warning-buttons'>
                                <button onClick={()=>this.makeDesicion(true)} className='yes'>yes</button>
                                <button onClick={()=>this.makeDesicion(false)} className='no'>no</button>
                            </div>
                        </div>
                        }
                    </div>

                    <div className='select-cards-cards-menu'>

                        <div className='select-cards-cards'>
                            <div className='select-cards-all-cards'>{allCards}</div>
                            <div className='select-cards'>{selectedCards}</div>
                        </div>

                        <div

                            className='footer'
                        >
                            {this.state.tokens >= 100 && games.length !== 0 &&
                                <div className='game-info'>
                                    <img 
                                        onMouseOver={()=>this.setState({buyGameInstruction:true})}
                                        onMouseOut={()=>this.setState({buyGameInstruction:false})} 
                                        src='/pictures/icons/shopingCart.png'
                                    />
                                    <div className='select-cards-games-select'>{games}</div>
                                </div>
                            }
                            <div className='select-game-buttons'>{buttonsShow}</div>
                        
                        </div>
                    </div>
            
                </div>
                } 

                {this.state.returnHome &&
                    <div className='return-home-warning'>
                        <Link to='/'><h3>you need to choose a stack to see cards, click here to go to stacks selection page</h3></Link>
                    </div>
                }  

                <div className='addButtonIntruction-selectCards'>
                    {this.state.addButtonIntruction &&
                        <div className='instruction'>
                            <h3>select all of your cards</h3>
                        </div>
                    }
                </div>

                <div className='unSelectAll-selectCards'>
                    {this.state.unSelectAll &&
                        <div className='instruction'>
                            <h3>unselect all of your cards</h3>
                        </div>
                    }
                </div>

                <div className='gamesToPlayInstruction'>
                    {this.state.gamesToPlayInstruction &&
                        <div className='instruction'>
                            <h3>games you can play</h3>
                        </div>
                    }
                </div>

                <div className='cardSelectInstruction'>
                    {this.state.cardSelectInstruction &&
                        <div className='instruction'>
                            <h3>you have selected {this.state.selectCards.length} {grammarCheck}</h3>
                        </div>
                    }
                </div>
                
                <div className='playGameIntruction'>
                    {this.state.playGameInstruction &&
                        <div className='instruction'>
                            <h3>select at least 4 cards to play games with</h3>
                        </div>
                    }
                </div>

                <div className='selectCards-instruction'>
                    {this.state.buyGameInstruction &&
                        <div className='instruction'>
                            <h3>you can buy this game for 100 tokens</h3>
                        </div>
                    }
                </div>

                {this.state.showInstruction &&
                    <div className='instruction'>
                        <h3>tokens you get from winning games, collect 100 tokens and you can buy new games</h3>
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
    tokens:state.tokenReducer,
})

export default connect(mapStateToProps)(SelectCards)