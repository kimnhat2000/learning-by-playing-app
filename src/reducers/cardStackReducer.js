const defaultState = {
    stacks:[],
    selectedStack:'',
    filteredStacks:[],
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
        case 'ADD_STACKS':
        return {
            ...state,
            stacks:[...action.stacks],
            stackId:action.stackId
        }

        case 'REMOVE_STACK':
        return {
            ...state,
            stacks:state.stacks.filter(s=>s.stackId !== action.stack.stackId),
        }

        case 'EDIT_STACK':
        return {
            ...state,
            stacks:state.stacks.map(s=>s.stackId === action.stack.stackId ? s=action.stack : s={...s, showButtons:false}),
            filteredStacks:state.filteredStacks.length !== 0 ? state.filteredStacks.map(s=>s.stackId === action.stack.stackId ? s=action.stack : s={...s, showButtons:false}) : state.filteredStacks
        }

        case 'DELETE_ALL_STACK':
        return {
            ...state,
            stacks:[],
            stackId:0
        }

        case 'SELECTED_STACK':
        return {
            ...state,
            selectedStack:action.stack
        }

        case 'SEARCH_STACK':
        return {
            ...state,
            filteredStacks:action.text?state.stacks.filter(s=>s.name.includes(action.text)):state.filteredStacks=[]
        }

    default:
        return state
    }
}