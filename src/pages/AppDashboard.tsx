import { motion, AnimatePresence } from 'motion/react';
import { Shield, AlertTriangle, Phone, MapPin, Mic, Bell, Settings, User, Heart, Zap, X, PhoneIncoming, PhoneOff, Video } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { recordingService } from '../services/recordingService';
import { VoiceRecognitionService } from '../services/voiceRecognitionService';
import { gpsService } from '../services/gpsService';
import { adminData } from '../utils/adminData';

export default function AppDashboard() {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [isFakeCallActive, setIsFakeCallActive] = useState(false);
  const [fakeCallTimer, setFakeCallTimer] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceMonitoring, setIsVoiceMonitoring] = useState(false);
  const voiceServiceRef = useRef<VoiceRecognitionService | null>(null);
  const sosLocationWatchIdRef = useRef<number | null>(null);

  const stopSOSCapture = useCallback(() => {
    recordingService.stopAllRecordings();
    setIsRecording(false);

    if (sosLocationWatchIdRef.current !== null) {
      gpsService.clearWatch(sosLocationWatchIdRef.current);
      sosLocationWatchIdRef.current = null;
    }
  }, []);

  const triggerSOS = useCallback(() => {
    if (!isSOSActive) {
      setIsSOSActive(true);
      // Auto-start evidence capture for higher officers.
      recordingService.startRecording('video');
      recordingService.startRecording('audio');
      setIsRecording(true);

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
          console.error('Unable to capture SOS location:', error);
        });

      sosLocationWatchIdRef.current = gpsService.watchPosition(
        (position) => {
          void adminData.addLocation(
            position.coords.latitude,
            position.coords.longitude,
            position.coords.accuracy,
            'gps'
          );
        },
        (error) => {
          console.error('Unable to watch SOS location:', error);
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );

      console.log('SOS Triggered: Emergency SMS sent to trusted contacts');
    }
  }, [isSOSActive]);

  const toggleRecording = () => {
    if (isSOSActive) {
      return;
    }

    if (isRecording) {
      recordingService.stopRecording('video');
      setIsRecording(false);
    } else {
      recordingService.startRecording('video');
      setIsRecording(true);
    }
  };

  const quickActions = [
    { icon: <Phone size={24} aria-hidden="true" />, label: 'Fake Call', color: 'bg-amber-100 text-amber-800', onClick: () => triggerFakeCall() },
    { icon: isRecording ? <Video size={24} aria-hidden="true" className="animate-pulse" /> : <Mic size={24} aria-hidden="true" />, label: isRecording ? 'Recording...' : 'Record', color: isRecording ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800', onClick: () => toggleRecording() },
    { icon: <MapPin size={24} aria-hidden="true" />, label: 'Share Trip', color: 'bg-blue-100 text-blue-800', onClick: () => console.log('Sharing...') },
    { icon: <Zap size={24} aria-hidden="true" />, label: 'Quick SOS', color: 'bg-purple-100 text-purple-800', onClick: () => triggerSOS() },
  ];

  const triggerFakeCall = () => {
    setFakeCallTimer(5);
  };

  // Shake to SOS logic
  useEffect(() => {
    let lastX: number | null = null, lastY: number | null = null, lastZ: number | null = null;
    let threshold = 15; // Shake sensitivity

    const handleMotion = (event: DeviceMotionEvent) => {
      const { x, y, z } = event.accelerationIncludingGravity || {};
      if (x !== undefined && y !== undefined && z !== undefined) {
        if (lastX !== null && lastY !== null && lastZ !== null) {
          const deltaX = Math.abs(x - lastX);
          const deltaY = Math.abs(y - lastY);
          const deltaZ = Math.abs(z - lastZ);

          if ((deltaX > threshold && deltaY > threshold) || (deltaX > threshold && deltaZ > threshold) || (deltaY > threshold && deltaZ > threshold)) {
            triggerSOS();
          }
        }
        lastX = x; lastY = y; lastZ = z;
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [triggerSOS]);

  useEffect(() => {
    if (fakeCallTimer !== null && fakeCallTimer > 0) {
      const timer = setTimeout(() => setFakeCallTimer(fakeCallTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (fakeCallTimer === 0) {
      setIsFakeCallActive(true);
      setFakeCallTimer(null);
    }
  }, [fakeCallTimer]);

  // Voice Recognition Setup
  useEffect(() => {
    if (!voiceServiceRef.current) {
      voiceServiceRef.current = new VoiceRecognitionService(() => {
        triggerSOS();
      });
    }

    if (isVoiceMonitoring) {
      voiceServiceRef.current.start();
    } else {
      voiceServiceRef.current.stop();
    }

    return () => {
      voiceServiceRef.current?.stop();
    };
  }, [isVoiceMonitoring, triggerSOS]);

  useEffect(() => {
    return () => {
      stopSOSCapture();
    };
  }, [stopSOSCapture]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-8 pb-24"
    >
      {/* Fake Call Overlay */}
      <AnimatePresence>
        {isFakeCallActive && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-between py-20 px-10 text-white"
          >
            <div className="text-center space-y-2">
              <p className="text-blue-400 text-sm font-medium uppercase tracking-widest">Incoming Call</p>
              <h2 className="text-3xl font-bold">Dad</h2>
              <p className="text-slate-400">Mobile +1 (555) 000-1234</p>
            </div>

            <div className="h-32 w-32 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-700 shadow-2xl">
              <User size={64} className="text-slate-500" />
            </div>

            <div className="flex w-full justify-around items-center">
              <div className="flex flex-col items-center gap-2">
                <button 
                  onClick={() => setIsFakeCallActive(false)}
                  className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl shadow-red-900/20 active:scale-90 transition-transform"
                >
                  <PhoneOff size={32} />
                </button>
                <span className="text-xs font-bold text-slate-400 uppercase">Decline</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button 
                  onClick={() => setIsFakeCallActive(false)}
                  className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center shadow-xl shadow-green-900/20 animate-bounce active:scale-90 transition-transform"
                >
                  <PhoneIncoming size={32} />
                </button>
                <span className="text-xs font-bold text-slate-400 uppercase">Accept</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hello, Guardian</h1>
          <p className="text-slate-500">You are currently protected.</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
           <User size={24} className="text-slate-400" />
        </div>
      </div>

      {/* SOS Button Area */}
      <div className="relative flex flex-col items-center justify-center py-12">
        {fakeCallTimer !== null && (
          <div className="absolute -top-4 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-amber-200 animate-pulse">
            Fake call in {fakeCallTimer}s...
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (isSOSActive) {
              setIsSOSActive(false);
              stopSOSCapture();
            } else {
              triggerSOS();
            }
          }}
          aria-label={isSOSActive ? 'Cancel SOS Emergency' : 'Activate SOS Emergency'}
          aria-pressed={isSOSActive}
          className={`relative z-10 flex h-48 w-48 flex-col items-center justify-center rounded-full shadow-2xl transition-colors duration-500 ${
            isSOSActive ? 'bg-red-600 shadow-red-200' : 'bg-blue-600 shadow-blue-200'
          }`}
        >
          <Shield size={64} className="text-white mb-2" aria-hidden="true" />
          <span className="text-xl font-bold text-white uppercase tracking-widest">
            {isSOSActive ? 'Active' : 'SOS'}
          </span>
        </motion.button>

        {/* Pulsing Rings */}
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <motion.div
            animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`absolute h-48 w-48 rounded-full border-2 ${isSOSActive ? 'border-red-400' : 'border-blue-400'}`}
          />
          <motion.div
            animate={{ scale: [1, 1.8, 2.5], opacity: [0.3, 0.1, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            className={`absolute h-48 w-48 rounded-full border-2 ${isSOSActive ? 'border-red-400' : 'border-blue-400'}`}
          />
        </div>
        
        <p className="mt-8 text-sm font-medium text-slate-500 uppercase tracking-widest">
          {isSOSActive ? 'Emergency Services Notified' : 'Hold for 3 seconds in emergency'}
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4" role="group" aria-label="Quick safety actions">
        {quickActions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            aria-label={action.label}
            onClick={action.onClick}
            className={`flex flex-col items-center gap-3 rounded-3xl p-6 shadow-sm border border-slate-100 transition-colors ${
              action.label === 'Recording...' ? 'bg-red-50 border-red-200' : 'bg-white'
            }`}
          >
            <div className={`rounded-2xl p-4 ${action.color}`}>
              {action.icon}
            </div>
            <span className={`font-semibold ${action.label === 'Recording...' ? 'text-red-700' : 'text-slate-700'}`}>
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Voice Monitor & Status */}
      <div className="grid grid-cols-1 gap-4">
        <div className={`rounded-3xl p-6 shadow-sm border transition-all ${isVoiceMonitoring ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isVoiceMonitoring ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                <Mic size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">AI Voice Monitor</p>
                <p className="text-xs text-slate-500">{isVoiceMonitoring ? 'Listening for distress signals...' : 'Monitoring is disabled'}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsVoiceMonitoring(!isVoiceMonitoring)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isVoiceMonitoring ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isVoiceMonitoring ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-4" aria-live="polite">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">Safety Status</h2>
          <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full">
            <div className="h-1.5 w-1.5 rounded-full bg-green-700 animate-pulse" aria-hidden="true" />
            LIVE
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">Current Location</p>
              <p className="text-xs text-slate-600">123 Safety Ave, Secure City</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
            <div className="h-10 w-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <Heart size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">Heart Rate</p>
              <p className="text-xs text-slate-600">72 BPM - Normal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
  );
}
