import React from 'react';
import {randomColor} from '../tools/tools';
import {Card} from './card';
import '../style/cardList.css';

const CardList =({cards, cardClick, deleteCard, editCard, showEditForm})=>{
    const r1=randomColor();
    const r2=randomColor();
    const r3=randomColor();
    const style={backgroundColor:`rgb(${r1}, ${r2}, ${r3})`}
    const card=cards.map((c,i)=>(
        <div
            className='card-list'
            key={i}
        >
            <Card
                key={i}
                style={style}
                card={c}
                cardClick={cardClick}
                deleteCard={deleteCard}
                editCard={editCard}
                showEditForm={showEditForm}
            />
        </div>
    ))
    return(
    <div className='card-list'>{card}</div>
)}

export default CardList