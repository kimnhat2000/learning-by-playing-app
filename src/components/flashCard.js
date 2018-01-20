import React from 'react';
import CardList from './cardList';
import {BigCard} from './card';
import {connect} from 'react-redux';
import {addCard, addCards, removeCard, cardToEditInfo, editCard, deleteAllCardsInCurrentStack, filteredCards, filterStack, setNewCardId} from '../actions/flashCardActions';
import {selectedStack} from '../actions/cardStackActions';
import {addToken, reduceToken} from '../actions/tokenActions'
import FlashCardForm from './form';
import {Link} from 'react-router-dom';
import {reziseAndStyleBigCard, randomPics} from '../tools/tools';
import styled, {injectGlobal} from 'styled-components';

class FlashCard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showForm:false,
            showEditForm:false,
            warning:false,
            showWarning:'',
            confirm:false,
            cardToDelete:'',
            confirmDeleteAll:false,
            cardFilter:'',
            bigCard:'',
            text:'',
            returnHome:false
        }
    }

    componentDidUpdate(prevProps, prevStates){
        if(prevProps.tokens !== this.props.tokens){
            const json=JSON.stringify(this.props.tokens)
            localStorage.setItem('tokens', json)
        }
    }

    componentWillUnmount(){
        if(!this.props.selectedStack){
            return;
        }else if(this.props.selectedStack){
            const allCards=this.props.allCards
            const newCardId=this.props.newCardId
            const json =JSON.stringify(allCards);
            const json2 =JSON.stringify(newCardId);
            localStorage.setItem('allCards', json);
            localStorage.setItem('newCardId', json2); 
        }
    }

    componentDidMount(){
        if(!this.props.selectedStack){
            this.setState({returnHome:true})
            return;
        }else{
            if(localStorage.getItem('newCardId')===null){
                return;
            }
            const json2=localStorage.getItem('newCardId')
            const newCardId=JSON.parse(json2)
            this.props.dispatch(setNewCardId(newCardId))
        }
        
    }

    onCardClick=(card)=>{
        this.setState({bigCard:card})
    }
    onDeleteCard=(card)=>{
        this.setState({
            warning:true, 
            cardToDelete:card,
            showWarning:`ARE YOU SURE YOU WANT TO DELETE '${card.name.toUpperCase()}' CARD?`,  
        })
    }
    onSaveCard=(newCard)=>{
        const cardsID=this.props.cards.map(c=>c.name)
        const card=newCard.name
        const stackId=this.props.selectedStack.stackId

        if(cardsID.includes(card)){
            this.setState({text:'This card already existed'})
            return;
        }
        this.setState({showForm:false})
        this.props.dispatch(addCard({stackId,...newCard}))
        this.props.dispatch(filterStack(this.props.selectedStack.stackId))

    }
    onSaveEdit=(editedCard)=>{
        const id=this.props.cardToEdit.id
        const stackId=this.props.selectedStack.stackId
        const newCard={id, stackId,...editedCard, showInfo:false, selected:false, showCard:true}
        const matchCheck=this.props.cards.map(c=>c.name)
        if(matchCheck.includes(newCard.name)){
            this.setState({text:'there is a card with the same name'})
            return;
        }else{
            this.props.dispatch(editCard(newCard))
            this.props.dispatch(cardToEditInfo({}))
            this.setState({showEditForm:false, bigCard:newCard, text:''})
            return;
        }
    }
    cardToEdit=(card)=>{
        this.setState({showEditForm:true})
        this.props.dispatch(cardToEditInfo(card))
    }

    onConfirm=(pass)=>{
        if(pass){
            if(this.state.confirmDeleteAll){
                this.setState({warning:false, confirmDeleteAll:false, bigCard:''})
                this.props.dispatch(deleteAllCardsInCurrentStack(this.props.selectedStack.stackId))
            }else{
                this.setState({warning:false, bigCard:''})
                this.props.dispatch(removeCard(this.state.cardToDelete.id))
            }
        }else {
            this.setState({warning:false, confirmDeleteAll:false})
        }
    }

    onDeleteAll=()=>{
        this.setState({warning:true, showWarning: 'ARE YOU SURE YOU WANT TO DELETE ALL CARDS?', confirmDeleteAll:true})
    }

    onFilterTextChange=(e)=>{
        this.setState({cardFilter:e.target.value})
        this.props.dispatch(filteredCards(e.target.value))
        
    }

    test=()=>{
        const {cards, cardToEdit, filteredCards, selectedStack, allCards, newCardId}=this.props
        console.log('cards:', cards)
        console.log('cardToEdit:', cardToEdit)
        console.log('filteredCards:', filteredCards)
        console.log('selectedStack:', selectedStack.stackId)
        console.log('allCards:', allCards)
        console.log('newCardId: ', newCardId)

        // localStorage.clear();
    }

    render(){
        const style=reziseAndStyleBigCard('400px', '300px', 17, 'pictures/backgroundPics/', 'jpg', '1em', '15px', 'auto')
        const {cards, filteredCards}=this.props
        const cardCheck=this.props.cards.length===1?'card':'cards'
        return (
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

                        <Link to='/test'><button>test page</button></Link>
                        <button onClick={this.test}>test</button>
                        <button onClick={()=>this.props.dispatch(addToken(50))}>add a token</button>
                        <button onClick={()=>this.props.dispatch(reduceToken(50))}>remove a token</button>

                        {!this.state.returnHome &&
                        <div>
                            <button onClick={()=>this.setState({showForm:true})} className='add'>add a card</button>
                            <button onClick={this.onDeleteAll} className='delete'>delete all cards</button>
                            <Link to='/selectCard'><button className='play'>play games</button></Link>
                        </div>
                        }

                        <input
                            type='text'
                            placeholder='find cards by name'
                            value = {this.state.cardFilter}
                            onChange= {this.onFilterTextChange}
                        />
                        <Link to='/'><button className='return'>return</button></Link>                       
                    </div>

                </div>
                    {this.state.returnHome &&
                    <Link to='/'><h3>you need to choose a stack to see cards, click this to go to stacks selection page</h3></Link>
                    }
                <div className='text'>
                    {this.state.text && this.state.text}
                    {this.props.cards.length > 0 && 
                    <h3>You have {this.props.cards.length} {cardCheck}</h3>
                    }
                </div>

                <div>
                    {this.state.warning && 
                    <div className='warning'>
                        <h3>{this.state.showWarning}</h3>
                        <div className='warning-buttons'>
                            <button onClick={()=>this.onConfirm(true)}>yes</button>
                            <button onClick={()=>this.onConfirm(false)}>no</button>
                        </div>
                    </div>
                    }
                </div>

                {this.state.showForm &&
                    <FlashCardForm
                        onCloseForm={()=>this.setState({showForm:false, text:''})}
                        saveCard={(newCard)=>this.onSaveCard(newCard)}
                    />
                }    
                {this.state.showEditForm && 
                    <FlashCardForm
                        onCloseForm={()=>this.setState({showEditForm:false, text:''})}
                        editCardInfo={this.props.cardToEdit}
                        saveEditCard={(editedCard)=>this.onSaveEdit(editedCard)}
                    />
                }

                <div className='all-cards'>
                    <CardList
                        cards={this.state.cardFilter?filteredCards:cards}
                        cardClick={this.onCardClick}
                        deleteCard={this.onDeleteCard}
                        showEditForm={()=>this.setState({showEditForm:true})}
                        editCard={this.cardToEdit}
                    />
                    {this.state.bigCard &&
                        <BigCard
                            style={style}
                            bigCardClick={()=>this.setState({bigCard:{...this.state.bigCard,showInfo:!this.state.bigCard.showInfo}})}
                            card={this.state.bigCard}
                            deleteCard={this.onDeleteCard}
                            editCard={this.cardToEdit}
                            showButtons={true}
                        />
                    }
                </div>      

            </div>
        )
    }
 
}

const mapStateToProps=(state)=>({
    allCards:state.flashCardReducer.cards,
    cards:state.flashCardReducer.stackCards,
    cardToEdit:state.flashCardReducer.cardToEdit,
    filteredCards:state.flashCardReducer.filteredCards,
    newCardId:state.flashCardReducer.newId,
    selectedStack:state.cardStackReducer.selectedStack,
    tokens:state.tokenReducer.totalTokens,
    gameBought:state.tokenReducer.gamesBought,
    gameRemain:state.tokenReducer.gamesRemain
})


export default connect(mapStateToProps)(FlashCard)

const randomBg=randomPics(13, '/pictures/textures/', 'jpg')

injectGlobal`
body{
    margin: 0;
    padding: 0;
    background: rgba(153, 127, 127, 0.7);
    background-image: url(${randomBg});
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
} 
`;
