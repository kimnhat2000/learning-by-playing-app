
//shuffle
export const shuffle=(a)=> {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

//randomNum
export const randomNum=(num)=>{
    const r=Math.floor(Math.random()*num)
    return r
}