import React from 'react';
import {teasing, gotHit, miss} from '../../tools/cookcooproms';
import {BigCard} from '../card';
import {randomNum} from '../../tools/tools';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

class Cookcoo extends React.Component{
    constructor(props){
        super(props);
        this.state={
            card:{},
            cardCatched:[],
            score:5,
            show:false,
            text:'',
            playButton:'play',
            test:null,
            showCard:false
        }
    }

    randomCard=()=>{
        const {appear}=this.state
        const {selectedCards} =this.props
        const card=selectedCards[randomNum(selectedCards.length)]
        this.setState({card})
    }

    onPlay=()=>{
        this.setState({card:{}, cardCatched:[], score:5, show: false, text:'', showCard:true, playButton:'restart'})
        clearTimeout(this.state.test)
        let that=this;
        (function loop() {
            that.randomCard();
            
            const scoreTrack=that.state.score;
            if (scoreTrack===0||scoreTrack===10){
                return;
            }
            let randomTime = Math.round(Math.random() * randomNum(4)+1) * 1000;
            that.state.test=setTimeout(()=> {
                that.setState({show:true});
                setTimeout(()=>{that.setState({show:false, text:teasing[randomNum(teasing.length)]})},800)
                loop();
                console.log(scoreTrack)
            }, randomTime);
        })();
    }

    onCardClick=()=>{
        const {show, cardCatched, card, score}=this.state;
        let scoreTrack = score;

        if(scoreTrack===10){
            this.setState({text:'Congrat, you win the game'})
            return;

        }else if(scoreTrack===0){
            this.setState({text:'sorry, you lose the game'})
            return;
        }

        if (show){
            this.setState({score:this.state.score+1, text:gotHit[randomNum(gotHit.length)], cardCatched:[...cardCatched, card]})
            setTimeout(()=>{this.setState({text:''})},700)
            return;
        } else{
            this.setState({score:this.state.score-1, text:miss[randomNum(gotHit.length)]})
            setTimeout(()=>{this.setState({text:''})},700)
            return;
        }
    }

    catchedCardClick=(card)=>{
        const cards = this.state.cardCatched
        const cardCatched = cards.map(c=>c.id===card.id?c={...c,showInfo:!card.showInfo}:c)
        this.setState({cardCatched})
    }

    test=()=>{ 
        const {cardCatched}=this.state
        console.log(cardCatched)
    }
    render(){
        const {cardCatched} = this.state
        const cards = cardCatched.map((c,i)=>(
            <BigCard
                key={i}
                card={c}
                bigCardClick={()=>this.catchedCardClick(c)}
                showButtons={false}
            />
        ))
        return(
            <div>
                <div>
                    <button onClick={this.onPlay }>{this.state.playButton}</button>
                    <button onClick={this.test}>test</button>
                    <Link to= '/selectCard'>return to select card page </Link>
                    <p>{this.state.appear}</p>
                    <p>{this.state.appear1}</p>
                </div>

                <div>score: {this.state.score}</div>
            
            {this.state.showCard &&
                <div className='next-card'>
                    {this.state.show?
                    <BigCard
                        bigCardClick={this.onCardClick}
                        card={this.state.card}
                        showButtons={false}
                    />:
                    <div 
                        className='empty-card'
                        onClick={this.onCardClick}
                    >
                        ready
                    </div>}
                    <div>
                        <label>It is me that appears</label>
                        <BigCard
                            bigCardClick={false}
                            card={this.state.card}
                            showButtons={false}
                        />
                    </div>
                </div>
            }
            
            <div><h3>{this.state.text}</h3></div>
            
            {this.state.cardCatched &&
                <div>
                    <label>cards you catched</label>
                    <div>
                        <div className='cards-catched'  >{cards}</div>
                    </div>
                </div>   
            }
            
            </div>
        )
    }
}
    
const mapStateToProps =(state)=>({
    selectedCards:state.selectCardsReducer.cards
})

export default connect(mapStateToProps)(Cookcoo)