
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, DirectMessage, UserRole } from '../types';
import { Send, Image as ImageIcon, ChevronLeft, CheckCircle, MoreVertical, Trash2, Mic } from 'lucide-react';

interface PrivateChatProps {
  user: User;
}

const MOCK_MESSAGES: DirectMessage[] = [
  { id: 'dm1', userId: 'u2', username: 'سارة', avatar: 'https://avatar.iran.liara.run/public/girl?username=sara', receiverId: 'admin_root', text: 'أهلاً بك! كيف يمكنني مساعدتك؟', timestamp: '12:00', role: UserRole.MEMBER },
  { id: 'dm2', userId: 'admin_root', username: 'M7', avatar: 'https://avatar.iran.liara.run/public/boy?username=M7', receiverId: 'u2', text: 'شكراً سارة، كل شيء يعمل بشكل رائع 👍', timestamp: '12:05', role: UserRole.ADMIN },
];

const PrivateChatPage: React.FC<PrivateChatProps> = ({ user }) => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<DirectMessage[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage: DirectMessage = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      receiverId: userId || '',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      role: user.role
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white animate-fadeIn">
      {/* Header */}
      <header className="p-6 bg-slate-900/80 backdrop-blur-3xl border-b border-blue-900/10 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-xl transition-all">
             <ChevronLeft size={24} className="rotate-180" />
          </button>
          <div className="flex items-center gap-3">
             <div className="relative">
               <img src="https://avatar.iran.liara.run/public/girl?username=sara" className="w-11 h-11 rounded-2xl border-2 border-slate-800" />
               <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-slate-900 shadow-lg"></div>
             </div>
             <div>
                <h2 className="font-black text-[15px] flex items-center gap-1.5">
                  سارة
                  <CheckCircle size={12} fill="currentColor" className="text-blue-500" />
                </h2>
                <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">متصل الآن</p>
             </div>
          </div>
        </div>
        <button className="p-2 text-slate-500 hover:text-white rounded-xl transition-all">
           <MoreVertical size={22} />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="text-center py-8">
           <div className="inline-block px-5 py-2 bg-slate-900/50 rounded-2xl border border-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              تم تشفير المحادثة من طرف إلى طرف 🔐
           </div>
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 animate-slideIn ${msg.userId === user.id ? 'flex-row-reverse' : ''}`}>
             <img src={msg.avatar} className="w-9 h-9 rounded-[1rem] border border-slate-800 object-cover" />
             <div className={`max-w-[75%] flex flex-col ${msg.userId === user.id ? 'items-end' : ''}`}>
                <div className={`p-4 text-sm font-bold shadow-2xl ${msg.userId === user.id ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[1.8rem] rounded-tr-none' : 'bg-slate-900/80 text-slate-100 rounded-[1.8rem] rounded-tl-none border border-slate-800'}`}>
                   {msg.text}
                </div>
                <span className="text-[8px] text-slate-600 mt-2 font-black uppercase tracking-widest">{msg.timestamp}</span>
             </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-5 bg-slate-900/50 backdrop-blur-2xl border-t border-slate-800/50 pb-24">
         <div className="bg-slate-950/80 rounded-[2rem] p-3 flex items-center gap-3 border border-slate-800/80 focus-within:border-blue-500/30 transition-all">
            <button className="p-2 text-slate-500 hover:text-blue-500 rounded-xl transition-all">
               <ImageIcon size={22} />
            </button>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="اكتب رسالة سرية..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-white placeholder:text-slate-700"
            />
            <div className="flex gap-1">
               <button className="p-2 text-slate-500 hover:text-blue-500 rounded-xl transition-all">
                  <Mic size={22} />
               </button>
               <button 
                  disabled={!inputText.trim()}
                  onClick={handleSendMessage}
                  className={`p-2.5 rounded-2xl transition-all ${inputText.trim() ? 'bg-blue-600 text-white shadow-xl scale-110 rotate-12' : 'text-slate-800 cursor-not-allowed'}`}
               >
                  <Send size={22} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PrivateChatPage;
