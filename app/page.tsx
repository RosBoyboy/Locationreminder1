"use client";

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  MapPin, Bell, Zap, Shield, Smartphone, Star,
  ArrowRight, Check, ChevronDown, Menu, X,
  Navigation, Map, Tag, CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import PwaInstallButton from '@/components/PwaInstallButton';

const FEATURES = [
  {
    icon: <MapPin size={22} />,
    color: 'from-indigo-500 to-indigo-600',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    title: 'Geofence Triggers',
    desc: 'Draw invisible boundaries around any location. Your reminders fire the moment you step inside.',
  },
  {
    icon: <Bell size={22} />,
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    title: 'Smart Notifications',
    desc: 'Rich push notifications with one-tap Done or Snooze — no app-opening required.',
  },
  {
    icon: <Map size={22} />,
    color: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    title: 'Interactive Map',
    desc: 'Visualise all your location pins on a live map. Tap any pin to preview and manage reminders.',
  },
  {
    icon: <Tag size={22} />,
    color: 'from-pink-400 to-rose-500',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    title: 'Category System',
    desc: 'Organise by Work, Personal, School, Shopping or Health. Filter and find in seconds.',
  },
  {
    icon: <Zap size={22} />,
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    title: 'Instant Sync',
    desc: 'Changes reflect everywhere in real time. Works offline too — syncs the moment you reconnect.',
  },
  {
    icon: <Shield size={22} />,
    color: 'from-cyan-400 to-sky-500',
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    title: 'Privacy First',
    desc: 'Location data never leaves your device. End-to-end encrypted, no third-party tracking.',
  },
];

const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'Product Designer', avatar: 'SC', rating: 5, text: 'GeoRemind completely changed how I run errands. I no longer forget anything — the location triggers are eerily accurate.' },
  { name: 'Marcus Rivera', role: 'Software Engineer', avatar: 'MR', rating: 5, text: 'The map view is gorgeous. Setting up geofences feels like drawing on a map. Best UX I\'ve seen in a productivity app.' },
  { name: 'Priya Nair', role: 'Medical Student', avatar: 'PN', rating: 5, text: 'I use it for every pharmacy run, library visit, and study group. It\'s like having a personal assistant who knows where I am.' },
];

const STEPS = [
  { num: '01', icon: <MapPin size={20} />, title: 'Drop a Pin', desc: 'Tap anywhere on the map or search an address to place your location trigger.' },
  { num: '02', icon: <Navigation size={20} />, title: 'Set the Radius', desc: 'Drag the slider to define how close you need to be before the reminder fires.' },
  { num: '03', icon: <Bell size={20} />, title: 'Get Notified', desc: 'Arrive at the location and receive an instant notification — right when you need it.' },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for personal use',
    features: ['Up to 10 reminders', '3 categories', 'Basic map view', 'Web notifications'],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$4',
    period: 'per month',
    desc: 'For power users',
    features: ['Unlimited reminders', 'All categories', 'Full map view', 'Push + SMS alerts', 'Priority support', 'Offline mode'],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$12',
    period: 'per month',
    desc: 'For small teams',
    features: ['Everything in Pro', 'Up to 10 members', 'Shared reminders', 'Admin dashboard', 'API access', 'Custom integrations'],
    cta: 'Contact Sales',
    highlight: false,
  },
];

