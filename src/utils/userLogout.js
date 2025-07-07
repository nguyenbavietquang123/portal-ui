
import { getAdminToken } from "./getAdminToken";
import { jwtDecode } from "jwt-decode";

export const userLogout= async (accessToken) => {
    const user_id = jwtDecode(accessToken).sub;
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