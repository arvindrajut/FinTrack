import React, { useState, useEffect } from "react";
import axios from "axios";

const SavingsChallenge = () => {
    const [challenges, setChallenges] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchChallenges = async () => {
        setLoading(true);
        try {
            const apiKey = "AIzaSyCI6DAkFW7stm8Uj5hRRZZuzX0N9evFgzo"; // Your API Key
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

            const response = await axios.post(
                url,
                {
                    prompt: "Generate three creative savings challenges for individuals looking to save money effectively.",
                    parameters: {
                        maxOutputTokens: 150,
                        temperature: 0.7,
                    },
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Parse and set the challenges
            const generatedChallenges = response.data.candidates[0]?.output?.split("\n") || [];
            setChallenges(generatedChallenges.filter((challenge) => challenge.trim() !== ""));
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.error?.message || "An error occurred.";
            if (errorMessage.includes("API key expired")) {
                setError("API key expired. Please update your API key.");
            } else if (errorMessage.includes("API_KEY_INVALID")) {
                setError("Invalid API key. Ensure your key is correctly set.");
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Savings Challenges</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && (
                <ul>
                    {challenges.map((challenge, index) => (
                        <li key={index} style={{ marginBottom: "10px" }}>
                            {challenge}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SavingsChallenge;
