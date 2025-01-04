export const MAPS_CONFIG = {
  apiKey: import.meta.env.GOOGLE_MAPS_API_KEY || '',
  defaultCenter: {
    lat: 40.7128,
    lng: -74.0060
  },
  defaultZoom: 10,
  options: {
    disableDefaultUI: false,
    zoomControl: true,
    scrollwheel: true,
    streetViewControl: true,
    mapTypeControl: true
  }
} as const;