const defaultSelectCardsReducerState={
    cards:[]
}

export const selectCardsReducer = (state=defaultSelectCardsReducerState, action)=>{
    switch (action.type){
        case 'MULTIBLE_SELECTION':
        return {
            ...state,
            cards:action.card.selected?
                state.cards.filter((c)=>c.id !== action.card.id):
                [...state.cards,action.card]
        }
        default:
            return state
    }
}