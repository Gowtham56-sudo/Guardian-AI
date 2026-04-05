import { motion } from 'motion/react';
import { User, Shield, Bell, Phone, Lock, Eye, LogOut, ChevronRight, Heart, Smartphone } from 'lucide-react';

export default function AppProfile() {
  const menuItems = [
    { icon: <User size={20} aria-hidden="true" />, label: 'Personal Information', color: 'text-blue-700', bg: 'bg-blue-50' },
    { icon: <Shield size={20} aria-hidden="true" />, label: 'Emergency Contacts', color: 'text-red-700', bg: 'bg-red-50' },
    { icon: <Bell size={20} aria-hidden="true" />, label: 'Notification Settings', color: 'text-amber-800', bg: 'bg-amber-50' },
    { icon: <Smartphone size={20} aria-hidden="true" />, label: 'Wearable Integration', color: 'text-purple-800', bg: 'bg-purple-50' },
    { icon: <Lock size={20} aria-hidden="true" />, label: 'Privacy & Security', color: 'text-green-800', bg: 'bg-green-50' },
    { icon: <Eye size={20} aria-hidden="true" />, label: 'App Appearance', color: 'text-slate-700', bg: 'bg-slate-50' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col gap-8 pb-24"
    >
      <h1 className="text-2xl font-bold text-slate-900">Profile</h1>

      {/* Profile Header */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-blue-700 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-xl">
            JD
          </div>
          <button 
            aria-label="Edit Profile Picture"
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-blue-700 hover:bg-slate-50 transition-colors"
          >
            <User size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">John Doe</h2>
          <p className="text-sm text-slate-600">Guardian ID: #G-8829</p>
        </div>
      </div>

      {/* Safety Score Card */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-700 to-blue-800 p-6 text-white shadow-xl shadow-blue-200" role="region" aria-label="Safety Performance">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium opacity-90 uppercase tracking-widest">Safety Score</span>
          <Heart size={20} fill="white" aria-hidden="true" />
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold">98</span>
          <span className="text-lg opacity-90 mb-1" aria-label="out of 100">/ 100</span>
        </div>
        <p className="mt-4 text-xs opacity-90 leading-relaxed">
          Your safety score is excellent. You've shared your trip 12 times this week and updated your emergency contacts recently.
        </p>
      </div>

      {/* Trusted Contacts Section */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Trusted Contacts</h2>
          <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
            + Add New
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Dad', phone: '+1 (555) 000-1234', relation: 'Father' },
            { name: 'Mom', phone: '+1 (555) 000-5678', relation: 'Mother' }
          ].map((contact, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                  {contact.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{contact.name}</p>
                  <p className="text-[10px] text-slate-500">{contact.relation} • {contact.phone}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-red-500 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Wearable Status */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Smartphone size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Guardian Watch</p>
            <p className="text-xs text-green-600 font-medium">Connected • 85% Battery</p>
          </div>
        </div>
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
      </div>

      {/* Menu List */}
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
                {item.icon}
              </div>
              <span className="font-semibold text-slate-700">{item.label}</span>
            </div>
            <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-700 font-bold hover:bg-red-100 transition-colors">
        <LogOut size={20} aria-hidden="true" />
        Logout
      </button>
    </motion.div>
  );
}
