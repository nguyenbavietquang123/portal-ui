import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLogout } from "../utils/userLogout";
const AUTH_SERVER_URL = "http://localhost:8080/realms/quang-fhir-server/protocol/openid-connect";
const CLIENT_ID = "Portal-Client";
const CLIENT_SECRET = "Jhhup28xLYAF2vrMiyZ4gsjBKbbPB9ly"; // Skip if public client or use PKCE
const REDIRECT_URI = "http://localhost:3000/homepage/";
const TOKEN_ENDPOINT = `${AUTH_SERVER_URL}/token`;
const AUTH_ENDPOINT = `${AUTH_SERVER_URL}/auth`;

function HomePage() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
    const [error, setError] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        console.log("UseEffect")
        if (code) {
            console.log("code");
            console.log(code);
            exchangeCodeForToken(code);
        }
    }, []);
    const navigate = useNavigate();
    const handleRedirectToPatientInfo = () => {
        navigate('/patientinfo')
    }
    const handleRedirectToEncounterInfo = () => {
        navigate('/encounterinfo')
    }
    const exchangeCodeForToken = async (code) => {
        try {

            const body = new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET, // optional for public clients
            });

            const response = await fetch(TOKEN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body.toString(),
            });

            const data = await response.json();
            console.log("get-token");
            console.log(data.access_token);
            if (response.ok) {
                setAccessToken(data.access_token);
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token',data.refresh_token);

                window.history.replaceState({}, document.title, "/");
            } else {
                setError(data.error_description || 'Token exchange failed');
            }
        } catch (err) {
            console.error('Token exchange error', err);
            setError('Unexpected error during token exchange');
        }
    };

    const redirectToLogin = (role) => {
        const scope = role === 'patient' ? 'patient/Patient.rs patient/Encounter.rs' : 'user/Patient.rs user/Encounter.rs';

        const authUrl = `${AUTH_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
            REDIRECT_URI
        )}&scope=${encodeURIComponent(scope)}`;

        window.location.href = authUrl;
    };

    if (accessToken) {
        
            localStorage.setItem('access_token', accessToken);
            return <div>
                <button
                    style={{ margin: 10, padding: "10px 20px", fontSize: "16px" }}
                    onClick={() => userLogout(accessToken)}
                >
                    Log Out
                </button>
                <h2 style={{ textAlign: 'center', marginTop: '20%' }}>Welcome to our portal</h2>;
                <button
                    style={{ margin: 10, padding: "10px 20px", fontSize: "16px" }}
                    onClick={handleRedirectToPatientInfo}
                >
                    Get PatientInfo
                </button>
                <button
                    style={{ margin: 10, padding: "10px 20px", fontSize: "16px" }}
                    onClick={handleRedirectToEncounterInfo}
                >
                    Get EncounterInfo
                </button>

            </div>
        

    }

    return (
        <div style={{ textAlign: 'center', marginTop: '20%' }}>
            <h1>Welcome</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button
                style={{ margin: 10, padding: "10px 20px", fontSize: "16px" }}
                onClick={() => redirectToLogin("patient")}
            >
                Login as Patient
            </button>
            <button
                style={{ margin: 10, padding: "10px 20px", fontSize: "16px" }}
                onClick={() => redirectToLogin("practitioner")}
            >
                Login as Practitioner
            </button>
        </div>
    );
}

export default HomePage;