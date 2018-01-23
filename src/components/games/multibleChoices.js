import React from 'react';
import {connect} from 'react-redux';
import {shuffle, randomNum, reziseAndStyleBigCard} from '../../tools/tools';
import {BigCard} from '../card';
import {Link} from 'react-router-dom';
import { addToken } from '../../actions/tokenActions';
import '../../style/multibleChoice.css'

class MultibleChoices extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showinfo:false,
            cards:[],
            card:{},
            score:5,
            text:'',
            playButton:'play',
            showIntruction:false,
            returnHome: false,
            gamePlayInstruction: false,
        }
    }

    componentDidMount() {
        if (!this.props.selectedStack) {
            this.setState({ returnHome: true })
            return;
        }
    }

    componentDidMount() {
        if (!this.props.selectedStack) {
            this.setState({ returnHome: true })
            return;
        }
    }

    componentDidUpdate(prevProps, prevStates){
        if(prevProps.tokens !== this.props.tokens){
            const json=JSON.stringify(this.props.tokens)
            localStorage.setItem('tokens', json)
        }
    }

    randomCard=()=>{
        const card=this.props.selectedCards[randomNum(this.props.selectedCards.length)]
        const allCards=shuffle(this.props.selectedCards.filter(c=>c.id !== card.id))
        //this line is to select randomly 3 cards and concat them with the random chosen card
        const newCards=allCards.slice(0,3)
        const addCards=shuffle([...allCards,card])
        const cards=addCards.map(c=>c={...c,showInfo:true, name:'this card name is hidden'})
        this.setState({card, cards, showinfo:true})
    }

    onCardClick=(card)=>{
        const {score}=this.state
        let scoreTract=score

        if(scoreTract===10) {
            this.setState({playButton:'play again', text:'you win'})
            this.props.dispatch(addToken(2))
            return;
        }else if (scoreTract===0){
            this.setState({playButton:'play again', text:'you lose'})
            return;
        }

        card.id===this.state.card.id?
        this.setState({score:scoreTract+1, text:' correct'}):
        this.setState({score:scoreTract-1, text:'wrong'})
        this.randomCard();
    }

    render(){
        const {cards}=this.state
        const style=reziseAndStyleBigCard('250px', '150px', 17, 'pictures/backgroundPics/', 'jpg', '0.8em', '10px')
        const allCards=cards.map((c,i)=>(
            <BigCard
                key={i}
                style={style}
                card={c}
                bigCardClick={()=>this.onCardClick(c)}
            />
        ))
        return(
            <div>
                <div className='header'>
                    <div className='stack-info'>
                        <div className='stack-name'>
                            {this.props.selectedStack &&
                                <h3>{this.props.selectedStack.name}</h3>
                            }
                        </div>

                        <div 
                            className ='token-container' 
                            onMouseOver={()=>this.setState({showIntruction:true})}
                            onMouseOut={()=>this.setState({showIntruction:false})}
                        >
                            <div className='token'/>
                            <img className='token-img'src='pictures/myLogo.png'/>
                            <h2>{this.props.tokens}</h2>
                        </div>
                    </div>

                    {this.state.showinfo &&
                    <div className='game-info'>
                        <img src='pictures/icons/score.png'/>
                        <h3>{this.state.score}</h3>
                    </div>
                    }

                    {this.state.showinfo &&
                    <h3 className='game-end'>{this.state.text}</h3>
                    }

                    <div className='header-menu'>
                        {!this.state.returnHome &&
                            <div>
                            <button
                                onMouseOver={() => this.setState({ gamePlayInstruction: true })}
                                onMouseOut={() => this.setState({ gamePlayInstruction: false })}
                                className='gamePlayInstruction'
                            />
                                <button onClick={this.onPlay} className='play'>{this.state.playButton}</button>
                                <Link to='/selectCard'><button className='return'>return</button></Link>
                            </div>
                        }
                        <Link to='/'><button className='return-home'>return home</button></Link>
                    </div>
                </div>

                {this.state.showinfo &&
                <div className='multible-choice-target'>
                    <BigCard
                        style={style}
                        card={this.state.card}
                        showButtons={false}
                        bigCardClick={false}
                    />
                </div>
                }

                <div className='multible-choice-cards'>
                    {allCards}
                </div>

                {this.state.returnHome &&
                    <div className='return-home-warning'>
                        <Link to='/'><h3>you need to choose a stack to see cards, click here to go to stacks selection page</h3></Link>
                    </div>
                }

                <div className='gamePlayInstruction'>
                    {this.state.gamePlayInstruction &&
                        <div className='instruction'>
                            <h3>click the correct card and win a score</h3>
                        </div>
                    }
                </div>

                {this.state.showIntruction &&
                    <div className='instruction'>
                        <h4>tokens you get from winning games, collect 100 tokens and you can buy new games</h4>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    selectedCards:state.selectCardsReducer.cards,
    tokens:state.tokenReducer.totalTokens,
    selectedStack:state.cardStackReducer.selectedStack
})

export default connect(mapStateToProps)(MultibleChoices)