import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = "http://localhost:5000/fhir/Encounter";

function PatientInfo() {
  const [encounterData, setEncounterData] = useState(null);
  const [responseCode, setResponseCode] = useState(null);

  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    if (!accessToken) {
    console.log("Khong co access token");
      window.location.href = "http://localhost:3000/homepage";
    } else {
      getEncounterData(accessToken);
    }
  }, [accessToken]);
  
  const getEncounterData = async (token) => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {},
      });

      setResponseCode(response.status);
      setEncounterData(response.data);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      // If unauthorized or any fetch error
      localStorage.removeItem("access_token");
      window.location.href = "http://localhost:3000/homepage";
    }
  };
  const navigate = useNavigate();
  const handleRedirectToHomePage = () =>{
    navigate("/homepage");
  }
  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: "20%" }}>
        Welcome to encounter info
      </h2>
      <div>
        <pre>Response Code: {responseCode}</pre>
        <pre>Encounter Data: {JSON.stringify(encounterData, null, 2)}</pre>
      </div>
      <button
                    style={{ margin: 10, padding: "10px 20px", fontSize: "16px" }}
                    onClick={handleRedirectToHomePage}
                >
                    Go to homepage
    </button>
    </div>
  );
}

export default PatientInfo;
