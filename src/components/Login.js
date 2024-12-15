import React, {useState,useContext } from 'react'
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css'
// import {toast} from 'react-toastify'
const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      return;
    }
    try{
      await login(username, password);
    }
    catch(err){
       console.log('Error while login')
    }
  }
  return (
    <div className='login-container'>
      <h2>File Upload</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            className='form-field'
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            className='form-field'
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="submit-btn">Login</button>
      </form>
    </div>
  )
}

export default Login
