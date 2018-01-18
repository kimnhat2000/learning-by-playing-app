import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {randomPics, reziseAndStyleBigCard} from '../tools/tools'
import {addStack, removeStack, editStack, deleteAllStack, selectedStackId} from '../actions/cardStackActions';
import {filterStack} from '../actions/flashCardActions';
import '../style/cardStack.css'

class CardStack extends React.Component{
    constructor(props){
        super(props);
        this.state={
            stack:{},
            stackName:'',
            editNameInput:'',
            addStackInput:false,
            stackImg:'',
            editNameInputShow:false,
            warning:false,
            text:'',
            error:'',
            saveStack:false
        }
    }

    stackNameInput=(e)=>{
        this.setState({[e.target.name]:e.target.value})
    }

    saveAStack=()=>{
        if(!this.state.stackName){
            this.setState({error:'you must enter stack name'})
            return;
        }else if(!this.state.stackImg){
            this.setState({error:'you will get a random image after save', warning:true, saveStack:true, addStackInput:false})
            return;
        }else{
            const stack={name:this.state.stackName, img:this.state.stackImg}
            this.setState({stackName:'', stackImg:'', saveStack:false, warning:false, error:'', addStackInput:false})
            this.props.dispatch(addStack(stack))
        }
    }

    handleStackClick=(stack)=>{
        const newStack={...stack, showButtons:!stack.showButtons}
        this.props.dispatch(editStack(newStack))
        this.setState({editNameInputShow:false, error:'', addStackInput:false})
    }

    handleWarning=(s)=>{
        const stack=s
        this.setState({warning:true, text:`are you sure you want to delete ${stack.name} stack?`, stack})
    }

    handleEdit=(s)=>{
        let editNameInputShow=true;
        const editNameInput=s.name;
        this.setState({editNameInput, editNameInputShow})
    }

    onEditSave=(s)=>{
        const newStack={...s, name:this.state.editNameInput, showButtons:false}
        this.props.dispatch(editStack(newStack))
        this.setState({editNameInputShow:false})
    }

    openStack=(s)=>{
        const closeButtons={...s, showButtons:false}
        this.props.dispatch(editStack(closeButtons))
        this.props.dispatch(filterStack(s.stackId))
        this.props.dispatch(selectedStackId(s))
        // console.log(this.props.sta)
    }

    confirm=(pass)=>{

        if(pass){
            if(this.state.saveStack){
                const saveStack={name:this.state.stackName, img:randomPics(71, 'pictures/randomPics/', 'jpg')}
                this.setState({stackName:'', saveStack:false, warning:false, error:''})
                this.props.dispatch(addStack(saveStack))
            }
            const stack=this.state.stack
            this.props.dispatch(removeStack(stack))
            return
        }else {
            this.setState({warning:false})
            return
        }
    }

    test=()=>{
        const{stacks, tokens, cards, stackCards, selectedStackId}= this.props
        console.log('stacks: ',stacks)
        console.log('tokens: ',tokens)
        console.log('cards: ',cards)
        console.log('stackCards: ',stackCards)
        console.log('selectedStackId: ',selectedStackId)
    }

    render(){

        const style=(style)=>{
            const s={
                width:'150px',
                height:'250px',
                backgroundColor:'gray',
                margin:'10px',
                backgroundImage: `url(${style.img})`,
                backgroundSize: '150px 250px'
            }
            return s
        }

        const stacks=this.props.stacks && this.props.stacks.map((s,i)=>(
            <div key={i}>
                <div>
                    <div
                        style={style(s)}
                        onClick={()=>this.handleStackClick(s)}
                    />

                    <h3>{s.name}</h3>
                </div> 
                    
                {s.showButtons && 
                <div>
                    <div>
                        <button onClick={()=>this.handleWarning(s)}>delete</button>
                        <button onClick={()=>this.handleEdit(s)}>edit</button>
                        <Link to='/flashCard' onClick={()=>this.openStack(s)}><button>open</button></Link>
                    </div>  
                    {this.state.editNameInputShow &&
                    <div>
                        <input
                            name='editNameInput'
                            value={this.state.editNameInput}
                            onChange={this.stackNameInput}
                        />
                        <button onClick={()=>this.onEditSave(s)}>save</button>
                    </div>   
                    }
                </div>               
                }
            </div>   
        ))

        return(
            <div>

                <div className='header'>
                    <button onClick={this.test}>test</button>
                    <button onClick={this.onDeleteEveryThing}>delete all stack</button>
                    <button onClick={()=>this.setState({addStackInput:true})}>add stack</button>
                </div>

                <h3>{this.state.error}</h3>

                {this.state.warning &&
                    <div>
                        <h3>{this.state.text}</h3>
                        <button onClick={()=>this.confirm(true)}>yes</button>
                        <button onClick={()=>this.confirm(false)}>no</button>
                    </div>
                }

                {this.state.addStackInput &&
                <div>
                    <input
                        placeholder='new stack name'
                        name='stackName'
                        value={this.state.stackName}
                        onChange={this.stackNameInput}
                        autoFocus
                    />
                    <input
                        placeholder='new stack image'
                        name='stackImg'
                        value={this.state.stackImg}
                        onChange={this.stackNameInput}
                    />
                    <button onClick={this.saveAStack}>save</button>
                </div>
                }

                <div className='stack'>{stacks}</div>
                
                
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    selectedStackId:state.cardStackReducer.selectedStackId,
    stacks: state.cardStackReducer.stacks,
    tokens: state.tokenReducer.totalTokens,
    cards:state.flashCardReducer.cards,
    stackCards:state.flashCardReducer.stackCards
})

export default connect(mapStateToProps)(CardStack)
