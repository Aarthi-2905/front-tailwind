import LoginForm from './components/LoginForm/LoginForm';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';
import About from './components/About/About';
import UserManagement from './components/UserManagement/UserManagement';
import RequestedFiles from './components/RequestedFiles/RequestedFiles';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

function App() {
    return (
        <div >
            <Router>
                <Routes>
                    <Route path="/Signup" element = {<Signup/>} ></Route>
                    <Route path="/" element={<LoginForm/>}></Route>
                    <Route path="/Home" element={<Home/>}></Route>
                    <Route path="/About" element={<About/>}></Route>
                    <Route path="/UserManagement" element={<UserManagement/>}></Route>
                    <Route path="/RequestedFiles" element={<RequestedFiles/>}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
