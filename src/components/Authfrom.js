import { authService, firebaseInstance } from 'fBase';
import React, { useState } from 'react';

const inputStyles = {};


const Authform = () => {
    const [email, setEmail] = useState(""); //aware of the email and password whenever the user types
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState('');

    const onChange = event => {
        const { target: { name, value } } = event;
        if (name === "email") {
            setEmail(value);
        }else if (name === "password") {
            setPassword(value);
        }
      
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if (newAccount) {
                data = await authService.createUserWithEmailAndPassword(email, password);//createAccount and also get logged-in
            } else {
                data = await authService.signInWithEmailAndPassword(email, password);//log in
            }
            console.log(data);
        } catch (error) {
            setError(error.message);
        }
    }
    
    const toggleAccount = () => setNewAccount((prev) => !prev);
    return(<>
       <form onSubmit={onSubmit} className="container">
        <input name="email" type="email" placeholder="Email" value={email} onChange={onChange} className="authInput" />
        <input name="password" type="password" placeholder="Password" value={password}  onChange={onChange}    className="authInput"/>
        <input type="submit" value={newAccount ? "Create Account" : "Log In"}  className="authInput authSubmit" />
        {error && <span className="authError">{error}</span>}
    </form>
    <span onClick={toggleAccount} className="authSwitch">{newAccount ? "Create Account" : "Sign In" }</span>
    </>)
}
export default Authform;