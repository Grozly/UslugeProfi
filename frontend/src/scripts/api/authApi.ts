import axios, { AxiosError, AxiosResponse } from "axios";

export async function registerAPI(data: {
    email: string;
    password: string;
    rePassword: string;
    isAgree: boolean;
    isOver18: boolean;
}) {
    return await axios
        .post("/register/", {
            email: data.email,
            password1: data.password,
            password2: data.rePassword,
            is_agree: data.isAgree,
            is_over18: data.isOver18,
        })
        .then((res: AxiosResponse<any>) => res)
        .catch((err: AxiosError) => err.response);
}

export async function loginAPI(data: { email: string; password: string; rememberMe: boolean }) {
    return await axios
        .post("/login/", {
            email: data.email,
            password: data.password,
            remember: data.rememberMe,
        })
        .then((res: AxiosResponse<any>) => res)
        .catch((err: AxiosError) => err.response);
}
