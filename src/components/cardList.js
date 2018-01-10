import React from 'react';
import {Card} from './card';
import '../style/flashCardStyle.css';

const CardList =({cards, cardClick, deleteCard, editCard, showEditForm})=>{
    const card=cards.map((c,i)=>(
        <Card
            key={i}
            card={c}
            cardClick={cardClick}
            deleteCard={deleteCard}
            editCard={editCard}
            showEditForm={showEditForm}
        />
    ))
    return(
    <div className='card-list'>{card}</div>
)}

export default CardList