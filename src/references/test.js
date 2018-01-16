import React from 'react';
import {Link} from 'react-router-dom';
import './test.css'

const array=new Array(39).fill('')

const cardNum=()=>{
    let num;
    let arrayCard=[];
    for (num=1; num<=39; num++){
        arrayCard=[...arrayCard, `pictures/randomPics/randomPic${num}.jpg` ]
    }
    return arrayCard;
}

const arrayCard=cardNum()

const randomPic=()=>{
    const i=Math.floor(Math.random()*arrayCard.length);
    const r=arrayCard[i]
    return r;
}

const t=()=>{
    console.log(randomPic())
}
const Test =()=>(
    <div>
        <div className='test'/>
        <div>
            <img/>
            <button onClick={t}>test</button>
            <Link to='/'>retrun to main page</Link>
        </div>
    </div> 
)

export default (Test)