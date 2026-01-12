
import React, { useState, useEffect, useRef } from 'react';
import { User, LiveStream, UserRole } from '../types';
import { Radio, Users, X, Heart, Send, RefreshCw, Bell, Camera, CameraOff } from 'lucide-react';

interface LiveStreamsPageProps {
  user: User;
}

const LiveStreamsPage: React.FC<LiveStreamsPageProps> = ({ user }) => {
  const [activeStream, setActiveStream] = useState<LiveStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [notification, setNotification] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // محاكاة إشعار "بدأ بث الآن"
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification("عباس_الذهبي بدأ بثاً جديداً الآن! 🔥");
      setTimeout(() => setNotification(null), 4000);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const startBroadcast = async () => {
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode }, 
        audio: true 
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { alert("إذن الكاميرا مطلوب للبث!"); }
  };

  useEffect(() => {
    if (activeStream && activeStream.hostId === user.id) startBroadcast();
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  }, [activeStream, facingMode]);

  return (
    <div className="flex-1 bg-black min-h-screen p-6 pb-32">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] glass border-blue-500/30 p-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-slide-up w-[90%] max-w-sm">
          <div className="bg-red-600 p-2 rounded-xl animate-pulse"><Radio size={14} className="text-white" /></div>
          <p className="text-[11px] font-black text-white">{notification}</p>
        </div>
      )}

      <header className="flex justify-between items-center mb-8 bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5">
        <div>
          <h2 className="text-2xl font-black text-white">البث المباشر</h2>
          <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">تواصل حي مع العالم</p>
        </div>
        <button onClick={() => setActiveStream({ id: 'my-live', hostId: user.id, hostName: user.username, hostAvatar: user.avatar, viewerCount: 0, title: 'بثي المباشر', isLive: true })} className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl shadow-red-600/20"><Radio size={24} className="text-white" /></button>
      </header>

      {activeStream ? (
        <div className="fixed inset-0 z-[150] bg-black animate-fadeIn overflow-hidden">
          <div className="absolute inset-0">
            {activeStream.hostId === user.id ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <img src={activeStream.hostAvatar} className="w-full h-full object-cover opacity-50" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
          </div>

          <div className="absolute top-8 left-6 right-6 flex justify-between z-10">
            <div className="flex items-center gap-3 bg-black/60 p-1.5 pr-5 rounded-full border border-white/10 backdrop-blur-xl">
               <div className="text-right">
                 <p className="text-[10px] font-black text-white">{activeStream.hostName}</p>
                 <p className="text-[8px] text-blue-400 font-bold">{activeStream.viewerCount} مشاهد</p>
               </div>
               <img src={activeStream.hostAvatar} className="w-10 h-10 rounded-full border-2 border-blue-500" />
            </div>
            <div className="flex gap-2">
               {activeStream.hostId === user.id && (
                 <button onClick={() => setFacingMode(f => f === 'user' ? 'environment' : 'user')} className="p-3 bg-black/60 rounded-full border border-white/10 text-white"><RefreshCw size={20} /></button>
               )}
               <button onClick={() => setActiveStream(null)} className="p-3 bg-red-600 rounded-full text-white"><X size={20} /></button>
            </div>
          </div>

          <div className="absolute bottom-8 left-6 right-6 flex gap-3">
             <div className="flex-1 bg-black/60 backdrop-blur-xl rounded-2xl px-5 flex items-center border border-white/10">
                <input type="text" placeholder="قل شيئاً جميلاً..." className="flex-1 bg-transparent border-none text-xs text-white h-14" />
                <Send size={20} className="text-blue-500" />
             </div>
             <button className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center"><Heart size={24} fill="currentColor" /></button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-slate-900/20 h-64 rounded-[3rem] border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-700">
             <CameraOff size={48} className="mb-4" />
             <p className="text-xs font-bold">لا توجد بثوث نشطة حالياً</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStreamsPage;
