import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Admin from './pages/Admin'; 
import { useState } from 'react';
import RefrshHandler from './RefrshHandler';
import Reports from './pages/Reports'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  const AdminRoute = ({ element }) => {
    return (isAuthenticated && isAdmin) ? element : <Navigate to="/login" />
  }

  return (
    <div className=" w-full h-full bg-app-gradient">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
        <Route path='/reports' element={<PrivateRoute element={<Reports />} />} />
        <Route path='/admin' element={<AdminRoute element={<Admin />} />} /> 
      </Routes>
    </div>
  );
}

export default App;

