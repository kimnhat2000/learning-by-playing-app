import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Card, BigCard} from './card';
import {editCard} from '../actions/flashCardActions';
import {multibleSelection} from '../actions/selectCardsActions';
import '../style/selectCards.css'

const SelectCards =({cards, selectCards, dispatch})=>{

    const onCardClick=(card)=>{
        dispatch(editCard({...card,selected:!card.selected}))
        dispatch(multibleSelection(card))
    }
    const SelectedCardClick=(card)=>{
    }

    const test=()=>{
        console.log(selectCards.length)
    }

    const allCards=cards.map((c,i)=>(
        <Card
            key={i}
            card={c}
            cardClick={onCardClick}
        />
    ))
    const selectedCards= selectCards.map((c,i)=>(
        <Card
            key={i}
            card={c}
            cardClick={SelectedCardClick}
        />
    ))
    const grammarCheck = selectCards.length===1? 'card': 'cards'
    return (
        <div>
            <Link to='/'>return to flashCard</Link>
            <button onClick={test}>test</button>
            <div className='cards'>{allCards}</div>
            {selectCards &&
                <div>
                    <h3>you have selected {selectCards.length}{grammarCheck}</h3>
                    <div className='cards'>{selectedCards}</div>
                </div>             
            }

            {selectCards &&
            <div>
                <h3>what games do you want to play?</h3>

                <div className='buttons'>
                    <Link to='/luckCheck'><button>luck check</button></Link>
                    <Link to='/matchCards'><button>match cards</button></Link>
                    <Link to='/typeThemOut'><button>type them out</button></Link>
                    <Link to='/pairThemUp'><button>pair them up</button></Link>
                    <Link to='/multibleChoices'><button>mutible choices</button></Link>
                    <Link to='/betThemDown'><button>bet them down</button></Link>
                    <Link to='/wackACard'><button>wack a card</button></Link>
                    <Link to='/catchMe'><button>catch me</button></Link>
                    <Link to='/cookcoo'><button>cookcoo</button></Link>
                </div>

            </div> 
            }  

        </div> 
)}

const mapStateToProps=(state)=>({
    cards:state.flashCardReducer.cards,
    selectCards:state.selectCardsReducer.cards
})

export default connect(mapStateToProps)(SelectCards)