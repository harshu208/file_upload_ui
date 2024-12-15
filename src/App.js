import './App.css';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import { AuthProvider } from './context/AuthContext';

import { Notifications } from '@mantine/notifications';

const App =() => {
  return (
    <>
    <Notifications position="top-right" />
    <Router>
    <AuthProvider>
       <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />}  />
       </Routes>
     </AuthProvider>
    </Router>

     </>
  )
}

export default App;
