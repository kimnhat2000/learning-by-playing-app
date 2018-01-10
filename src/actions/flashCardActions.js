//filter cards
export const filteredCards=(text)=>({
    type:'FILTERED_CARD',
    text
})

//add card
export const addCard=({name='', description='', variants=[], img=''})=>({
    type:'ADD_CARD',
    card:{
        name, description, variants, img, showInfo:false, selected:false, showCard:true
    }
})

//remove card
export const removeCard=(id)=>({
    type:'REMOVE_CARD',
    id
})

//removeAllCards
export const removeAllCards=()=>({
    type:'REMOVE_ALL_CARDS'
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