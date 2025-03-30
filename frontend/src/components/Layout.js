import React from "react";
import Navbar from "../pages/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <main className="pt-20 px-6"> {/* ✅ Added padding-top (adjust based on Navbar height) */}
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
