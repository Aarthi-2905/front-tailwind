import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {EnvelopeSimple, Paperclip, User, SignOut, UserCircle, Robot } from 'phosphor-react';
import './Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUsername, fetchUseremail, fetchRole,fetchToken, logout, fetchStatus, setStatus } from "../utils/Auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadFile, userPrompt,authTest } from "../Fetch/Home";

export default function Home() {
    const navigate = useNavigate();
    const token = fetchToken() ;
    const username = fetchUsername();
    const userRole = fetchRole();
    const useremail = fetchUseremail();
    //Holds the user input text
    const [inputText, setInputText] = useState("");
    // Indicates if an operation is in progress.
    const [isLoading, setIsLoading] = useState(false); 
    //Holds the conversation messages.
    const [messages, setMessages] = useState([]); 
    //Toggles the sidebar visibility.
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    //Reference to the file input element.
    const fileInputRef = useRef(null);
    //Indicates if the token is verified.
    const [isVerified, setIsVerified] = useState(false);
    //Toggles the mobile sidebar visibility.
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    //Verifies the token and sets the isVerified state. Redirects to the login page if the token is invalid.
    const verifyToken = async () => {
        try {
            const data = await authTest(token);
            if (data.detail === "true") {
                setIsVerified(true);
            } else {
                console.log("Token verification failed");
                logout(localStorage);
                navigate('/');
            }
        } catch (error) {
            console.error("Token verification failed:", error);
            logout(localStorage);
            navigate('/');
        } 
    };
    // Calls verifyToken on component mount.
    useEffect(() => {
        // verifyToken();
    }, []);

    if (!isVerified) {
        // return null;
        setIsVerified(true);
    }

    //Displays a success toast notification.
    const successNotify = (status) => toast.success(status, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });

    //Displays an error toast notification.
    const errorNotify = (status) => toast.error(status, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });

    //Checks and displays the login status.
    const loginStatus = fetchStatus()
    if( loginStatus !== "false"){
        successNotify(loginStatus)
        setStatus("false")
    }

    //Logs out the user, sets the status to "signed_out", and redirects to the login page.
    const signOut = () => {
        logout();
        setStatus("signed_out")
        navigate("/");
    };

    //Updates the inputText state with the user's input.
    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    //Simulates a click on the hidden file input.
    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    //Handles file selection, validates the file type, uploads the file, and displays appropriate notifications.
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
    
        const validExtensions = ['.pdf', '.xlsx', '.txt', '.pptx', '.docx','.csv'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
        if (!validExtensions.includes(fileExtension)) {
            errorNotify('Invalid file type. please upload .pdf,.xlsx,.txt,.pptx,.docx,.csv file.');
            setTimeout(() => {
                errorNotify(null); 
            }, 2000);
            return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
        localStorage.removeItem("status")
        setIsLoading(true);

        try {
            const data = uploadFile(formData);
            successNotify("uploaded successfully!!") 
        } catch (error) {
            errorNotify("upload failed!!")
        } finally {
            setIsLoading(false);
        }
    };
    
    //Handles the form submission, sends the user's input to the server, and updates the conversation messages.
    const onSend = async (event) => {
        event.preventDefault();

        // Add the user prompt to the messages list
        setMessages(prevMessages => [...prevMessages, { user: 'user', text: inputText }]);
        setInputText(""); // Clear the input field

        setIsLoading(true);
        try {
            const data = await userPrompt(inputText);
            console.log('Text submission success:', data.detail);
            setMessages(prevMessages => [...prevMessages, { user: 'bot', text: data.detail }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prevMessages => [...prevMessages, { user: 'bot', text: 'Text submission failed' }]);
        } finally {
            setIsLoading(false); 
        }
    };

    //Toggles the sidebar visibility.
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    //Toggles the mobile sidebar visibility.
    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    //Navigates to the User Management page.
    const handleUserManagement = () => {
        navigate('/UserManagement');
    };

    // Navigates to the About Us page.
    const handleAboutUs= () => {
        navigate('/About');
    };

    return (
        <div className="profile-page">
            <div className="content-wrapper">
                {isLoading && (
                    <div className="spinner-overlay">
                        <i className="fas fa-spinner fa-spin fa-3x"></i>
                    </div>
                )}
                <aside className='sidebar-styled'>
                    <div className='sidebar-top'>
                        <button className='sidebar-item' onClick={handleAboutUs}> About </button>
                        {/* {userRole === 'admin' && ( */}
                            <button className='sidebar-item' onClick={handleUserManagement}>User Management</button>
                        {/* )} */}
                    </div>
                    <div className='sidebar-bottom'>
                        <div className='sidebar-item' onClick={toggleSidebar}>
                            <User weight='bold' size={20} /> {username}
                        </div>
                        {isSidebarOpen && (
                            <div className="popup-box">
                                <div className='sidebar-item disabled'>
                                    <EnvelopeSimple weight='bold' size={20} className="emailIcon" /> {useremail}
                                </div>
                                <div className='sidebar-item' onClick={signOut}>
                                    <SignOut weight='bold' size={20} className="signoutIcon" /> Sign out
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
                <div className="main-content">
                    <nav className="navbar-styled">
                        <p>Knowledge Base</p>
                        <button className="mobile-menu-button" onClick={toggleMobileSidebar}>
                            ☰
                        </button>
                    </nav>
                    <div className={`mobile-sidebar ${isMobileSidebarOpen ? 'show' : ''}`}>
                        <div className='mobile-sidebar-item'>
                            <button className='mobile-sidebar-item-button' onClick={handleAboutUs}> About </button>
                        </div>
                        <div className='mobile-sidebar-item'>
                            <button className='mobile-sidebar-item-button' onClick={handleUserManagement}>User Management</button>
                        </div>
                        <div className='mobile-sidebar-item'>
                            <User weight='bold' size={20} /> {username}
                        </div>
                        <div className='mobile-sidebar-item disabled'>
                            <EnvelopeSimple weight='bold' size={20} className="emailIcon" /> {useremail}
                        </div>
                        <div className='mobile-sidebar-item' onClick={signOut}>
                            <SignOut weight='bold' size={20} className="signoutIcon" /> Sign out
                        </div>
                    </div>
                    <div className="main-content1">
                        <div className="response-container">
                            {messages.map((message, index) => (
                                <div key={index} className={`response-value ${message.user}`}>
                                    {message.user === 'user' ? (
                                        <UserCircle size={20} className="message-icon user"/>
                                    ) : (
                                        <Robot size={20} className="message-icon bot"/>
                                    )}
                                    <span>{message.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="input-container">
                            <form onSubmit={onSend} className="input-form">
                                <textarea type="text" placeholder="Type your message here"
                                    value={inputText} onChange={handleInputChange} 
                                    className="input-field" rows={1}
                                />
                                <button type="submit" className="send-button">Send</button>
                            </form>
                            {userRole === 'admin' && (
                                <Paperclip weight="bold" size={25} 
                                    onClick={handleFileClick} className="paperclip-icon"
                                />
                            )}
                            <input type="file" ref={fileInputRef} style={{ display: 'none' }}
                                onChange={handleFileChange} accept=".pdf,.xlsx,.txt,.pptx"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}