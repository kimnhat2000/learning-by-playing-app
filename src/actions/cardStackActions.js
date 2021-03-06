export const addStack =(stack)=>({
    type: 'ADD_STACK',
    stack
})

export const removeStack =(stack)=>({
    type: 'REMOVE_STACK',
    stack
})

export const editStack =(stack)=>({
    type: 'EDIT_STACK',
    stack
})

export const deleteAllStack =()=>({
    type: 'DELETE_ALL_STACK'
})

export const selectedStack=(stack)=>({
    type: 'SELECTED_STACK',
    stack
})

export const stackSearch =(text)=>({
    type: 'SEARCH_STACK',
    text
})

export const addStacks =(stacks, stackId)=>({
    type: 'ADD_STACKS',
    stacks,
    stackId
})