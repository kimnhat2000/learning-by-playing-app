
const defaultState={
    cards:[],
    selectedCards:[],
    stackCards:[],
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
            cards:[...state.cards,{id:state.newId, ...action.card}],
            newId:state.newId+1
        }

        //for using to add all cards in state to local storage
        case 'ADD_CARDS':
        return {
            ...state,
            cards:action.cards
        }

        //test need, done, works fine now
        case 'REMOVE_CARD':
        return {
            ...state,
            stackCards:state.stackCards.filter((c)=>c.id !== action.id),
            cards:state.cards.filter((c)=>c.id !== action.id && c.stackId !== action.stackId)
        }

        //why did I need this? I do not really need this, I can create this easily in app state. maybe I created this just because I can???
        case 'CARD_TO_EDIT_INFO':
        return {
            ...state,
            cardToEdit:action.card
        }

        //test this, done works fine
        case 'EDIT_CARD':
        return {
            ...state,
            stackCards:state.stackCards.map((c)=>c.id===action.card.id ? c=action.card:c),
            cards:state.cards.map(c=> c.id === action.card.id && c.stackId === action.card.stackId ? c=action.card : c),
        }

        //test this, tested and working fine
        case 'REMOVE_ALL_CARDS':
            const stackCards=[]
            const cards=state.cards.filter(c=>c.stackId !== action.stackId)
        return {
            ...state,
            cards,
            stackCards
        }

        //test this, tested and working fine
        case 'FILTERED_CARD':
        const filteredCards=state.stackCards.filter(c=>c.name.toLowerCase().includes(action.text.toLowerCase()))
        return {
            ...state, 
            filteredCards
        }
        case 'FILTER_STACK':
        return {
            ...state,
            stackCards: state.cards.filter(c=>c.stackId === action.stackId)
        }

        default:
            return state
    }
}