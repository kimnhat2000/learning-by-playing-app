import React from 'react';

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
                    <div className='img-div'>
                        <img src={card.img}/>
                    </div>
                    <div className='card-name'>
                        <h3>{card.name}</h3>
                    </div>
                    
            </div>:

            <div 
                className='card'
                style={style}
                onClick={onCardClick}
            >
            </div>
            }
        </div>
        
)}


export const BigCard =({card, deleteCard, editCard, bigCardClick, showButtons, style})=>{
    const variants=card.variants && card.variants.map((v,i)=>(
        <li key={i}>{v}</li>
    ))
    return (
        <div className='big-card-container'
            >
            {card.showInfo?
            <div 
                className='big-card'
                style={style}
                onClick={bigCardClick}
            >
                <h3 className='info'>{card.name}</h3>
                <p className='info'>{card.description}</p>
                <ul className='info'>{variants}</ul>
            </div>
            :
            <div 
                className='big-card'
                style={style}
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
                        className='delete'
                        onClick={()=>deleteCard(card)}
                    >delete</button>
                    <button
                        className='edit'
                        onClick={()=>editCard(card)}

                    >edit</button>
                </div>
            }
            
        </div>
)}