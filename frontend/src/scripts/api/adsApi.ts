import axios, { AxiosError, AxiosResponse } from "axios";

export async function createAdAPI(formData: FormData, csrf: string) {
    return await axios
        .post("/create-ad/", formData, {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "multipart/form-data",
                "X-CSRF-TOKEN": csrf,
            },
        })
        .then((res: AxiosResponse<any>) => res)
        .catch((err: AxiosError) => err.response);
}
