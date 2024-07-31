import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {EnvelopeSimple, Paperclip, User, SignOut, UserCircle, Robot } from 'phosphor-react';
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
            const data = await uploadFile(formData);
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
    const handleRequestedFiles = () => {
        navigate('/RequestedFiles');
    };

    // Navigates to the About Us page.
    const handleAboutUs= () => {
        navigate('/About');
    };

  return (
    <div className="flex flex-col min-h-screen">
        <div className="relative flex flex-1">
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <i className="fas fa-spinner fa-spin text-white text-3xl"></i>
            </div>
        )}
        <aside className="hidden w-64 p-6 text-white bg-gray-800 md:block">
            <div className="space-y-4">
            {userRole === 'admin' && (
                <>
                <button
                    className="block w-full px-4 py-2 text-left rounded hover:bg-gray-700"
                    onClick={handleUserManagement}
                >
                    User Management
                </button>
                <button
                    className="block w-full px-4 py-2 text-left rounded hover:bg-gray-700"
                    onClick={handleRequestedFiles}
                >
                    Requested Files
                </button>
                </>
            )}
            </div>
            <div className="pt-4 mt-6 border-t border-gray-700">
            <div
                className="flex items-center p-2 cursor-pointer rounded hover:bg-gray-700"
                onClick={toggleSidebar}
            >
                <User weight="bold" size={20} className="mr-2" /> {username}
            </div>
            {isSidebarOpen && (
                <div className="mt-2">
                <div className="flex items-center p-2 rounded hover:bg-gray-700">
                    <EnvelopeSimple weight="bold" size={20} className="mr-2" /> {useremail}
                </div>
                <div
                    className="flex items-center p-2 rounded hover:bg-gray-700"
                    onClick={signOut}
                >
                    <SignOut weight="bold" size={20} className="mr-2" /> Sign out
                </div>
                </div>
            )}
            </div>
        </aside>
        <div className="flex flex-col flex-1 bg-gray-100">
            <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
            <p className="text-lg">Varphi KBI</p>
            <button className="md:hidden" onClick={toggleMobileSidebar}>
                ☰
            </button>
            </nav>
            <div
            className={`fixed inset-0 z-50 bg-gray-800 text-white transform md:hidden ${
                isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300`}
            >
            <div className="p-4">
                <button
                className="block w-full px-4 py-2 text-left rounded hover:bg-gray-700"
                onClick={handleAboutUs}
                >
                About
                </button>
                {userRole === 'admin' && (
                <button
                    className="block w-full px-4 py-2 text-left rounded hover:bg-gray-700"
                    onClick={handleUserManagement}
                >
                    User Management
                </button>
                )}
                <div className="flex items-center p-2 mt-4 rounded hover:bg-gray-700">
                <User weight="bold" size={20} className="mr-2" /> {username}
                </div>
                <div className="flex items-center p-2 mt-2 rounded hover:bg-gray-700">
                <EnvelopeSimple weight="bold" size={20} className="mr-2" /> {useremail}
                </div>
                <div
                className="flex items-center p-2 mt-2 rounded hover:bg-gray-700"
                onClick={signOut}
                >
                <SignOut weight="bold" size={20} className="mr-2" /> Sign out
                </div>
            </div>
            </div>
            <div className="flex flex-col flex-1 p-4 overflow-auto">
            <div className="flex flex-col mb-4 space-y-4">
                {messages.map((message, index) => (
                <div
                    key={index}
                    className={`flex items-start space-x-2 ${
                    message.user === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                >
                    {message.user === 'user' ? (
                    <UserCircle size={20} className="text-blue-500" />
                    ) : (
                    <Robot size={20} className="text-green-500" />
                    )}
                    <span className="p-2 bg-white rounded-lg shadow-sm">
                    {message.text}
                    </span>
                </div>
                ))}
            </div>
            <div className="flex items-center space-x-4">
                <form
                onSubmit={onSend}
                className="flex items-center flex-1 p-2 bg-white rounded-lg shadow-md"
                >
                <textarea
                    type="text"
                    placeholder="Type your message here"
                    value={inputText}
                    onChange={handleInputChange}
                    className="flex-1 border-0 resize-none focus:ring-0 focus:outline-none"
                    rows={1}
                />
                <button
                    type="submit"
                    className="px-4 py-2 ml-2 text-white bg-blue-500 rounded-lg"
                >
                    Send
                </button>
                </form>
                {userRole === 'admin' && (
                <Paperclip
                    weight="bold"
                    size={25}
                    onClick={handleFileClick}
                    className="text-gray-600 cursor-pointer"
                />
                )}
                <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".pdf,.xlsx,.txt,.pptx"
                />
            </div>
            </div>
        </div>
        </div>
        <ToastContainer />
  </div>
  );
};

// export default Home;
