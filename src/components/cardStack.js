import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {randomPics, reziseAndStyleBigCard} from '../tools/tools'
import {addStack, removeStack, editStack, deleteAllStack, selectedStack, stackSearch} from '../actions/cardStackActions';
import {filterStack, deleteAllCards} from '../actions/flashCardActions';
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
            saveStack:false,
            deleteAllConfirm:false,
            stackSearch:'',
        }
    }

    stackNameInput=(e)=>{
        this.setState({[e.target.name]:e.target.value})
    }

    //search a stack by name
    onStackSearch=(e)=>{
        const s=e.target.value
        this.setState({stackSearch:s})
        this.props.dispatch(stackSearch(s))
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
        this.props.dispatch(selectedStack(stack))
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
        this.props.dispatch(selectedStack(s))
        this.props.dispatch(stackSearch())
    }

    onDeleteEveryThing=()=>{
        this.setState({warning:true, text:'are you sure you want to delete EVERYTHING?', deleteAllConfirm:true})
    }

    confirm=(pass)=>{

        if(pass){
            if(this.state.saveStack){
                const saveStack={name:this.state.stackName, img:randomPics(71, 'pictures/randomPics/', 'jpg')}
                this.setState({stackName:'', saveStack:false, warning:false, error:''})
                this.props.dispatch(addStack(saveStack))
                return
            }else if (this.state.deleteAllConfirm){
                this.props.dispatch(deleteAllStack());
                this.props.dispatch(deleteAllCards())
                this.setState({deleteAllConfirm:false, text:'', warning:false})
                return
            }
            const stack=this.state.stack
            this.props.dispatch(removeStack(stack))        
            this.props.dispatch(stackSearch())
            this.setState({warning:false})
            return
        }else {
            this.setState({warning:false, text:''})
            return
        }
    }

    test=()=>{
        const{stacks, tokens, cards, stackCards, selectedStack, filteredStacks}= this.props
        console.log('stacks: ',stacks)
        console.log('tokens: ',tokens)
        console.log('cards: ',cards)
        console.log('stackCards: ',stackCards)
        console.log('selectedStack: ',selectedStack)
        console.log('filteredStacks: ',filteredStacks)
        console.log('check stackSearch: ',this.state.stackSearch?true:false)
    }

    render(){

        const grammarCheck = this.props.stacks.length === 1 ? 'stack' : 'stacks'

        return(
            <div>

                <div className='header'>
                    <div className='stack-info'>
                        {this.props.selectedStack &&
                            <h3>{this.props.selectedStack.name}</h3>
                        }
                    </div>

                    <div className='header-menu'>
                    <button onClick={this.test}>test</button>
                    <input
                        type='text'
                        placeholder='find stack by name'
                        value={this.state.stackSearch}
                        onChange={this.onStackSearch}
                    />
                    <button onClick={this.onDeleteEveryThing}>delete all stack</button>
                    <button onClick={()=>this.setState({addStackInput:true})}>add stack</button>
                    </div>
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
                        type='text'
                        placeholder='new stack name'
                        name='stackName'
                        value={this.state.stackName}
                        onChange={this.stackNameInput}
                        autoFocus
                    />
                    <input
                        type='text'
                        placeholder='new stack image'
                        name='stackImg'
                        value={this.state.stackImg}
                        onChange={this.stackNameInput}
                    />
                    <button onClick={this.saveAStack}>save</button>
                </div>
                }

                {this.props.stacks.length !== 0 ? 
                    <h3>you have {this.props.stacks.length} {grammarCheck}</h3>:
                    <h3>please add a card stack</h3>
                }
                
                <Test
                    stacks={this.props.filteredStacks.length===0?this.props.stacks:this.props.filteredStacks}
                    inputShow={this.state.editNameInputShow}
                    inputValue={this.state.editNameInput}
                    onInputChange={this.stackNameInput}
                    stackClick={(s)=>this.handleStackClick(s)}
                    buttonClick={(s)=>this.onEditSave(s)}
                    deleteClick={(s)=>this.handleWarning(s)}
                    editClick={(s)=>this.handleEdit(s)}
                    openClick={(s)=>this.openStack(s)}
                />    

            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    selectedStack:state.cardStackReducer.selectedStack,
    stacks: state.cardStackReducer.stacks,
    tokens: state.tokenReducer.totalTokens,
    cards:state.flashCardReducer.cards,
    stackCards:state.flashCardReducer.stackCards,
    filteredStacks:state.cardStackReducer.filteredStacks
})

export default connect(mapStateToProps)(CardStack)

//stacks render
const Test =({stacks, inputShow, inputValue, onInputChange, buttonClick, stackClick, deleteClick, editClick, openClick, shouldShowButtons})=>{

    const style=(stack)=>{
        const s={
            width:'150px',
            height:'250px',
            backgroundColor:'gray',
            margin:'10px',
            backgroundImage: `url(${stack.img})`,
            backgroundSize: '150px 250px'
        }
        return s
    }

    const teststacks=stacks && stacks.map((s,i)=>(
        <div key={i}>
            <div>
                <div
                    style={style(s)}
                    onClick={()=>stackClick(s)}
                />

                <h3>{s.name}</h3>
            </div> 

            {s.showButtons && 
            <div>
                <div>
                    <button onClick={()=>deleteClick(s)}>delete</button>
                    <button onClick={()=>editClick(s)}>edit</button>
                    <Link to='/flashCard' onClick={()=>openClick(s)}><button>open</button></Link>
                </div>  
                {inputShow &&
                <div>
                    <input
                        type='text'
                        name='editNameInput'
                        value={inputValue}
                        onChange={onInputChange}
                    />
                    <button onClick={()=>buttonClick(s)}>save</button>
                </div>   
                }
            </div>               
            }

        </div>   
    ))
    return(
        <div className='stack'>{teststacks}</div>
    )
}