
import React, { useState } from 'react';
import { User, Post } from '../types';
import { Heart, MessageCircle, Share2, Plus, X, Send, Hash, AtSign } from 'lucide-react';

const ReelsPage: React.FC<{ user: User }> = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ content: '', mediaUrl: '', hashtags: '', mentions: '' });

  const handlePublish = () => {
    if (!formData.mediaUrl) return alert("الرابط مطلوب!");
    alert("تم نشر الريلز بنجاح!");
    setShowModal(false);
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-black overflow-hidden relative">
      <div className="h-full flex items-center justify-center text-slate-800">
        <p className="text-sm font-black uppercase tracking-widest">اسحب للأعلى لمشاهدة المزيد</p>
      </div>

      <button onClick={() => setShowModal(true)} className="absolute top-8 left-8 p-4 bg-white text-black rounded-2xl shadow-2xl z-50 active:scale-95 border-4 border-black"><Plus size={28} strokeWidth={3} /></button>

      {showModal && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fadeIn">
          <div className="glass w-full max-w-md rounded-[3rem] p-10 space-y-8 border border-white/10">
             <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-white">نشر ريرز جديد</h3>
                <button onClick={() => setShowModal(false)} className="p-2 bg-slate-900 rounded-full text-slate-500"><X size={20} /></button>
             </div>
             <div className="space-y-4">
                <input type="text" value={formData.mediaUrl} onChange={e => setFormData({...formData, mediaUrl: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-xs font-bold text-white" placeholder="رابط الفيديو (URL)" />
                <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-xs font-bold text-white resize-none h-24" placeholder="اكتب وصفاً..." />
                <div className="grid grid-cols-2 gap-4">
                   <div className="relative"><Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" placeholder="هاشتاجات" className="w-full bg-slate-900 border-none rounded-2xl py-4 pl-10 pr-4 text-[10px] text-white" /></div>
                   <div className="relative"><AtSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" placeholder="منشن" className="w-full bg-slate-900 border-none rounded-2xl py-4 pl-10 pr-4 text-[10px] text-white" /></div>
                </div>
             </div>
             <button onClick={handlePublish} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black flex items-center justify-center gap-3"><Send size={20} /> نشر الآن</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReelsPage;
