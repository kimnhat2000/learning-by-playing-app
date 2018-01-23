import React from 'react'
import {BrowserRouter, Route, Switch, Link, NavLink} from 'react-router-dom';
import FlashCard from '../components/flashCard';
import SelectCards from '../components/selectCards';
import LuckCheck from '../components/games/luckCheck';
import MatchCards from '../components/games/matchCards';
import TypeThemOut from '../components/games/typeThemOut';
import PairThemUp from '../components/games/pairThemUp';
import MultibleChoices from '../components/games/multibleChoices';
import BetThemDown from '../components/games/betThemDown';
import WackACard from '../components/games/wackACard';
import Cookcoo from '../components/games/cookcoo';
import CardStack from '../components/cardStack';
import '../style/globalStyle.css';

const FlashCardAppRouter =()=>(
    <BrowserRouter>
        <Switch>
            <Route path='/' component={CardStack} exact={true}/>
            <Route path='/flashCard' component={FlashCard}/>
            <Route path='/selectCard' component={SelectCards}/>
            <Route path='/luckCheck' component={LuckCheck}/>
            <Route path='/matchCards' component={MatchCards}/>
            <Route path='/typeThemOut' component={TypeThemOut}/>
            <Route path='/pairThemUp' component={PairThemUp}/>
            <Route path='/multibleChoices' component={MultibleChoices}/>
            <Route path='/betThemDown' component={BetThemDown}/>
            <Route path='/wackACard' component={WackACard}/>
            <Route path='/cookcoo' component={Cookcoo}/>

        </Switch>
    </BrowserRouter>
)

export default FlashCardAppRouter