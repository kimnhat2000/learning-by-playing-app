import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Card, BigCard} from './card';
import {editCard} from '../actions/flashCardActions';
import {randomColor} from '../tools/tools';
import {selectOtherApproach, storeSelectedCards} from '../actions/selectCardsActions';
import '../style/selectCards.css';

class SelectCards extends React.Component{
    constructor(props){
        super(props);
        const cards=this.props.cards;
        this.state={
            cards,
            selectCards:[],
            showcards:[],  
        }
    }

    // componentDidUpdate(prevProps, prevState){
    //     if (prevProps.selectCards !== this.props.selectCards) {
    //         const json =JSON.stringify(this.props.selectCards);
    //         localStorage.setItem('selectCards', json);
    //     }
    // }

    // componentDidMount(){
    //     try{
    //         const json=localStorage.getItem('selectCards');
    //         const selectCards= JSON.parse(json);
    //         if(selectCards){
    //             this.props.dispatch(storeSelectedCards(selectCards))
    //         }
    //     }catch(error){
    //         //do nothing
    //     }
    // }

    onCardClick=(card)=>{
        const cards=this.state.cards.filter(c=>c.id!==card.id)
        const selectCards=[...this.state.selectCards,card]
        this.setState({cards, selectCards})
        this.props.dispatch(selectOtherApproach(selectCards))
    }

    onSelectedCardClick=(card)=>{
        const cards=[...this.state.cards, card]
        const selectCards=this.state.selectCards.filter(c=>c.id!==card.id)
        this.setState({selectCards, cards})
        this.props.dispatch(selectOtherApproach(selectCards))
        console.log(this.state.cards)
    }

    test=()=>{
        console.log(this.props.cards, this.props.selectCards)
        // localStorage.clear('selectCards');
    }
        

    render(){

        const allCards=this.state.cards.map((c,i)=>(
            <Card
                key={i}
                card={c}
                cardClick={this.onCardClick}
            />
        ))

        const selectedCards=this.state.selectCards && this.state.selectCards.map((c,i)=>(
            <Card
                key={i}
                card={c}
                cardClick={this.onSelectedCardClick}
            />
        ))

        const grammarCheck=this.state.selectCards.length===1?'card':'cards';
        const grammarCheckReverse=this.state.cards.length===1?'card':'cards';

        const buttonGrammar=4-this.state.selectCards.length === 1? 'card': 'cards';
    
        const buttonsShow = this.state.selectCards.length < 1  ? 
            <h3>you need to select {4-this.state.selectCards.length} {buttonGrammar} to play games</h3> : 
            <div>
                <h3>what games do you want to play?</h3>
    
                <div className='buttons'>
                    <Link to='/luckCheck'><button>luck check</button></Link>
                    <Link to='/matchCards'><button>match cards</button></Link>
                    <Link to='/typeThemOut'><button>type them out</button></Link>
                    <Link to='/pairThemUp'><button>pair them up</button></Link>
                    <Link to='/multibleChoices'><button>mutible choices</button></Link>
                    <Link to='/betThemDown'><button>bet them down</button></Link>
                    <Link to='/wackACard'><button>wack a card</button></Link>
                    <Link to='/catchMe'><button>catch me</button></Link>
                    <Link to='/cookcoo'><button>cookcoo</button></Link>
                </div>
    
            </div> 
        return(
            <div>
            <Link to='/'>return to flashCard</Link>
            <button onClick={this.test}>test</button>
            <div className='cards'>{allCards}</div>

            {grammarCheck &&
                <h3>you have selected {this.state.selectCards.length} {grammarCheck}</h3>
            }

            <div className='cards'>{selectedCards}</div>

            <div>{buttonsShow}</div>
              
            </div> 
        )
    }
}

// const SelectCards =({cards, selectCards, dispatch})=>{

//     const onCardClick=(card)=>{
//         dispatch(editCard({...card,selected:true, showCard:false}))
//         dispatch(multibleSelection(card))
//     }

//     const onSelectedCardClick=(card)=>{
//         const unselectCard={...card, selected:true, showCard:true}
//         dispatch(multibleSelection(unselectCard))
//         dispatch(editCard({...card, showCard:true}))
//     }

//     const test=()=>{
//         console.log(selectCards.length)
//         // localStorage.clear('selectCards');
//     }

//     const r1=randomColor();
//     const r2=randomColor();
//     const r3=randomColor();
//     const style={backgroundColor:`rgb(${r1}, ${r2}, ${r3})`}
        
//     const allCards=cards.map((c,i)=>(
//         <Card
//             key={i}
//             style={style}
//             card={c}
//             cardClick={onCardClick}
//         />
//     ))

//     const selectedCards=selectCards && selectCards.map((c,i)=>(
//         <Card
//             key={i}
//             style={style}
//             card={c}
//             cardClick={onSelectedCardClick}
//         />
//     ))

//     const grammarCheck=selectCards.length===1?'card':'cards'

//     const buttonGrammar=4-selectCards.length === 1? 'card': 'cards'

//     const buttonsShow = selectCards.length < 4? 
//         <h3>you need to select {4-selectCards.length} {buttonGrammar} to play games</h3> : 
//         <div>
//             <h3>what games do you want to play?</h3>

//             <div className='buttons'>
//                 <Link to='/luckCheck'><button>luck check</button></Link>
//                 <Link to='/matchCards'><button>match cards</button></Link>
//                 <Link to='/typeThemOut'><button>type them out</button></Link>
//                 <Link to='/pairThemUp'><button>pair them up</button></Link>
//                 <Link to='/multibleChoices'><button>mutible choices</button></Link>
//                 <Link to='/betThemDown'><button>bet them down</button></Link>
//                 <Link to='/wackACard'><button>wack a card</button></Link>
//                 <Link to='/catchMe'><button>catch me</button></Link>
//                 <Link to='/cookcoo'><button>cookcoo</button></Link>
//             </div>

//         </div> 

//     return (
//         <div>
//             <Link to='/'>return to flashCard</Link>
//             <button onClick={test}>test</button>
//             <div className='cards'>{allCards}</div>

//             {grammarCheck &&
//                 <h3>you have selected {selectCards.length} {grammarCheck}</h3>
//             }

//             <div className='cards'>{selectedCards}</div>

//             {cards.length < 4? 
//                 <h3>you need at least 4 cards to play games</h3>:
//                 <div>{buttonsShow}</div>
//             }  
//         </div> 
//     )
// }
    
const mapStateToProps=(state)=>({
    cards:state.flashCardReducer.cards,
    selectCards:state.selectCardsReducer.cards
})

export default connect(mapStateToProps)(SelectCards)