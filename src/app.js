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

console.log('connected')

const reducers=combineReducers({
    flashCardReducer,
    selectCardsReducer,
    tokenReducer,
    cardStackReducer
})

const store =createStore(reducers)

store.subscribe(()=>{
    const state=store.getState()
})

const Jsx =()=>(
    <Provider store={store}>
        <FlashCardAppRouter/>
    </Provider>
)

ReactDom.render(<Jsx/>, document.getElementById('app'))