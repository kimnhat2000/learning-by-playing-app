import {Link} from 'react-router-dom';
// import React from 'react';

// const style={
//     width:'300px',
//     height:'200px',
//     backgroundImage: 'url(pictures/backgroundPics/1.jpg)'
// }

// const Test =()=>(  
//     <div style={style}/>
// )

// export default (Test)
// import '../../public/pictures/randomPics/1.jpg'

import React from 'react';
import './test.css'

// const json=localStorage.getItem('allCards')
// const json1 = localStorage.getItem('selectedCardsToPlay')
// let cards=JSON.parse(json)
// let select=JSON.parse(json1)

// let cards = [1, 3, 2, 3, 4, 5]
// let select = [1, 2, 3]



const check=(cards, select)=>{
    for (let i = 0; i <= select.length-1; i++) {
        cards=cards.filter(c => c.id !== select[i].id)
    }
    return cards
}

const Test =()=>{
    const json = localStorage.getItem('allCards')
    const json1 = localStorage.getItem('selectedCardsToPlay')
    let cards = JSON.parse(json)
    let select = JSON.parse(json1)
    console.log(check(cards, select))
    return(  
        <div>
            <button onClick={()=>check()}>check</button>
            
            <Link to='/'>return</Link>
        </div>
    )}

export default (Test)