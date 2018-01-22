
//add card
export const addCard=({stackId='', name='', description='', variants=[], img=''})=>({
    type:'ADD_CARD',
    card:{
        stackId, name, description, variants, img, showInfo:false, selected:false, showCard:true
    }
})

//add many cards
export const addCards=(cards, newId)=>({
    type:'ADD_CARDS',
    cards,
    newId
})

//remove card
export const removeCard=(id)=>({
    type:'REMOVE_CARD',
    id
})

//removeAllCards
export const deleteAllCardsInCurrentStack=(stackId)=>({
    type:'DELETE_ALL_CARDS_IN_CURRENT_STACK',
    stackId
})

export const deleteAllCards=()=>({
    type:'DELETE_ALL_CARDS',
})

//cardToEditInfo
export const cardToEditInfo=(card={})=>({
    type:'CARD_TO_EDIT_INFO',
    card
})

//editCard
export const editCard=(card)=>({
    type: 'EDIT_CARD',
    card
})

//filter cards
export const filteredCards=(text)=>({
    type:'FILTERED_CARD',
    text
})

//filter stack
export const filterStack=(stackId)=>({
    type: 'FILTER_STACK',
    stackId
})

//set new card id for saving to storage purpose
export const setNewCardId =(newCardId)=>({
    type: 'SET_CARD_ID',
    newCardId
})