
import React from 'react';
import { User } from '../types';
import { Dice5, Trophy, Coins, Gem, Play, Users, Settings } from 'lucide-react';

interface LudoProps {
  user: User;
}

const LudoPage: React.FC<LudoProps> = ({ user }) => {
  return (
    <div className="flex flex-col h-full bg-[#040d21] animate-fadeIn">
      {/* Game Header */}
      <div className="p-4 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500 rounded-xl shadow-lg shadow-yellow-500/20">
            <Dice5 className="text-slate-950" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">ساحة اللودو</h1>
            <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">الموسم الأول</p>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5 shadow-inner">
             <Coins size={14} className="text-yellow-400" />
             <span className="text-xs font-bold">{user.points.toLocaleString()}</span>
           </div>
           <div className="bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5 shadow-inner">
             <Gem size={14} className="text-blue-400" />
             <span className="text-xs font-bold">{user.gems.toLocaleString()}</span>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Banner */}
        <div className="relative h-44 rounded-[2rem] overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1611996598518-888e9d501861?w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6">
            <h2 className="text-2xl font-black text-white">تحدي الملوك</h2>
            <p className="text-sm text-slate-300">اربح 5000 نقطة في كل فوز!</p>
          </div>
        </div>

        {/* Game Modes */}
        <div className="grid grid-cols-1 gap-4">
          <button className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-[2rem] flex justify-between items-center group active:scale-95 transition-all shadow-xl shadow-blue-900/20">
            <div className="text-right">
              <h3 className="text-xl font-black text-white">لعب كلاسيكي</h3>
              <p className="text-xs text-blue-200 mt-1">إلعب ضد 3 لاعبين آخرين</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Users className="text-white" size={24} />
            </div>
          </button>

          <button className="bg-gradient-to-r from-red-600 to-rose-700 p-6 rounded-[2rem] flex justify-between items-center group active:scale-95 transition-all shadow-xl shadow-rose-900/20">
            <div className="text-right">
              <h3 className="text-xl font-black text-white">تحدي 1 ضد 1</h3>
              <p className="text-xs text-rose-200 mt-1">الفائز يأخذ كل شيء</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Trophy className="text-white" size={24} />
            </div>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-slate-900/50 p-4 rounded-[1.5rem] border border-slate-800 flex flex-col items-center gap-2">
             <div className="p-3 bg-slate-950 rounded-xl text-yellow-500">
               <Trophy size={20} />
             </div>
             <span className="text-xs font-bold">المتصدرين</span>
           </div>
           <div className="bg-slate-900/50 p-4 rounded-[1.5rem] border border-slate-800 flex flex-col items-center gap-2">
             <div className="p-3 bg-slate-950 rounded-xl text-blue-500">
               <Settings size={20} />
             </div>
             <span className="text-xs font-bold">الإعدادات</span>
           </div>
        </div>
      </div>

      {/* Floating Play Button */}
      <button className="fixed bottom-24 left-1/2 -translate-x-1/2 w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.4)] border-8 border-[#040d21] z-10 active:scale-90 transition-transform">
         <Play size={32} fill="currentColor" className="text-slate-950 ml-1" />
      </button>
    </div>
  );
};

export default LudoPage;
