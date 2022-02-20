import React, { useEffect, useState } from "react";
import Axios from 'axios';
import { useHistory } from "react-router-dom";
import auth from "../auth/auth";

import './login.css';


function Login() {
    let history = useHistory();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [errorMessage, setErrorMessage] = useState("");

    Axios.defaults.withCredentials = true;

    const login = props => {
        Axios.post('http://localhost:3001/login', {
            username: username,
            password: password,
        }).then((response) => {
            //console.log(response.data.length);
            if (response.data.message) {
                setErrorMessage(response.data.message);
            } else {
                //setLoginStatus(response.data[0].username);
                auth.login(() => {
                    history.push('/profile');
                });
                
            }
        })
    };

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            //console.log(response);
            if (response.data.loggedIn == true) {
                //setLoginStatus(response.data.user[0].username);
                history.push('/profile');
            }
        });
    }, []);

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

                    <div id="login_form" className="input-fields" style={{ height: "85px" }}>

                        <div className="inputf1">
                            <i className="fa fa-user"></i>
                            <input type="text" name="username" id="uname" className="uname" placeholder="Username" required onChange={(e) => { setUsername(e.target.value) }} />
                        </div>

                        <div className="inputf1">
                            <i className="fa fa-lock" ></i>
                            <input type="password" name="password" id="pwd" className="pwd" placeholder="Password" required onChange={(e) => { setPassword(e.target.value) }} />
                        </div>
                    </div>

                    {/* <div className="remember">
                        <input type="checkbox" className="chech-box" /><span>Remember me</span>
                    </div> */}

                    <div>
                        <input type="submit" value="Login" id="Login" onClick={login} />
                    </div>

                    <div className="bottom">
                        <p>Don't have an account?
                            <a href="reg"> Sign up Now</a></p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login