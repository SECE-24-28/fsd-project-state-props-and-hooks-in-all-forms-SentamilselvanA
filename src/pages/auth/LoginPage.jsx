import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { loginUser } from '../../store/authSlice';
import RhythmDanceLogo from '../../assets/rhythmdance.png';

/* ── dancer photos — different set from Register ── */
const PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=500&q=85', alt: 'neon dance sign' },
  { src: 'https://images.unsplash.com/photo-1578736641330-3155e606cd40?w=500&q=85', alt: 'neon studio' },
  { src: 'https://images.unsplash.com/photo-1545959570-a94084071b5d?w=500&q=85', alt: 'dancer silhouette' },
  { src: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=500&q=85', alt: 'stage lights' },
  { src: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=500&q=85', alt: 'ballet pose' },
];

/* mismatched frames — different layout from Register for variety */
const FRAMES = [
  { photo: 0, top:  22, left:  30, w: 200, h: 240, rotate:  2   },
  { photo: 1, top:  50, left: 205, w: 190, h: 210, rotate: -2.5 },
  { photo: 2, top: 230, left:  60, w: 175, h: 215, rotate:  3   },
  { photo: 3, top: 210, left: 210, w: 195, h: 230, rotate: -1.5 },
  { photo: 4, top: 400, left:  95, w: 235, h: 168, rotate:  1.5 },
];

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { loading } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      navigate(result.payload.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: '"Inter", sans-serif' }}>

      {/* ══ LEFT PANEL — photo collage ══ */}
      <div
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #2d0752 0%, #5b0f72 40%, #3e0d68 100%)' }}
      >
        {/* ambient glows */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 30%, rgba(232,121,249,0.22) 0%, transparent 60%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 80%, rgba(249,115,22,0.13) 0%, transparent 55%)', zIndex: 1 }} />

        {/* mismatched collage frames */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          {FRAMES.map((f, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: f.top, left: f.left, width: f.w, height: f.h,
              borderRadius: 16, overflow: 'hidden',
              transform: `rotate(${f.rotate}deg)`,
              boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
              border: '2px solid rgba(255,255,255,0.12)',
            }}>
              <img src={PHOTOS[f.photo].src} alt={PHOTOS[f.photo].alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.2) brightness(0.82)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(80,10,130,0.3) 0%, rgba(0,0,0,0.1) 100%)', mixBlendMode: 'multiply' }} />
            </div>
          ))}
        </div>

        {/* headline scrim */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
          background: 'linear-gradient(to top, rgba(22,5,50,0.97) 0%, rgba(22,5,50,0.75) 50%, transparent 100%)',
          padding: '56px 44px 44px',
        }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.35rem', fontWeight: 700, lineHeight: 1.25, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
            Where Passion Meets{' '}
            <span style={{ background: 'linear-gradient(90deg, #e879f9, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Perfection
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '0.9rem', lineHeight: 1.65, maxWidth: 340, margin: 0 }}>
            Sign in to continue your dance journey and unlock your full potential.
          </p>
        </div>
      </div>

      {/* ══ RIGHT PANEL — clean white form ══ */}
      <div
        className="flex-1 flex items-center justify-center p-6 lg:p-10"
        style={{ background: '#f8f5ff' }}
      >
        <div style={{
          width: '100%', maxWidth: 460,
          background: '#ffffff',
          borderRadius: 20,
          padding: '40px 44px',
          boxShadow: '0 4px 40px rgba(90,20,150,0.10)',
        }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <Link to="/" style={{ display: 'inline-block', textDecoration: 'none', marginBottom: 18 }}>
              <img src={RhythmDanceLogo} alt="Rhythm Dance Academy" style={{ height: 100, width: 'auto', objectFit: 'contain' }} />
            </Link>

            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.7rem', fontWeight: 700, color: '#1a0a2e', margin: '0 0 6px' }}>
              Welcome{' '}
              <span style={{ background: 'linear-gradient(90deg, #c026d3, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Back
              </span>
            </h1>
            <p style={{ color: '#7c6e91', fontSize: '0.875rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#c026d3', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Email */}
            <CleanField label="Email Address" error={errors.email?.message}>
              <CleanInput
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                placeholder="your@email.com"
              />
            </CleanField>

            {/* Password */}
            <CleanField label="Password" error={errors.password?.message}>
              <div style={{ position: 'relative' }}>
                <CleanInput
                  type={showPass ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  placeholder="••••••••"
                  style={{ paddingRight: 44 }}
                />
                <EyeBtn show={showPass} onClick={() => setShowPass(p => !p)} />
              </div>
            </CleanField>

            {/* Remember me + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: -4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 15, height: 15, accentColor: '#c026d3', cursor: 'pointer' }} />
                <span style={{ fontSize: '0.82rem', color: '#7c6e91' }}>Remember me</span>
              </label>
              <Link to="/forgot-password" style={{ fontSize: '0.82rem', color: '#c026d3', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                width: '100%', padding: '13px',
                background: loading ? '#d580e8' : '#c026d3',
                border: 'none', borderRadius: 10,
                color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 18px rgba(192,38,211,0.35)',
                transition: 'background 0.2s, box-shadow 0.2s',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#a21caf'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(162,28,175,0.45)'; } }}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = '#c026d3'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(192,38,211,0.35)'; } }}
            >
              {loading
                ? <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 22, fontSize: '0.8rem' }}>
            <Link to="/" style={{ color: '#b0a0c8', textDecoration: 'none' }}>← Back to Home</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #c4b8d8; }
      `}</style>
    </div>
  );
}

/* ── shared helpers (mirror of RegisterPage) ── */
function CleanField({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#3b2460', marginBottom: 6, letterSpacing: '0.01em' }}>
        {label}
      </label>
      {children}
      {error && <p style={{ color: '#dc2626', fontSize: '0.72rem', marginTop: 4 }}>{error}</p>}
    </div>
  );
}

const CleanInput = React.forwardRef(({ style, ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    style={{
      width: '100%', boxSizing: 'border-box',
      padding: '11px 14px',
      background: '#fff',
      border: '1.5px solid #e2d9f3',
      borderRadius: 9,
      color: '#1a0a2e',
      fontSize: '0.9rem',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      ...style,
    }}
    onFocus={e => { e.target.style.borderColor = '#c026d3'; e.target.style.boxShadow = '0 0 0 3px rgba(192,38,211,0.1)'; }}
    onBlur={e  => { e.target.style.borderColor = '#e2d9f3'; e.target.style.boxShadow = 'none'; }}
  />
));

function EyeBtn({ show, onClick }) {
  return (
    <button type="button" onClick={onClick}
      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#b0a0c8', cursor: 'pointer', padding: 0, display: 'flex' }}>
      {show ? <FiEyeOff size={17} /> : <FiEye size={17} />}
    </button>
  );
}
