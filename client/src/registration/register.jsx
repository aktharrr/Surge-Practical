import React, { useState } from 'react';
import Axios from 'axios';
import validator from 'validator';
import { useHistory } from "react-router-dom";

import './register.css';

function Register() {
    let history = useHistory();

    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [pass, setPass] = useState('')
    const [cpass, setcPass] = useState('')

    const [errorMessage, setErrorMessage] = useState("");
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPass, setErrorPass] = useState(false);

    Axios.defaults.withCredentials = true;
    const reg = () => {
        if (errorEmail == false && errorPass == false) {
            Axios.post('http://localhost:3001/reg', {
                fullname: fullname,
                email: email,
                username: username,
                password: pass,
                c_password: cpass,
            }).then((response) => {
                console.log(response);
                if (response.data.message) {
                    setErrorMessage(response.data.message);
                } else {
                    //setLoginStatus(response.data[0].username);
                    history.push('/');
                }
            })
        }
    };

    const validateEmail = (email) => {
        setEmail(email);

        if (!validator.isEmail(email)) {
            setErrorMessage('Enter valid Email!');
            setErrorEmail(true);
        } else {
            setErrorMessage("");
            setErrorEmail(false);
        }

        if (errorPass == true) {
            setErrorMessage('Password not strong, Please enter min 8 characters including 1 lowercase, 1 uppercase, 1 number, and 1 symbol');
        }
    }

    const validate = (value) => {
        setPass(value);

        if (!validator.isStrongPassword(value, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            setErrorMessage('Password not strong, Please enter min 8 characters including 1 lowercase, 1 uppercase, 1 number, and 1 symbol');
            setErrorPass(true);
        } else {
            setErrorMessage("");
            setErrorPass(false);
        }

        if (errorEmail == true) {
            setErrorMessage('Enter valid Email!');
        }
    }

    return (

        <div className="maincontainer">

            <div className="subcontainer">
                <div className="inter_lcontainer">
                    <img src="/ml.png" height="580px" width="500px" id="ml1" />
                </div>

                <div className="inter_rcontainer">
                    <div className="logo">
                        <img src="/logo.png" height="100px" />
                    </div>

                    <div id="error_message">
                        {errorMessage}
                    </div>

                    <h4>Fill your details below</h4>

                    <div id="register_form" className="input-fields">
                        <div className="inputf1">
                            <input type="text" name="fname" id="fname" className="input" placeholder="Full Name"
                                required onChange={(e) => { setFullname(e.target.value) }} />
                        </div>

                        <div className="inputf1">
                            <input type="text" name="email" id="email" className="input" placeholder="Email"
                                required onChange={(e) => { validateEmail(e.target.value) }} />
                        </div>

                        <div className="inputf1">
                            <input type="text" name="username" id="username" className="input" placeholder="Username"
                                required onChange={(e) => { setUsername(e.target.value) }} />
                        </div>

                        <div className="inputf1">
                            <input type="password" name="pwd" id="pwd" className="input" placeholder="Password"
                                required onChange={(e) => { validate(e.target.value) }} />
                        </div>

                        <div className="inputf1">
                            <input type="password" name="cnfrm_pwd" id="cnfrm_pwd" className="input" placeholder="Confirm Password"
                                required onChange={(e) => { setcPass(e.target.value) }} />
                        </div>
                    </div>

                    <div>
                        <input type="submit" value="Sign up" id="Signup" onClick={reg} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;