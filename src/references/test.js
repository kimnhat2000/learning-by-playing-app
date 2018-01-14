import React from 'react';
import {Link} from 'react-router-dom';
import './test.css'

const test=(e)=>{
    console.log(Number (e.target.value))
    console.log(typeof e.target.value)

}

const style={
    backgroundSize: '200px 250px',
    height:'250px',
    width:'200px',
    backgroundColor:'grey'
}

const Test =()=>(
    <div>
        <div className='test' style={style}/>
        <div>
            <select name="cars" onChange={test}>
                <option value="1">Volvo</option>
                <option value="2">Saab</option>
                <option value="3">Fiat</option>
                <option value="4">Audi</option>
            </select>
            <Link to='/'>retrun to main page</Link>
        </div>
    </div> 
)

export default (Test)