// src/utils/tokenService.js

const TOKEN_ENDPOINT = "http://localhost:8080/realms/quang-fhir-server/protocol/openid-connect/token";
const CLIENT_ID = "Portal-Client";
const CLIENT_SECRET = "Jhhup28xLYAF2vrMiyZ4gsjBKbbPB9ly"; 

export async function refreshAccessToken() {
  const refresh_token = localStorage.getItem("refresh_token");

  if (!refresh_token) {
    console.error("No refresh token available.");
    return null;
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refresh_token,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET, // omit if public client
  });

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("access_token", data.access_token);
      //localStorage.setItem("refresh_token", data.refresh_token);
      return data.access_token;
    } else {
      console.error("Token refresh failed:", data);
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}
