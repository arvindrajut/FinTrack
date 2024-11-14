import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="abolute flex w-full bg-black text-white top-0 p-6 justify-between ">
            <h2 className='my-auto text-purple-400 text-2xl'>Finaura</h2>
                <div className='border-2 flex p-4 justify-evenly'>
                <Link className='p-2' to="/home">Home</Link>
                <Link className='p-2'  to="/expenses">Expenses</Link>
                <Link className='p-2' to="/reports">Reports</Link>
                <Link className='p-2' to="/admin">Admin Portal</Link>
                </div>
            <button onClick={handleLogout}>Logout</button>
        </nav>
    );
};

export default Navbar;
