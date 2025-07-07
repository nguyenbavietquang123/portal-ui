const TOKEN_ENDPOINT = "http://localhost:8080/realms/quang-fhir-server/protocol/openid-connect/token";
const CLIENT_ID = "Portal-Client";
const CLIENT_SECRET = "Jhhup28xLYAF2vrMiyZ4gsjBKbbPB9ly"; 

export async function getAdminToken() {
    const body = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    });
    try{
        const response = await fetch(TOKEN_ENDPOINT,{
            method: "POST",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body.toString(),
        });
        const data = await response.json();
        if(response.ok){
            return data.access_token;
        } else {
      console.error("Get admin token failed:", data);
      return null;
    }
    }
    catch(error){
        console.error("Get admin token failed:", error);
        return null;
    }
}