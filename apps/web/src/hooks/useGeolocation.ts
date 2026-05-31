import { useState, useEffect, useCallback } from 'react';
import { GeoLocation } from '../types/entities.types';

interface UseGeolocationReturn {
  location: GeoLocation | null;
  error: string | null;
  loading: boolean;
  requestLocation: () => void;
}

// Default location: Quito, Ecuador (Mariscal Sucre area)
const DEFAULT_LOCATION: GeoLocation = {
  latitude: -0.2198,
  longitude: -78.5123,
};

export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Using default location.');
      setLocation(DEFAULT_LOCATION);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        let errorMessage = 'Failed to get your location';

        if (err.code === 1) {
          errorMessage = 'Location permission denied. Using default location.';
        } else if (err.code === 2) {
          errorMessage = 'Location is unavailable. Using default location.';
        } else if (err.code === 3) {
          errorMessage = 'Location request timeout. Using default location.';
        }

        setError(errorMessage);
        setLocation(DEFAULT_LOCATION);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    location,
    error,
    loading,
    requestLocation,
  };
};
