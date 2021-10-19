import React, { Component } from 'react';
import TodoApp from './TodoApp';
import '../App.css';

export class LoginPage extends Component {
    constructor(props) {
        super(props)
      
        this.state = {
           loggedIn: false,
           register: false,
           userName: '',
           password: '',
           newUsername: '',
           newPassword: '',
           fName: '',
           lName: '',
           email: '',
           token: '',
        }
        this.userReg = this.userReg.bind(this);
        this.userLogin = this.userLogin.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleLastChange = this.handleLastChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.gotoReg = this.gotoReg.bind(this);
      }

    handleEmailChange = (e) => {
        let newMail = e.target.value;

        this.setState({
            email: newMail
        });
    }
    handleNameChange = (e) => {
        let newName = e.target.value;

        this.setState({
            fName: newName
        });
    }
    handleLastChange = (e) => {
        let newLName = e.target.value;

        this.setState({
            lName: newLName
        });
    }

    handleUserChange = (e) => {
        let userInput = e.target.value;

        this.setState({
            userName: userInput
        });
    }

    newUserChange = (e) => {
        let newUser = e.target.value;

        this.setState({
            newUsername: newUser
        });
    }
    handlePassChange = (e) => {
        let passInput = e.target.value;

        this.setState({
            password: passInput
        });
    }

    newPassChange = (e) => {
        let newPass = e.target.value;

        this.setState({
            newPassword: newPass
        });
    }
    userLogin = (e) => {

        e.preventDefault()
        
        let userCred = {username: this.state.userName, password: this.state.password}
          
        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userCred)
        })
        .then(res => res.json())
        .then((result) => {
          this.setState({
            loggedIn: true,
            token: result.token,
          })

          alert(result.message)
        })
    }

    userReg = (e) => {

        e.preventDefault()
        
        let newUser = {
            username: this.state.newUsername,
            password: this.state.newPassword,
            email: this.state.email,
            first_name: this.state.fName,
            last_name: this.state.lName
        }

        fetch('/api/register', {
            method: 'POST',
            body:JSON.stringify(newUser),
            headers:{
                'Content-Type': 'application/json'
                }
            }
        )
        .then(res => res.json())
        .then((result) => {
            this.setState({
                register: false
            })

            alert(result.message);
        }
        )
        .then(
            window.location.reload()
        );
    }

    gotoReg() {

        this.setState({
            register: true
        });

    }

    returnLogin() {
        this.setState({
            register: false
        });
        
    }

    render() {

        const {userName, newUsername, newPassword, register, password, token, loggedIn, fName, lName, email} = this.state;

        if(!loggedIn && !register){
            return (
                <div>
                    <h2 id="auth-heading">User Login</h2>
                    <br></br>
                    <input type='text' value={userName} onChange={this.handleUserChange} className="todo-input" placeholder="user name"/>
                    <br></br>
                    <input type='text' value={password} onChange={this.handlePassChange} className="todo-input" placeholder="password"/>
                    <br></br>
                    <button onClick={this.userLogin} type='submit' className="todo-button">Login</button>
                    <br></br>
                    <button onClick={this.gotoReg} className="todo-button">Register</button>
                </div>
            )
        }
        else if(!loggedIn && register){
            return (
            <div>
                <h2 id="auth-heading">User Registration</h2>
                <br></br>
                <input type='text' value={newUsername} onChange={this.newUserChange} className="todo-input" placeholder="user name"/>
                <br></br>
                <input type='text' value={newPassword} onChange={this.newPassChange} className="todo-input" placeholder="password"/>
                <br></br>
                <input type='text' value={fName} onChange={this.handleNameChange} className="todo-input" placeholder="first name"/>
                <br></br>
                <input type='text' value={lName} onChange={this.handleLastChange} className="todo-input" placeholder="last name"/>
                <br></br>
                <input type='text' value={email} onChange={this.handleEmailChange} className="todo-input" placeholder="email"/>
                <br></br>
                <button onClick={this.userReg} type='submit' className="todo-button">Register</button>
                <br></br>
                <button onClick={this.returnLogin} className="todo-button">Return to Login</button>
            </div>
            )
        }else{
            return (
                <div>
                    <TodoApp currUser={userName} token={token}/>
                </div>
            )
        }
    }
}

export default LoginPage;
