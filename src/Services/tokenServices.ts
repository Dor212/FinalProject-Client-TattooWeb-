import { jwtDecode } from "jwt-decode"
import { TDecodedToken } from "../Types/TDecodedToken.ts";

export const decode = (token: string)=>{
    return jwtDecode(token) as TDecodedToken;
};

