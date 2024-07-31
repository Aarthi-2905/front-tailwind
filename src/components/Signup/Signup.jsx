import React, { useState } from "react";
import './Signup.css';
import {FaEye, FaEyeSlash,FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { setRole, setToken, setUsername, setUseremail,setStatus} from "../utils/Auth";
import { useNavigate } from "react-router-dom";
import {signupUser} from '../Fetch/SignupUser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const navigate = useNavigate();
    //Holds the Username entered by the user.
    const [username, setUserName] = useState("");
    //Holds the email entered by the user.
    const [email, setEmail] = useState("");
    //Holds the password entered by the user.
    const [password, setPassword] = useState("");
    //Holds the confirm password entered by the user.
    const [confirmPassword, setConfirmPassword] = useState("");
    //Toggles the visibility of the password.
    const [showPassword, setShowPassword] = useState(false);

    //Toggles the state of showPassword to show or hide the password.
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    //Function to display a success toast notification.
    const successNotify = (status) => {
        toast.success(status, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    //Function to display an error toast notification.
    const errorNotify = (status) => {
        toast.error(status, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };


    //Handles form submission, validates input, calls the signup API, and sets authentication data upon success.
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (password !== confirmPassword) {
            errorNotify("Passwords do not match");
            return;
        }

        try {
            const data =  await signupUser(username, email, password);

            if (data['access_token']) {
                setToken(data['access_token']);
                setUsername(data['user_name']);
                setUseremail(data['user_email']);
                setRole(data['role']);
                setStatus(data['detail']);
                navigate('/Home');
            } else {
                errorNotify('The Username and Password is already registered');
            }
        } catch (error) {
            errorNotify('Error:', error);
            
        }
    };
    return (
        <div>
            <div className="signup-wrapper">
                <form  onSubmit={handleSubmit} className="signup-form">
                    <h1>Sign Up</h1>
                    <div className="input-boxes">
                        <input type="text" placeholder="username"  value={username}
                            onChange={(e) => setUserName(e.target.value)} required 
                        />
                        <FaUser className="icon"/>
                    </div>
                    <div className="input-boxes">
                        <input type="text" placeholder="email" value={email}
                            onChange={(e) => setEmail(e.target.value)} required 
                        />
                        <MdEmail className="icon"/>
                    </div>
                    <div className="input-boxes">
                        <input type={showPassword ? "text" : "password"} placeholder="password" 
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                        <span onClick={handleTogglePassword} className="toggle-password">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <div className="input-boxes">
                        <input type={showPassword ? "text" : "password"} placeholder="confirm-password" 
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        required />
                        <span onClick={handleTogglePassword} className="toggle-password">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button type="submit">Signup</button>
                    <div className="login-link">
                        <p>Already have an Account? <a href="/">&nbsp;&nbsp; Login</a></p>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Signup;