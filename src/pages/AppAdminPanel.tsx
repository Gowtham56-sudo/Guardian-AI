import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Mic, Play, ShieldCheck, Trash2, Video } from 'lucide-react';
import { adminData } from '../utils/adminData';
import { recordingService } from '../services/recordingService';
import { gpsService } from '../services/gpsService';

export default function AppAdminPanel() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [captureState, setCaptureState] = useState<'idle' | 'loading' | 'error' | 'done'>('idle');

  const recordings = useMemo(() => adminData.getRecordings(), [refreshKey]);
  const locations = useMemo(() => adminData.getLocations(), [refreshKey]);

  const videoItems = recordings.filter((item) => item.kind === 'video');
  const audioItems = recordings.filter((item) => item.kind === 'audio');

  const onStartAudio = async () => {
    await recordingService.startRecording('audio');
    setIsAudioRecording(true);
  };

  const onStopAudio = () => {
    recordingService.stopRecording('audio');
    setIsAudioRecording(false);
    setTimeout(() => setRefreshKey((value) => value + 1), 250);
  };

  const captureLocation = async () => {
    setCaptureState('loading');
    try {
      const position = await gpsService.getCurrentPosition();
      adminData.addLocation(
        position.coords.latitude,
        position.coords.longitude,
        position.coords.accuracy,
        'gps'
      );
      setCaptureState('done');
      setRefreshKey((value) => value + 1);
    } catch {
      setCaptureState('error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="space-y-6 pb-24"
    >
      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-600 p-3 text-white">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
            <p className="text-sm text-slate-600">Monitor recorded video, voice clips, and recent locations.</p>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Mic size={16} />
            Voice Recordings
          </h2>
          <button
            onClick={isAudioRecording ? onStopAudio : onStartAudio}
            className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
              isAudioRecording ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'
            }`}
          >
            {isAudioRecording ? 'Stop Voice' : 'Record Voice'}
          </button>
        </div>

        {audioItems.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No voice clips recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {audioItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-3">
                <p className="mb-2 text-xs font-semibold text-slate-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
                <audio controls className="w-full">
                  <source src={item.url} type={item.mimeType} />
                </audio>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Video size={16} />
            Video Recordings
          </h2>
          <button
            onClick={() => {
              adminData.clearRecordings();
              setRefreshKey((value) => value + 1);
            }}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
          >
            <Trash2 size={14} />
            Clear Media
          </button>
        </div>

        {videoItems.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No video clips recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {videoItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-3">
                <p className="mb-2 text-xs font-semibold text-slate-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
                <video controls className="w-full rounded-xl bg-slate-950">
                  <source src={item.url} type={item.mimeType} />
                </video>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <MapPin size={16} />
            Location History
          </h2>
          <button
            onClick={captureLocation}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white"
          >
            <Play size={12} />
            Capture
          </button>
        </div>

        {captureState === 'error' && (
          <p className="mb-3 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
            Location access denied or unavailable.
          </p>
        )}

        {captureState === 'done' && (
          <p className="mb-3 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">
            Current location captured successfully.
          </p>
        )}

        {locations.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No locations captured yet.</p>
        ) : (
          <div className="space-y-2">
            {locations.slice(0, 10).map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}</p>
                <p className="text-xs text-slate-500">Accuracy: {Math.round(item.accuracy)}m</p>
                <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}
