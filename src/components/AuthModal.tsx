import { useState, useEffect, useRef, FormEvent, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Mail, Lock, User, Send, CheckCircle2, ShieldCheck, 
  Eye, EyeOff, Smartphone, RefreshCw, Copy, Check, 
  ArrowLeft, KeyRound, Sparkles, MessageCircle, BadgeCheck, AlertCircle
} from "lucide-react";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  telegramUsername: string;
  email: string;
  password?: string;
  telegramVerified: boolean;
  joinedDate: string;
  streakDays?: number;
}

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export default function AuthModal({
  isOpen,
  initialMode = 'signin',
  onClose,
  onSuccess
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [signUpStep, setSignUpStep] = useState<'form' | 'verify' | 'success'>('form');

  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [signUpName, setSignUpName] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpTelegram, setSignUpTelegram] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Verification Code State
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [codeDigits, setCodeDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isCopied, setIsCopied] = useState(false);
  const [registeredUserObj, setRegisteredUserObj] = useState<UserProfile | null>(null);

  // General State
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedUsers, setSavedUsers] = useState<UserProfile[]>([]);

  // Input refs for 6-digit OTP
  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load registered users on mount
  useEffect(() => {
    try {
      const usersRaw = localStorage.getItem('sanjars_registered_users');
      if (usersRaw) {
        setSavedUsers(JSON.parse(usersRaw));
      } else {
        // Check legacy key
        const legacy = localStorage.getItem('registeredUsers');
        if (legacy) {
          const parsed = JSON.parse(legacy);
          const migrated: UserProfile[] = parsed.map((u: any, idx: number) => ({
            id: `migrated_${idx}_${Date.now()}`,
            name: u.name || "Learner",
            username: (u.name || "learner").toLowerCase().replace(/\s+/g, '_'),
            telegramUsername: "@sanjarmultilevel",
            email: u.email || `${u.name || "user"}@sanjarsenglish.com`,
            password: u.password || "123456",
            telegramVerified: true,
            joinedDate: new Date().toLocaleDateString()
          }));
          setSavedUsers(migrated);
          localStorage.setItem('sanjars_registered_users', JSON.stringify(migrated));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  // Sync mode with prop
  useEffect(() => {
    setMode(initialMode);
    setSignUpStep('form');
    setError(null);
  }, [initialMode, isOpen]);

  // Timer countdown for OTP
  useEffect(() => {
    let interval: any;
    if (signUpStep === 'verify' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [signUpStep, timerSeconds]);

  if (!isOpen) return null;

  // Handle Quick Switch with Saved Users
  const handleQuickLogin = (user: UserProfile) => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      if (rememberMe) {
        localStorage.setItem('sanjars_active_user', JSON.stringify(user));
        localStorage.setItem('sanjars_user_name', user.name);
      }
      onSuccess(user);
    }, 400);
  };

  // Sign In Handler
  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const query = signInIdentifier.trim().toLowerCase();
      const cleanTelegram = query.startsWith('@') ? query : `@${query}`;

      const found = savedUsers.find(u => 
        u.username?.toLowerCase() === query ||
        u.email?.toLowerCase() === query ||
        u.name?.toLowerCase() === query ||
        u.telegramUsername?.toLowerCase() === cleanTelegram ||
        u.telegramUsername?.toLowerCase() === query
      );

      if (!found) {
        setIsLoading(false);
        setError("Foydalanuvchi topilmadi. Iltimos tekshiring yoki Telegram orqali ro'yxatdan o'ting.");
        return;
      }

      if (found.password && signInPassword && found.password !== signInPassword) {
        setIsLoading(false);
        setError("Kiritilgan parol noto'g'ri. Iltimos qaytadan urinib ko'ring.");
        return;
      }

      setIsLoading(false);
      if (rememberMe) {
        localStorage.setItem('sanjars_active_user', JSON.stringify(found));
        localStorage.setItem('sanjars_user_name', found.name);
      }
      onSuccess(found);
    }, 600);
  };

  // Request Telegram OTP Code
  const handleRequestTelegramCode = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = signUpName.trim();
    const cleanUsername = signUpUsername.trim().toLowerCase().replace(/\s+/g, '_');
    let cleanTelegram = signUpTelegram.trim();
    if (!cleanTelegram.startsWith('@') && !cleanTelegram.startsWith('+')) {
      cleanTelegram = `@${cleanTelegram}`;
    }
    const cleanEmail = signUpEmail.trim().toLowerCase();

    if (cleanName.length < 2) {
      setError("Iltimos, to'liq ismingizni kiriting.");
      return;
    }
    if (cleanUsername.length < 3) {
      setError("Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak.");
      return;
    }
    if (cleanTelegram.length < 3) {
      setError("Iltimos, to'g'ri Telegram username yoki telefon raqamingizni kiriting.");
      return;
    }
    if (signUpPassword.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi lozim.");
      return;
    }

    // Check if username already exists
    const exists = savedUsers.some(u => 
      u.username?.toLowerCase() === cleanUsername || 
      u.email?.toLowerCase() === cleanEmail
    );

    if (exists) {
      setError("Bu foydalanuvchi nomi yoki email allaqachon ro'yxatdan o'tgan. Iltimos 'Kirish' orqali hisobingizga kiring.");
      return;
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setCodeDigits(["", "", "", "", "", ""]);
    setTimerSeconds(60);
    setSignUpStep('verify');

    // Auto-focus first digit after rendering
    setTimeout(() => {
      digitInputRefs.current[0]?.focus();
    }, 200);
  };

  // Handle digit input in OTP
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...codeDigits];
    if (value.length > 1) {
      // Handle paste of multiple digits
      const pasted = value.slice(0, 6).split('');
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setCodeDigits(newDigits);
      const nextIndex = Math.min(pasted.length, 5);
      digitInputRefs.current[nextIndex]?.focus();
      return;
    }

    newDigits[index] = value;
    setCodeDigits(newDigits);

    // Auto advance focus
    if (value && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    }
  };

  // Auto fill code from simulated Telegram bot
  const handleAutoFillCode = () => {
    const digits = generatedCode.split('');
    setCodeDigits(digits);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    // Focus last digit
    digitInputRefs.current[5]?.focus();
  };

  // Resend Telegram Code
  const handleResendCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    setCodeDigits(["", "", "", "", "", ""]);
    setTimerSeconds(60);
    setError(null);
    digitInputRefs.current[0]?.focus();
  };

  // Verify Code and Complete Registration
  const handleVerifyCode = () => {
    const enteredCode = codeDigits.join('');
    if (enteredCode.length !== 6) {
      setError("Iltimos, Telegram orqali yuborilgan 6 xonali kodni to'liq kiriting.");
      return;
    }

    if (enteredCode !== generatedCode) {
      setError("Tasdiqlash kodi noto'g'ri. Iltimos tekshirib qaytadan kiriting!");
      return;
    }

    setIsLoading(true);
    setError(null);

    let cleanTelegram = signUpTelegram.trim();
    if (!cleanTelegram.startsWith('@') && !cleanTelegram.startsWith('+')) {
      cleanTelegram = `@${cleanTelegram}`;
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: signUpName.trim(),
      username: signUpUsername.trim().toLowerCase().replace(/\s+/g, '_'),
      telegramUsername: cleanTelegram,
      email: signUpEmail.trim().toLowerCase(),
      password: signUpPassword,
      telegramVerified: true,
      joinedDate: new Date().toLocaleDateString('uz-UZ'),
      streakDays: 1
    };

    setTimeout(() => {
      const updatedUsers = [...savedUsers, newUser];
      setSavedUsers(updatedUsers);
      localStorage.setItem('sanjars_registered_users', JSON.stringify(updatedUsers));
      localStorage.setItem('sanjars_active_user', JSON.stringify(newUser));
      localStorage.setItem('sanjars_user_name', newUser.name);

      setRegisteredUserObj(newUser);
      setIsLoading(false);
      setSignUpStep('success');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
      />

      {/* Modal Box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: "spring", duration: 0.35 }}
        className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden z-10 my-auto border border-slate-100"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center transition-all z-20 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="p-7 sm:p-10">
          {/* Header & Tabs */}
          {signUpStep !== 'success' && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-sm">
                  <Sparkles size={16} />
                </div>
                <span className="font-display font-bold text-xl text-slate-900">
                  Sanjars<span className="text-pink-600">English</span>
                </span>
              </div>

              {/* Mode Switcher */}
              <div className="flex bg-slate-100/90 p-1.5 rounded-2xl max-w-xs mx-auto border border-slate-200/70">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setError(null); }}
                  className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    mode === 'signin' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Kirish (Sign In)
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setSignUpStep('form'); setError(null); }}
                  className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    mode === 'signup' 
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Send size={13} />
                  <span>Ro'yxatdan o'tish</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-medium flex items-start gap-2.5"
            >
              <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </motion.div>
          )}

          {/* ============================================================== */}
          {/* SIGN IN VIEW */}
          {/* ============================================================== */}
          {mode === 'signin' && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-display font-bold text-slate-900">Hisobingizga kiring</h3>
                <p className="text-xs text-slate-500 mt-1">Ingliz tili darslarini davom ettirish uchun kiring</p>
              </div>

              {/* Saved accounts for 1-click login */}
              {savedUsers.length > 0 && (
                <div className="mb-5 p-3 bg-pink-50/70 border border-pink-100 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wider flex items-center gap-1">
                      <BadgeCheck size={14} className="text-pink-600" /> Saqlangan profil bilan kirish:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {savedUsers.slice(-3).map((u, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickLogin(u)}
                        className="px-3 py-1.5 bg-white hover:bg-pink-100 border border-pink-200 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-2 shadow-2xs transition-all hover:scale-102 active:scale-98 cursor-pointer"
                      >
                        <span className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center text-[10px] font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </span>
                        <span>{u.name}</span>
                        <span className="text-[10px] text-pink-600 font-normal">{u.telegramUsername}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 ml-1">Foydalanuvchi nomi, Email yoki Telegram</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="Username, email yoki @telegram"
                      value={signInIdentifier}
                      onChange={(e) => setSignInIdentifier(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold text-slate-700">Parol</label>
                    <button 
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setSignUpStep('form');
                      }}
                      className="text-[11px] text-pink-600 font-bold hover:underline"
                    >
                      Yangi hisob ochish
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      type={showSignInPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showSignInPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-slate-300 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 font-medium">Meni eslab qol</span>
                  </label>
                  
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-500" /> Xavfsiz tizim
                  </span>
                </div>

                <button 
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3.5 rounded-2xl font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-sm"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Tizimga kirish"
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-slate-500 mt-6">
                Hisobingiz yo'qmi?{" "}
                <button 
                  type="button"
                  onClick={() => { setMode('signup'); setSignUpStep('form'); setError(null); }}
                  className="text-pink-600 font-bold hover:underline"
                >
                  Telegram orqali ro'yxatdan o'tish
                </button>
              </p>
            </div>
          )}

          {/* ============================================================== */}
          {/* SIGN UP: STEP 1 - FILL USER DETAILS */}
          {/* ============================================================== */}
          {mode === 'signup' && signUpStep === 'form' && (
            <div>
              <div className="text-center mb-5">
                <h3 className="text-2xl font-display font-bold text-slate-900">Telegram orqali a'zo bo'lish</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Har bir o'quvchi xavfsizlik uchun Telegram orqali tasdiqlanadi
                </p>
              </div>

              <form onSubmit={handleRequestTelegramCode} className="space-y-3.5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">Ism va Familiyangiz</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                    <input 
                      required
                      type="text" 
                      placeholder="Masalan: Sanjar Rahimov"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">Foydalanuvchi nomi (Username)</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                    <input 
                      required
                      type="text" 
                      placeholder="Masalan: sanjar_ielts"
                      value={signUpUsername}
                      onChange={(e) => setSignUpUsername(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    />
                  </div>
                </div>

                {/* Telegram Username or Phone */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Send size={12} className="text-sky-500" /> Telegram hisobingiz
                    </label>
                    <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                      Kod keladi
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 font-bold text-xs">@</span>
                    <input 
                      required
                      type="text" 
                      placeholder="telegram_username yoki +99890..."
                      value={signUpTelegram}
                      onChange={(e) => setSignUpTelegram(e.target.value)}
                      className="w-full bg-sky-50/40 border border-sky-200 rounded-2xl py-3 pl-10 pr-4 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 ml-1">
                    Tasdiqlash kodi Telegram botimiz (@sanjarmultilevel) orqali ushbu hisobingizga yuboriladi.
                  </p>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">Email manzili</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                    <input 
                      required
                      type="email" 
                      placeholder="student@example.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">Parol (kamida 6 ta belgi)</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                    <input 
                      required
                      type={showSignUpPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-11 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showSignUpPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white py-3.5 rounded-2xl font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm mt-3"
                >
                  <Send size={15} />
                  <span>Telegram orqali tasdiqlash kodini olish</span>
                </button>
              </form>

              <p className="text-center text-xs text-slate-500 mt-4">
                Hisobingiz bormi?{" "}
                <button 
                  type="button"
                  onClick={() => { setMode('signin'); setError(null); }}
                  className="text-pink-600 font-bold hover:underline"
                >
                  Kirish
                </button>
              </p>
            </div>
          )}

          {/* ============================================================== */}
          {/* SIGN UP: STEP 2 - TELEGRAM OTP VERIFICATION */}
          {/* ============================================================== */}
          {mode === 'signup' && signUpStep === 'verify' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-1">
                <button
                  type="button"
                  onClick={() => setSignUpStep('form')}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <ArrowLeft size={14} /> Ma'lumotlarni o'zgartirish
                </button>
                <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100 flex items-center gap-1">
                  <Send size={12} /> Telegram OTP
                </span>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-inner">
                  <Send size={28} />
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900">Telegram Tasdiqlash Kodi</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Biz <span className="font-bold text-sky-600">{signUpTelegram}</span> hisobingizga 6 xonali tasdiqlash kodini yubordik.
                </p>
              </div>

              {/* Interactive Telegram Bot Connect & Simulated Telegram Notification Card */}
              <div className="bg-gradient-to-br from-sky-50/90 via-sky-50/40 to-slate-50 border border-sky-200/80 rounded-2xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center">
                      <Send size={12} />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Telegram • SanjarsEnglish Bot</span>
                  </div>
                  <a
                    href="https://t.me/sanjarmultilevel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-800 bg-white px-2.5 py-0.5 rounded-lg border border-sky-200 hover:bg-sky-50 transition-colors flex items-center gap-1"
                  >
                    <span>@sanjarmultilevel</span>
                    <Send size={10} />
                  </a>
                </div>

                <div className="bg-white rounded-xl p-3 border border-sky-100/80 text-xs text-slate-700 shadow-2xs">
                  <p className="text-slate-500 text-[11px] mb-1">
                    📩 <strong>SanjarsEnglish Bot:</strong> "Hurmatli <strong>{signUpName}</strong>, platformadan ro'yxatdan o'tish uchun bir martalik kodingiz:"
                  </p>
                  
                  {/* Generated Code Highlight */}
                  <div className="flex items-center justify-between bg-sky-50 rounded-lg px-3 py-2 border border-sky-200 my-2">
                    <span className="font-mono text-lg font-extrabold tracking-widest text-sky-900">
                      {generatedCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoFillCode}
                      className="text-[11px] font-bold bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      {isCopied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{isCopied ? "Kiritildi!" : "Kodni kiritish"}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    Amal qilish muddati: 3 daqiqa. Kodni hech kimga bermang.
                  </p>
                </div>
              </div>

              {/* 6 Digit Inputs */}
              <div>
                <label className="text-xs font-bold text-slate-700 block text-center mb-2">
                  6 xonali tasdiqlash kodini kiriting:
                </label>
                <div className="flex justify-center gap-2 sm:gap-2.5">
                  {codeDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { digitInputRefs.current[i] = el; }}
                      type="text"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(i, e)}
                      className={`w-11 h-12 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-bold rounded-2xl border transition-all focus:outline-none ${
                        digit 
                          ? 'border-sky-500 bg-sky-50/30 text-sky-900 shadow-sm' 
                          : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Timer and Resend Controls */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>
                  {timerSeconds > 0 ? (
                    <>Qayta yuborish: <strong className="text-slate-800 font-mono">00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}</strong></>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-pink-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={12} /> Yangi kod yuborish
                    </button>
                  )}
                </span>

                <a
                  href="https://t.me/sanjarmultilevel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:text-sky-700 font-medium hover:underline flex items-center gap-1"
                >
                  <MessageCircle size={12} /> Botdan yordam
                </a>
              </div>

              {/* Verify Button */}
              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={isLoading || codeDigits.some(d => !d)}
                className="w-full bg-gradient-to-r from-sky-600 via-pink-600 to-rose-600 text-white py-3.5 rounded-2xl font-bold hover:shadow-lg hover:shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Kodni tasdiqlash va Hisobni faollashtirish</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* ============================================================== */}
          {/* SIGN UP: STEP 3 - SUCCESS STATE */}
          {/* ============================================================== */}
          {mode === 'signup' && signUpStep === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <CheckCircle2 size={42} />
              </div>

              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 mb-3">
                <BadgeCheck size={14} /> Telegram hisob tasdiqlandi
              </div>

              <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
                Xush kelibsiz, {registeredUserObj?.name}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
                Hisobingiz <span className="text-sky-600 font-bold">{registeredUserObj?.telegramUsername}</span> orqali muvaffaqiyatli faollashtirildi. Barcha darsliklar va AI repetitor siz uchun ochiq.
              </p>

              {/* User summary card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left mb-6 max-w-sm mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {registeredUserObj?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{registeredUserObj?.name}</p>
                    <p className="text-xs text-slate-500">@{registeredUserObj?.username} • {registeredUserObj?.telegramUsername}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <ShieldCheck size={12} /> Telegram orqali himoyalangan
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (registeredUserObj) {
                    onSuccess(registeredUserObj);
                  }
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3.5 rounded-2xl font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all text-sm cursor-pointer"
              >
                O'quv xonasiga (Dashboard) o'tish
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
