
const defaultState={
    cards:[],
    selectedCards:[],
    newId:0,
    showInfo:false,
    cardToEdit:'',
    filteredCards:[]
}

export const flashCardReducer =(state=defaultState, action)=>{
    switch (action.type){
        case 'ADD_CARD':
        return {
            ...state,
            cards:[...state.cards,{id:state.newId,...action.card}],
            newId:state.newId+1
        }
        case 'REMOVE_CARD':
        return {
            ...state,
            cards:state.cards.filter((c)=>c.id !== action.id)
        }
        case 'CARD_TO_EDIT_INFO':
        return {
            ...state,
            cardToEdit:action.card
        }
        case 'EDIT_CARD':
        return {
            ...state,
            cards:state.cards.map((c)=>c.id===action.card.id?c=action.card:c)
        }
        case 'REMOVE_ALL_CARDS':
        return {
            ...state,
            cards:[]
        }
        case 'FILTERED_CARD':
        const filteredCards=state.cards.filter(c=>c.name.toLowerCase().includes(action.text.toLowerCase()))
        return {
            ...state, 
            filteredCards
        }

        default:
            return state
    }
}