'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, CirclePlay, LockKeyhole, Menu, Network, Search, ShieldCheck, Sparkles, Target, X, Zap } from 'lucide-react';
import { getSupabaseClient } from '@/lib/db/supabase';

const capabilityCards = [
  { number: '01', title: ['Remember', 'Everything'], description: 'Capture memories, ideas and important moments that shape your story.', icon: 'cube' },
  { number: '02', title: ['Search', 'Your Past'], description: 'Find anything instantly with natural language AI search.', icon: 'lens' },
  { number: '03', title: ['Discover', 'Connections'], description: 'AI finds patterns and links you never saw before.', icon: 'network' },
  { number: '04', title: ['Ask', 'Life Replay'], description: 'Ask questions. Get answers from your own life.', icon: 'dialogue' },
  { number: '05', title: ['Visualize', 'Your Life'], description: 'See your story unfold on interactive maps and timelines.', icon: 'orbit' },
  { number: '06', title: ['Grow', 'Every Day'], description: 'Insights that help you make better decisions and build your future.', icon: 'bars' },
];

const nodes = [
  { label: 'MEMORIES', value: 'Your moments', className: 'node-memory' },
  { label: 'PROJECTS', value: 'Your momentum', className: 'node-projects' },
  { label: 'GOALS', value: 'Your direction', className: 'node-goals' },
  { label: 'DECISIONS', value: 'Your choices', className: 'node-decisions' },
  { label: 'CONNECTIONS', value: 'Your context', className: 'node-connections' },
  { label: 'OPEN LOOPS', value: 'Your next steps', className: 'node-loops' },
];

