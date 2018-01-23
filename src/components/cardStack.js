import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {randomPics, reziseAndStyleBigCard} from '../tools/tools'
import {addStack, addStacks, removeStack, editStack, deleteAllStack, selectedStack, stackSearch} from '../actions/cardStackActions';
import {filterStack, deleteAllCards, addCards, addCard, deleteAllCardsInCurrentStack, setNewCardId} from '../actions/flashCardActions';
import {changeTokenNum}from '../actions/tokenActions';
import styled, {injectGlobal} from 'styled-components';
import '../style/cardStack.css';


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
            cancelButton:false,
            showDiv:false,
            showInstruction:false,
            stackNumber:false,
            deleteButtonInstruction:false,
            addButtonIntruction:false,
            gamePlayInstruction:false
        }
    }

    componentDidUpdate(prevProps, prevState){
        //this if is to check if I decide to delete a stack there maybe may cards in that stack
        if (prevProps.cards.length !== this.props.cards.length){
        const allCards=JSON.stringify(this.props.cards)
        const json= localStorage.setItem('allCards', allCards);
        }
        if (prevProps.stacks !== this.props.stacks) {
            const stacks =JSON.stringify(this.props.stacks);
            const stackId=JSON.stringify(this.props.stackNextId);
            localStorage.setItem('stacks', stacks);
            localStorage.setItem('stackId', stackId);
        }
    }

    componentDidMount(){
        try{
            const json=localStorage.getItem('stacks');
            const json2=localStorage.getItem('stackId');
            const json3=localStorage.getItem('allCards');
            const json4=localStorage.getItem('newCardId');
            const json5=localStorage.getItem('tokens');
            let stacks= JSON.parse(json);
            const stackId= JSON.parse(json2);
            const allCards=JSON.parse(json3);
            const newId=JSON.parse(json4);
            const tokens=JSON.parse(json5);
            if(stacks){
                stacks = stacks.map(s => s = { ...s, showButtons: false })
                this.props.dispatch(addStacks(stacks, stackId))
            }
            if(allCards){
                this.props.dispatch(addCards(allCards, newId))
            }
            if(tokens){
                this.props.dispatch(changeTokenNum(tokens))
            }

        }catch(error){
            // do nothing
        }
    }

    componentWillUnmount(){
        const selectedStack=JSON.stringify(this.props.selectedStack)
        const json= localStorage.setItem('selectedStack', selectedStack);
        const json1 =localStorage.getItem('newCardId')
        const allStacks=localStorage.getItem('stacks')
        let stacks = JSON.parse(allStacks)
        stacks=stacks.map(s=>s={...s,showButtons:false})
        const stackJson=JSON.stringify(stacks)
        localStorage.setItem('stacks', stackJson)
        const newCardId=JSON.parse(json1)
        this.props.dispatch(setNewCardId(newCardId))
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
        const name=this.state.stackName
        const names=this.props.stacks.map(s=>s.name)

        if(!this.state.stackName){
            this.setState({error:'you must enter stack name'})
            return;
        }else if(names.includes(name)){
            this.setState({error:'this stack name is already existed, please select another name', cancelButton:true})
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

    cancelSaving=()=>{
        this.setState({cancelButton:false, warning:false, error:'', addStackInput:false})
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
        const checkMatch=this.props.stacks.map(s=>s.name)
        if(checkMatch.includes(newStack.name)){
            this.setState({error:'this stack already existed'})
            return;
        }else{
            this.props.dispatch(editStack(newStack))
            this.setState({editNameInputShow:false, error:''})
            return;
        }       
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
                this.props.dispatch(selectedStack())
                this.setState({deleteAllConfirm:false, text:'', warning:false})
                localStorage.clear();
                return
            }

            const stack=this.state.stack
            this.props.dispatch(deleteAllCardsInCurrentStack(stack.stackId))  
            this.props.dispatch(removeStack(stack))       
            this.props.dispatch(stackSearch())
            this.props.dispatch(selectedStack())
            this.setState({warning:false})
            return
        }else {
            this.setState({warning:false, text:'', error:''})
            return
        }
    }


    render(){

        const grammarCheck = this.props.stacks.length === 1 ? 'stack' : 'stacks'

        return(
            <div className='cardStackPage'>
                <div className='header'>
                    <div className='stack-info'>
                        <div className='stack-name'>
                            {this.props.selectedStack &&
                                <h2>{this.props.selectedStack.name}</h2>
                            }
                        </div>

                        <div 
                            className ='token-container' 
                            onMouseOver={()=>this.setState({showInstruction:true})}
                            onMouseOut={()=>this.setState({showInstruction:false})}
                        >
                            <div className='token'/>
                            <img className='token-img'src='pictures/myLogo.png'/>
                            <h2>{this.props.tokens}</h2>
                        </div>
                    </div>

                    <div className='game-info'>
                        <img 
                            onMouseOver={()=>this.setState({stackNumber:true})}
                            onMouseOut={()=>this.setState({stackNumber:false})}
                            src='pictures/icons/cards.png'
                        />
                        {this.props.stacks.length !== 0 ? 

                            <h3>{this.props.stacks.length}</h3>:
                            <button
                                onMouseOver={() => this.setState({ gamePlayInstruction: true })}
                                onMouseOut={() => this.setState({ gamePlayInstruction: false })}
                                className='gamePlayInstruction'
                            />
                        }
                    </div>
                    
                    <div className='header-menu'>

                        <button
                            onMouseOver={() => this.setState({ addButtonIntruction: true })}
                            onMouseOut={() => this.setState({ addButtonIntruction: false })}
                            className='add'
                            onClick={() => this.setState({ addStackInput: !this.state.addStackInput, stackName: '', stackImg: '' })}
                        >+</button>

                        <input
                            type='text'
                            placeholder='find stack by name'
                            value={this.state.stackSearch}
                            onChange={this.onStackSearch}
                        />

                        <button
                            onMouseOver={() => this.setState({ deleteButtonInstruction: true })}
                            onMouseOut={() => this.setState({ deleteButtonInstruction: false })}
                            onClick={this.onDeleteEveryThing} className='delete'>ALL
                        </button>

                    </div>
                </div>

                <h3>{this.state.error}</h3>

                {this.state.warning &&
                    <div className='warning-show'>
                        <h3>{this.state.text}</h3>
                        <div className='warning-buttons'>
                            <button className='yes' onClick={()=>this.confirm(true)}>yes</button>
                            <button className='no' onClick={()=>this.confirm(false)}>no</button>
                        </div>        
                    </div>
                }

                {this.state.addStackInput &&
                <div className='stack-input'>
                    <div className='inputs'>
                        <input
                            className='name-input'
                            type='text'
                            placeholder='new stack name'
                            name='stackName'
                            value={this.state.stackName}
                            onChange={this.stackNameInput}
                            autoFocus
                        />
                        <input
                            className='img-input'
                            type='text'
                            placeholder='new stack image url'
                            name='stackImg'
                            value={this.state.stackImg}
                            onChange={this.stackNameInput}
                        />
                    </div>
                    
                    <div className='input-buttons'>
                        <button className='save' onClick={this.saveAStack}>save</button>
                        {this.state.cancelButton &&
                        <button className='cancel' onClick={this.cancelSaving}>cancel</button>
                        }
                    </div>

                </div>
                }
                
                <Stacks
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

                <div className='gamePlayInstruction'>
                    {this.state.gamePlayInstruction &&
                        <div className='instruction'>
                            <h3>please add a card stack to start</h3>
                        </div>
                    }
                </div>

                <div className='addButtonIntruction'>
                    {this.state.addButtonIntruction &&
                        <div className='instruction'>
                            <h3>add a new card stack</h3>
                        </div>
                    }
                </div>

                <div className='deleteButtonInstruction'>
                    {this.state.deleteButtonInstruction &&
                        <div className='instruction'>
                            <h3>delete all of your stacks</h3>
                        </div>
                    }
                </div>

                <div className='stackNumber-instruction'>
                    {this.state.stackNumber &&
                        <div className='instruction'>
                            <h3>your total stacks</h3>
                        </div>
                    }
                </div>

                {this.state.showInstruction &&
                    <div className='instruction'>
                        <h3>tokens you get from winning games, collect 100 tokens and you can buy new games</h3>
                    </div>
                }

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
    stackNextId:state.cardStackReducer.stackId,
    filteredStacks:state.cardStackReducer.filteredStacks
})

