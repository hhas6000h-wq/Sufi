
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { 
  Dice5, Trophy, Coins, Play, Users, RefreshCw, Star, Info, 
  Swords, UserPlus, X, Check, Bell, User as UserIcon, Shield 
} from 'lucide-react';

interface LudoProps {
  user: User;
}

interface Opponent {
  id: string;
  username: string;
  avatar: string;
  score: number;
}

const MOCK_ONLINE_PLAYERS = [
  { id: 'u101', username: 'صقر_بغداد', avatar: 'https://avatar.iran.liara.run/public/boy?username=falcon' },
  { id: 'u102', username: 'أميرة_بابل', avatar: 'https://avatar.iran.liara.run/public/girl?username=princess' },
  { id: 'u103', username: 'الأسد_الملكي', avatar: 'https://avatar.iran.liara.run/public/boy?username=lion' },
];

const LudoPage: React.FC<LudoProps> = ({ user }) => {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'winner' | 'loser'>('lobby');
  const [gameLog, setGameLog] = useState<string[]>(['أهلاً بك في عالم لودو ريل!']);
  const [playersOnBoard, setPlayersOnBoard] = useState(Math.floor(Math.random() * 500) + 1200);
  
  // Challenge Mode State
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [incomingChallenge, setIncomingChallenge] = useState<Opponent | null>(null);
  const [isOpponentRolling, setIsOpponentRolling] = useState(false);

  const opponentIntervalRef = useRef<number | null>(null);

  // Simulate an incoming challenge after some time in lobby
  useEffect(() => {
    if (gameState === 'lobby' && !incomingChallenge && !showInviteModal) {
      const timer = setTimeout(() => {
        const randomOpp = MOCK_ONLINE_PLAYERS[Math.floor(Math.random() * MOCK_ONLINE_PLAYERS.length)];
        setIncomingChallenge({ ...randomOpp, score: 0 });
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [gameState, incomingChallenge, showInviteModal]);

  // Handle Opponent Turns in Challenge Mode
  useEffect(() => {
    if (gameState === 'playing' && isChallengeMode && opponent) {
      opponentIntervalRef.current = window.setInterval(() => {
        if (!isOpponentRolling && !isRolling) {
          simulateOpponentTurn();
        }
      }, 4000);
    }
    return () => {
      if (opponentIntervalRef.current) clearInterval(opponentIntervalRef.current);
    };
  }, [gameState, isChallengeMode, opponent, isOpponentRolling, isRolling]);

  const simulateOpponentTurn = () => {
    setIsOpponentRolling(true);
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setOpponent(prev => {
        if (!prev) return null;
        const newScore = prev.score + roll;
        if (newScore >= 50) {
          setGameState('loser');
        }
        return { ...prev, score: newScore };
      });
      setGameLog(prev => [`الخصم حصل على ${roll} 🎲`, ...prev.slice(0, 3)]);
      setIsOpponentRolling(false);
    }, 1500);
  };

  const rollDice = () => {
    if (isRolling || (isChallengeMode && isOpponentRolling)) return;
    setIsRolling(true);
    
    let counter = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setIsRolling(false);
        handleTurn(finalValue);
      }
    }, 70);
  };

  const handleTurn = (value: number) => {
    const newScore = score + value;
    setScore(newScore);
    setGameLog(prev => [`حصلت على ${value} 🎲`, ...prev.slice(0, 3)]);

    if (newScore >= 50) {
      setGameState('winner');
      updateUserPoints(isChallengeMode ? 10000 : 5000);
    }
  };

  const updateUserPoints = (points: number) => {
    const dbUsers = JSON.parse(localStorage.getItem('db_users') || '[]');
    const updatedUsers = dbUsers.map((u: any) => u.username === user.username ? { ...u, points: u.points + points } : u);
    localStorage.setItem('db_users', JSON.stringify(updatedUsers));
    
    const activeSession = JSON.parse(localStorage.getItem('active_session') || '{}');
    if(activeSession.username === user.username) {
      activeSession.points += points;
      localStorage.setItem('active_session', JSON.stringify(activeSession));
    }
  };

  const startGame = (solo: boolean = true, selectedOpponent: Opponent | null = null) => {
    setIsChallengeMode(!solo);
    setOpponent(selectedOpponent);
    setGameState('playing');
    setScore(0);
    setGameLog([solo ? 'بدأت اللعبة المنفردة! الهدف: 50 نقطة.' : `بدأ التحدي ضد ${selectedOpponent?.username}!`]);
    setShowInviteModal(false);
    setIncomingChallenge(null);
  };

  const sendInvite = (player: any) => {
    alert(`تم إرسال دعوة تحدي إلى ${player.username}...`);
    // In a real app, this would send a notification via socket
    // Here we simulate they accept after 2 seconds
    setTimeout(() => {
      startGame(false, { ...player, score: 0 });
    }, 2000);
  };

  const acceptChallenge = () => {
    if (incomingChallenge) {
      startGame(false, incomingChallenge);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#040d21] animate-fadeIn overflow-hidden relative">
      {/* Incoming Challenge Alert */}
      {incomingChallenge && gameState === 'lobby' && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[90%] z-[100] animate-slide-up">
           <div className="glass bg-blue-600/20 border border-blue-500/30 p-4 rounded-3xl shadow-2xl flex items-center gap-4">
              <div className="relative">
                <img src={incomingChallenge.avatar} className="w-12 h-12 rounded-2xl border-2 border-blue-500" />
                <div className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 border-2 border-slate-950">
                   <Bell size={10} className="text-white animate-pulse" />
                </div>
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">تحدي جديد!</p>
                 <p className="text-xs font-black text-white">{incomingChallenge.username} يدعوك لمباراة 1v1</p>
              </div>
              <div className="flex gap-2">
                 <button onClick={acceptChallenge} className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg active:scale-90 transition-transform"><Check size={20} /></button>
                 <button onClick={() => setIncomingChallenge(null)} className="bg-slate-800 p-2.5 rounded-xl text-slate-400 shadow-lg active:scale-90 transition-transform"><X size={20} /></button>
              </div>
           </div>
        </div>
      )}

      {/* Header */}
      <div className="p-5 glass border-b border-white/5 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-500 rounded-2xl shadow-xl shadow-yellow-500/20 rotate-6">
            <Dice5 className="text-slate-950" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-black text-white leading-none">لودو ريل برو</h1>
            <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-widest mt-1">ساحة المنافسة المباشرة</p>
          </div>
        </div>
        <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-2">
           <Coins size={14} className="text-yellow-400" />
           <span className="text-xs font-black">{user.points.toLocaleString()}</span>
        </div>
      </div>

      {gameState === 'lobby' ? (
        <div className="flex-1 p-8 flex flex-col justify-center space-y-8">
          <div className="text-center space-y-6">
             <div className="relative inline-block">
               <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-20"></div>
               <Trophy size={90} className="text-yellow-500 relative animate-bounce" />
             </div>
             <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">البطولة الذهبية</h2>
                <p className="text-slate-400 text-sm font-bold">اربح نقاطاً ذهبية عند الوصول لخط النهاية</p>
             </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => startGame(true)}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              <Play fill="currentColor" size={22} />
              لعب منفرد (Solo)
            </button>

            <button 
              onClick={() => setShowInviteModal(true)}
              className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              <Swords size={24} />
              تحدي 1 ضد 1 (1v1)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="glass p-6 rounded-[2rem] text-center border-white/5">
                <Users size={24} className="mx-auto text-blue-400 mb-2" />
                <p className="text-[10px] text-slate-500 font-black uppercase">اللاعبين النشطين</p>
                <p className="text-lg font-black text-white">{playersOnBoard.toLocaleString()}</p>
             </div>
             <div className="glass p-6 rounded-[2rem] text-center border-white/5">
                <Star size={24} className="mx-auto text-yellow-500 mb-2" />
                <p className="text-[10px] text-slate-500 font-black uppercase">جائزة التحدي</p>
                <p className="text-lg font-black text-white">10K+</p>
             </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6 flex flex-col space-y-6">
          <div className="aspect-square w-full glass rounded-[3rem] border-white/10 relative p-8 flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]">
             
             {/* Progress Tracks */}
             <div className="w-full flex justify-between px-10 mb-8 items-center">
                {/* User Player */}
                <div className="flex flex-col items-center gap-2">
                   <div className="relative">
                      <img src={user.avatar} className={`w-12 h-12 rounded-2xl border-2 object-cover ${isRolling ? 'border-yellow-500 scale-110 shadow-lg shadow-yellow-500/20' : 'border-blue-500'}`} />
                      {isRolling && <div className="absolute inset-0 bg-yellow-500/20 rounded-2xl animate-pulse"></div>}
                   </div>
                   <span className="text-[10px] font-black text-white">{user.displayName}</span>
                </div>

                {isChallengeMode && opponent ? (
                  <>
                    <div className="flex flex-col items-center gap-1">
                      <Swords size={20} className="text-red-500 animate-pulse" />
                      <span className="text-[8px] font-black text-slate-600 uppercase">VS</span>
                    </div>
                    {/* Opponent Player */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <img src={opponent.avatar} className={`w-12 h-12 rounded-2xl border-2 object-cover ${isOpponentRolling ? 'border-yellow-500 scale-110 shadow-lg shadow-yellow-500/20' : 'border-red-500'}`} />
                        {isOpponentRolling && <div className="absolute inset-0 bg-yellow-500/20 rounded-2xl animate-pulse"></div>}
                      </div>
                      <span className="text-[10px] font-black text-white">{opponent.username}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-30">
                     <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center">
                        <UserIcon size={20} className="text-slate-700" />
                     </div>
                     <span className="text-[10px] font-black text-slate-700">SOLO</span>
                  </div>
                )}
             </div>

             {/* Main Board Visual */}
             <div className="relative w-56 h-56 flex items-center justify-center">
                {/* Opponent Track (Outer Ring) */}
                {isChallengeMode && opponent && (
                  <div className="absolute inset-0 rounded-full border-[6px] border-slate-800 flex items-center justify-center scale-125">
                     <div 
                        className="absolute inset-0 rounded-full border-[6px] border-red-500 transition-all duration-700 opacity-30"
                        style={{ clipPath: `conic-gradient(from 0deg, white ${(opponent.score / 50) * 100}%, transparent 0%)` }}
                     ></div>
                  </div>
                )}

                {/* User Track */}
                <div className="relative w-48 h-48 rounded-full border-[12px] border-slate-900 flex items-center justify-center overflow-hidden shadow-2xl">
                    <div 
                      className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-indigo-500 transition-all duration-700"
                      style={{ height: `${(score / 50) * 100}%` }}
                    ></div>
                    <div className="relative z-10 text-center">
                      <p className="text-5xl font-black text-white tracking-tighter">{score}</p>
                      <p className="text-[9px] text-white/70 font-black uppercase tracking-widest mt-1">/ 50 هدفاً</p>
                    </div>
                </div>
             </div>

             {/* UI Controls */}
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full flex justify-center gap-6">
                <div className={`w-28 h-28 glass border-white/20 rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all ${isRolling ? 'scale-90 rotate-45' : ''}`}>
                   <span className="text-6xl font-black text-white">{diceValue}</span>
                </div>
                <button 
                  onClick={rollDice}
                  disabled={isRolling || (isChallengeMode && isOpponentRolling)}
                  className={`w-28 h-28 rounded-[2.5rem] shadow-2xl flex items-center justify-center active:scale-90 transition-all ${isRolling || (isChallengeMode && isOpponentRolling) ? 'bg-slate-800 opacity-50 cursor-not-allowed' : 'bg-yellow-500 shadow-yellow-500/40'}`}
                >
                  <RefreshCw size={40} className={`text-slate-950 ${isRolling ? 'animate-spin' : ''}`} />
                </button>
             </div>
          </div>

          <div className="flex-1 glass rounded-[2.5rem] border-white/5 p-6 mt-8">
             <div className="flex items-center gap-2 mb-4 text-blue-400">
                <Info size={14} />
                <h4 className="text-[10px] font-black uppercase tracking-widest">تحديثات الساحة</h4>
             </div>
             <div className="space-y-2 overflow-y-auto max-h-32 no-scrollbar">
                {gameLog.map((log, i) => (
                  <div key={i} className={`text-[11px] font-bold p-3 rounded-2xl animate-slide-up ${i === 0 ? 'bg-blue-600/10 text-white border border-blue-600/20 shadow-lg shadow-blue-600/5' : 'text-slate-500 opacity-60'}`}>
                    {log}
                  </div>
                ))}
             </div>
          </div>
          
          <button 
            onClick={() => setGameState('lobby')}
            className="w-full py-4 text-slate-500 text-xs font-black uppercase hover:text-white transition-colors"
          >
            الانسحاب من التحدي
          </button>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl animate-fadeIn">
           <div className="glass w-full max-w-sm rounded-[3rem] p-8 space-y-6 border border-white/10 shadow-2xl">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-white">تحدَّ أصدقاءك</h3>
                 <button onClick={() => setShowInviteModal(false)} className="p-2 bg-slate-900 rounded-full text-slate-500"><X size={18} /></button>
              </div>
              
              <div className="space-y-3">
                 <p className="text-[10px] text-slate-500 font-black uppercase px-2">لاعبون متصلون الآن</p>
                 <div className="space-y-2">
                    {MOCK_ONLINE_PLAYERS.map(player => (
                      <div key={player.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                         <div className="flex items-center gap-3">
                            <img src={player.avatar} className="w-10 h-10 rounded-xl object-cover" />
                            <span className="text-sm font-black text-white">{player.username}</span>
                         </div>
                         <button onClick={() => sendInvite(player)} className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg active:scale-90 transition-transform">
                            <UserPlus size={18} />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Winner Modal */}
      {gameState === 'winner' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-3xl animate-fadeIn">
          <div className="w-full max-w-sm text-center space-y-8 animate-slide-up">
             <Trophy size={140} className="text-yellow-500 mx-auto animate-bounce" />
             <div className="space-y-2">
               <h2 className="text-5xl font-black text-white tracking-tighter">بطل ريل!</h2>
               <p className="text-slate-400 font-bold">لقد حققت النصر الساحق {isChallengeMode && 'في التحدي'}.</p>
             </div>
             <div className="p-8 glass rounded-[3rem] border-yellow-500/20 shadow-2xl bg-yellow-500/5">
                <p className="text-xs font-black text-yellow-500 uppercase tracking-widest mb-4">تمت إضافة المكافأة</p>
                <div className="flex items-center justify-center gap-4">
                  <Coins size={36} className="text-yellow-500" />
                  <span className="text-5xl font-black text-white">{isChallengeMode ? '+10,000' : '+5,000'}</span>
                </div>
             </div>
             <button 
              onClick={() => {
                setGameState('lobby');
                window.location.reload();
              }}
              className="w-full py-5 bg-white text-slate-950 rounded-[2rem] font-black text-lg active:scale-95 transition-all shadow-xl"
             >
                استلام الجائزة
             </button>
          </div>
        </div>
      )}

      {/* Loser Modal */}
      {gameState === 'loser' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-3xl animate-fadeIn">
          <div className="w-full max-w-sm text-center space-y-8 animate-slide-up">
             <Shield size={140} className="text-red-500 mx-auto opacity-50" />
             <div className="space-y-2">
               <h2 className="text-5xl font-black text-white tracking-tighter">هارد لك!</h2>
               <p className="text-slate-400 font-bold">لقد سبقك الخصم {opponent?.username} لخط النهاية.</p>
             </div>
             <div className="p-8 glass rounded-[3rem] border-white/5 bg-white/5">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">النتيجة النهائية</p>
                <div className="flex items-center justify-center gap-6">
                   <div className="text-center">
                      <p className="text-2xl font-black text-white">{score}</p>
                      <p className="text-[8px] text-slate-600 font-black">أنت</p>
                   </div>
                   <Swords size={20} className="text-slate-800" />
                   <div className="text-center">
                      <p className="text-2xl font-black text-red-500">50</p>
                      <p className="text-[8px] text-slate-600 font-black">{opponent?.username}</p>
                   </div>
                </div>
             </div>
             <button 
              onClick={() => {
                setGameState('lobby');
              }}
              className="w-full py-5 bg-slate-800 text-white rounded-[2rem] font-black text-lg active:scale-95 transition-all shadow-xl"
             >
                العودة للساحة
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LudoPage;