function CapabilityVisual({ type }: { type: string }) {
  if (type === 'lens') return <div className="cap-visual lens-visual"><span /></div>;
  if (type === 'network') return <div className="cap-visual network-visual"><i /><i /><i /><i /><i /><b /></div>;
  if (type === 'dialogue') return <div className="cap-visual dialogue-visual"><span /><span /><span /></div>;
  if (type === 'orbit') return <div className="cap-visual orbit-visual"><i /><i /><b /></div>;
  if (type === 'bars') return <div className="cap-visual bars-visual"><i /><i /><i /><i /></div>;
  return <div className="cap-visual cube-visual"><span /><i /><b /></div>;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSource, setActiveSource] = useState(0);

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) return;
    client.auth.getUser().then(({ data: { user } }) => setIsAuthenticated(Boolean(user)));
  }, []);

  const startRoute = isAuthenticated ? '/dashboard' : '/signup';

  return (
    <main className="landing-page">
      <div className="landing-grain" />
      <nav className="landing-nav">
        <Link href="/" className="brand-mark" aria-label="Life Replay home"><span className="brand-orbit" /><span>LIFE REPLAY</span></Link>
        <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
          <a href="#product">Product <ChevronDown /></a><a href="#how-it-works">How It Works</a><a href="#capabilities">Features</a><a href="#intelligence">AI Intelligence</a><a href="#pricing">Pricing</a><a href="#resources">Resources <ChevronDown /></a>
        </div>
        <div className="nav-actions"><Link href={isAuthenticated ? '/dashboard' : '/login'} className="nav-sign-in">Sign In</Link><Link href={startRoute} className="button button-nav">Get Started Free <ArrowRight /></Link><button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button></div>
      </nav>

      <section className="hero-shell" id="product">
        <div className="hero-copy reveal-up"><p className="eyebrow"><span /> EARLY ACCESS <b>Lifetime founding members get 60% off</b> <ArrowRight /></p><h1>Your life.<br /><em>Intelligently</em><br />remembered.</h1><p className="hero-description">Life Replay transforms your memories, ideas, projects and decisions into living intelligence that grows with you.</p><div className="hero-actions"><Link href={startRoute} className="button button-light">Start Your Replay <ArrowRight /></Link><a href="#how-it-works" className="button button-quiet"><CirclePlay /> See How It Works</a></div><p className="hero-note"><LockKeyhole /> Private by design. Your history belongs to you.</p></div>
        <div className="intelligence-stage" aria-label="Animated Life Replay intelligence visualization"><div className="stage-haze" /><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><div className="connection-line line-one" /><div className="connection-line line-two" /><div className="connection-line line-three" /><div className="core-sphere"><span className="core-ring" /><strong>YOU</strong><small>Everything<br />connected.</small></div>{nodes.map((node) => <div className={`intelligence-node ${node.className}`} key={node.label}><span>{node.label}</span><strong>{node.value}</strong><i /></div>)}<span className="stage-particle particle-one" /><span className="stage-particle particle-two" /><span className="stage-particle particle-three" /></div>
      </section>

      <section className="trust-strip" aria-label="Life Replay principles"><div><ShieldCheck /><span><b>Private by Design</b><small>Your data is private and always yours.</small></span></div><div><Sparkles /><span><b>AI That Knows Your History</b><small>Personal intelligence built from your life.</small></span></div><div><LockKeyhole /><span><b>Source-Backed Intelligence</b><small>Every insight grounded in your context.</small></span></div><div><Network /><span><b>Built to Last</b><small>Your life. Your data. Your legacy.</small></span></div></section>

      <section className="capabilities-section" id="capabilities"><div className="section-heading reveal-up"><p className="section-kicker">SIX POWERFUL CAPABILITIES</p><h2>Understand your life like <em>never before.</em></h2></div><div className="capability-grid">{capabilityCards.map((card) => <article className="capability-card reveal-up" key={card.number}><span className="card-number">{card.number}</span><CapabilityVisual type={card.icon} /><h3>{card.title.map((line) => <span key={line}>{line}</span>)}</h3><p>{card.description}</p><a href="#intelligence" aria-label={`Explore ${card.title.join(' ')}`}><ArrowRight /></a></article>)}</div></section>

      <section className="story-section" id="how-it-works"><div className="story-copy reveal-up"><p className="section-kicker">MEMORY EVOLUTION</p><h2>An idea is never just an idea.</h2><p>Life Replay follows the quiet thread between the thought you had, the decision you made, and the future it became.</p><a href="#intelligence" className="text-link">Explore your evolution <ArrowRight /></a></div><div className="evolution-visual"><div className="evolution-path" /><div className="evolution-point point-a"><small>JAN 12</small><b>The first spark</b></div><div className="evolution-point point-b"><small>MAR 28</small><b>A direction appears</b></div><div className="evolution-point point-c"><small>JUN 04</small><b>Something real begins</b></div></div></section>

      <section className="intelligence-section" id="intelligence"><div className="intelligence-panel reveal-up"><div className="panel-heading"><p className="section-kicker">ASK YOUR ENTIRE LIFE</p><h2>Questions become <em>clarity.</em></h2></div><div className="ask-window"><div className="ask-question"><Search /><span>What patterns have shaped my work this year?</span></div><div className="ask-answer"><div className="answer-mark"><Sparkles /></div><div><p>Your history points to a recurring pattern: your strongest work begins after you reconnect with an old idea and give it a narrower shape.</p><div className="source-list">{['Memory · The first spark', 'Decision · Choosing focus', 'Project · Something real begins'].map((source, index) => <button key={source} className={activeSource === index ? 'source-active' : ''} onClick={() => setActiveSource(index)}><span>{String(index + 1).padStart(2, '0')}</span>{source}<ArrowRight /></button>)}</div></div></div></div></div><div className="forgotten-panel reveal-up"><p className="section-kicker">FORGOTTEN</p><h2>Sometimes the past<br />knows what you need <em>now.</em></h2><div className="resurface-card"><span>RESURFACED FROM YOUR ARCHIVE</span><p>“Build a quieter place to think.”</p><small>Saved 8 months ago · Related to your current focus</small><Zap /></div></div></section>

      <section className="life-map-section" id="resources"><div className="life-map-copy reveal-up"><p className="section-kicker">LIFE MAP</p><h2>See the shape of<br /><em>who you are becoming.</em></h2><p>Every memory is a point of light. Life Replay helps you see the constellation.</p></div><div className="life-map-visual"><div className="map-core">YOU</div><span className="map-label map-label-a">MEMORIES</span><span className="map-label map-label-b">PROJECTS</span><span className="map-label map-label-c">PEOPLE</span><span className="map-label map-label-d">GOALS</span><div className="map-line map-line-a" /><div className="map-line map-line-b" /><div className="map-line map-line-c" /><div className="map-line map-line-d" /></div></section>

      <section className="final-cta" id="pricing"><div className="moon" /><div className="horizon" /><div className="final-cta-content"><p className="section-kicker">A PRIVATE ARCHIVE OF YOUR EXISTENCE</p><h2>Your life is your<br /><em>greatest asset.</em></h2><p>Life Replay helps you understand it.</p><Link href={startRoute} className="button button-light">Start Your Replay For Free <ArrowRight /></Link><div className="cta-details"><span>✓ Free Forever</span><span>✓ No Credit Card</span><span>✓ Setup in 60 Seconds</span></div></div></section>

      <footer className="landing-footer"><Link href="/" className="brand-mark"><span className="brand-orbit" /><span>LIFE REPLAY</span></Link><span>© 2026 Life Replay AI</span><div><a href="#product">Product</a><a href="#capabilities">Features</a><Link href="/dashboard/privacy">Privacy</Link><Link href="/login">Sign In</Link></div></footer>
    </main>
  );
}
