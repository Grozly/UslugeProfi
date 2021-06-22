import axios, { AxiosError, AxiosResponse } from "axios";

export async function getAllCategoriesAPI() {
    return await axios
        .get("/ajax/category-val/")
        .then((res: AxiosResponse<any>) => res)
        .catch((err: AxiosError) => err.response);
}

export async function getSubcategoriesByCategoryAPI(categoryId: number) {
    return await axios
        .get("/ajax/subcategory-val/" + categoryId + "/")
        .then((res: AxiosResponse<any>) => res)
        .catch((err: AxiosError) => err.response);
}

export async function getServicesBySubcategoryAPI(subcategoryId: number) {
    return await axios
        .get("/ajax/service-val/" + subcategoryId + "/")
        .then((res: AxiosResponse<any>) => res)
        .catch((err: AxiosError) => err.response);
}
