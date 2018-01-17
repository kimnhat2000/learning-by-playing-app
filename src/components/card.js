import React from 'react';
import {randomPics} from '../tools/tools'
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
                        onClick={()=>deleteCard(card)}
                    >delete</button>
                    <button
                        onClick={()=>editCard(card)}

                    >edit</button>
                </div>
            }
            
        </div>
)}

export const BigCardResize =({card, bigCardClick})=>{
    const img= randomPics(17, 'pictures/backgroundPics/', 'jpg')
    const style={
        backgroundImage: `url(${img})`,
        backgroundSize:'350px 250px',
    }
    const variants=card.variants && card.variants.map((v,i)=>(
        <li key={i}>{v}</li>
    ))
    return (
        <div className='big-card-container-resize'
            >
            {card.showInfo?
            <div 
                className='big-card-resize'
                style={style}
                onClick={bigCardClick}
            >
                <h3 className='info-resize'>{card.name}</h3>
                <p className='info-resize'>{card.description}</p>
                <ul className='info-resize'>{variants}</ul>
            </div>
            :
            <div 
                className='big-card-resize'
                style={style}
                onClick={bigCardClick}
            >
                <div className='big-img-resize'>
                    <img src={card.img}/>
                    <h3>{card.name}</h3>
                </div>
            </div>}
            
        </div>
)}
