
import React, { useState, useEffect, useRef } from 'react';
import { User, Post } from '../types';
import { Heart, MessageCircle, Bookmark, Share2, MoreVertical, Music, CheckCircle } from 'lucide-react';

interface ReelsProps {
  user: User;
}

const MOCK_REELS: Post[] = [
  { id: 'r1', userId: 'u5', username: 'noor_99', userAvatar: 'https://avatar.iran.liara.run/public/girl?username=noor', type: 'REEL', content: 'أجمل إطلالة لهذا المساء ✨ #موديل #جمال', mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60', likes: 1540, commentsCount: 42, isLiked: true, isSaved: false, timestamp: '1h', isVerified: true },
  { id: 'r2', userId: 'u6', username: 'khaled_dev', userAvatar: 'https://avatar.iran.liara.run/public/boy?username=khaled', type: 'REEL', content: 'لحظات لا تنسى في العمل 💻 #برمجة #حياة', mediaUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=60', likes: 3200, commentsCount: 112, isLiked: false, isSaved: true, timestamp: '3h', isVerified: false },
  { id: 'r3', userId: 'u7', username: 'iraqi_traveler', userAvatar: 'https://avatar.iran.liara.run/public/boy?username=ali', type: 'REEL', content: 'من جبال كردستان الخلابة ⛰️🇮🇶 #العراق #سياحة', mediaUrl: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=500&auto=format&fit=crop&q=60', likes: 890, commentsCount: 15, isLiked: false, isSaved: false, timestamp: '5h', isVerified: true },
];

const ReelItem: React.FC<{ reel: Post, onToggleLike: (id: string) => void, onToggleSave: (id: string) => void }> = ({ reel, onToggleLike, onToggleSave }) => {
  const [showHeart, setShowHeart] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 15; // محاكاة مدة الفيديو بـ 15 ثانية لتطابق الأنميشن

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prev => (prev >= duration ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      if (!reel.isLiked) {
        onToggleLike(reel.id);
      }
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    setLastTap(now);
  };

  return (
    <div 
      className="h-full w-full snap-start relative flex items-center justify-center overflow-hidden"
      onClick={handleDoubleTap}
    >
      {/* Mock Video Placeholder */}
      <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
         <img src={reel.mediaUrl} className="w-full h-full object-cover" alt="Reel content" />
         <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Heart Overlay for Double Tap */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <Heart size={100} fill="white" className="text-white animate-heart-pop opacity-80" />
        </div>
      )}

      {/* Overlay UI - Bottom Shade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 pointer-events-none" />

      {/* Side Actions (TikTok Style) */}
      <div className="absolute bottom-28 left-6 flex flex-col items-center gap-7 z-20">
        <div className="flex flex-col items-center gap-1.5 group">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleLike(reel.id); }}
            className={`p-3 rounded-full transition-all active:scale-50 shadow-2xl ${reel.isLiked ? 'text-red-500 bg-red-500/10' : 'text-white bg-white/10 hover:bg-white/20 backdrop-blur-md'}`}
          >
            <Heart size={34} fill={reel.isLiked ? 'currentColor' : 'none'} className={reel.isLiked ? 'animate-bounce' : ''} />
          </button>
          <span className="text-white text-[10px] font-black drop-shadow-2xl">{reel.likes.toLocaleString()}</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all active:scale-90 shadow-2xl">
            <MessageCircle size={34} />
          </button>
          <span className="text-white text-[10px] font-black drop-shadow-2xl">{reel.commentsCount}</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleSave(reel.id); }}
            className={`p-3 rounded-full transition-all active:scale-90 shadow-2xl ${reel.isSaved ? 'text-yellow-500 bg-yellow-500/10' : 'text-white bg-white/10 hover:bg-white/20 backdrop-blur-md'}`}
          >
            <Bookmark size={34} fill={reel.isSaved ? 'currentColor' : 'none'} />
          </button>
          <span className="text-white text-[10px] font-black drop-shadow-2xl">حفظ</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all active:scale-90 shadow-2xl">
            <Share2 size={34} />
          </button>
          <span className="text-white text-[10px] font-black drop-shadow-2xl">مشاركة</span>
        </div>

        <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white">
           <MoreVertical size={24} />
        </button>
      </div>

      {/* Bottom Info (TikTok Style) */}
      <div className="absolute bottom-10 right-8 left-24 z-20 text-right space-y-4">
        <div className="flex items-center justify-end gap-3 mb-2">
          <button className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-black px-5 py-2 rounded-xl shadow-xl shadow-red-600/20 active:scale-95 transition-all">متابعة</button>
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-base drop-shadow-lg flex items-center gap-1.5">
               @{reel.username}
               {reel.isVerified && <CheckCircle size={14} fill="currentColor" className="text-blue-500" />}
            </span>
            <div className="relative p-0.5 bg-gradient-to-tr from-yellow-400 to-rose-500 rounded-2xl shadow-2xl shadow-rose-500/20">
               <img src={reel.userAvatar} className="w-12 h-12 rounded-[1.1rem] border-2 border-slate-900 object-cover" />
            </div>
          </div>
        </div>
        
        <p className="text-white text-sm font-bold leading-relaxed mb-4 line-clamp-2 drop-shadow-lg px-2">
          {reel.content}
          <span className="block mt-1.5 text-blue-400">#ريل_العراقي #ترند #اكسبلور</span>
        </p>
        
        <div className="flex items-center justify-end gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-2 px-4 shadow-2xl border border-white/10 max-w-fit ml-auto">
          <span className="text-white text-[10px] font-black truncate max-w-[140px] uppercase tracking-wider">
            الصوت الأصلي - {reel.username}
          </span>
          <div className="p-2 bg-slate-950 rounded-full animate-spin-slow">
             <Music size={14} className="text-white" />
          </div>
        </div>
      </div>

      {/* Time Display Overlay */}
      <div className="absolute bottom-3 right-6 z-40">
        <span className="text-[9px] font-black text-white/70 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm tracking-tighter tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div className="h-full bg-blue-500 animate-reel-progress origin-left"></div>
      </div>

      <style>{`
        @keyframes heart-pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes reel-progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-heart-pop {
          animation: heart-pop 0.8s ease-out forwards;
        }
        .animate-reel-progress {
          animation: reel-progress 15s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const ReelsPage: React.FC<ReelsProps> = ({ user }) => {
  const [reels, setReels] = useState(MOCK_REELS);

  const toggleLike = (id: string) => {
    setReels(prev => prev.map(r => r.id === id ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 } : r));
  };

  const toggleSave = (id: string) => {
    setReels(prev => prev.map(r => r.id === id ? { ...r, isSaved: !r.isSaved } : r));
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-scroll snap-y snap-mandatory bg-black scroll-smooth no-scrollbar">
      {reels.map(reel => (
        <ReelItem 
          key={reel.id} 
          reel={reel} 
          onToggleLike={toggleLike} 
          onToggleSave={toggleSave} 
        />
      ))}
    </div>
  );
};

export default ReelsPage;
