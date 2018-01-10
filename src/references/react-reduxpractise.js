import {createStore, combineReducers} from 'redux';
import uuid from 'uuid';

//subject action
//ADD_SUBJECT
const addSubject=(
    {
        subjectName='',
        hour=0,
        minute=0,
        createdAt=0
    } = {}
)=>({
    type: 'ADD_SUBJECT',
    subject:{
        id:uuid(),
        subjectName,
        hour,
        minute,
        createdAt
    }
});

//REMOVE_SUBJECT
const removeSubject=({id}={})=>({
    type: 'REMOVE_SUBJECT',
    id
});

//START_SUBJECT
const startSubject=(id, begin) => ({
    type: 'START_SUBJECT',
    id
});


//subjects reducer
const subjectReducerDefaultState=[];

const subjectReducer=(state=subjectReducerDefaultState, action)=> {
    switch(action.type) {
        case 'ADD_SUBJECT':
            return [
                ...state,action.subject
            ];
        case 'REMOVE_SUBJECT':
            return state.filter(({id})=>id !== action.id);
        case 'START_SUBJECT':
            return state.map((subject)=>{
                if (subject.id === action.id) {
                    return {
                        ...subject,
                        ...action.begin
                    };
                } else {
                    return subject;
                };
            });
        default:
            return state;
    }
};

//filter actions
//SET_TEXT_FILTER
const setTextFilter = (text='')=>({
    type: 'SET_TEXT_FILTER',
    text
});

//SORT_BY_TIME
const sortByDate=()=>({
    type: 'SORT_BY_TIME',
});

//SORT_BY_NAME
const sortByName=()=>({
    type: 'SORT_BY_NAME',
})
//filters reducer

const filerReducerDefaultState={
    text:'',
    sortBy:'',

}

const filterReducer = (state=filerReducerDefaultState, action)=>{
    switch (action.type) {
        case 'SET_TEXT_FILTER':
            return {
                ...state,
                text:action.text
            };
        case 'SORT_BY_TIME':
            return {
                ...state,
                sortBy: 'time'
            }
        case 'SORT_BY_NAME':
            return{
                ...state,
                sortBy: 'name'
            }
        default:
            return state;
    }
};

const store = createStore(
    combineReducers({
        subjects: subjectReducer,
        filters: filterReducer
    })
)

//get visible subjects
const getVisibleSubjects=(subjects, {text, sortBy})=>{
    return subjects.filter((subject)=>{
        const textMatch = subject.subjectName.toLowerCase().includes(text.toLowerCase());
        
        return textMatch;
    }).sort((a,b)=>{
        if(sortBy==='time') {
            return a.hour*60+a.minute < b.hour*60+b.minute ? 1:-1;
        }else if (sortBy==='name') {
            return a.subjectName>b.subjectName? 1:-1
        }
        })
}

store.subscribe(()=>{
    const state=store.getState();
    const visibleSubjects=getVisibleSubjects(state.subjects,state.filters)
    console.log(visibleSubjects);
});

const subjectOne = store.dispatch(addSubject({subjectName:'react',hour:2,minute:20}));
const subjectTwo = store.dispatch(addSubject({subjectName:'note',hour:1,minute:10}));
const subjectThree = store.dispatch(addSubject({subjectName:'css',hour:1,minute:30}));
const subjectFour = store.dispatch(addSubject({subjectName:'js',hour:2,minute:30}));
const subjectFive = store.dispatch(addSubject({subjectName:'3djs',hour:3,minute:30}));


store.dispatch(setTextFilter('s'));
store.dispatch(removeSubject({id:subjectOne.subject.id}));

// const demostate = {
//     subjects:[{
//         subjectName:'react',
//         hour:1,
//         minute:20,
//         createAt:0
//     }],
//     filters: {
//         id:uuid(),
//         text:'react',
//         sortBy: 'time'
//     }
// }