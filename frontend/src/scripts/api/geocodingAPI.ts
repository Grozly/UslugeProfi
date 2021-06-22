import axios, { AxiosError, AxiosResponse } from "axios";
import { GOOGLE_MAPS_API_TOKEN } from "../../config.map";

export async function getLocationOfAddressAPI(address: string) {
    return await axios
        .get("https://maps.googleapis.com/maps/api/geocode/json", {
            params: { address, key: GOOGLE_MAPS_API_TOKEN },
        })
        .then((res: AxiosResponse<any>) => res)
        .catch((err: AxiosError) => err.response);
}
