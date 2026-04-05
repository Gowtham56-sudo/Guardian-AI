export const formatDistance = (meters: number) => {
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
