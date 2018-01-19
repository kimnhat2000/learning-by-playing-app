const tokenDefault={
    totalTokens:0,
    games:[
        {id: 1, name:'luck check', path:'/luckCheck', buy:true},
        {id: 2, name:'match cards', path:'/matchCards', buy:false},
        {id: 3, name:'type Them Out', path:'/typeThemOut', buy:false},
        {id: 4, name:'pair ThemUp', path:'/pairThemUp', buy:false},
        {id: 5, name:'multible Choices', path:'/multibleChoices', buy:false},
        {id: 6, name:'bet Them Down', path:'/betThemDown', buy:false},
        {id: 7, name:'wack A Card', path:'/wackACard', buy:false},
        {id: 8, name:'cook coo', path:'/cookcoo', buy:false},
    ],
    gamesBought:[
        {id: 1, name:'luck check', path:'/luckCheck', buy:true},
        {id: 2, name:'match cards', path:'/matchCards', buy:true},
        {id: 3, name:'type Them Out', path:'/typeThemOut', buy:true},
        {id: 4, name:'pair ThemUp', path:'/pairThemUp', buy:true},
        {id: 5, name:'multible Choices', path:'/multibleChoices', buy:true},
        {id: 6, name:'bet Them Down', path:'/betThemDown', buy:true},
        {id: 7, name:'wack A Card', path:'/wackACard', buy:true},
        {id: 8, name:'cook coo', path:'/cookcoo', buy:true},
    ],
    gamesRemain:[
        {id: 2, name:'match cards', path:'/matchCards', buy:false},
        {id: 3, name:'type Them Out', path:'/typeThemOut', buy:false},
        {id: 4, name:'pair ThemUp', path:'/pairThemUp', buy:false},
        {id: 5, name:'multible Choices', path:'/multibleChoices', buy:false},
        {id: 6, name:'bet Them Down', path:'/betThemDown', buy:false},
        {id: 7, name:'wack A Card', path:'/wackACard', buy:false},
        {id: 8, name:'cook coo', path:'/cookcoo', buy:false},
    ]
}

export const tokenReducer=(state=tokenDefault, action)=>{
    switch (action.type){
        case 'ADD_TOKEN':
        return {
            ...state,
            totalTokens:state.totalTokens+action.num
        }

        case 'REDUCE_TOKEN':
        return {
            ...state,
            totalTokens:state.totalTokens-action.num
        }

        case 'BUY_A_GAME':
        const games=state.games.map(g=>g.id===action.game.id ? g={...g, buy:true} : g)
        const gamesBought=games.filter(g=>g.buy===true)
        const gamesRemain=games.filter(g=>g.buy===false)
        return {
            ...state,
            totalTokens:state.totalTokens-100,
            games,
            gamesBought,
            gamesRemain
        }

        default:
            return state
    }
}