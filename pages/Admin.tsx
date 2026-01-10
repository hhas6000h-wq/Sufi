
import React, { useState } from 'react';
import { User, UserRole, SiteSettings } from '../types';
import { 
  Users, Shield, MessageSquare, Layout, CheckCircle, 
  Coins, Gem, Save, Edit3, X, UserPlus, TrendingUp, Trash2, Ban
} from 'lucide-react';

interface AdminProps {
  user: User;
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

const MOCK_USERS: User[] = [
  { id: 'admin_root', username: 'M7', displayName: 'الأدمن الرئيسي', avatar: 'https://avatar.iran.liara.run/public/boy?username=M7', role: UserRole.ADMIN, isFollowing: false, isMuted: false, isBanned: false, isVerified: true, points: 99999, gems: 9999, followersCount: 1500000, followingCount: 0 },
  { id: 'u2', username: 'sara_vip', displayName: 'سارة', avatar: 'https://avatar.iran.liara.run/public/girl?username=sara', role: UserRole.MODERATOR, isFollowing: false, isMuted: false, isBanned: false, isVerified: true, points: 1500, gems: 150, followersCount: 450, followingCount: 120 }
];

const AdminPage: React.FC<AdminProps> = ({ user, settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'site'>('site');
  const [siteForm, setSiteForm] = useState(settings);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [boostAmount, setBoostAmount] = useState(1000);

  const saveSettings = () => {
    onUpdateSettings(siteForm);
    alert('تم حفظ إعدادات الموقع الجديد بنجاح!');
  };

  const boostFollowers = () => {
    if(editingUser) {
      alert(`تم بنجاح إضافة ${boostAmount} متابع حقيقي لحساب ${editingUser.username}`);
      setEditingUser(null);
    }
  };

  return (
    <div className="p-6 pb-24 space-y-8 animate-fadeIn max-w-2xl mx-auto">
      <header className="flex justify-between items-center bg-slate-900/60 p-8 rounded-[3rem] border border-blue-600/20 shadow-2xl">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">لوحة القوة</h1>
          <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">أهلاً بك يا M7</p>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl rotate-3">
           <Shield size={32} className="text-white" />
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
        <button 
          onClick={() => setActiveTab('site')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl transition-all font-black text-xs uppercase ${activeTab === 'site' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
        >
          <Layout size={18} /> تخصيص الموقع
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl transition-all font-black text-xs uppercase ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
        >
          <Users size={18} /> إدارة الأعضاء
        </button>
      </div>

      {activeTab === 'site' ? (
        <div className="bg-slate-900/50 rounded-[3rem] border border-slate-800 p-10 space-y-8 shadow-2xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-1">إسم المنصة</label>
              <input 
                type="text" 
                value={siteForm.name}
                onChange={e => setSiteForm({...siteForm, name: e.target.value})}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-1">رابط الأيقونة (URL)</label>
              <input 
                type="text" 
                value={siteForm.iconUrl}
                onChange={e => setSiteForm({...siteForm, iconUrl: e.target.value})}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-white text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>
          <button 
            onClick={saveSettings}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-2xl transition-all"
          >
            <Save size={20} /> تحديث النظام
          </button>
        </div>
      ) : (
        <div className="bg-slate-900/50 rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-xl font-black">إدارة الحسابات</h3>
            <span className="text-[10px] bg-blue-600/20 px-4 py-1.5 rounded-full text-blue-400 font-black uppercase tracking-widest">نشط الآن</span>
          </div>
          <div className="divide-y divide-slate-800/50">
            {MOCK_USERS.map(u => (
              <div key={u.id} className="p-8 hover:bg-blue-600/5 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <img src={u.avatar} className="w-16 h-16 rounded-2xl border-2 border-slate-800 shadow-xl" />
                      {u.isVerified && <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1 border-2 border-slate-900"><CheckCircle size={14} className="text-white" fill="currentColor" /></div>}
                    </div>
                    <div>
                      <h4 className="font-black text-white text-lg flex items-center gap-2">{u.username}</h4>
                      <div className="flex gap-4 mt-1">
                         <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5"><Coins size={12} className="text-yellow-500" /> {u.points}</span>
                         <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5"><Users size={12} className="text-blue-500" /> {u.followersCount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingUser(u)} className="p-4 bg-slate-950 hover:bg-blue-600 text-slate-500 hover:text-white rounded-2xl transition-all"><Edit3 size={20} /></button>
                    <button className="p-4 bg-slate-950 hover:bg-red-600 text-slate-500 hover:text-white rounded-2xl transition-all"><Trash2 size={20} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 w-full max-w-md rounded-[3.5rem] border border-blue-900/20 p-10 space-y-8 animate-scaleIn shadow-2xl">
             <div className="flex justify-between items-center">
               <h3 className="text-xl font-black">تعديل: {editingUser.username}</h3>
               <button onClick={() => setEditingUser(null)} className="p-3 hover:bg-slate-800 rounded-full"><X /></button>
             </div>
             <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-2"><UserPlus size={14} /> زيادة متابعين وهميين</label>
                 <div className="flex gap-3">
                   <input 
                    type="number" 
                    value={boostAmount} 
                    onChange={e => setBoostAmount(parseInt(e.target.value))}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 text-white font-black outline-none" 
                   />
                   <button onClick={boostFollowers} className="bg-blue-600 text-white px-6 rounded-xl font-black text-xs active:scale-95 transition-all">زيادة</button>
                 </div>
               </div>
               <button className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 text-white font-black rounded-[1.5rem] shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                 <CheckCircle size={20} fill="currentColor" /> توثيق الحساب بالعلامة الزرقاء
               </button>
               <div className="grid grid-cols-2 gap-4">
                 <button className="py-4.5 bg-slate-950 border border-red-900/30 text-red-500 font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all text-xs">حظر نهائي</button>
                 <button className="py-4.5 bg-slate-950 border border-slate-800 text-slate-400 font-black rounded-2xl hover:bg-slate-800 transition-all text-xs">حفظ التغييرات</button>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
