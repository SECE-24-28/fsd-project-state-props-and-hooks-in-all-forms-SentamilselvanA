import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { registerUser } from '../../store/authSlice';
import RhythmDanceLogo from '../../assets/rhythmdance.png';

const passwordChecks = [
  { label: '8+ chars',    test: (p) => p.length >= 8 },
  { label: 'Uppercase',   test: (p) => /[A-Z]/.test(p) },
  { label: 'Number',      test: (p) => /\d/.test(p) },
  { label: 'Special',     test: (p) => /[!@#$%^&*]/.test(p) },
];

const getStrength = (password) => {
  const passed = passwordChecks.filter(c => c.test(password)).length;
  if (passed <= 1) return { label: 'Weak',   color: '#ef4444', width: '25%' };
  if (passed <= 2) return { label: 'Fair',   color: '#eab308', width: '50%' };
  if (passed <= 3) return { label: 'Good',   color: '#3b82f6', width: '75%' };
  return             { label: 'Strong', color: '#22c55e', width: '100%' };
};

const PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=500&q=85', alt: 'contemporary dancer leap' },
  { src: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=500&q=85', alt: 'ballet silhouette' },
  { src: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=500&q=85', alt: 'neon dance studio' },
  { src: 'https://images.unsplash.com/photo-1545959570-a94084071b5d?w=500&q=85', alt: 'dancer mid-motion' },
  { src: 'https://images.unsplash.com/photo-1578736641330-3155e606cd40?w=500&q=85', alt: 'dancer pose' },
];

const FRAMES = [
  { photo: 0, top:  18, left:  24, w: 210, h: 260, rotate:  -3   },
  { photo: 1, top:  40, left: 210, w: 185, h: 220, rotate:   2   },
  { photo: 2, top: 220, left:  55, w: 170, h: 200, rotate:  -1.5 },
  { photo: 3, top: 200, left: 205, w: 200, h: 240, rotate:   3   },
  { photo: 4, top: 390, left:  90, w: 240, h: 175, rotate:  -2   },
];

export default function RegisterPage() {
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { loading } = useSelector((s) => s.auth);
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const password    = watch('password', '');
  const strength    = password ? getStrength(password) : null;

  const onSubmit = async (data) => {
    const { confirmPassword, ...registerData } = data;
    const result = await dispatch(registerUser(registerData));
    if (registerUser.fulfilled.match(result)) navigate('/student/dashboard');
  };

  return (
    <>
      {/* ── viewport wrapper: strict 100vh, no page scroll ── */}
      <div style={S.root}>

        {/* ══ LEFT PANEL ══ */}
        <div style={S.left} className="hidden lg:block">
          {/* ambient glows */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 70%, rgba(232,121,249,0.22) 0%, transparent 60%)', zIndex: 1 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 75% 15%, rgba(249,115,22,0.13) 0%, transparent 55%)', zIndex: 1 }} />

          {/* collage frames */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
            {FRAMES.map((f, i) => (
              <div key={i} style={{
                position: 'absolute', top: f.top, left: f.left, width: f.w, height: f.h,
                borderRadius: 16, overflow: 'hidden', transform: `rotate(${f.rotate}deg)`,
                boxShadow: '0 12px 40px rgba(0,0,0,0.55)', border: '2px solid rgba(255,255,255,0.12)',
              }}>
                <img src={PHOTOS[f.photo].src} alt={PHOTOS[f.photo].alt}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.2) brightness(0.82)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(80,10,130,0.3) 0%, rgba(0,0,0,0.1) 100%)', mixBlendMode: 'multiply' }} />
              </div>
            ))}
          </div>

          {/* headline scrim */}
          <div style={S.scrim}>
            <h2 style={S.scrimH2}>
              Where Every{' '}
              <span style={S.gradientText}>Step</span>
              {' '}Tells a Story
            </h2>
            <p style={S.scrimP}>Begin your journey with Rhythm Dance Academy and discover the dancer within you.</p>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div style={S.right}>
          {/*
            Card: flex column so header + scrollable-fields + footer
            each take exactly the space they need.
          */}
          <div style={S.card}>

            {/* ── HEADER (fixed, never scrolls) ── */}
            <div style={S.cardHeader}>
              <Link to="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
                <img src={RhythmDanceLogo} alt="Rhythm Dance Academy" style={S.logo} />
              </Link>
              <h1 style={S.title}>
                Create Your{' '}
                <span style={S.gradientText}>Account</span>
              </h1>
              <p style={S.subtitle}>
                Already have an account?{' '}
                <Link to="/login" style={S.link}>Sign in</Link>
              </p>
            </div>

            {/* ── SCROLLABLE FIELD AREA (only this scrolls on tiny screens) ── */}
            <div style={S.fieldArea}>
              <form
                id="register-form"
                onSubmit={handleSubmit(onSubmit)}
                style={S.form}
              >
                {/* Full Name */}
                <CleanField label="Full Name" error={errors.name?.message}>
                  <CleanInput
                    {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                    placeholder="Your full name"
                  />
                </CleanField>

                {/* Email */}
                <CleanField label="Email Address" error={errors.email?.message}>
                  <CleanInput
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                    placeholder="your@email.com"
                  />
                </CleanField>

                {/* Mobile */}
                <CleanField label="Mobile Number" error={errors.mobile?.message}>
                  <CleanInput
                    {...register('mobile', { required: 'Mobile is required', pattern: { value: /^[0-9+\-\s]{7,15}$/, message: 'Invalid mobile' } })}
                    placeholder="+91 00000 00000"
                  />
                </CleanField>

                {/* Password */}
                <CleanField label="Password" error={errors.password?.message}>
                  <div style={{ position: 'relative' }}>
                    <CleanInput
                      type={showPass ? 'text' : 'password'}
                      {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                      placeholder="••••••••"
                      style={{ paddingRight: 44 }}
                    />
                    <EyeBtn show={showPass} onClick={() => setShowPass(p => !p)} />
                  </div>

                  {/* Strength indicator — compact inline layout */}
                  {password && strength && (
                    <div style={S.strengthWrap}>
                      {/* bar + label on one line */}
                      <div style={S.strengthRow}>
                        <div style={S.strengthTrack}>
                          <div style={{ ...S.strengthFill, width: strength.width, background: strength.color }} />
                        </div>
                        <span style={{ ...S.strengthLabel, color: strength.color }}>{strength.label}</span>
                      </div>
                      {/* 4 checks in a single row */}
                      <div style={S.checksRow}>
                        {passwordChecks.map(({ label, test }) => (
                          <span key={label} style={{ ...S.checkItem, color: test(password) ? '#16a34a' : '#b0a0c8' }}>
                            {test(password) ? <FiCheck size={8} /> : <FiX size={8} />}
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CleanField>

                {/* Confirm Password */}
                <CleanField label="Confirm Password" error={errors.confirmPassword?.message}>
                  <div style={{ position: 'relative' }}>
                    <CleanInput
                      type={showConfirm ? 'text' : 'password'}
                      {...register('confirmPassword', { required: 'Please confirm password', validate: v => v === password || 'Passwords do not match' })}
                      placeholder="••••••••"
                      style={{ paddingRight: 44 }}
                    />
                    <EyeBtn show={showConfirm} onClick={() => setShowConfirm(p => !p)} />
                  </div>
                </CleanField>
              </form>
            </div>

            {/* ── FOOTER (submit + back link, always visible) ── */}
            <div style={S.cardFooter}>
              <button
                type="submit"
                form="register-form"
                disabled={loading}
                style={{
                  ...S.submitBtn,
                  background: loading ? '#d580e8' : '#c026d3',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#a21caf'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(162,28,175,0.45)'; } }}
                onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = '#c026d3'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(192,38,211,0.35)'; } }}
              >
                {loading
                  ? <div style={S.spinner} />
                  : 'Create Account'}
              </button>

              <p style={{ textAlign: 'center', marginTop: 10, fontSize: '0.78rem' }}>
                <Link to="/" style={{ color: '#b0a0c8', textDecoration: 'none' }}>← Back to Home</Link>
              </p>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #c4b8d8; }
      `}</style>
    </>
  );
}

/* ─────────────────────────── styles object ─────────────────────────── */
const S = {
  /* wrapper: hard 100vh, no overflow */
  root: {
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    fontFamily: '"Inter", sans-serif',
  },

  /* left purple panel */
  left: {
    width: '50%',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(145deg, #2d0752 0%, #5b0f72 40%, #3e0d68 100%)',
    flexShrink: 0,
  },

  scrim: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
    background: 'linear-gradient(to top, rgba(22,5,50,0.97) 0%, rgba(22,5,50,0.75) 50%, transparent 100%)',
    padding: '48px 44px 40px',
  },
  scrimH2: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '2.2rem', fontWeight: 700, lineHeight: 1.25,
    color: '#fff', margin: '0 0 10px', letterSpacing: '-0.01em',
  },
  scrimP: { color: 'rgba(255,255,255,0.58)', fontSize: '0.88rem', lineHeight: 1.65, maxWidth: 340, margin: 0 },

  gradientText: {
    background: 'linear-gradient(90deg, #e879f9, #f97316)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  },

  /* right panel: centers the card, never overflows */
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f5ff',
    overflow: 'hidden',        /* page-level scroll blocked here too */
    padding: '16px',
  },

  /*
    Card is a flex column:
      header  → shrinks to content
      fields  → flex: 1, overflow-y: auto  (only this scrolls if needed)
      footer  → shrinks to content
    maxHeight: 96vh keeps it from overflowing on short screens.
  */
  card: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '96vh',
    background: '#ffffff',
    borderRadius: 20,
    boxShadow: '0 4px 40px rgba(90,20,150,0.10)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  /* header: logo + title + subtitle — never scrolls */
  cardHeader: {
    textAlign: 'center',
    padding: '20px 36px 12px',
    flexShrink: 0,
  },

  logo: { height: 72, width: 'auto', objectFit: 'contain', marginBottom: 10 },

  title: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '1.55rem', fontWeight: 700, color: '#1a0a2e', margin: '0 0 4px',
  },
  subtitle: { color: '#7c6e91', fontSize: '0.82rem', margin: 0 },
  link: { color: '#c026d3', fontWeight: 600, textDecoration: 'none' },

  /*
    The scrollable zone: only this div gets overflow-y: auto.
    On full-height screens it won't show a scrollbar; on short screens
    (e.g. landscape mobile) it scrolls independently.
  */
  fieldArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 36px',
    /* custom thin scrollbar so it doesn't look jarring */
    scrollbarWidth: 'thin',
    scrollbarColor: '#e2d9f3 transparent',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,                  /* tightened from 16 → 10 */
    paddingBottom: 4,
  },

  /* footer: submit button + back link — never scrolls */
  cardFooter: {
    padding: '10px 36px 16px',
    flexShrink: 0,
  },

  submitBtn: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.92rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 4px 18px rgba(192,38,211,0.35)',
    transition: 'background 0.2s, box-shadow 0.2s',
    letterSpacing: '0.02em',
  },

  spinner: {
    width: 18, height: 18,
    border: '2px solid rgba(255,255,255,0.35)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },

  /* ── compact strength indicator ── */
  strengthWrap: { marginTop: 5 },

  strengthRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  strengthTrack: {
    flex: 1, height: 3,
    background: '#ede9f5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s',
  },
  strengthLabel: {
    fontSize: '0.68rem',
    fontWeight: 600,
    flexShrink: 0,
  },

  /* 4 checks in one horizontal row */
  checksRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'nowrap',       /* single line on normal screens */
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontSize: '0.65rem',
    whiteSpace: 'nowrap',
  },
};

/* ─────────────────────────── helpers ─────────────────────────── */
function CleanField({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#3b2460', marginBottom: 4, letterSpacing: '0.01em' }}>
        {label}
      </label>
      {children}
      {error && <p style={{ color: '#dc2626', fontSize: '0.68rem', marginTop: 3 }}>{error}</p>}
    </div>
  );
}

const CleanInput = React.forwardRef(({ style, ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    style={{
      width: '100%', boxSizing: 'border-box',
      padding: '9px 13px',          /* tightened from 11px → 9px */
      background: '#fff',
      border: '1.5px solid #e2d9f3',
      borderRadius: 9,
      color: '#1a0a2e',
      fontSize: '0.875rem',
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
    <button
      type="button"
      onClick={onClick}
      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#b0a0c8', cursor: 'pointer', padding: 0, display: 'flex' }}
    >
      {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
    </button>
  );
}
