import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "../utils/tokenService";
import { getAdminToken } from "../utils/getAdminToken";
import { jwtDecode } from "jwt-decode";
const API_BASE_URL = "http://localhost:5000/fhir/Patient";

function PatientInfo() {
    const [patientData, setPatientData] = useState(null);
    const [responseCode, setResponseCode] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const accessToken = localStorage.getItem("access_token");

    useEffect(() => {
        if (!accessToken) {
            console.log("Khong co access token");
            window.location.href = "http://localhost:3000/homepage";
        } else {
            getPatientData(accessToken);
        }
    }, [accessToken]);
    const logOutAUser = async () => {
        const user_id = jwtDecode(localStorage.getItem("access_token")).sub;
        const adminToken = await getAdminToken();
        console.log("admitoken" + adminToken);
        console.log(user_id);
        if (adminToken) {
            try {
                
                const response = await fetch(`http://localhost:8080/admin/realms/quang-fhir-server/users/${user_id}/logout`, {
                    method: "POST",
                    headers: {
                        Authorization : `Bearer ${adminToken}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });
            } catch (error) {
                console.error(error);
            }
            finally{
                if (localStorage.getItem("access_token")) localStorage.removeItem("access_token");
                if (localStorage.getItem("refresh_token")) localStorage.removeItem("refresh_token");
                window.location.href = "http://localhost:3000/homepage";
            }
        }
        else{
            if (localStorage.getItem("access_token")) localStorage.removeItem("access_token");
                if (localStorage.getItem("refresh_token")) localStorage.removeItem("refresh_token");
                window.location.href = "http://localhost:3000/homepage";
        }

    }
    const getPatientData = async (token) => {
        try {
            const response = await axios.get(API_BASE_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {},
            });

            setResponseCode(response.status);
            setPatientData(response.data);
        } catch (error) {
            console.error("Error fetching patient data:", error);
            // If unauthorized or any fetch error
            if (error.response?.status === 401) {
                token = await refreshAccessToken();
                if (token) {
                    try {
                        const retry = await axios.get(API_BASE_URL, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            data: {},
                        });
                        if (retry.status === 200) {
                            setResponseCode(retry.status);
                            setPatientData(retry.data);
                        }
                    } catch (error) {
                        await  logOutAUser();
                    }

                }
                else {
                    await  logOutAUser();
                }
            }
            else {
                await  logOutAUser();
            }

        } finally {
            setIsLoading(false)
        }
    };
    const navigate = useNavigate();
    const handleRedirectToHomepage = () => {
        navigate('/homepage');
    }
    if (isLoading) {
        return (
            <div style={{ textAlign: "center", marginTop: "20%" }}>
                <h2>Loading patient info...</h2>
            </div>
        );
    }
    return (
        <div>
            <h2 style={{ textAlign: "center", marginTop: "20%" }}>
                Welcome to patient info
            </h2>
            <div>
                <pre>Response Code: { }</pre>
                <pre>Patient Data: {JSON.stringify(patientData, null, 2)}</pre>
            </div>
            <button
                style={{ margin: 10, padding: "10px 20px", fontSize: "16px" }}
                onClick={handleRedirectToHomepage}
            >
                Go to homepage
            </button>
        </div>
    );
}

export default PatientInfo;
