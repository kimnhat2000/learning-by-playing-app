const defaultState = {
    stacks:[],
    selectedStackId:'',
    stackId:0
}

export const cardStackReducer =(state=defaultState, action)=>{
    switch (action.type){
        case 'ADD_STACK':
        const newStack={};
        const addStack={...newStack, stackId:state.stackId, name:action.stack.name, img:action.stack.img, showButtons:false};
        return {
            ...state,
            stacks:[...state.stacks,addStack],
            stackId:state.stackId+1
        }

        case 'REMOVE_STACK':
        return {
            ...state,
            stacks:state.stacks.filter(s=>s.stackId !== action.stack.stackId),
        }

        case 'EDIT_STACK':
        return {
            ...state,
            stacks:state.stacks.map(s=>s.stackId === action.stack.stackId ? s=action.stack : s={...s, showButtons:false})
        }

        case 'DELETE_ALL_STACK':
        return {
            ...state,
            stacks:[],
            stackId:0
        }

        case 'SELECTED_STACK_ID':
        return {
            ...state,
            selectedStackId:action.stack.stackId
        }

    default:
        return state
    }
}