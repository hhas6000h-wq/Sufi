
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, Message, MicSlot } from '../types';
import { Send, Image as ImageIcon, Mic, MicOff, UserPlus, CheckCircle, Trash2, Edit3, X, VolumeX, MoreVertical, Ban, UserCheck, Shield, Crown } from 'lucide-react';

interface ChatProps {
  user: User;
  background: string;
}

const ChatPage: React.FC<ChatProps> = ({ user, background }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [micSlots, setMicSlots] = useState<MicSlot[]>([
    { id: 1, userId: 'admin_root', username: 'M7', avatar: 'https://avatar.iran.liara.run/public/boy?username=M7', isMuted: false, isSpeaking: true },
    { id: 2, userId: null, isMuted: false, isSpeaking: false },
    { id: 3, userId: null, isMuted: false, isSpeaking: false },
    { id: 4, userId: null, isMuted: false, isSpeaking: false },
  ]);
  const [isOnStage, setIsOnStage] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedUserAction, setSelectedUserAction] = useState<Message | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('db_chat_messages') || '[]');
    setMessages(savedMessages);
    
    // محاكاة نشاط المايك للأعضاء الآخرين
    const interval = setInterval(() => {
      setMicSlots(prev => prev.map(slot => {
        if (slot.userId && slot.userId !== user.id && !slot.isMuted) {
          return { ...slot, isSpeaking: Math.random() > 0.6 };
        }
        return slot;
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, [user.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      text: inputText,
      timestamp: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
      role: user.role,
      isVerified: user.isVerified
    };
    const updated = [...messages, msg].slice(-100);
    setMessages(updated);
    localStorage.setItem('db_chat_messages', JSON.stringify(updated));
    setInputText('');
  };

  const toggleStage = async () => {
    if (isOnStage) {
      micStreamRef.current?.getTracks().forEach(t => t.stop());
      setMicSlots(slots => slots.map(s => s.userId === user.id ? { ...s, userId: null } : s));
      setIsOnStage(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        const freeSlot = micSlots.find(s => !s.userId);
        if (freeSlot) {
          setMicSlots(slots => slots.map(s => s.id === freeSlot.id ? { ...s, userId: user.id, username: user.username, avatar: user.avatar, isMuted: false, isSpeaking: true } : s));
          setIsOnStage(true);
        }
      } catch (err) { alert("يجب منح إذن المايك للصعود!"); }
    }
  };

  const isAdmin = user.role === UserRole.ADMIN;

  const performAdminAction = (msg: Message, action: 'ban' | 'verify' | 'kick') => {
    const dbUsers = JSON.parse(localStorage.getItem('db_users') || '[]');
    const idx = dbUsers.findIndex((u: any) => u.id === msg.userId);
    if (idx !== -1) {
      if (action === 'ban') dbUsers[idx].isBanned = true;
      if (action === 'verify') dbUsers[idx].isVerified = !dbUsers[idx].isVerified;
      localStorage.setItem('db_users', JSON.stringify(dbUsers));
      alert(`تم تنفيذ ${action} على ${msg.username}`);
    }
    setSelectedUserAction(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-black overflow-hidden relative">
      {/* خلفية تلغرام الثابتة */}
      <div className="absolute inset-0 opacity-15 pointer-events-none z-0" style={{ backgroundImage: `url(${background})`, backgroundSize: 'contain' }}></div>

      {/* منصة الصوت */}
      <div className="glass p-5 z-40 rounded-b-[2.5rem] shadow-2xl border-b border-white/5">
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">المسرح المباشر</span>
          </div>
          <button onClick={toggleStage} className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all ${isOnStage ? 'bg-red-600' : 'bg-blue-600'} text-white shadow-lg`}>
            {isOnStage ? 'مغادرة المسرح' : 'صعود المنصة'}
          </button>
        </div>
        
        <div className="flex justify-around">
          {micSlots.map(slot => (
            <div key={slot.id} className="flex flex-col items-center gap-2">
              <div className="relative">
                {slot.userId && slot.isSpeaking && !slot.isMuted && <div className="voice-ring"></div>}
                <div className={`w-14 h-14 rounded-2xl border-2 overflow-hidden transition-all ${slot.userId ? (slot.isSpeaking ? 'border-blue-500 scale-105' : 'border-slate-800') : 'border-dashed border-slate-800'}`}>
                  {slot.userId ? <img src={slot.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-900/40 flex items-center justify-center text-slate-800"><UserPlus size={18} /></div>}
                </div>
                {slot.userId && (
                  <div className="absolute -bottom-1 -right-1 bg-black p-1 rounded-full border border-white/10">
                    {slot.isMuted ? <MicOff size={8} className="text-red-500" /> : <Mic size={8} className="text-blue-500" />}
                  </div>
                )}
              </div>
              <span className="text-[8px] font-black text-slate-400 truncate w-12 text-center">{slot.username || 'خالٍ'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* الرسائل */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar z-10 pb-32">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 animate-slide-up ${msg.userId === user.id ? 'flex-row-reverse' : ''}`}>
            <img src={msg.avatar} onClick={() => isAdmin && setSelectedUserAction(msg)} className="w-8 h-8 rounded-xl object-cover border border-white/5 cursor-pointer" />
            <div className={`max-w-[75%] ${msg.userId === user.id ? 'items-end' : ''} flex flex-col`}>
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className={`text-[9px] font-black ${msg.role === UserRole.ADMIN ? 'text-yellow-500' : 'text-blue-400'}`}>{msg.username}</span>
                {msg.isVerified && <CheckCircle size={10} className="text-blue-500" fill="currentColor" />}
              </div>
              <div className={`p-3 rounded-2xl text-xs font-bold shadow-xl ${msg.userId === user.id ? 'bg-blue-600 text-white rounded-br-none' : 'glass text-slate-100 rounded-bl-none'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* منطقة الإدخال المنخفضة */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-10 glass border-t border-white/5 z-50 chat-input-area">
        <div className="flex items-center gap-3 bg-slate-900/80 rounded-[2rem] px-5 py-3 border border-white/10 shadow-2xl">
          {isOnStage && (
            <button onClick={() => setIsMuted(!isMuted)} className={`p-2 rounded-xl ${isMuted ? 'text-red-500' : 'text-blue-500'}`}>
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}
          <input 
            type="text" 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="اكتب رسالتك هنا..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-white h-10"
          />
          <button onClick={handleSendMessage} className={`p-3 rounded-2xl transition-all ${inputText.trim() ? 'bg-blue-600 text-white scale-105' : 'text-slate-700'}`}>
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* قائمة خيارات الإدارة */}
      {selectedUserAction && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="glass w-full max-w-xs rounded-[2.5rem] p-8 space-y-4 animate-slide-up">
            <div className="text-center pb-4 border-b border-white/5">
              <img src={selectedUserAction.avatar} className="w-16 h-16 rounded-2xl mx-auto mb-2 border-2 border-blue-600" />
              <p className="text-sm font-black text-white">{selectedUserAction.username}</p>
            </div>
            <button onClick={() => performAdminAction(selectedUserAction, 'verify')} className="w-full py-3 bg-blue-600/10 text-blue-500 rounded-xl text-[10px] font-black flex items-center justify-center gap-2"><UserCheck size={14} /> توثيق / إلغاء</button>
            <button onClick={() => performAdminAction(selectedUserAction, 'ban')} className="w-full py-3 bg-red-600/10 text-red-500 rounded-xl text-[10px] font-black flex items-center justify-center gap-2"><Ban size={14} /> حظر العضو</button>
            <button onClick={() => setSelectedUserAction(null)} className="w-full py-3 text-slate-500 text-[10px] font-black">إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
