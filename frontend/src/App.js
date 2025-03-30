import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Reports from "./pages/Reports";
import BalanceCard from "./pages/BalanceCard";
import InvestmentTracker from "./pages/InvestmentTracker";
import SpendTimeline from "./pages/SpendTimeline";
import Savings from "./pages/Savings";
import Transactions from "./pages/Transactions";
import { useState } from "react";
import RefrshHandler from "./RefrshHandler";
import { ThemeProvider, ThemeContext } from "./ThemeContext";
import EnvelopeBudgeting from "./pages/EnvelopeBudgeting";
import Layout from "./components/Layout"; // ✅ Import Layout

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const PrivateRoute = ({ element }) => {
        return isAuthenticated ? element : <Navigate to="/login" />;
    };

    const AdminRoute = ({ element }) => {
        return isAuthenticated && isAdmin ? element : <Navigate to="/login" />;
    };

    return (
        <ThemeProvider>
            <ThemeContext.Consumer>
                {({ theme, toggleTheme }) => (
                    <div className={`app-container ${theme}`}>
                        <RefrshHandler setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />
                        <button
                            onClick={toggleTheme}
                            className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
                        >
                            Toggle {theme === "dark" ? "Light" : "Dark"} Mode
                        </button>

                        <Routes>
                            {/* No Navbar on Login/Signup */}
                            <Route path="/" element={<Navigate to="/login" />} />
                            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />} />
                            <Route path="/signup" element={<Signup />} />

                            {/* Wrap all pages inside Layout */}
                            <Route element={<Layout />}>
                                <Route path="/home" element={<PrivateRoute element={<Home />} />} />
                                <Route path="/reports" element={<PrivateRoute element={<Reports />} />} />
                                <Route path="/admin" element={<AdminRoute element={<Admin />} />} />
                                <Route path="/balance" element={<PrivateRoute element={<BalanceCard />} />} />
                                <Route path="/investments" element={<PrivateRoute element={<InvestmentTracker />} />} />
                                <Route path="/timeline" element={<PrivateRoute element={<SpendTimeline />} />} />
                                <Route path="/savings" element={<PrivateRoute element={<Savings />} />} />
                                <Route path="/transactions" element={<PrivateRoute element={<Transactions />} />} />
                                <Route path="/budget" element={<PrivateRoute element={<EnvelopeBudgeting />} />} />
                            </Route>
                        </Routes>
                    </div>
                )}
            </ThemeContext.Consumer>
        </ThemeProvider>
    );
}

export default App;
