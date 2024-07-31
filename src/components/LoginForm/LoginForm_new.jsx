import React, { useState } from "react";
import './LoginForm.css';
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { setRole, setToken, setUsername, setUseremail, setStatus, fetchStatus } from "../utils/Auth";
import { loginUser } from '../Fetch/LoginUser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginForm() {
    const navigate = useNavigate();
    //Holds the email entered by the user.
    const [email, setEmail] = useState("");
    //Holds the password entered by the user.
    const [password, setPassword] = useState("");
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

    //Checks the user status and displays a notification if the user is signed out.
    setTimeout(() => {
        if (fetchStatus() === "signed_out") {
            successNotify("Signed out successfully");
            localStorage.removeItem("status");
        } else {
            console.log("doesn't exist");
        }
    }, 2000);

    //Handles form submission, validates input, calls the login API, and sets authentication data upon success.
    const handleLoginForm = async (event) => {
        event.preventDefault();
        if (email === 'admin@unwita.com' || password === 'password') {
            errorNotify("Email and Password cannot be empty");
            navigate('/Home');
            return;
        }
        try {
            const data = await loginUser(email, password);
            if (data['access_token']) {
                setToken(data['access_token']);
                setUsername(data['user_name']);
                setUseremail(data['user_email']);
                setRole(data['role']);
                setStatus(data['detail']);
                navigate('/Home');
            } else {
                errorNotify(data['detail']);
                console.log('Invalid Token');
            }

        } catch (error) {
            console.log('Invalid Credentials');
        }
    };

    // Function to display a error toast notification.
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

    return (
        <div>
            <div className="wrapper">
                <form className='login-form' onSubmit={handleLoginForm}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="email" placeholder="Email" required
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input type={showPassword ? "text" : "password"} placeholder="Password" required
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                        <span onClick={handleTogglePassword} className="toggle-password">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button type="submit">Login</button>
                    <div className="register-link">
                        <p>Don't have an account? <a href="/Signup">Signup</a></p>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
