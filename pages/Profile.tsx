
import React, { useState, useEffect } from 'react';
import { User, Post, UserRole } from '../types';
import { LogOut, Settings, Grid, Bookmark, Heart, Edit3, MessageCircle, CheckCircle, Share2, Image as ImageIcon, X, Save, Camera, Coins, Gem } from 'lucide-react';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

type TabType = 'posts' | 'liked' | 'saved';

const ProfilePage: React.FC<ProfileProps> = ({ user, onLogout, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editForm, setEditForm] = useState({
    displayName: user.displayName,
    username: user.username,
    avatar: user.avatar
  });

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('db_posts') || '[]');
    setAllPosts(savedPosts);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...user, ...editForm });
    setIsEditing(false);
  };

  const userPosts = allPosts.filter(p => p.userId === user.id);
  const likedPosts = allPosts.filter(p => p.isLiked);
  const savedPostsList = allPosts.filter(p => p.isSaved);

  return (
    <div className="max-w-lg mx-auto w-full pb-32 animate-fadeIn">
      {/* Profile Header Design */}
      <div className="relative pt-12 pb-10 px-6 text-center bg-gradient-to-b from-blue-600/10 via-slate-950 to-slate-950 rounded-b-[4rem]">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-blue-600 blur-[40px] opacity-20 rounded-full scale-150"></div>
          <div className="relative p-1.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[3rem] shadow-2xl">
            <img src={user.avatar} className="w-32 h-32 rounded-[2.8rem] border-4 border-slate-950 object-cover" />
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute -bottom-2 -right-2 p-3 bg-blue-600 rounded-2xl border-4 border-slate-950 shadow-xl active:scale-90 transition-transform text-white"
            >
              <Edit3 size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <h2 className="text-3xl font-black text-white flex items-center justify-center gap-2">
            {user.displayName}
            {user.isVerified && <CheckCircle size={24} fill="currentColor" className="text-blue-500 shadow-blue-500/20" />}
          </h2>
          <p className="text-slate-500 text-sm font-black uppercase tracking-[0.2em]">@{user.username}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="glass p-5 rounded-3xl border border-white/5">
             <p className="text-xl font-black text-white">{user.followersCount.toLocaleString()}</p>
             <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">متابع</p>
          </div>
          <div className="glass p-5 rounded-3xl border border-white/5">
             <p className="text-xl font-black text-white">{likedPosts.length}</p>
             <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">إعجاب</p>
          </div>
          <div className="glass p-5 rounded-3xl border border-white/5">
             <p className="text-xl font-black text-white">{userPosts.length}</p>
             <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">منشور</p>
          </div>
        </div>

        <div className="flex gap-4">
           <div className="flex-1 glass p-4 rounded-2xl flex items-center justify-center gap-3 border border-yellow-500/10">
              <Coins size={18} className="text-yellow-500" />
              <span className="text-sm font-black text-white">{user.points.toLocaleString()}</span>
           </div>
           <div className="flex-1 glass p-4 rounded-2xl flex items-center justify-center gap-3 border border-blue-500/10">
              <Gem size={18} className="text-blue-500" />
              <span className="text-sm font-black text-white">{user.gems.toLocaleString()}</span>
           </div>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex px-6 border-b border-white/5">
        {[
          { id: 'posts', icon: Grid },
          { id: 'liked', icon: Heart },
          { id: 'saved', icon: Bookmark }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex-1 py-5 flex justify-center transition-all border-b-4 ${activeTab === tab.id ? 'border-blue-600 text-blue-500' : 'border-transparent text-slate-600'}`}
          >
            <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          </button>
        ))}
      </div>

      {/* Profile Content Grid */}
      <div className="grid grid-cols-3 gap-2 p-4">
        {(activeTab === 'posts' ? userPosts : activeTab === 'liked' ? likedPosts : savedPostsList).map(post => (
          <div key={post.id} className="aspect-square glass rounded-2xl overflow-hidden relative group">
            {post.mediaUrl ? (
              <img src={post.mediaUrl} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-3 text-center">
                <p className="text-[9px] font-black text-slate-500 line-clamp-3">{post.content}</p>
              </div>
            )}
            <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="text-white text-xs font-black flex items-center gap-1"><Heart size={14} fill="white" /> {post.likes}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Actions */}
      <div className="p-6 space-y-4">
        <button onClick={onLogout} className="w-full py-5 glass border-red-500/20 text-red-500 rounded-[2rem] font-black flex items-center justify-center gap-3 active:scale-95 transition-all">
          <LogOut size={20} /> تسجيل الخروج من النظام
        </button>
      </div>

      {/* Edit Modal (Redesigned) */}
      {isEditing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl animate-fadeIn">
           <div className="w-full max-w-md glass border-white/10 rounded-[3rem] p-10 space-y-8 animate-slide-up shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-white">تعديل الحساب</h3>
                <button onClick={() => setIsEditing(false)} className="p-3 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                   <div className="relative group">
                     <img src={editForm.avatar} className="w-24 h-24 rounded-[2.5rem] border-4 border-blue-600 shadow-xl object-cover" />
                     <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera size={24} className="text-white" />
                     </div>
                   </div>
                   <input 
                      type="text" 
                      value={editForm.avatar}
                      onChange={e => setEditForm({...editForm, avatar: e.target.value})}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-3 text-xs font-bold text-slate-400 focus:border-blue-500 outline-none"
                      placeholder="رابط الصورة الشخصية..."
                   />
                </div>
                <div className="space-y-4">
                   <input 
                      type="text" 
                      value={editForm.displayName}
                      onChange={e => setEditForm({...editForm, displayName: e.target.value})}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-blue-500 outline-none"
                      placeholder="الاسم المستعار"
                   />
                   <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 font-black">@</span>
                      <input 
                        type="text" 
                        value={editForm.username}
                        onChange={e => setEditForm({...editForm, username: e.target.value})}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl pr-6 pl-12 py-4 text-sm font-bold text-white focus:border-blue-500 outline-none"
                        placeholder="اسم المستخدم"
                      />
                   </div>
                </div>
                <button type="submit" className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[1.8rem] font-black shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Save size={20} /> حفظ الإعدادات
                </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