// Floating map pin positions for hero illustration
const HERO_PINS = [
  { x: 35, y: 55, color: '#6366f1', label: 'Office', delay: 0 },
  { x: 75, y: 45, color: '#10b981', label: 'Gym', delay: 0.15 },
  { x: 85, y: 65, color: '#f59e0b', label: 'Grocery', delay: 0.3 },
  { x: 45, y: 80, color: '#ec4899', label: '', delay: 0.45 },
  { x: 70, y: 85, color: '#8b5cf6', label: '', delay: 0.6 },
];

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.4]);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const goToLogin = () => router.push('/login');

  return (
    <div className="min-h-screen bg-slate-50/50 overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#6366f1] flex items-center justify-center shadow-md">
              <MapPin size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-[17px]">GeoRemind</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-500">
            {['Features', 'How it works', 'Pricing', 'Testimonials'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="hover:text-[#6366f1] transition-colors">{item}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={goToLogin} className="text-[15px] font-semibold text-slate-600 hover:text-[#6366f1] transition-colors px-3 py-2">
              Sign In
            </button>
            <button onClick={goToLogin} className="bg-[#6366f1] hover:bg-[#4f46e5] transition-colors text-white text-[15px] font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-indigo-200">
              Get Started
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-slate-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3"
            >
              {['Features', 'How it works', 'Pricing', 'Testimonials'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-slate-600 hover:text-indigo-600 py-1">{item}</a>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <button onClick={goToLogin} className="w-full py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600">Sign In</button>
                <button onClick={goToLogin} className="btn-primary w-full py-2.5 rounded-xl text-white text-sm font-semibold">Get Started Free</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
        {/* Subtle dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #e2e8f0 1.5px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.6 }} />

        <div className="relative max-w-[1200px] mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 items-center w-full">
          {/* Left copy */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-xl pr-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 bg-indigo-500/10 text-[#6366f1] text-[13px] font-semibold px-4 py-2 rounded-full mb-8"
            >
              <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full animate-pulse"></div>
              Now available as a PWA — install on any device
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-[64px] font-bold text-slate-800 leading-[1.05] tracking-tight mb-7"
            >
              Reminders that<br />
              <span className="text-[#8b5cf6]">
                know where you<br />
                are.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-[19px] text-slate-500 leading-[1.6] mb-10"
            >
              GeoRemind triggers the right reminder at the right<br />
              place — automatically. No more forgetting the dry<br />
              cleaning when you pass the laundromat.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <button
                onClick={goToLogin}
                className="bg-[#6366f1] hover:bg-[#4f46e5] flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-indigo-200 text-base transition-colors"
              >
                Start for free <ArrowRight size={18} />
              </button>
              <button
                onClick={goToLogin}
                className="flex items-center gap-2 font-semibold text-slate-600 px-8 py-4 rounded-xl border-2 border-slate-100 bg-white hover:bg-slate-50 transition-all text-base shadow-sm"
              >
                View demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-6 text-[15px] font-medium text-slate-400"
            >
              {['No credit card', 'Free forever plan', 'Works offline'].map((item, i) => (
                <div key={item} className="flex items-center gap-2">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-slate-300"></span>}
                  <Check size={16} className="text-emerald-400 stroke-[3]" />
                  <span className="text-slate-400">{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Hero Map Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="relative h-full w-full flex items-center justify-center -ml-4"
          >
            {/* Map card wrapper to give that floating look over the dotted bg */}
            <div className="relative w-[110%] bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 border border-slate-100/60 overflow-visible"
              style={{ aspectRatio: '4/3' }}>
              
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                  {/* Subtle dots inside the card itself just to keep it textured or totally clean */}
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              </div>

              {/* Animated pins + geofences */}
              {HERO_PINS.map((pin, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0, y: -10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.6 + pin.delay }}
                  className="absolute z-10"
                  style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -100%)' }}
                >
                  {/* Geofence */}
                  <div
                    className="absolute"
                    style={{
                      left: '50%', top: '100%',
                      width: 60, height: 60,
                      borderColor: pin.color,
                      backgroundColor: `${pin.color}0A`,
                      borderRadius: '50%',
                      borderWidth: '1.5px',
                      borderStyle: 'dashed',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                  {/* Pin */}
                  <div className="flex flex-col items-center relative z-10">
                    <div className="w-8 h-8 rounded-full border-[2.5px] border-white flex items-center justify-center shadow-md relative"
                      style={{ backgroundColor: pin.color }}>
                      <MapPin size={14} className="text-white" />
                    </div>
                    {/* Inner triangle pointer missing in pure tailwind without raw border so handling with specific inline */}
                    <div className="w-0 h-0"
                      style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `6px solid ${pin.color}` }} />
                    {/* Label chip */}
                    {pin.label && (
                      <div className="mt-1.5 bg-white text-slate-600 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full shadow-sm border border-slate-100/80 whitespace-nowrap">
                        {pin.label}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Floating notification toast */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5, ease: 'easeOut' }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[88%] bg-white rounded-[20px] shadow-2xl shadow-indigo-100/50 border border-slate-100/80 p-3.5 flex items-center gap-3 z-30"
              >
                <div className="w-10 h-10 rounded-full bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-[#6366f1]" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[10px] font-bold text-[#6366f1] uppercase tracking-wider mb-0.5">LOCATION TRIGGER</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[15px] font-bold text-slate-800 leading-none">Buy groceries</p>
                    <span className="text-[15px] leading-none">🛒</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10.5px] text-slate-400 font-medium">
                    <MapPin size={10} className="text-red-400" />
                    <span>You've arrived at Whole Foods</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="px-3.5 py-1.5 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-full transition-colors hover:bg-emerald-100">Done</button>
                  <button className="px-3.5 py-1.5 bg-slate-50 text-slate-500 text-[11px] font-bold rounded-full transition-colors hover:bg-slate-100">Snooze</button>
                </div>
              </motion.div>
            </div>

            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.1 }}
              className="absolute -left-12 top-[35%] bg-white rounded-[1.25rem] shadow-xl shadow-slate-200/50 border border-slate-100/80 px-4 py-3.5 z-40 bg-white/95 backdrop-blur-sm"
            >
              <p className="text-[26px] leading-none font-bold text-[#6366f1] tracking-tight mb-1">98%</p>
              <p className="text-[11px] text-slate-500 font-medium whitespace-nowrap">On-time triggers</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.25 }}
              className="absolute -right-8 top-[15%] bg-white rounded-[1.25rem] shadow-xl shadow-slate-200/50 border border-slate-100/80 px-4 py-3.5 z-40 bg-white/95 backdrop-blur-sm"
            >
              <p className="text-[26px] leading-none font-bold text-emerald-500 tracking-tight mb-1">12k+</p>
              <p className="text-[11px] text-slate-500 font-medium whitespace-nowrap">Active users</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-300"
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <section className="border-y border-slate-100 bg-slate-50 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400 font-medium">
          {['Trusted by teams at', 'Google', 'Notion', 'Figma', 'Linear', 'Vercel', 'Stripe'].map((item, i) => (
            <span key={item} className={i === 0 ? 'text-slate-400' : 'text-slate-300 font-bold text-base tracking-tight'}>{item}</span>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">Features</span>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Everything you need,<br />nothing you don't.</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Built for speed, privacy and simplicity. GeoRemind handles the heavy lifting so you can focus on what matters.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-hover bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transform hover:scale-[1.02] transition-transform"
            >
              <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center ${f.text} mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl" />

        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-white/10 text-indigo-100 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">How it works</span>
            <h2 className="text-4xl font-extrabold text-white mb-4">Up and running in 3 steps.</h2>
            <p className="text-indigo-200 text-lg max-w-md mx-auto">No complicated setup. Just open, pin, and go.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-white/20" style={{ left: '18%', right: '18%' }} />

            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="text-center relative"
              >
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5 relative">
                  <span className="text-white">{step.icon}</span>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-indigo-700 text-[10px] font-black rounded-full flex items-center justify-center">
                    {step.num.replace('0', '')}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-indigo-200 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-14"
          >
            <button
              onClick={goToLogin}
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all text-sm"
            >
              Try it now — it's free <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── SCREENSHOT / APP PREVIEW ── */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">App Preview</span>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">A dashboard built for clarity.</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Every screen is designed to give you exactly the information you need — no clutter, no confusion.</p>
        </motion.div>

        {/* App mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 p-6 md:p-10 shadow-xl"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden" style={{ minHeight: 340 }}>
            {/* Mock topbar */}
            <div className="h-12 bg-white border-b border-slate-100 flex items-center px-5 gap-3 cursor-pointer" onClick={() => router.push('/dashboard')}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 h-6 bg-slate-100/50 rounded-lg mx-4 flex items-center px-2 text-xs text-slate-400">
                Click to open app 👉
              </div>
              <div className="w-6 h-6 rounded-full bg-indigo-100" />
            </div>

            <div className="flex" onClick={() => router.push('/dashboard')}>
              {/* Mock sidebar */}
              <div className="w-14 md:w-52 bg-white border-r border-slate-100 p-3 space-y-1 flex-shrink-0 cursor-pointer">
                {[
                  { icon: '⬛', label: 'Dashboard', active: true },
                  { icon: '🔔', label: 'Reminders', active: false },
                  { icon: '🗺', label: 'Map View', active: false },
                  { icon: '🏷', label: 'Categories', active: false },
                ].map((item, i) => (
                  <div key={item.label} className={`flex items-center gap-2.5 px-2 py-2 rounded-xl ${item.active ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
                    <span className="text-sm">{item.icon}</span>
                    <span className={`hidden md:block text-xs font-medium ${item.active ? 'text-indigo-600' : 'text-slate-400'}`}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Mock content */}
              <div className="flex-1 p-5 space-y-4 cursor-pointer relative group">
                <div className="absolute inset-0 z-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/40 backdrop-blur-sm">
                   <div className="bg-indigo-600 text-white font-semibold shadow-xl rounded-full px-6 py-3" onClick={() => router.push("/dashboard")}>Go to your Dashboard</div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {[['6', 'Total', 'bg-indigo-50'], ['2', 'Done', 'bg-emerald-50'], ['3', 'Pending', 'bg-amber-50'], ['1', 'Active', 'bg-blue-50']].map(([v, l, bg]) => (
                    <div key={l} className={`${bg} rounded-xl p-3`}>
                      <p className="font-bold text-slate-800 text-lg">{v}</p>
                      <p className="text-xs text-slate-500">{l}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    { title: 'Buy groceries', loc: 'Whole Foods', cat: 'Shopping', status: 'Pending', color: 'bg-amber-50 text-amber-600' },
                    { title: 'Submit report', loc: 'Office HQ', cat: 'Work', status: 'Active', color: 'bg-blue-50 text-blue-600' },
                    { title: 'Library return', loc: 'Public Library', cat: 'Personal', status: 'Done', color: 'bg-emerald-50 text-emerald-600' },
                  ].map(r => (
                    <div key={r.title} className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{r.title}</p>
                        <p className="text-[10px] text-slate-400">📍 {r.loc}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${r.color}`}>{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block bg-pink-50 text-pink-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">Testimonials</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Loved by thousands.</h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-amber-400 fill-amber-400" />)}
              <span className="ml-2 text-slate-500 text-sm font-medium">4.9 / 5 from 2,400+ reviews</span>
            </div>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 md:p-10 text-center"
              >
                <div className="flex items-center justify-center gap-1 mb-5">
                  {[...Array(TESTIMONIALS[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xl text-slate-700 font-medium leading-relaxed mb-8 max-w-2xl mx-auto">
                  "{TESTIMONIALS[activeTestimonial].text}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {TESTIMONIALS[activeTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 text-sm">{TESTIMONIALS[activeTestimonial].name}</p>
                    <p className="text-xs text-slate-400">{TESTIMONIALS[activeTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`rounded-full transition-all ${i === activeTestimonial ? 'w-6 h-2 bg-indigo-500' : 'w-2 h-2 bg-slate-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-violet-50 text-violet-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">Pricing</span>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Simple, honest pricing.</h2>
          <p className="text-slate-500 text-lg">Start free. Upgrade when you're ready.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-3xl border p-7 relative ${
                plan.highlight
                  ? 'bg-gradient-to-br from-indigo-600 to-violet-700 border-indigo-500 shadow-2xl shadow-indigo-200 scale-105'
                  : 'bg-white border-slate-100 shadow-sm'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide shadow-md">
                  Most Popular
                </div>
              )}
              <div className="mb-5">
                <p className={`font-bold text-sm mb-1 ${plan.highlight ? 'text-indigo-200' : 'text-slate-500'}`}>{plan.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                  <span className={`text-sm mb-1.5 ${plan.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>/{plan.period}</span>
                </div>
                <p className={`text-xs ${plan.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>{plan.desc}</p>
              </div>

              <ul className="space-y-2.5 mb-7">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5">
                    <CheckCircle size={15} className={plan.highlight ? 'text-indigo-200' : 'text-emerald-500'} />
                    <span className={`text-sm ${plan.highlight ? 'text-indigo-100' : 'text-slate-600'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={goToLogin}
                className={`w-full py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center ${
                  plan.highlight
                    ? 'bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg'
                    : 'btn-primary text-white shadow-md'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 pointer-events-none opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
              <MapPin size={28} className="text-white" />
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-4">Ready to never forget again?</h2>
            <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
              Join 12,000+ users who've made location-based reminders part of their daily routine.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={goToLogin}
                className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all text-sm"
              >
                Get started for free <ArrowRight size={16} />
              </button>
              <PwaInstallButton className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-8 py-3.5 rounded-2xl border border-white/20 hover:bg-white/20 transition-all text-sm" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md">
                  <MapPin size={14} className="text-white" />
                </div>
                <span className="font-bold text-slate-800">GeoRemind</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">Location-based reminders that work for you.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
            ].map(col => (
              <div key={col.title}>
                <p className="font-bold text-slate-700 text-sm mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm text-slate-400 hover:text-indigo-600 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">© 2026 GeoRemind. All rights reserved.</p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
