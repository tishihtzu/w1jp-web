/**
 * Convert latitude/longitude to an MGRS string at 10m precision.
 *
 * Accepts either:
 *   toMGRS10m({ lat: 26.9767, lng: -82.3550 })
 *   toMGRS10m(26.9767, -82.3550)
 *
 * Requires:
 *   npm install mgrs
 */

import { forward } from "mgrs";

export function toMGRS10m(latOrObj, lng = undefined) {
    let lat;

    if (typeof latOrObj === "object" && latOrObj !== null) {
        lat = latOrObj.lat;
        lng = latOrObj.lng;
    } else {
        lat = latOrObj;
    }

    if (lat === undefined || lng === undefined) {
        throw new Error("Latitude and longitude are required");
    }

    lat = Number(lat);
    lng = Number(lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        throw new Error("Latitude and longitude must be numeric");
    }

    if (lat < -90 || lat > 90) {
        throw new Error("Latitude must be between -90 and 90");
    }

    if (lng < -180 || lng > 180) {
        throw new Error("Longitude must be between -180 and 180");
    }

    // mgrs.forward([lng, lat], precision)
    // precision:
    // 0 = 100km
    // 1 = 10km
    // 2 = 1km
    // 3 = 100m
    // 4 = 10m
    // 5 = 1m
    return forward([lng, lat], 4);
}
