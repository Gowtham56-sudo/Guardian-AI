import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Search, Layers, Compass, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMultilingualAssistantResponse } from '../services/aiDetectionService';
import { gpsService } from '../services/gpsService';
import { adminData } from '../utils/adminData';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #2563eb; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function AppMap() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzingRoute, setIsAnalyzingRoute] = useState(false);
  const [routeAdvice, setRouteAdvice] = useState<string | null>(null);
  const [isJourneyActive, setIsJourneyActive] = useState(false);
  const [hasDeviation, setHasDeviation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const watchId = gpsService.watchPosition((pos) => {
      setCurrentLocation([pos.coords.latitude, pos.coords.longitude]);
    }, undefined, { enableHighAccuracy: true });

    // Initial fetch
    gpsService.getCurrentPosition().then(pos => {
      setCurrentLocation([pos.coords.latitude, pos.coords.longitude]);
    }).catch(console.error);

    return () => gpsService.clearWatch(watchId);
  }, []);

  const recenterMap = () => {
    gpsService.getCurrentPosition().then(pos => {
      setCurrentLocation([pos.coords.latitude, pos.coords.longitude]);
    }).catch(console.error);
  };


  const startJourney = () => {
    setIsJourneyActive(true);
    setHasDeviation(false);
    gpsService.getCurrentPosition()
      .then((position) => {
        void adminData.addLocation(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.accuracy,
          'gps'
        );
      })
      .catch((error) => {
        console.error('Unable to capture start location:', error);
      });
    // Simulate a deviation alert after 10 seconds
    setTimeout(() => {
      if (isJourneyActive) setHasDeviation(true);
    }, 10000);
  };

  const analyzeSafeRoute = async () => {
    if (!searchQuery) return;
    setIsAnalyzingRoute(true);
    try {
      const advice = await getMultilingualAssistantResponse(
        `Analyze the safety of the route to ${searchQuery}. Mention police stations and well-lit areas.`,
        'English'
      );
      setRouteAdvice(advice);
    } catch (error) {
      console.error("Route Analysis Error:", error);
    } finally {
      setIsAnalyzingRoute(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full gap-4 pb-24"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Live Tracking</h1>
        <div className="flex gap-2">
           <button 
             onClick={() => alert('Map layers toggled')}
             aria-label="Map Layers"
             className="p-2 rounded-full bg-white shadow-sm border border-slate-100 text-slate-700 hover:bg-slate-50 transition-colors"
           >
             <Layers size={20} aria-hidden="true" />
           </button>
           <button 
             onClick={() => alert('Compass calibrated')}
             aria-label="Compass"
             className="p-2 rounded-full bg-white shadow-sm border border-slate-100 text-slate-700 hover:bg-slate-50 transition-colors"
           >
             <Compass size={20} aria-hidden="true" />
           </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative space-y-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} aria-hidden="true" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search safe destinations..." 
            aria-label="Search safe destinations"
            className="w-full rounded-2xl bg-white py-4 pl-12 pr-28 shadow-sm border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {searchQuery && (
            <button 
              onClick={analyzeSafeRoute}
              disabled={isAnalyzingRoute}
              className="absolute right-2 top-2 h-10 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isAnalyzingRoute ? 'Analyzing...' : 'Safe Route'}
            </button>
          )}
        </div>

        {/* Route Advice Overlay */}
        <AnimatePresence>
          {routeAdvice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-4 rounded-2xl shadow-xl border border-blue-100 relative"
            >
              <button 
                onClick={() => setRouteAdvice(null)}
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI Safety Analysis</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{routeAdvice}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Deviation Alert */}
      <AnimatePresence>
        {hasDeviation && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[85%] bg-red-600 text-white p-6 rounded-[32px] shadow-2xl text-center space-y-4"
          >
            <div className="mx-auto h-16 w-16 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
              <AlertCircle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Route Deviation!</h3>
              <p className="text-sm opacity-90 mt-1">You have moved away from your safe route. Trusted contacts have been notified.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setHasDeviation(false)}
                className="flex-1 py-3 rounded-2xl bg-white/20 font-bold text-sm"
              >
                I'm Safe
              </button>
              <button 
                onClick={() => { alert('Emergency SOS Activated!'); setHasDeviation(false); }}
                className="flex-1 py-3 rounded-2xl bg-white text-red-600 font-bold text-sm"
              >
                SOS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real Map Container */}
      <div className="flex-1 min-h-[400px] h-[400px] rounded-3xl overflow-hidden border-4 border-white shadow-lg relative z-0">
        <MapContainer 
          center={currentLocation} 
          zoom={15} 
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={currentLocation} icon={customIcon}>
            <Popup>
              You are here.
            </Popup>
          </Marker>
          <MapRecenter center={currentLocation} />
        </MapContainer>

        {/* Floating Action Button for Recenter */}
        <button 
          onClick={recenterMap}
          aria-label="Recenter Map"
          className="absolute bottom-6 right-6 z-[1000] h-14 w-14 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-200 flex items-center justify-center active:scale-90 transition-transform"
        >
          <Navigation size={24} aria-hidden="true" />
        </button>
      </div>

      {/* Trip Info Card */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${isJourneyActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
            <Navigation size={24} className={isJourneyActive ? 'animate-pulse' : ''} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              {isJourneyActive ? 'Journey Active' : 'No Active Journey'}
            </p>
            <p className="text-xs text-slate-500">
              {isJourneyActive ? 'Sharing live location with 2 contacts' : 'Start a journey to share location'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => isJourneyActive ? setIsJourneyActive(false) : startJourney()}
          className={`text-sm font-bold px-6 py-3 rounded-xl transition-all ${
            isJourneyActive ? 'bg-red-50 text-red-600' : 'bg-blue-700 text-white shadow-lg shadow-blue-200'
          }`}
        >
          {isJourneyActive ? 'Stop' : 'Start'}
        </button>
      </div>
    </motion.div>
  );
}
