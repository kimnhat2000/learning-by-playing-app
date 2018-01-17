export const addToken =(num)=>({
    type:'ADD_TOKEN',
    num
})

export const reduceToken =(num)=>({
    type:'REDUCE_TOKEN',
    num
})

export const buyAGame =(game)=>({
    type:'BUY_A_GAME',
    game
})