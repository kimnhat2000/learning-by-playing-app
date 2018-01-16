import React from 'react';
import '../style/card.css';

export const Card =({cardClick, card, style})=>{
    const onCardClick=()=>cardClick && cardClick(card)
    const variants=card.variants&&card.variants.map((v,i)=>(
        <li key={i}>{v}</li>
    ))
    return (
        <div>
            {card.showCard?
            
            <div
                className='card'
                style={style}
                onClick={onCardClick}
            >
                <div className='card-contents'>
                    <img src={card.img}/>
                    <h3>{card.name}</h3>
                </div>
                
            </div>:

            <div 
                className='card'
                style={style}
                onClick={onCardClick}
            >
                <div className='card-contents'>
                </div>
            </div>
            }
        </div>
        
)}

export const BigCard =({card, deleteCard, editCard, bigCardClick, showButtons})=>{
    const variants=card.variants && card.variants.map((v,i)=>(
        <li key={i}>{v}</li>
    ))
    return (
        <div className='big-card-container'
            >
            {card.showInfo?
            <div 
                className='big-card'
                onClick={bigCardClick}
            >
                <h3 className='info'>{card.name}</h3>
                <p className='info'>{card.description}</p>
                <ul className='info'>{variants}</ul>
            </div>
            :
            <div 
                className='big-card'
                onClick={bigCardClick}
            >
                <div className='big-img'>
                    <img src={card.img}/>
                    <h3>{card.name}</h3>
                </div>
            </div>}

            {showButtons &&
                <div className='card-buttons'>
                    <button
                        onClick={()=>deleteCard(card)}
                    >delete</button>
                    <button
                        onClick={()=>editCard(card)}

                    >edit</button>
                </div>
            }
            
        </div>

        )

}
