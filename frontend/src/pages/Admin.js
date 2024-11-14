import React, { useEffect, useState } from 'react';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const [usersData, setUsersData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const response = await fetch(`${APIUrl}/expenses/admin/all`, {
                    headers: { 'Authorization': localStorage.getItem('token') }
                });
                if (response.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                const result = await response.json();
                if (result.success) {
                    setUsersData(result.data);
                } else {
                    handleError(result.message);
                }
            } catch (err) {
                handleError(err);
            }
        };
        fetchUsersData();
    }, [navigate]);

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Expenses</th>
                    </tr>
                </thead>
                <tbody>
                    {usersData.map((user, index) => (
                        <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <ul>
                                    {user.expenses.map((expense, idx) => (
                                        <li key={idx}>
                                            {expense.text} - ${expense.amount} on {new Date(expense.date).toLocaleDateString()}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
}

export default Admin;
