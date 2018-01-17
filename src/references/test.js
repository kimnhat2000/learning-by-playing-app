import React from 'react';
import {Link} from 'react-router-dom';
import {randomPics} from '../tools/tools';
// import '../../public/pictures/background01.jpg'

const img1 = 'pictures/backgroundPics/1.jpg'
const img= randomPics(17, 'pictures/backgroundPics/', 'jpg')
const style={
    backgroundColor:'gray',
    width:'300px',
    height:'200px',
    backgroundImage: `url(${img})`
}

// const img=randomPics(55, 'pictures/randomPics/', 'jpg')


const test=()=>{
    console.log(img)
}

const Test =()=>(
    <div>  
        <div style={style}/>
        {/* <img src={img}/> */}
        <button onClick={test}>test</button>
        <Link to ='/'>return to home page</Link>
    </div> 
)

export default (Test)