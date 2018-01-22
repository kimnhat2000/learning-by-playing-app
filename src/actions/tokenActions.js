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

export const changeTokenNum=(num)=>({
    type:'CHANGE_TOKEN_NUM',
    num
})

export const saveGameBought=(gamesBoughtState, gamesRemainState)=>({
    type:'CHANGE_GAME_BOUGHT_STATE',
    gamesBoughtState,
    gamesRemainState
})