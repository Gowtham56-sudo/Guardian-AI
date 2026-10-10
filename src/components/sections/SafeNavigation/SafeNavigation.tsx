import { Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
export default function SafeNavigation() {
  return (
    <section className="flex flex-col items-center gap-12 md:flex-row-reverse py-12">
      <div className="flex-1 space-y-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100">
          <Navigation size={32} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Safe Navigation</h2>
        <p className="text-lg leading-relaxed text-slate-600">
          Travel with confidence using our intelligent routing system. GuardianAI suggests the most secure paths based on real-time community data, lighting conditions, and proximity to safe zones.
        </p>
        <ul className="space-y-3 text-slate-700">
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
            Nearby police stations and 24/7 safe zones
          </li>
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
            Route deviation and unusual stop alerts
          </li>
        </ul>
      </div>
      <div className="flex-1 rounded-3xl bg-slate-800/50 p-6 md:p-8 backdrop-blur-xl border border-white/10 shadow-2xl shadow-blue-900/20">
        <div className="aspect-video rounded-2xl bg-white shadow-inner relative overflow-hidden z-0 border border-white/20">
          <MapContainer 
            center={[40.7128, -74.0060]} 
            zoom={13} 
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* User Location Marker */}
            <Marker position={[40.7128, -74.0060]}>
              <Popup>Current Location</Popup>
            </Marker>
            <Circle 
              center={[40.7128, -74.0060]}
              radius={1000}
              pathOptions={{ fillColor: '#3b82f6', color: '#2563eb', weight: 1, fillOpacity: 0.1 }}
            />
            {/* Safe Zone Marker */}
            <Marker position={[40.7200, -73.9900]}>
              <Popup>Verified Safe Zone</Popup>
            </Marker>
            <Circle 
              center={[40.7200, -73.9900]}
              radius={300}
              pathOptions={{ fillColor: '#10b981', color: '#059669', weight: 1, fillOpacity: 0.2 }}
            />
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
