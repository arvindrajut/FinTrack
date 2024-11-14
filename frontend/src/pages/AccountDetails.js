import React from 'react';

function AccountDetails({ accountName, officialName, persistentAccountId, subtype, type }) {
    return (
        <div className="bg-gradient-to-br from-purple-200 via-white to-blue-200 p-6 rounded-3xl shadow-lg max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Account Details</h2>
            <div className="bg-white p-4 rounded-xl shadow-md space-y-3">
                <div className="text-gray-700">
                    <strong>Account Name:</strong> {accountName}
                </div>
                <div className="text-gray-700">
                    <strong>Official Name:</strong> {officialName}
                </div>
                <div className="text-gray-700">
                    <strong>Persistent Account ID:</strong> {persistentAccountId}
                </div>
                <div className="text-gray-700">
                    <strong>Subtype:</strong> {subtype}
                </div>
                <div className="text-gray-700">
                    <strong>Type:</strong> {type}
                </div>
            </div>
        </div>
    );
}

export default AccountDetails;
