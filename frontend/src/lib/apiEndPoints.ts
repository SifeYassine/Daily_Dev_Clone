import Env from "./env";

export const API_URL = Env.API_URL;
export const LOGIN_URL = `${API_URL}/auth/login`;
export const REGISTER_URL = `${API_URL}/auth/register`;
export const LOGOUT_URL = `${API_URL}/auth/logout`;
