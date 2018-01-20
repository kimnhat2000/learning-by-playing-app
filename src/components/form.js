import React from 'react';
import {randomPics} from '../tools/tools';
import '../style/form.css';

class FlashCardForm extends React.Component{
    constructor(props){
        super(props);
        const {editCardInfo}=this.props
        this.state={
            name:editCardInfo?editCardInfo.name:'',
            description:editCardInfo?editCardInfo.description:'',
            variants:editCardInfo?editCardInfo.variants:[],
            img:editCardInfo?editCardInfo.img:'',
            imgInput:true,
            text:'',
            saveButton:'Save'
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.editCardInfo){
            const {name, description, variants, img}=nextProps.editCardInfo
            this.setState({
                name:name?name:'', 
                description:description?description:'', 
                variants:variants?variants:[], 
                img:img?img:''
            })
        }
    }

    onChange=(e)=>{
        this.setState({[e.target.name]:e.target.value})
    }

    addVariant=()=>{
        this.setState({variants:[...this.state.variants,'']})
    }

    removeVariant=(index)=>{
        const variants=this.state.variants.filter((v,i)=>i !== index)
        this.setState({variants})
    }

    variantInput=(e)=>{
        const index=Number(e.target.id)
        const variants=this.state.variants.map((v,i)=>i===index ? e.target.value:v)
        this.setState({variants})
    }

    onSubmit=(e)=>{
        const img=randomPics(71, 'pictures/randomPics/', 'jpg')
        const imgInput=false
        e.preventDefault()
        if(!this.state.name){
            this.setState({text:'please enter card name'})
        }else if (!this.state.description){
            this.setState({text:'please enter card description'})
        }else if (!this.state.img){
            this.setState({img, imgInput, text:'a random img was set for your card', saveButton:'OK'})
        }
        else{
            this.props.editCardInfo ?
            this.props.saveEditCard(this.state):
            this.props.saveCard(this.state)  
        }
        return;
    }

    render(){
        const addVariant=this.state.variants.map((v,i)=>(
            <div
                className='variants'
                key={i}
            >{i+1}. 
                <input
                    id={i}
                    type='text'
                    value={v}
                    onChange={this.variantInput}
                    autoCorrect='off'
                />
                <button 
                    type='button'
                    onClick={()=>this.removeVariant(i)}
                >-</button> 
            </div>  
        ))
        return(
            <div className='form-container'>
            
            <form
                className='form-border'
                onSubmit={this.onSubmit}
                
            >
                
                <button
                    type='button'
                    onClick={this.props.onCloseForm}
                >X</button>
                
                <input
                    type='text'
                    name='name'
                    placeholder='enter card name'
                    value={this.state.name}
                    onChange={this.onChange}
                    autoComplete='off'
                />
                
                <label>description</label>
                <textarea
                    name='description'
                    rows='8'
                    cols='40'
                    autoComplete='off'
                    value={this.state.description}
                    onChange={this.onChange}
                />
                

                <div>
                    <label>add variant</label>
                    <button
                        type='button'
                        onClick={this.addVariant}
                    >+</button>
                    <div className='variants'>{addVariant}</div>
                </div>

                <div>
                    <label>image</label>
                    <h3>{this.state.text}</h3>
                    {this.state.imgInput&&
                    <input
                        name='img'
                        type='text'
                        placeholder='enter a img url'
                        value={this.state.img}
                        onChange={this.onChange}
                    />}
                </div>
                {this.state.error}
                <button>{this.state.saveButton}</button>
            </form>
                
            </div>
        )
    }    
}

export default FlashCardForm