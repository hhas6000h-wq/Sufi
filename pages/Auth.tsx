
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, User as UserIcon, Lock, Mail, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setError('');
    setSuccess('');
  }, [isLoginView]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // جلب قاعدة البيانات من المتصفح
    const dbUsers = JSON.parse(localStorage.getItem('db_users') || '[]');

    if (isLoginView) {
      // --- تسجيل الدخول ---
      if (formData.username === 'M7' && formData.password === 'mmm2006mmm6') {
        const admin: User = {
          id: 'admin_root',
          username: 'M7',
          displayName: 'المدير العام',
          avatar: 'https://avatar.iran.liara.run/public/boy?username=M7',
          role: UserRole.ADMIN,
          isFollowing: false, isMuted: false, isBanned: false, isVerified: true,
          points: 1000000, gems: 10000, followersCount: 5000000, followingCount: 0,
          // Added missing followingList property to satisfy User interface
          followingList: []
        };
        onLogin(admin);
        return;
      }

      const user = dbUsers.find((u: any) => u.username === formData.username && u.password === formData.password);
      
      if (user) {
        setSuccess('تم تسجيل الدخول بنجاح!');
        setTimeout(() => onLogin(user), 800);
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }

    } else {
      // --- إنشاء حساب جديد ---
      if (formData.username.length < 3) {
        setError('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
        return;
      }
      if (formData.password.length < 6) {
        setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('كلمات المرور غير متطابقة');
        return;
      }

      const userExists = dbUsers.find((u: any) => u.username === formData.username);
      if (userExists) {
        setError('اسم المستخدم هذا مسجل بالفعل');
        return;
      }

      const newUser: User = {
        id: 'u_' + Math.random().toString(36).substr(2, 9),
        username: formData.username,
        displayName: formData.displayName || formData.username,
        avatar: `https://avatar.iran.liara.run/public/${Math.random() > 0.5 ? 'boy' : 'girl'}?username=${formData.username}`,
        role: UserRole.MEMBER,
        isFollowing: false, isMuted: false, isBanned: false, isVerified: false,
        points: 500, gems: 50, followersCount: 0, followingCount: 0,
        // Added missing followingList property to satisfy User interface
        followingList: []
      };

      // حفظ في "قاعدة البيانات"
      const userToStore = { ...newUser, password: formData.password };
      dbUsers.push(userToStore);
      localStorage.setItem('db_users', JSON.stringify(dbUsers));
      
      setSuccess('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
      setTimeout(() => {
        setIsLoginView(true);
        setFormData({ username: formData.username, password: '', confirmPassword: '', displayName: '' });
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full animate-pulse delay-700"></div>

      <div className="w-full max-w-md glass rounded-[3.5rem] border border-white/10 p-10 shadow-2xl relative z-10 animate-slide-up">
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <ShieldCheck size={42} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">ريل العراقي</h2>
          <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-widest">
            {isLoginView ? 'تسجيل دخول للنظام' : 'إنشاء عضوية جديدة'}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 text-xs font-bold animate-shake">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-2xl mb-6 text-xs font-bold">
            <CheckCircle2 size={18} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <UserIcon className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full pr-14 pl-6 py-5 bg-slate-900/50 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
              placeholder="اسم المستخدم"
            />
          </div>

          {!isLoginView && (
            <div className="relative group">
              <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="text"
                required
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                className="w-full pr-14 pl-6 py-5 bg-slate-900/50 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                placeholder="الاسم المستعار"
              />
            </div>
          )}

          <div className="relative group">
            <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full pr-14 pl-6 py-5 bg-slate-900/50 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
              placeholder="كلمة المرور"
            />
          </div>

          {!isLoginView && (
            <div className="relative group">
              <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full pr-14 pl-6 py-5 bg-slate-900/50 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                placeholder="تأكيد كلمة المرور"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 text-sm mt-6"
          >
            {isLoginView ? 'دخول للمنصة' : 'إنشاء حساب جديد'}
            <ArrowRight size={20} className="rotate-180" />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-slate-500 hover:text-blue-500 text-[11px] font-black uppercase tracking-widest transition-colors"
          >
            {isLoginView ? (
              <>ليس لديك عضوية؟ <span className="text-blue-500 ml-1">انضم إلينا الآن</span></>
            ) : (
              <>لديك حساب مسبقاً؟ <span className="text-blue-500 ml-1">سجل دخولك</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
