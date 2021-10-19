import React from 'react';
import Todo from './Todo';

//create a list JSX element for the todos and
//give it access to the todos and the capability to alter its state
//using the map method we create 'Todo' element for each item in the array
//this, in turn, creates the todo list elements and the 'remove' button
const ListTodos = ({token, todos, setTodos}) => {

    return (
        <fieldset id="todoField">
            <legend id="myLegend"><b>My Todos</b></legend>
            <ul className="todo-list">
                
                {todos.map((todo, idx) => (
                    //here, defining the required attributes which are the coresponding props of Todos.js
                    <Todo id={idx} token={token} todo={todo} todos={todos} setTodos={setTodos}/>       
                    ))
                }
            </ul>
        </fieldset>
    )
}

export default ListTodos;
