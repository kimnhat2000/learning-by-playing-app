
//shuffle
export const shuffle=(a)=> {
    let newArr = [].concat(a);
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

//randomNum
export const randomNum=(num)=>{
    const r=Math.floor(Math.random()*num)
    return r
}