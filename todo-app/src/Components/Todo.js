import React from 'react'

//create a Todo JSX element while giving it access to the neccessary props from TodoApp.js
const Todo = ({token, todo}) => {

    //create a function to handle the removal of a todo from the list 
    const handleDelete = () => {

        const confirmDlt = window.confirm('Are you sure you want to delete this item?');

        if(confirmDlt) {
            fetch('/api/task/delete', {
                method: 'DELETE',
                body: JSON.stringify(todo),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then((result) => {
                alert(result.message)
            })
            .then(
                alert('Click on view task button to refresh Todo List.')
            );
        }else {
            alert('Request cancelled');
        }
    }

    const handleUpdate = () => {

        const todoNew = {task: todo.task, isCompleted: true};

        fetch('/api/task/update', {
            method: 'PUT',
            body: JSON.stringify(todoNew),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then((result) => {
            alert(result.message)
        })
        .then(
            alert('Click on view task button to refresh Todo List.')
        );
    }

    //here, return the todo list element and the 'remove' button
    //&nbsp is used as a spacer  
    return (
        <li>
            {todo.task} &nbsp; <button className="deleteBtn" onClick={handleDelete}>Remove</button> &nbsp;
            {todo.isCompleted === false ? (<button className="editBtn" onClick={handleUpdate}>Complete now</button> ) : (<button className="completeBtn">Completed</button>)}
        </li>
    )
}

//export the element to be used in other modules
export default Todo;
