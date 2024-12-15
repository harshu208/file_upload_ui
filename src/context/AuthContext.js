import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {notifications} from '@mantine/notifications'
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   // const [authToken, setAuthToken] = useState(null);
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
    const navigate = useNavigate();

    const login = async (username, password) => {
        try{
            const response = await axios.post('http://localhost:5000/auth/login', {
                username,password
            })
            console.log('respinse',response);
            const token = response.data.token;
            if(token){
                setAuthToken(token);
                localStorage.setItem('authToken', token);
                navigate('/home');
            }
            else{
                throw new Error('Invalid login');
            }
        }
        catch(err){
            console.error('Login failed', err);
            notifications.show({
                title : 'Error',
                message : 'Invalid Username or Password',
                color:'red',
                autoClose:5000
              })
            throw err;
        }
    }

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
          {children}
        </AuthContext.Provider>
      );
        
}