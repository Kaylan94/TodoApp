import React, { useState } from 'react';
import Form from './Form';
import ListTodos from './ListTodos';

//create the ultimate element for all other components
const TodoApp = ({currUser, token}) => {

    //with the use of 'useState' set the initial state of the todos object(todos and inputText), and
    //function(setTodos and setInputText) to change its state
    //initial state for todos is an empty array
    const [todos, setTodos] = useState([]);
    //the initial state for inputText is ane empty string 
    const [inputText, setInputText] = useState('');

    const [loading, setLoading] = useState(false);

    //the function's purpose is to fetch the current records for the current user from the database, and
    //set the value of Todos to the results from the response, as well as
    //toggle the loading prop
    const getTodos = () => {

        setLoading(true);
        
        fetch('/api/user/resource', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then((result) => {

            setTodos(result)
            setLoading(false)
        });
    }

    return (

        <div className="todoDiv" id="todiv" onLoad={getTodos}>
            <Form 
                token={token} 
                inputText={inputText} 
                setInputText={setInputText} 
                todos={todos} 
                setTodos={setTodos}
            />
            <br></br>
            <button onClick={getTodos} type="submit" className="todo-button">View Tasks</button>
            <br></br>
            {
                loading === false && todos.length > 0 
                ? (<ListTodos currUser={currUser} token={token} todos={todos} setTodos={setTodos}/>)
                : loading === true && todos.length < 1 ? (<h5>Loading...</h5>)
                : (<p>Gotta do what you gotta do!</p>)
            }
        </div>
    )
}

export default TodoApp;