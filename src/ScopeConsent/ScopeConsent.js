import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ScopeConsent = () => {
  const [searchParams] = useSearchParams();
  const [scopes, setScopes] = useState([]);
  const [selectedScopes, setSelectedScopes] = useState([]);

  const responseType = searchParams.get("response_type");
  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state");
  const scopeParam = searchParams.get("scope");
  const aud = searchParams.get("aud");
  // const code_challenge = searchParams.get("code_challenge");
  // const code_challenge_method = searchParams.get("code_challenge_method");
  const [allChecked, setAllChecked] = useState(true);

  useEffect(() => {
    if (scopeParam) {
      const scopeList = scopeParam.split(" ");
      setScopes(scopeList);
      setSelectedScopes(scopeList); // all selected by default
    }
  }, [scopeParam]);

  const toggleScope = (scope) => {
    setSelectedScopes((prev) =>
      prev.includes(scope)
        ? prev.filter((s) => s !== scope)
        : [...prev, scope]
    );
  };

  const handleAuthorize = () => {
    const chosenScope = selectedScopes.join(" ");
    const authEndpoint = "http://localhost:8080/realms/quang-fhir-server/protocol/openid-connect/auth"; // <-- Replace this

    //const authorizeUrl = `${authEndpoint}?response_type=${encodeURIComponent(responseType || "")}&client_id=${encodeURIComponent(clientId || "")}&redirect_uri=${encodeURIComponent(redirectUri || "")}&scope=${encodeURIComponent(chosenScope)}&state=${encodeURIComponent(state || "")}&aud=${encodeURIComponent(aud)}&code_challenge=${encodeURIComponent(code_challenge)}&code_challenge_method=${encodeURIComponent(code_challenge_method)}`;
    const authorizeUrl = `${authEndpoint}?response_type=${encodeURIComponent(responseType || "")}&client_id=${encodeURIComponent(clientId || "")}&redirect_uri=${encodeURIComponent(redirectUri || "")}&scope=${encodeURIComponent(chosenScope)}&state=${encodeURIComponent(state || "")}&aud=${encodeURIComponent(aud)}`;
    window.location.href = authorizeUrl;
  };
  const toggleAllScopes = () => {
    if (allChecked) {
      setSelectedScopes([]);
    } else {
      setSelectedScopes(scopes);
    }
    setAllChecked(!allChecked);
  };
const handleCancel = () => {
    window.location.href = redirectUri || "/";
  };
  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Authorize App Access</h2>
      <p>Select which scopes you'd like to grant:</p>
       <button
        onClick={toggleAllScopes}
        style={{ marginBottom: "10px", padding: "5px 10px", backgroundColor: "#f3f4f6", border: "1px solid #ccc", borderRadius: "5px" }}
      >
        {allChecked ? "Uncheck All" : "Check All"}
      </button>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {scopes.map((scope) => (
          <li key={scope} style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={selectedScopes.includes(scope)}
                onChange={() => toggleScope(scope)}
              />{" "}
              {scope}
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={handleAuthorize}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "10px",
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Authorize Selected Scopes
      </button>
      <button
        onClick={handleCancel}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "10px",
          backgroundColor: "#e5e7eb",
          color: "#111827",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
    </div>
  );
};

export default ScopeConsent;
