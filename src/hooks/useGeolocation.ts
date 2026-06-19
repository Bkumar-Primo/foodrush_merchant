import { useCallback, useEffect, useState } from "react";

export const useGeolocation = (defaultCoords: [number, number] = [12.9715987, 77.5945627]) => {
  const [storeCoords, setStoreCoords] = useState<[number, number]>(defaultCoords);
  const [geoStatus, setGeoStatus] = useState<string>("using default");

  const requestLocation = useCallback(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      setGeoStatus("requesting...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStoreCoords([latitude, longitude]);
          setGeoStatus("granted");
        },
        (error) => {
          console.warn(
            "Geolocation permission denied or failed, using default (Bengaluru):",
            error,
          );
          let errMsg = "failed";
          if (error.code === 1) errMsg = "denied";
          else if (error.code === 2) errMsg = "unavailable";
          else if (error.code === 3) errMsg = "timeout";
          setGeoStatus(errMsg);
        },
        { enableHighAccuracy: false, timeout: 8000 },
      );
    } else {
      setGeoStatus("unsupported");
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { storeCoords, setStoreCoords, geoStatus, requestLocation };
};
