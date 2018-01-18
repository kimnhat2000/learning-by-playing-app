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
    type: 'DELETE_ALL'
})

export const selectedStackId=(stack)=>({
    type: 'SELECTED_STACK_ID',
    stack
})