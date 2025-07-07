import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScopeConsent from "./ScopeConsent/ScopeConsent";
import HomePage from "./PortalUI/HomePage";
import PatientInfo from "./PortalUI/PatientInfoUI";
import EncounterInfo from "./PortalUI/EncounterInfoUI"; 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/consent" element={<ScopeConsent />} />
        <Route path="/homepage" element={<HomePage />}/>
        <Route path="/patientinfo" element={<PatientInfo />}/>
        <Route path="/encounterinfo" element={<EncounterInfo />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
