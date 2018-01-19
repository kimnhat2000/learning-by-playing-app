import React from 'react';
import ReactDom from 'react-dom';
import {Provider, connect} from 'react-redux';
import {createStore, combineReducers} from 'redux';

import {addCard, filterStack} from './actions/flashCardActions';
import {selectOtherApproach, storeSelectedCards} from './actions/selectCardsActions';
import {addToken} from './actions/tokenActions';
import {addStack, removeStack, editStack, deleteAllStack} from './actions/cardStackActions';
import {randomPics} from './tools/tools';

import {flashCardReducer} from './reducers/flashCardReducer';
import {selectCardsReducer} from './reducers/selectCardsReducer';
import {tokenReducer} from './reducers/tokenReducer';
import {cardStackReducer} from './reducers/cardStackReducer';
import FlashCardAppRouter from './routers/flashCardAppRouter';

const reducers=combineReducers({
    flashCardReducer,
    selectCardsReducer,
    tokenReducer,
    cardStackReducer
})

const store =createStore(reducers)

store.subscribe(()=>{
    const state=store.getState()
    // console.log(state.cardStackReducer)
})

store.dispatch(addCard({stackId:0, name:'card 1a looong loong nameeee and it keeps getting looonggeerrrrr', description:' card 1 description', variants:['var1', 'var2'], img:'pictures/lagi.png'}))
store.dispatch(addCard({stackId:0, name:'card 2a', description:' card 2 description', variants:['var 2a', 'var2a'], img:'pictures/narga.png'}))
store.dispatch(addCard({stackId:0, name:'card 3b', description:' card 3 description', variants:['var3b', 'var3b'], img:'pictures/akan.png'}))
store.dispatch(addCard({stackId:0, name:'card 4b', description:' card 4 description', variants:['var4b', 'var4b', 'var4b'], img:'pictures/ukan.png'}))
store.dispatch(addCard({stackId:2, name:'card 1a', description:' card 1 description', variants:['var1', 'var2'], img:'pictures/lagi.png'}))
store.dispatch(addCard({stackId:2, name:'card 2a', description:' card 2 description', variants:['var 2a', 'var2a'], img:'pictures/narga.png'}))
store.dispatch(addCard({stackId:3, name:'card 3b', description:' card 3 description', variants:['var3b', 'var3b'], img:'pictures/akan.png'}))
store.dispatch(addCard({stackId:3, name:'card 4b', description:' card 4 description', variants:['var4b', 'var4b', 'var4b'], img:'pictures/ukan.png'}))
// store.dispatch(addCard({name:'card 1a', description:' card 1 description', variants:['var1', 'var2'], img:'pictures/lagi.png'}))
// store.dispatch(addCard({name:'card 2a', description:' card 2 description', variants:['var 2a', 'var2a'], img:'pictures/narga.png'}))
// store.dispatch(addCard({name:'card 3b', description:' card 3 description', variants:['var3b', 'var3b'], img:'pictures/akan.png'}))
// store.dispatch(addCard({name:'card 4b', description:' card 4 description', variants:['var4b', 'var4b', 'var4b'], img:'pictures/ukan.png'}))
// store.dispatch(addCard({name:'card 1a', description:' card 1 description', variants:['var1', 'var2'], img:'pictures/lagi.png'}))
// store.dispatch(addCard({name:'card 2a', description:' card 2 description', variants:['var 2a', 'var2a'], img:'pictures/narga.png'}))
// store.dispatch(addCard({name:'card 3b', description:' card 3 description', variants:['var3b', 'var3b'], img:'pictures/akan.png'}))
// store.dispatch(addCard({name:'card 4b', description:' card 4 description', variants:['var4b', 'var4b', 'var4b'], img:'pictures/ukan.png'}))
// store.dispatch(addCard({name:'card 1a', description:' card 1 description', variants:['var1', 'var2'], img:'pictures/lagi.png'}))
// store.dispatch(addCard({name:'card 2a', description:' card 2 description', variants:['var 2a', 'var2a'], img:'pictures/narga.png'}))
// store.dispatch(addCard({name:'card 3b', description:' card 3 description', variants:['var3b', 'var3b'], img:'pictures/akan.png'}))
// store.dispatch(addCard({name:'card 4b', description:' card 4 description', variants:['var4b', 'var4b', 'var4b'], img:'pictures/ukan.png'}))
// store.dispatch(addCard({name:'card 1a', description:' card 1 description', variants:['var1', 'var2'], img:'pictures/lagi.png'}))
// store.dispatch(addCard({name:'card 2a', description:' card 2 description', variants:['var 2a', 'var2a'], img:'pictures/narga.png'}))
// store.dispatch(addCard({name:'card 3b', description:' card 3 description', variants:['var3b', 'var3b'], img:'pictures/akan.png'}))
// store.dispatch(addCard({name:'card 4b', description:' card 4 description', variants:['var4b', 'var4b', 'var4b'], img:'pictures/ukan.png'}))

store.dispatch(selectOtherApproach(store.getState().flashCardReducer.cards))

store.dispatch(addToken(250))
store.dispatch(addToken(3))

const stack1={name:'stack1', img:`${randomPics(55, 'pictures/randomPics/', 'jpg')}`}
const stack2={name:'stack2', img:`${randomPics(55, 'pictures/randomPics/', 'jpg')}`}
const stack3={name:'stack3', img:`${randomPics(55, 'pictures/randomPics/', 'jpg')}`}
const stack4={name:'stack4', img:`${randomPics(55, 'pictures/randomPics/', 'jpg')}`}

store.dispatch(addStack(stack1))
store.dispatch(addStack(stack2))
store.dispatch(addStack(stack3))
store.dispatch(addStack(stack4))

// const stack={stackId:1}

// store.dispatch(filterStack(1))




const Jsx =()=>(
    <Provider store={store}>
        <FlashCardAppRouter/>
    </Provider>
)

ReactDom.render(<Jsx/>, document.getElementById('app'))