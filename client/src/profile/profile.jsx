import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import validator from 'validator';
import { useHistory } from "react-router-dom";

import './profile.css';

function Profile() {
    let history = useHistory();

    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    const [loginUsername, setLoginUsername] = useState("");
    const [loginFullName, setLoginFullName] = useState("");
    const [loginEmail, setLoginEmail] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState(false);

    Axios.defaults.withCredentials = true;
    const edit = () => {
        if (error == false) {
            Axios.post('http://localhost:3001/edit', {
                fullname: fullname,
                email: email,
                username: loginUsername,
                password: pass,
            }).then((response) => {
                console.log(response);
                if (response.data.message) {
                    setErrorMessage(response.data.message);
                } else {
                    window.location.reload();
                }
            })
        }
    };

    const logout = () => {
        Axios.post('http://localhost:3001/logout', {

        }).then((response) => {
            history.push('/');
        })
    };

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            console.log(response);
            if (response.data.loggedIn == true) {
                setLoginUsername(response.data.user[0].Username);
                setLoginFullName(response.data.user[0].FullName);
                setLoginEmail(response.data.user[0].Email);

                setFullname(response.data.user[0].FullName);
                setEmail(response.data.user[0].Email);
                //history.push('/profile');
            }
        });
    }, []);

    const validateEmail = (email) => {
        setEmail(email);

        if (!validator.isEmail(email)) {
            setErrorMessage('Enter valid Email!');
            setError(true);
            //console.log(error);
        } else {
            setErrorMessage("");
            setError(false);
        }
    }

    return (

        <div className="maincontainer">

            <div className="subcontainer">
                <div className="inter_lcontainer">
                    <div className="logo">
                        <img src="/profile.png" height="250px" />
                    </div>

                    <h4>Username: {loginUsername}</h4>
                    <h5>Full Name: {loginFullName}</h5>
                    <h5>Email: {loginEmail}</h5>

                    <div>
                        <input type="submit" value="Log Out" id="Logout" onClick={logout} />
                    </div>
                </div>

                <div className="inter_rcontainer">
                    <div className="logo">
                        {/* <img src="/logo.png" height="100px" /> */}
                    </div>

                    <h4>Edit your details below</h4>

                    <div id="error_message">
                        {errorMessage}
                    </div>

                    <div id="register_form" className="input-fields">
                        <div className="inputf1">
                            <label>Name</label>
                            <input type="text" name="fname" id="fname" className="input" defaultValue={loginFullName}
                                required onChange={(e) => { setFullname(e.target.value) }} />
                        </div>

                        <div className="inputf1">
                            <label>Email</label>
                            <input type="text" name="email" id="email" className="input" defaultValue={loginEmail}
                                required onChange={(e) => { validateEmail(e.target.value) }} />
                        </div>

                        <div className="inputf1">
                            <br></br>
                            <h5>Please enter your password to verify</h5>
                        </div>

                        <div className="inputf1">
                            <input type="password" name="pwd" id="pwd" className="input" placeholder="Password"
                                required onChange={(e) => { setPass(e.target.value) }} />
                        </div>
                    </div>

                    <div>
                        <input type="submit" value="Update" id="Signup" onClick={edit} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile