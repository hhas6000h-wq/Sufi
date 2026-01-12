
import React, { useState, useEffect, useRef } from 'react';
import { User, Post, UserRole } from '../types';
import { LogOut, Settings, Edit3, CheckCircle, Save, Camera, Coins, Gem, X, Heart, MessageCircle } from 'lucide-react';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

const ProfilePage: React.FC<ProfileProps> = ({ user, onLogout, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editForm, setEditForm] = useState({
    displayName: user.displayName,
    username: user.username,
    avatar: user.avatar
  });

  useEffect(() => {
    const allPosts = JSON.parse(localStorage.getItem('db_posts') || '[]');
    const myPosts = allPosts.filter((p: Post) => p.userId === user.id);
    setUserPosts(myPosts);
  }, [user.id]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditForm({ ...editForm, avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...user, ...editForm });
    setIsEditing(false);
  };

  return (
    <div className="max-w-lg mx-auto w-full pb-32 animate-fadeIn overflow-y-auto no-scrollbar">
      <div className="relative pt-12 pb-6 px-6 text-center bg-gradient-to-b from-blue-600/10 via-slate-950 to-slate-950 rounded-b-[4rem]">
        <div className="relative inline-block mb-4">
          <div className="relative p-1 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[3rem] shadow-2xl">
            <img src={user.avatar} className="w-28 h-28 rounded-[2.8rem] border-4 border-slate-950 object-cover" />
            <button onClick={() => setIsEditing(true)} className="absolute -bottom-1 -right-1 p-2.5 bg-blue-600 rounded-2xl border-4 border-slate-950 shadow-xl text-white"><Camera size={16} /></button>
          </div>
        </div>

        <div className="space-y-1 mb-6">
          <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
            {user.displayName}
            {user.isVerified && <CheckCircle size={20} fill="currentColor" className="text-blue-500" />}
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">@{user.username}</p>
        </div>

        <div className="flex justify-center gap-12 mb-6">
           <div className="text-center">
             <p className="text-xl font-black text-white">{user.followersCount}</p>
             <p className="text-[8px] text-slate-500 font-bold uppercase">متابع</p>
           </div>
           <div className="text-center">
             <p className="text-xl font-black text-white">{user.followingCount}</p>
             <p className="text-[8px] text-slate-500 font-bold uppercase">يتابع</p>
           </div>
           <div className="text-center">
             <p className="text-xl font-black text-white">{userPosts.length}</p>
             <p className="text-[8px] text-slate-500 font-bold uppercase">منشور</p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
           <div className="glass p-4 rounded-3xl flex items-center justify-center gap-3 border border-yellow-500/10">
              <Coins size={20} className="text-yellow-500" />
              <div>
                <p className="text-lg font-black text-white">{user.points}</p>
                <p className="text-[7px] text-slate-500 font-bold uppercase">نقاط ذهبية</p>
              </div>
           </div>
           <div className="glass p-4 rounded-3xl flex items-center justify-center gap-3 border-blue-500/10">
              <Gem size={20} className="text-blue-500" />
              <div>
                <p className="text-lg font-black text-white">{user.gems}</p>
                <p className="text-[7px] text-slate-500 font-bold uppercase">جواهر</p>
              </div>
           </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">منشوراتي</h3>
        <div className="grid grid-cols-2 gap-3">
          {userPosts.length > 0 ? userPosts.map(p => (
            <div key={p.id} className="glass rounded-2xl overflow-hidden aspect-square relative group">
              {p.mediaUrl ? (
                <img src={p.mediaUrl} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4 text-[10px] font-bold text-slate-400 text-center">{p.content}</div>
              )}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1 text-white text-xs font-black"><Heart size={14} fill="currentColor" /> {p.likes}</div>
                <div className="flex items-center gap-1 text-white text-xs font-black"><MessageCircle size={14} fill="currentColor" /> {p.comments.length}</div>
              </div>
            </div>
          )) : (
            <div className="col-span-2 py-12 text-center text-slate-600 text-xs font-bold uppercase tracking-widest">لا توجد منشورات حتى الآن</div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-3">
        <button onClick={() => setIsEditing(true)} className="w-full py-4 glass text-xs text-white rounded-[1.5rem] font-black flex items-center justify-center gap-2 transition-all active:scale-95">
          <Settings size={18} /> تعديل الحساب
        </button>
        <button onClick={onLogout} className="w-full py-4 bg-red-600/10 text-xs text-red-500 border border-red-500/20 rounded-[1.5rem] font-black flex items-center justify-center gap-2 transition-all active:scale-95">
          <LogOut size={18} /> تسجيل الخروج
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/98 backdrop-blur-2xl animate-fadeIn">
           <div className="w-full max-w-md glass border-white/10 rounded-[3rem] p-8 space-y-6 shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-white">إعدادات الملف الشخصي</h3>
                <button onClick={() => setIsEditing(false)} className="p-2 bg-slate-800 rounded-full text-slate-400"><X size={18} /></button>
              </div>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                   <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                     <img src={editForm.avatar} className="w-24 h-24 rounded-[2.5rem] border-4 border-blue-600 shadow-2xl object-cover" />
                     <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><Camera size={24} className="text-white" /></div>
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="space-y-1">
                     <label className="text-[10px] text-slate-500 font-black uppercase px-2">الاسم المعروض</label>
                     <input type="text" value={editForm.displayName} onChange={e => setEditForm({...editForm, displayName: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-blue-500 outline-none" />
                   </div>
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"><Save size={18} /> حفظ التغييرات</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
