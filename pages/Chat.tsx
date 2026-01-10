
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, Message, MicSlot } from '../types';
import { Send, Image as ImageIcon, Mic, MicOff, UserPlus, CheckCircle, Trash2, VolumeX, ShieldCheck, MoreHorizontal } from 'lucide-react';

interface ChatProps {
  user: User;
}

const INITIAL_MIC_SLOTS: MicSlot[] = [
  { id: 1, userId: 'admin_root', username: 'M7', avatar: 'https://avatar.iran.liara.run/public/boy?username=M7', isMuted: false, isSpeaking: false, status: 'connected' },
  { id: 2, userId: null, isMuted: false, isSpeaking: false },
  { id: 3, userId: null, isMuted: false, isSpeaking: false },
  { id: 4, userId: null, isMuted: false, isSpeaking: false },
  { id: 5, userId: null, isMuted: false, isSpeaking: false },
];

const ChatPage: React.FC<ChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [micSlots, setMicSlots] = useState<MicSlot[]>(INITIAL_MIC_SLOTS);
  const [isOnStage, setIsOnStage] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('db_chat_messages') || '[]');
    setMessages(savedMessages);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startAudioMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      analyser.fftSize = 256;
      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const average = sum / dataArray.length;
        const speaking = average > 25;

        setMicSlots(slots => slots.map(s => 
          s.userId === user.id ? { ...s, isSpeaking: speaking && !isMuted } : s
        ));
        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };
      checkVolume();
    } catch (err) {
      alert("يرجى تفعيل الميكروفون للتحدث.");
      toggleStage();
    }
  };

  const stopAudioMonitoring = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
  };

  const toggleStage = () => {
    if (isOnStage) {
      stopAudioMonitoring();
      setMicSlots(slots => slots.map(s => s.userId === user.id ? { ...s, userId: null, isSpeaking: false } : s));
      setIsOnStage(false);
      setIsMuted(false);
    } else {
      const freeIdx = micSlots.findIndex(s => s.userId === null);
      if (freeIdx !== -1) {
        const newSlots = [...micSlots];
        newSlots[freeIdx] = { ...micSlots[freeIdx], userId: user.id, username: user.username, avatar: user.avatar, status: 'connected' };
        setMicSlots(newSlots);
        setIsOnStage(true);
        startAudioMonitoring();
      }
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      role: user.role,
      isVerified: user.isVerified
    };
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem('db_chat_messages', JSON.stringify(updated));
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-950 overflow-hidden">
      {/* Premium Mic Stage */}
      <div className="glass border-b border-white/5 p-6 shadow-2xl z-40 rounded-b-[3rem]">
        <div className="flex justify-between items-center mb-8 px-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              <h2 className="text-sm font-black text-white uppercase tracking-widest">المجلس العراقي المباشر</h2>
            </div>
            <p className="text-[10px] text-slate-500 font-bold mt-1">كشف صوتي متطور مفعل</p>
          </div>
          
          <div className="flex gap-2">
            {isOnStage && (
              <button 
                onClick={() => {
                  const newState = !isMuted;
                  setIsMuted(newState);
                  if (streamRef.current) streamRef.current.getAudioTracks()[0].enabled = !newState;
                  setMicSlots(slots => slots.map(s => s.userId === user.id ? { ...s, isMuted: newState } : s));
                }}
                className={`p-3 rounded-2xl transition-all shadow-lg ${isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-blue-600/20 text-blue-500 border border-blue-600/30'}`}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            )}
            <button 
              onClick={toggleStage}
              className={`text-[11px] font-black px-8 py-3 rounded-2xl transition-all shadow-xl ${isOnStage ? 'bg-red-600 text-white shadow-red-600/20' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 active:scale-95'}`}
            >
              {isOnStage ? 'مغادرة المنصة' : 'طلب صعود'}
            </button>
          </div>
        </div>

        <div className="flex justify-around items-end gap-2 px-1">
          {micSlots.map(slot => (
            <div key={slot.id} className="flex flex-col items-center gap-3">
              <div className={`w-16 h-16 rounded-[1.6rem] border-2 relative transition-all duration-500 ${slot.userId ? (slot.isSpeaking ? 'border-blue-500 scale-110 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'border-slate-800') : 'border-dashed border-slate-800 bg-slate-900/40'}`}>
                {slot.isSpeaking && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded-[1.6rem] animate-pulse"></div>
                )}
                {slot.userId ? (
                  <>
                    <img src={slot.avatar} className="w-full h-full object-cover rounded-[1.4rem]" />
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-lg ${slot.isMuted ? 'bg-red-500 shadow-lg shadow-red-500/30' : 'bg-blue-600 shadow-lg shadow-blue-600/30'}`}>
                       {slot.isMuted ? <MicOff size={10} className="text-white" /> : <Mic size={10} className="text-white" />}
                    </div>
                    {slot.userId === 'admin_root' && <ShieldCheck size={14} className="absolute -top-2 -right-2 text-yellow-500" fill="currentColor" />}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-800"><UserPlus size={22} /></div>
                )}
              </div>
              <span className={`text-[9px] font-black truncate max-w-[60px] ${slot.userId ? 'text-white' : 'text-slate-700'}`}>
                {slot.username || 'خالٍ'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-3 animate-slide-up ${msg.userId === user.id ? 'flex-row-reverse' : ''}`}>
            <img src={msg.avatar} className="w-9 h-9 rounded-2xl border border-white/5 object-cover" />
            <div className={`max-w-[75%] flex flex-col ${msg.userId === user.id ? 'items-end' : ''}`}>
              <div className="flex items-center gap-1.5 mb-1.5 px-1">
                <span className={`text-[10px] font-black ${msg.role === UserRole.ADMIN ? 'text-yellow-400' : 'text-slate-400'}`}>{msg.username}</span>
                {msg.isVerified && <CheckCircle size={10} className="text-blue-500" fill="currentColor" />}
              </div>
              <div className={`p-4 text-sm font-bold shadow-2xl leading-relaxed ${msg.userId === user.id ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl rounded-br-none' : 'glass text-slate-100 rounded-3xl rounded-bl-none border-white/5'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Modern Input Bar */}
      <div className="p-5 glass border-t border-white/5 pb-28 md:pb-8">
        <div className="flex items-center gap-4 bg-slate-950/80 rounded-[2.2rem] px-5 py-3 border border-white/10 shadow-inner">
          <button className="text-slate-500 hover:text-blue-500 transition-colors"><ImageIcon size={22} /></button>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="عبّر عما في خاطرك..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-white placeholder:text-slate-700 h-10"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={`p-3 rounded-2xl transition-all ${inputText.trim() ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 scale-105 active:scale-95' : 'text-slate-800 cursor-not-allowed'}`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
