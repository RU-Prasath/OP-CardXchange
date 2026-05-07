'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['','','','','','']);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function sendOTP() {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('otp');
        toast({ title: 'Code sent', description: `Check ${email} for your 6-digit code.`, variant: 'default' });
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to send code', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Network error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function verifyOTP() {
    const code = otp.join('');
    if (code.length < 6) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.user.role === 'superadmin') {
          router.push('/super-admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        toast({ title: 'Invalid code', description: data.error || 'Wrong or expired OTP', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Network error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(val: string, idx: number) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      const el = document.getElementById(`otp-${idx+1}`);
      el?.focus();
    }
  }

  function handleOtpKeyDown(e: React.KeyboardEvent, idx: number) {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const el = document.getElementById(`otp-${idx-1}`);
      el?.focus();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative">
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 50% at 50% 50%,rgba(99,102,241,0.15),transparent 70%)'}}/>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={14}/> Back to home
        </Link>

        <div className="card-panel p-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 font-bold text-base mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-[14px] text-[#0A0D14]" style={{background:'linear-gradient(135deg,#22D3EE,#6366F1,#A855F7)'}}>F</div>
            <span>Folioforge</span>
          </div>

          {step === 'email' ? (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl border border-white/[0.07] bg-white/[0.04] flex items-center justify-center"><Mail size={16} className="text-cyan-400"/></div>
                <h1 className="text-xl font-bold tracking-tight">Sign in to your account</h1>
              </div>
              <p className="text-sm text-white/40 mb-8 ml-12">We&apos;ll send you a 6-digit code. No password needed.</p>

              <div className="space-y-3">
                <label className="text-sm text-white/60 font-medium">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendOTP()}
                  placeholder="you@company.com"
                  className="w-full h-11 rounded-xl border border-white/[0.12] bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button
                  onClick={sendOTP}
                  disabled={!email || loading}
                  className="w-full btn-grad py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending code…' : 'Send login code →'}
                </button>
              </div>

              <p className="text-xs text-white/25 text-center mt-6">Don&apos;t have an account? Contact your admin to get access.</p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl border border-white/[0.07] bg-white/[0.04] flex items-center justify-center"><Shield size={16} className="text-violet-400"/></div>
                <h1 className="text-xl font-bold tracking-tight">Enter your code</h1>
              </div>
              <p className="text-sm text-white/40 mb-8 ml-12">Sent to <span className="text-white/60">{email}</span> · expires in 5 minutes</p>

              {/* OTP cells */}
              <div className="flex gap-2 justify-center mb-6">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleOtpKeyDown(e, i)}
                    className={`w-11 h-14 text-center text-xl font-bold font-mono rounded-xl border outline-none transition-all ${d ? 'bg-indigo-500/15 border-indigo-500 text-white shadow-[0_0_0_3px_rgba(99,102,241,0.15)]' : 'border-white/[0.12] bg-white/[0.03] text-white'} focus:border-cyan-400 focus:ring-0`}
                  />
                ))}
              </div>

              <button
                onClick={verifyOTP}
                disabled={otp.join('').length < 6 || loading}
                className="w-full btn-grad py-3 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying…' : 'Verify & sign in →'}
              </button>

              <div className="flex items-center justify-between text-xs text-white/30">
                <button onClick={() => { setStep('email'); setOtp(['','','','','','']); }} className="hover:text-white transition-colors">← Change email</button>
                <button onClick={sendOTP} className="hover:text-white transition-colors text-cyan-400/70 hover:text-cyan-400">Resend code</button>
              </div>
            </>
          )}
        </div>

        {/* Security note */}
        <p className="text-center text-xs text-white/20 mt-6">Secured with 256-bit encryption · Codes expire in 5 minutes</p>
      </div>
    </div>
  );
}
