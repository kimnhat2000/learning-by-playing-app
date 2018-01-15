import React from 'react';
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
            error:''
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
        e.preventDefault()
        if(!this.state.name){
            this.setState({error:'please enter card name'})
        }else if (!this.state.description){
            this.setState({error:'please enter card description'})
        }else{
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
                    className='delete-button'
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
                    className='buttons'
                    type='button'
                    onClick={this.props.onCloseForm}
                >X</button>
                
                <label>name</label>
                <input
                    type='text'
                    name='name'
                    placeholder='enter card name'
                    value={this.state.name}
                    onChange={this.onChange}
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
                        className='buttons'
                        type='button'
                        onClick={this.addVariant}
                    >+</button>
                    <div className='variants'>{addVariant}</div>
                </div>

                <div>
                    <label>image</label>
                    <input
                        name='img'
                        type='text'
                        value={this.state.img}
                        onChange={this.onChange}
                    />
                </div>
                {this.state.error}
                <button className='buttons'>save</button>
            </form>
                
            </div>
        )
    }    
}

export default FlashCardForm