export default connect(mapStateToProps)(CardStack)

//stacks render
const Stacks =({stacks, inputShow, inputValue, onInputChange, buttonClick, stackClick, deleteClick, editClick, openClick, shouldShowButtons})=>{

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

    const renderStacks=stacks && stacks.map((s,i)=>(
        <div
            className='stack-render' 
            key={i}>
            <div className='stack-pic-name'>
                <div
                    style={style(s)}
                    onClick={()=>stackClick(s)}
                />

                <h3>{s.name}</h3>
            </div> 

            {s.showButtons && 
            <div className='edit-field'>
                <div className='stack-buttons'>
                    <button className='delete' onClick={()=>deleteClick(s)}>delete</button>
                    <button className='edit' onClick={()=>editClick(s)}>edit</button>
                    <Link to='/flashCard' onClick={()=>openClick(s)}><button className='open'>open</button></Link>
                </div>
                  
                {inputShow &&
                <div className='edit-stack-input'>
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
        <div className='stack'>{renderStacks}</div>
    )
}

const randomBg=randomPics(13, '/pictures/textures/', 'jpg')

injectGlobal`
body{
    margin: 0;
    padding: 0;
    background: rgba(153, 127, 127, 0.7);
    background-image: url(${randomBg});
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    background-attachment: fixed;
} 
`;
