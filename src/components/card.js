import React from 'react';

export const Card =({cardClick, card, deleteCard, editCard})=>{
    const onCardClick=()=>cardClick(card)
    const variants=card.variants&&card.variants.map((v,i)=>(
        <li key={i}>{v}</li>
    ))
    return (
        <div>
            {card.showCard?
            
            <div 
                className='card'
                onClick={onCardClick}
            >
                <div className='img'>
                    <img src={card.img}/>
                    <h3>{card.name}</h3>
                </div>
            </div>:
            <div 
                className='card'
                onClick={onCardClick}
            >
                <div className='img'>
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
        <div 
            className='big-card-container'
            >
            {card.showInfo?
            <div 
                className='big-card'
                onClick={bigCardClick}
            >
                <h3>{card.name}</h3>
                <p>{card.description}</p>
                <ul>{variants}</ul>
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
                <div>
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
