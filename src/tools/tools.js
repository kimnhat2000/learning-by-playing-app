
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

//random colors
export const randomColor=()=>{
    const c=Math.floor(Math.random()*256);
    return c
}

//random picture from picture folder
export const randomPics=(picsNum, folderPath, fileExtension)=>{
    const totalPics=picsNum
    let array=[]
    const randomNum=Math.floor(Math.random()*totalPics);
    let num;
    for (num=1; num<=totalPics; num++) {
        array=[...array, `${folderPath}${num}.${fileExtension}`]
    }
    const r=array[randomNum];
    return r;
}

//rezise and style big card
export const reziseAndStyleBigCard=(cardWidth, carHeight, picsNum, folderPath, fileExtension, fontSize, margin, overflow)=>{
    const randomPics=(picsNum, folderPath, fileExtension)=>{
        const totalPics=picsNum
        let array=[]
        const randomNum=Math.floor(Math.random()*totalPics);
        let num;
        for (num=1; num<=totalPics; num++) {
            array=[...array, `${folderPath}${num}.${fileExtension}`]
        }
        const r=array[randomNum];
        return r;
    }
    const backgroundImage=`url(${randomPics(picsNum, folderPath, fileExtension)})`
    const width=cardWidth
    const height=carHeight
    const backgroundSize=`${width} ${height}`
    const style={  
        backgroundImage,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize,
        width,
        height,
        fontSize,
        margin,
        overflow
    }   
    return style
}
