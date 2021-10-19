import React from 'react';

//create a form element
//giving it access to props from todoApp.js
const Form = ({inputText, setInputText, token}) => {


    const handleChange = (e) => {
        
        setInputText(e.target.value);
    }

    const handleClick = (e) => {

        e.preventDefault();

        let parNode = e.target.parentNode;
        
        //if input is blank raise an alert and return false,
        //so that no list elements is created
        // eslint-disable-next-line
        if (parNode.firstChild.value.length != 0) {

            let newtask = {
                task: inputText,
                isCompleted: false,
            }

            fetch('/api/resource/add', {
                method: 'POST',
                body: JSON.stringify(newtask),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then((result) => {
                alert(result.message)

                parNode.firstChild.value = ''
            })
            .then(
                alert('Click on view task button to refresh Todo List.')
            );
        } else {

            alert("Please enter task");

            return false;
        }   
    }

    return (
        <div>
            <input type='text' onChange={handleChange} className="todo-input" />
            <br></br>
            <button onClick={handleClick} type="submit" className="todo-button">Add Todo</button>
        </div>
    )
}

export default Form;