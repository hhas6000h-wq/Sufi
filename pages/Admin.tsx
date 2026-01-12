
import React, { useState, useEffect } from 'react';
import { User, UserRole, SiteSettings } from '../types';
import { Shield, Layout, Save, Edit3, X, Ban, UserCheck, ShieldAlert, ImageIcon, Coins, Users, CheckCircle } from 'lucide-react';

const AdminPage: React.FC<{ user: User, settings: SiteSettings, onUpdateSettings: (s: SiteSettings) => void }> = ({ user, settings, onUpdateSettings }) => {
  const [dbUsers, setDbUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [bgInput, setBgInput] = useState(settings.chatBackground);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('db_users') || '[]');
    setDbUsers(saved);
  }, []);

  const handleUpdateUser = (updates: Partial<User>) => {
    if (!editingUser) return;
    const updatedUsers = dbUsers.map(u => u.id === editingUser.id ? { ...u, ...updates } : u);
    setDbUsers(updatedUsers);
    localStorage.setItem('db_users', JSON.stringify(updatedUsers));
    alert("تم تحديث بيانات العضو!");
  };

  return (
    <div className="p-6 pb-32 max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <header className="bg-gradient-to-tr from-slate-900 to-black p-8 rounded-[3rem] border border-blue-600/20 shadow-2xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">إدارة النظام الملكي</h1>
          <p className="text-[10px] text-blue-500 font-black uppercase mt-1">المدير: {user.displayName}</p>
        </div>
        <ShieldAlert size={40} className="text-blue-600 animate-pulse" />
      </header>

      {/* إعدادات المنصة */}
      <div className="glass p-8 rounded-[3rem] border-white/5 space-y-6">
        <h3 className="text-xs font-black text-slate-500 uppercase flex items-center gap-2"><ImageIcon size={16} /> مظهر الدردشة</h3>
        <input type="text" value={bgInput} onChange={e => setBgInput(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-xs font-bold text-white" placeholder="رابط خلفية الدردشة (URL)" />
        <button onClick={() => { onUpdateSettings({ ...settings, chatBackground: bgInput }); alert("تم تغيير الخلفية بنجاح!"); }} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2"><Save size={18} /> حفظ إعدادات المظهر</button>
      </div>

      {/* قائمة الأعضاء */}
      <div className="glass rounded-[3rem] border-white/5 overflow-hidden">
        <div className="p-6 bg-white/5 border-b border-white/5 flex items-center gap-2">
          <Users size={18} className="text-blue-500" />
          <h3 className="text-xs font-black text-white">قاعدة بيانات الأعضاء ({dbUsers.length})</h3>
        </div>
        <div className="divide-y divide-white/5 max-h-96 overflow-y-auto no-scrollbar">
          {dbUsers.map(u => (
            <div key={u.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-all">
              <div className="flex items-center gap-4">
                <img src={u.avatar} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                <div>
                  <p className="text-xs font-black text-white">{u.username} {u.isVerified && <CheckCircle size={10} className="text-blue-500 inline ml-1" />}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">{u.role} • {u.points} نقطة</p>
                </div>
              </div>
              <button onClick={() => setEditingUser(u)} className="p-2 text-slate-500 hover:text-blue-500"><Edit3 size={18} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* نافذة تعديل العضو */}
      {editingUser && (
        <div className="fixed inset-0 z-[250] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl">
           <div className="glass w-full max-w-md rounded-[3rem] p-10 space-y-6 animate-slide-up border-white/10">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-white">تعديل حساب: {editingUser.username}</h3>
                 <button onClick={() => setEditingUser(null)}><X size={20} className="text-slate-500" /></button>
              </div>
              <div className="space-y-4">
                 <input type="text" value={editingUser.displayName} onChange={e => setEditingUser({...editingUser, displayName: e.target.value})} className="w-full bg-black border border-white/5 rounded-xl p-4 text-xs font-bold text-white" placeholder="الاسم المستعار" />
                 <input type="text" value={editingUser.avatar} onChange={e => setEditingUser({...editingUser, avatar: e.target.value})} className="w-full bg-black border border-white/5 rounded-xl p-4 text-xs font-bold text-white" placeholder="رابط الصورة" />
                 <div className="grid grid-cols-2 gap-4">
                    <input type="number" value={editingUser.points} onChange={e => setEditingUser({...editingUser, points: parseInt(e.target.value)})} className="bg-black border border-white/5 rounded-xl p-4 text-xs font-bold text-white" placeholder="النقاط" />
                    <input type="number" value={editingUser.followersCount} onChange={e => setEditingUser({...editingUser, followersCount: parseInt(e.target.value)})} className="bg-black border border-white/5 rounded-xl p-4 text-xs font-bold text-white" placeholder="المتابعين" />
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handleUpdateUser({ isVerified: !editingUser.isVerified })} className={`flex-1 py-3 rounded-xl text-[10px] font-black ${editingUser.isVerified ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}>توثيق</button>
                    <button onClick={() => handleUpdateUser({ isBanned: !editingUser.isBanned })} className={`flex-1 py-3 rounded-xl text-[10px] font-black ${editingUser.isBanned ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-500'}`}>حظر</button>
                 </div>
              </div>
              <button onClick={() => { handleUpdateUser(editingUser); setEditingUser(null); }} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl">حفظ التغييرات النهائية</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
