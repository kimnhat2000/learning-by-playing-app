import {createStore, combineReducers} from 'redux';
import uuid from 'uuid';


//ADD_SUBJECT //const addSubject=({a=''})=>({new a})
const addSubject=({ 
    subjectName = '',
    hour=0,
    minute=0
}={})=>({
    type: 'ADD_SUBJECT',
    subject: {
        id: uuid(),
        subjectName,
        hour,
        minute
    }
});

//REMOVE_SUBJECT
const removeSubject=({id}={})=>({
    type: 'REMOVE_SUBJECT',
    id
});

//START_SUBJECT
const editSubject=(id, update)=>({
    type: 'START_SUBJECT',
    id,
    update
});

//Subject reducer
const subjectReducerDefaultState=[];

const subjectReducer=(state=subjectReducerDefaultState, action)=>{
    switch (action.type) {
        case 'ADD_SUBJECT':
            return[...state,action.subject]
        
        case 'REMOVE_SUBJECT':
            return state.filter((expense)=>action.id !== expense.id);

        case 'START_SUBJECT':
            return state.map((subject)=>{
                if(subject.id===action.id){
                    return{
                        ...subject,
                        ...action.update
                    };
                }else {
                    return subject;
                };
            });
        default:
        return state;
    }
};

//SET_TEXT_FILTER
const setTextFilter=(textUpdate='')=>({
    type: 'SET_TEXT_FILTER',
    textUpdate
});

const filtersReducerDefaultState={
    text:'' 
};

//filter reducer
const filterReducer=(state=filtersReducerDefaultState, action)=>{
    switch (action.type) {
        case 'SET_TEXT_FILTER':
            return {
                ...state,
                text:action.textUpdate
            };
        default:
            return state; 
    }
}

//create store
const store=createStore(
    combineReducers({
        subjects: subjectReducer,
        filters: filterReducer
    })
);

//selector
const getVisibleSubject = (subjects, {text})=>{
    return subjects.filter((subject)=>{
        const textMatch=subject.subjectName.toLowerCase().includes(text.toLowerCase());
        return textMatch;
    }).sort((a,b)=>{
        return (a.hour+a.minute*60) < (b.hour+b.minute*60) ? 1:-1
    
    });
};

store.subscribe(()=>{
    const state=store.getState()
    const VisibleSubject=getVisibleSubject(state.subjects, state.filters);
    console.log(VisibleSubject);
})

const subjectOne=store.dispatch(addSubject({subjectName: 'learn react', hour: 3, minute: 30}));
const subjectTwo=store.dispatch(addSubject({subjectName: 'learn redux', hour: 1, minute: 30}));
const subjectThree=store.dispatch(addSubject({subjectName:'learn css', hour: 2, minute: 30}));
const subjectfour=store.dispatch(addSubject({subjectName: 'learn Notejs', hour: 2, minute: 30}));

store.dispatch(removeSubject({id:subjectTwo.subject.id}));
store.dispatch(addSubject({subjectName: 'learn redux', hour: 1, minute: 30}));

store.dispatch(setTextFilter('react'));
store.dispatch(setTextFilter());

const demostate = {
    subjects: [{
        subjectName:'react',
        hour:1,
        minute:20,
    }],
    filters: {
        id:uuid(),
        text:'react',
    }
};