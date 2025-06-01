import { useState, useCallback } from 'react';
export const useLocationService = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);
    const getLocation = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
                return;
            }
            setIsLoading(true);
            setError(null);
            navigator.geolocation.getCurrentPosition((position) => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                setLocation(location);
                setIsLoading(false);
                resolve(location);
            }, (error) => {
                let errorMessage = 'Unable to fetch location.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Please enable location permissions to use this feature.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }
                setError(errorMessage);
                setIsLoading(false);
                reject(new Error(errorMessage));
            });
        });
    }, []);
    const getGoogleMapsUrl = (location) => {
        return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    };
    return {
        getLocation,
        getGoogleMapsUrl,
        isLoading,
        error,
        location,
    };
};
