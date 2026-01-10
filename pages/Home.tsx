
import React, { useState, useEffect } from 'react';
import { User, Post, UserRole } from '../types';
import { 
  Image, Send, Heart, MessageCircle, 
  CheckCircle, MoreHorizontal, Save, Share2, Copy, Globe, X, Plus, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  user: User;
  siteName: string;
}

const HomePage: React.FC<HomeProps> = ({ user, siteName }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postText, setPostText] = useState('');
  const [sharingPost, setSharingPost] = useState<Post | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('db_posts') || '[]');
    if (savedPosts.length === 0) {
      const welcomePost: Post = { 
        id: '1', 
        userId: 'admin', 
        username: 'إدارة ريل', 
        userAvatar: 'https://cdn-icons-png.flaticon.com/512/3670/3670151.png', 
        type: 'IMAGE', 
        content: `أهلاً بك يا ${user.displayName} في شات ريل العراقي! 💎 نحن سعداء بانضمامك إلينا. استكشف الريلز والدردشات الصوتية الآن.`, 
        likes: 1240, 
        commentsCount: 85, 
        isLiked: false, 
        isSaved: false, 
        timestamp: 'الآن', 
        isVerified: true 
      };
      setPosts([welcomePost]);
      localStorage.setItem('db_posts', JSON.stringify([welcomePost]));
    } else {
      setPosts(savedPosts);
    }
  }, [user]);

  const handlePublish = () => {
    if (!postText.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      type: 'TEXT',
      content: postText,
      likes: 0,
      commentsCount: 0,
      isLiked: false,
      isSaved: false,
      timestamp: 'الآن',
      isVerified: user.isVerified
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('db_posts', JSON.stringify(updatedPosts));
    setPostText('');
  };

  return (
    <div className="max-w-lg mx-auto w-full pb-32">
      {/* Premium Header */}
      <header className="sticky top-0 glass z-50 px-6 py-5 border-b border-white/5 flex justify-between items-center rounded-b-[2.5rem] shadow-xl">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
             <CheckCircle size={22} className="text-white" fill="currentColor" />
           </div>
           <div>
             <h1 className="text-lg font-black text-white tracking-tight leading-none">{siteName}</h1>
             <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">نسخة المحترفين</p>
           </div>
        </div>
        <button onClick={() => navigate('/chat')} className="relative p-3 bg-slate-900/50 rounded-2xl border border-white/5">
           <MessageCircle size={22} className="text-slate-200" />
           <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
        </button>
      </header>

      {/* Modern Publisher */}
      <div className="m-4 mt-6 p-6 glass rounded-[2.5rem] border border-white/10 shadow-2xl animate-slide-up">
        <div className="flex gap-4">
          <img src={user.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-600/20" />
          <textarea 
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder={`ماذا يدور في ذهنك يا ${user.displayName}؟`} 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-white resize-none placeholder:text-slate-600 pt-2"
            rows={2}
          />
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
          <div className="flex gap-2">
            <button className="p-2.5 bg-slate-800/50 text-slate-400 rounded-xl"><Image size={20} /></button>
            <button className="p-2.5 bg-slate-800/50 text-slate-400 rounded-xl"><Plus size={20} /></button>
          </div>
          <button 
            onClick={handlePublish}
            disabled={!postText.trim()}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-xl disabled:opacity-50 active:scale-95 transition-all"
          >
            نشر المنشور
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="px-4 space-y-6 mt-8">
        {posts.map(post => (
          <div key={post.id} className="glass rounded-[2.5rem] p-6 border border-white/5 shadow-2xl animate-slide-up group">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-4">
                <img src={post.userAvatar} className="w-12 h-12 rounded-[1.1rem] border-2 border-slate-900 object-cover" />
                <div>
                  <h4 className="text-[15px] font-black text-white flex items-center gap-1.5">
                    {post.username} 
                    {post.isVerified && <CheckCircle size={14} className="text-blue-500" fill="currentColor" />}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{post.timestamp}</p>
                </div>
              </div>
              <button className="p-2 text-slate-600"><MoreHorizontal size={20} /></button>
            </div>
            
            <p className="text-sm font-bold text-slate-300 leading-loose mb-5">{post.content}</p>
            
            <div className="flex gap-6 border-t border-white/5 pt-5 items-center">
               <button className="flex items-center gap-2.5 text-slate-400 hover:text-red-500">
                  <Heart size={20} className={post.isLiked ? 'text-red-500' : ''} fill={post.isLiked ? 'currentColor' : 'none'} />
                  <span className="text-xs font-black">{post.likes}</span>
               </button>
               <button className="flex items-center gap-2.5 text-slate-400 hover:text-blue-500">
                  <MessageCircle size={20} />
                  <span className="text-xs font-black">{post.commentsCount}</span>
               </button>
               <button onClick={() => setSharingPost(post)} className="flex items-center gap-2.5 text-slate-400">
                  <Share2 size={20} />
                  <span className="text-xs font-black">مشاركة</span>
               </button>
               <button className="mr-auto p-2.5 bg-slate-800/50 text-slate-400 rounded-2xl">
                 <Save size={20} fill={post.isSaved ? 'currentColor' : 'none'} />
               </button>
            </div>
          </div>
        ))}
      </div>

      {sharingPost && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 rounded-[3rem] border border-white/10 p-10 space-y-8 animate-slide-up">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white">مشاركة</h3>
              <button onClick={() => setSharingPost(null)} className="p-3 bg-slate-800 rounded-full text-slate-400"><X size={22} /></button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center gap-5 p-6 bg-slate-950 rounded-[2rem] border border-white/5">
                <div className="p-4 bg-blue-600 rounded-2xl text-white"><Copy size={24} /></div>
                <div className="text-right">
                  <p className="text-lg font-black text-white">نسخ الرابط</p>
                  <p className="text-xs text-slate-500">شارك الرابط يدوياً</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
