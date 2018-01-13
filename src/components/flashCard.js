import React from 'react';
import CardList from './cardList';
import {BigCard} from './card';
import {connect} from 'react-redux';
import {addCard, removeCard, cardToEditInfo, editCard, removeAllCards, filteredCards} from '../actions/flashCardActions';
import FlashCardForm from './form';
import {Link} from 'react-router-dom';
import '../style/flashCardStyle.css'

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
            bigCard:''
        }
    }
    onCardClick=(card)=>{
        this.setState({bigCard:card})
    }
    onDeleteCard=(card)=>{
        this.setState({
            warning:true, 
            cardToDelete:card,
            showWarning:`ARE YOU SURE YOU WANT TO DELETE ${card.name.toUpperCase()} CARD?`,  
        })

    }
    onSaveCard=(newCard)=>{
        this.props.dispatch(addCard(newCard))
        this.setState({showForm:false})
    }
    onSaveEdit=(editedCard)=>{
        const id=this.props.cardToEdit.id
        const newCard={id,...editedCard, showInfo:false, selected:false, showCard:true}
        this.props.dispatch(editCard(newCard))
        this.props.dispatch(cardToEditInfo({}))
        this.setState({showEditForm:false, bigCard:newCard})
    }
    cardToEdit=(card)=>{
        this.setState({showEditForm:true})
        this.props.dispatch(cardToEditInfo(card))
    }
    test=()=>{
        // this.props.cards.map(c=>console.log(c.selected))
        // console.log(this.state.bigCard.showInfo)
        console.log(this.props.cards)
        console.log(this.props.cardToEdit)
    }
    checkPass=(pass)=>{
        if(pass){
            if(this.state.confirmDeleteAll){
                this.setState({warning:false})
                this.props.dispatch(removeAllCards())
            }else{
                this.setState({warning:false, bigCard:''})
                this.props.dispatch(removeCard(this.state.cardToDelete.id))
            }
        }else {
            this.setState({warning:false})
        }
    }

    onDeleteAll=()=>{
        this.setState({warning:true, showWarning: 'ARE YOU SURE YOU WANT TO DELETE ALL CARDS?', confirmDeleteAll:true})
    }

    onFilterTextChange=(e)=>{
        this.setState({cardFilter:e.target.value})
        this.props.dispatch(filteredCards(e.target.value))
    }

    render(){   
        const {cards, filteredCards}=this.props
        const cardCkeck=this.props.cards.length===1?'card':'cards'
        return (
            <div>
                <div>
                    <button
                        onClick={()=>this.setState({showForm:true})}
                    >add a card</button>
                    <button onClick={this.test}>test</button>
                    <button
                        onClick={this.onDeleteAll}
                    >delete all</button>
                    <input
                        type='text'
                        placeholder='find cards by name'
                        value = {this.state.cardFilter}
                        onChange= {this.onFilterTextChange}
                    />

                    <Link to='/selectCard'>
                        <button>play games</button>
                    </Link>
                    
                </div>

                <div>
                    {this.props.cards.length > 0 && 
                    <h3>You have {this.props.cards.length} {cardCkeck}</h3>
                    }
                    {this.state.warning && 
                    <div>
                        <h3>{this.state.showWarning}</h3>
                        <button onClick={()=>this.checkPass(true)}>yes</button>
                        <button onClick={()=>this.checkPass(false)}>no</button>
                    </div>
                    }
                </div>

                {this.state.showForm &&
                    <FlashCardForm
                        onCloseForm={()=>this.setState({showForm:false})}
                        saveCard={(newCard)=>this.onSaveCard(newCard)}
                    />
                }    
                {this.state.showEditForm && 
                    <FlashCardForm
                        onCloseForm={()=>this.setState({showEditForm:false})}
                        editCardInfo={this.props.cardToEdit}
                        saveEditCard={(editedCard)=>this.onSaveEdit(editedCard)}
                    />

                }
                       
                <CardList
                    cards={this.state.cardFilter?filteredCards:cards}
                    cardClick={this.onCardClick}
                    deleteCard={this.onDeleteCard}
                    showEditForm={()=>this.setState({showEditForm:true})}
                    editCard={this.cardToEdit}
                />
                {this.state.bigCard &&
                    <BigCard
                        bigCardClick={()=>this.setState({bigCard:{...this.state.bigCard,showInfo:!this.state.bigCard.showInfo}})}
                        card={this.state.bigCard}
                        deleteCard={this.onDeleteCard}
                        editCard={this.cardToEdit}
                        showButtons={true}
                    />
                }

            </div>
        )
    }
 
}

const mapStateToProps=(state)=>({
    cards:state.flashCardReducer.cards,
    cardToEdit:state.flashCardReducer.cardToEdit,
    selectedCards:state.flashCardReducer.selectedCards,
    filteredCards:state.flashCardReducer.filteredCards
})


export default connect(mapStateToProps)(FlashCard)