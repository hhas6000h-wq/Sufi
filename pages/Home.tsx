
import React, { useState, useEffect, useRef } from 'react';
import { User, Post, Comment } from '../types';
import { 
  Image as ImageIcon, Heart, MessageCircle, 
  CheckCircle, MoreHorizontal, Share2, X, Edit3, Trash2, Send, UserPlus, UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  user: User;
  siteName: string;
  onUpdateUser: (u: User) => void;
}

const HomePage: React.FC<HomeProps> = ({ user, siteName, onUpdateUser }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('db_posts') || '[]');
    setPosts(savedPosts);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    if (!postText.trim() && !selectedImage) return;
    
    const dbPosts = JSON.parse(localStorage.getItem('db_posts') || '[]');
    
    if (editingPostId) {
      const updated = dbPosts.map((p: Post) => p.id === editingPostId ? { ...p, content: postText, mediaUrl: selectedImage || p.mediaUrl } : p);
      setPosts(updated);
      localStorage.setItem('db_posts', JSON.stringify(updated));
      setEditingPostId(null);
    } else {
      const newPost: Post = {
        id: Date.now().toString(),
        userId: user.id,
        username: user.username,
        userAvatar: user.avatar,
        type: selectedImage ? 'IMAGE' : 'TEXT',
        content: postText,
        mediaUrl: selectedImage || undefined,
        likes: 0,
        comments: [],
        isLiked: false,
        isSaved: false,
        timestamp: new Date().toLocaleString('ar-IQ'),
        isVerified: user.isVerified
      };
      const updated = [newPost, ...dbPosts];
      setPosts(updated);
      localStorage.setItem('db_posts', JSON.stringify(updated));
    }
    
    setPostText('');
    setSelectedImage(null);
  };

  const handleDeletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    localStorage.setItem('db_posts', JSON.stringify(updated));
  };

  const toggleLike = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const isNowLiked = !p.isLiked;
        return { ...p, isLiked: isNowLiked, likes: isNowLiked ? p.likes + 1 : p.likes - 1 };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem('db_posts', JSON.stringify(updated));
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      text: commentText,
      timestamp: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })
    };
    const updated = posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p);
    setPosts(updated);
    localStorage.setItem('db_posts', JSON.stringify(updated));
    setCommentText('');
  };

  const handleToggleFollow = (targetId: string) => {
    const isFollowing = user.followingList.includes(targetId);
    let newList: string[];
    
    if (isFollowing) {
      newList = user.followingList.filter(id => id !== targetId);
    } else {
      newList = [...user.followingList, targetId];
    }
    
    onUpdateUser({ 
      ...user, 
      followingList: newList, 
      followingCount: newList.length 
    });
  };

  return (
    <div className="max-w-lg mx-auto w-full pb-32 bg-black min-h-screen">
      <header className="sticky top-0 bg-black/90 backdrop-blur-xl z-50 px-6 py-5 border-b border-white/5 flex justify-between items-center rounded-b-[2.5rem] shadow-xl">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
             <CheckCircle size={22} className="text-white" fill="currentColor" />
           </div>
           <div>
             <h1 className="text-lg font-black text-white tracking-tight leading-none">{siteName}</h1>
             <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">تواصل ملكي داكن</p>
           </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-left bg-slate-900/50 px-4 py-2 rounded-2xl border border-white/5">
            <p className="text-[10px] font-black text-white leading-none">{user.points.toLocaleString()} 💰</p>
          </div>
          <button onClick={() => navigate('/chat')} className="relative p-3 bg-slate-900/50 rounded-2xl border border-white/5 shadow-inner">
             <MessageCircle size={22} className="text-slate-200" />
             <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
          </button>
        </div>
      </header>

      {/* الناشر */}
      <div className="m-4 mt-6 p-6 bg-[#050505] rounded-[2.5rem] border border-white/5 shadow-2xl animate-slide-up">
        <div className="flex gap-4">
          <img src={user.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-900 shadow-xl" />
          <div className="flex-1">
            <textarea 
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder={editingPostId ? "تعديل المنشور..." : `ما الجديد يا ${user.displayName}؟`} 
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-white resize-none placeholder:text-slate-800 pt-2"
              rows={2}
            />
            {selectedImage && (
              <div className="relative mt-4 rounded-2xl overflow-hidden border border-white/5">
                <img src={selectedImage} className="w-full h-48 object-cover" />
                <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white backdrop-blur-md"><X size={16} /></button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
          <div className="flex gap-2">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-slate-900/50 text-blue-500 rounded-2xl hover:bg-blue-600/10"><ImageIcon size={22} /></button>
          </div>
          <button 
            onClick={handlePublish}
            disabled={!postText.trim() && !selectedImage}
            className="bg-blue-600 text-white px-10 py-3.5 rounded-2xl text-xs font-black shadow-xl disabled:opacity-30 active:scale-95 transition-all"
          >
            {editingPostId ? 'تحديث' : 'نشر'}
          </button>
        </div>
      </div>

      {/* الخلاصة */}
      <div className="px-4 space-y-6 mt-8">
        {posts.map(post => {
          const isFollowing = user.followingList.includes(post.userId);
          return (
            <div key={post.id} className="bg-[#050505] rounded-[2.5rem] border border-white/5 shadow-2xl animate-slide-up overflow-hidden">
              <div className="p-6 pb-4 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <img src={post.userAvatar} className="w-12 h-12 rounded-[1.2rem] border-2 border-slate-900 object-cover shadow-lg" />
                  <div>
                    <h4 className="text-[15px] font-black text-white flex items-center gap-1.5">
                      {post.username} 
                      {post.isVerified && <CheckCircle size={14} className="text-blue-500" fill="currentColor" />}
                    </h4>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{post.timestamp}</p>
                  </div>
                  {post.userId !== user.id && (
                    <button 
                      onClick={() => handleToggleFollow(post.userId)}
                      className={`mr-2 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 transition-all ${isFollowing ? 'bg-slate-900 text-slate-600' : 'bg-blue-600 text-white'}`}
                    >
                      {isFollowing ? <UserCheck size={12} /> : <UserPlus size={12} />}
                      {isFollowing ? 'متابع' : 'متابعة'}
                    </button>
                  )}
                </div>
                {post.userId === user.id && (
                  <div className="flex gap-1">
                    <button onClick={() => {setEditingPostId(post.id); setPostText(post.content); setSelectedImage(post.mediaUrl || null); window.scrollTo({top: 0, behavior: 'smooth'});}} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-xl"><Edit3 size={18} /></button>
                    <button onClick={() => handleDeletePost(post.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 size={18} /></button>
                  </div>
                )}
              </div>
              
              <div className="px-6 pb-4">
                <p className="text-[15px] font-bold text-slate-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </div>

              {post.mediaUrl && (
                <div className="px-2 pb-2">
                  <img src={post.mediaUrl} className="w-full rounded-[2rem] object-cover max-h-96" />
                </div>
              )}
              
              <div className="px-6 py-5 flex gap-6 border-t border-white/5 items-center">
                 <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${post.isLiked ? 'bg-red-500/10 text-red-500' : 'text-slate-600 hover:text-red-500'}`}>
                    <Heart size={22} fill={post.isLiked ? 'currentColor' : 'none'} />
                    <span className="text-xs font-black">{post.likes}</span>
                 </button>

                 <button onClick={() => setCommentingPostId(commentingPostId === post.id ? null : post.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${commentingPostId === post.id ? 'bg-blue-500/10 text-blue-500' : 'text-slate-600 hover:text-blue-500'}`}>
                    <MessageCircle size={22} />
                    <span className="text-xs font-black">{post.comments.length}</span>
                 </button>

                 <button className="p-2.5 text-slate-600 mr-auto hover:text-white"><Share2 size={22} /></button>
              </div>

              {commentingPostId === post.id && (
                <div className="bg-black/50 p-6 border-t border-white/5 space-y-4 animate-fadeIn">
                  <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar">
                    {post.comments.map(c => (
                      <div key={c.id} className="flex gap-3">
                        <img src={c.userAvatar} className="w-8 h-8 rounded-xl object-cover" />
                        <div className="flex-1 bg-slate-900/30 p-3 rounded-2xl rounded-tr-none border border-white/5">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-black text-blue-400">{c.username}</span>
                            <span className="text-[8px] text-slate-700">{c.timestamp}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-200">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <input 
                      type="text" 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="اكتب تعليقاً..."
                      className="flex-1 bg-black border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-blue-500 shadow-inner"
                    />
                    <button onClick={() => handleAddComment(post.id)} className="p-2 bg-blue-600 text-white rounded-xl active:scale-95 transition-all"><Send size={18} /></button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
