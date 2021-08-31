import { Loader } from "google-maps";
import {
    GOOGLE_MAPS_API_TOKEN,
    MAP_CHANGE_LOCATION_TIMEOUT,
    MAP_DEFAULT_POSITION,
    MAP_DEFAULT_ZOOM,
} from "../config.map";

export async function initMap() {
    let changeZoomTimeoutId: NodeJS.Timeout;
    let changePositionTimeoutId: NodeJS.Timeout;

    let currentPosition = MAP_DEFAULT_POSITION;
    let currentZoom = MAP_DEFAULT_ZOOM;

    const loader = new Loader(GOOGLE_MAPS_API_TOKEN);

    const google = await loader.load();
    const map = new google.maps.Map(document.getElementById("map"), {
        center: currentPosition,
        zoom: currentZoom,
    });

    map.addListener("center_changed", () => {
        if (changePositionTimeoutId) clearTimeout(changePositionTimeoutId);

        changePositionTimeoutId = setTimeout(() => {
            currentPosition = { lat: map.getCenter().lat(), lng: map.getCenter().lng() };
            console.log("currentPosition", currentPosition);
        }, MAP_CHANGE_LOCATION_TIMEOUT);
    });

    map.addListener("zoom_changed", () => {
        if (changeZoomTimeoutId) clearTimeout(changeZoomTimeoutId);

        changeZoomTimeoutId = setTimeout(() => {
            currentZoom = map.getZoom();
            console.log("currentZoom", currentZoom);
        }, MAP_CHANGE_LOCATION_TIMEOUT);
    });

    return map;
}
