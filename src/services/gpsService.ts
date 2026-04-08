export const gpsService = {
  getCurrentPosition: (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  },
  watchPosition: (
    onSuccess: PositionCallback,
    onError?: PositionErrorCallback,
    options?: PositionOptions
  ): number => {
    return navigator.geolocation.watchPosition(onSuccess, onError, options);
  },
  clearWatch: (watchId: number) => {
    navigator.geolocation.clearWatch(watchId);
  },
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Haversine formula implementation
    return 0;
  }
};
