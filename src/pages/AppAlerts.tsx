import { motion, AnimatePresence } from 'motion/react';
import { Bell, AlertCircle, ShieldCheck, MapPin, Clock, Filter, Plus, X, Camera, Send } from 'lucide-react';
import { useState } from 'react';

export default function AppAlerts() {
  const [isReporting, setIsReporting] = useState(false);
  const [reportType, setReportType] = useState<'danger' | 'warning' | 'info'>('warning');

  const alerts = [
    {
      id: 1,
      type: 'danger',
      title: 'Suspicious Activity Reported',
      location: 'Central Park North',
      time: '5 mins ago',
      description: 'Multiple users reported a suspicious individual near the fountain area. Stay alert.',
      icon: <AlertCircle className="text-red-700" aria-hidden="true" />,
      bgColor: 'bg-red-50',
    },
    {
      id: 2,
      type: 'info',
      title: 'Safe Zone Updated',
      location: 'Downtown District',
      time: '2 hours ago',
      description: 'New police patrol routes added. This area is now marked as High Security.',
      icon: <ShieldCheck className="text-blue-700" aria-hidden="true" />,
      bgColor: 'bg-blue-50',
    },
    {
      id: 3,
      type: 'warning',
      title: 'Heavy Traffic / Low Visibility',
      location: 'Highway 101',
      time: '4 hours ago',
      description: 'Foggy conditions reported. Use Safe Navigation for better route guidance.',
      icon: <Bell className="text-amber-800" aria-hidden="true" />,
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6 pb-24"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Community Alerts</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsReporting(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all active:scale-95"
          >
            <Plus size={18} />
            Report
          </button>
          <button 
            aria-label="Filter Alerts"
            className="p-2 rounded-xl bg-white shadow-sm border border-slate-100 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Filter size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {isReporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-end justify-center p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-md bg-white rounded-t-[40px] p-8 pb-12 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Report Safety Issue</h2>
                <button onClick={() => setIsReporting(false)} className="p-2 rounded-full bg-slate-100 text-slate-500">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-700">Issue Type</p>
                <div className="grid grid-cols-3 gap-3">
                  {(['danger', 'warning', 'info'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setReportType(type)}
                      className={`py-3 rounded-2xl border-2 transition-all text-xs font-bold uppercase tracking-wider ${
                        reportType === type 
                          ? 'bg-blue-50 border-blue-700 text-blue-700' 
                          : 'bg-white border-slate-100 text-slate-500'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-700">Description</p>
                  <textarea 
                    placeholder="What's happening? Be specific..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[100px]"
                  />
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm">
                    <Camera size={18} />
                    Add Photo
                  </button>
                  <button 
                    onClick={() => setIsReporting(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-200"
                  >
                    <Send size={18} />
                    Submit
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert Stats */}
      <div className="grid grid-cols-3 gap-3" role="region" aria-label="Alert Statistics">
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 text-center">
          <p className="text-xl font-bold text-red-700">2</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Active</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 text-center">
          <p className="text-xl font-bold text-blue-700">12</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Safe</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 text-center">
          <p className="text-xl font-bold text-slate-900">45</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Reports</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4" role="feed" aria-label="Safety Alerts Feed">
        {alerts.map((alert) => (
          <motion.article
            key={alert.id}
            whileHover={{ scale: 1.02 }}
            className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${alert.bgColor}`} aria-hidden="true">
                {alert.icon}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={12} aria-hidden="true" />
                {alert.time}
              </div>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">{alert.title}</h2>
              <div className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                <MapPin size={12} aria-hidden="true" />
                {alert.location}
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {alert.description}
            </p>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors">
                Ignore
              </button>
              <button className="flex-1 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold hover:bg-blue-800 transition-colors">
                I'm Safe
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}
