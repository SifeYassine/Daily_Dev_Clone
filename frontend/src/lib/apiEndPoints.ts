import Env from "./env";

export const API_URL = Env.API_URL;
export const LOGIN_URL = `${API_URL}/api/auth/login`;
export const REGISTER_URL = `${API_URL}/api/auth/register`;
export const LOGOUT_URL = `${API_URL}/api/auth/logout`;
export const UPDATE_PROFILE_URL = `${API_URL}/api/users/update-profile`;
