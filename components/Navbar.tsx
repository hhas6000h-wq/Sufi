
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlayCircle, MessageSquare, User as UserIcon, ShieldAlert, Dice5 } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  userRole: UserRole;
}

const Navbar: React.FC<NavbarProps> = ({ userRole }) => {
  const isAdmin = userRole === UserRole.ADMIN;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-[100]">
      <nav className="glass rounded-[2.5rem] p-2 flex justify-around items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center p-3 rounded-full transition-all duration-300 ${isActive ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'}`}>
          <Home size={22} strokeWidth={2.5} />
        </NavLink>

        <NavLink to="/reels" className={({ isActive }) => `flex flex-col items-center p-3 rounded-full transition-all duration-300 ${isActive ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'}`}>
          <PlayCircle size={22} strokeWidth={2.5} />
        </NavLink>

        <NavLink to="/chat" className={({ isActive }) => `flex flex-col items-center p-3 rounded-full transition-all duration-300 ${isActive ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'}`}>
          <MessageSquare size={22} strokeWidth={2.5} />
        </NavLink>

        <NavLink to="/ludo" className={({ isActive }) => `flex flex-col items-center p-3 rounded-full transition-all duration-300 ${isActive ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'}`}>
          <Dice5 size={22} strokeWidth={2.5} />
        </NavLink>

        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `flex flex-col items-center p-3 rounded-full transition-all duration-300 ${isActive ? 'bg-red-600 text-white scale-110 shadow-lg shadow-red-600/30' : 'text-slate-400 hover:text-white'}`}>
            <ShieldAlert size={22} strokeWidth={2.5} />
          </NavLink>
        )}

        <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center p-3 rounded-full transition-all duration-300 ${isActive ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'}`}>
          <UserIcon size={22} strokeWidth={2.5} />
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;
