'use client';

import { useEffect, useState, useRef } from 'react';

const AI_LOGS = [
  { prefix: '⚡', text: 'jossue.ai Engine Initializing...', color: 'text-amber-400' },
  { prefix: '>', text: 'Connecting to neural interface...', color: 'text-cyan-400/60' },
  { prefix: '[+]', text: 'Loaded 3D Context Window', color: 'text-white/60' },
  {
    prefix: '>',
    text: 'import { Canvas, useFrame } from "@react-three/fiber";',
    color: 'text-cyan-400/60',
  },
  {
    prefix: '>',
    text: 'import { OrbitControls } from "@react-three/drei";',
    color: 'text-cyan-400/60',
  },
  { prefix: '[~]', text: 'Optimizing WebGL shaders...', color: 'text-white/60' },
  { prefix: '>', text: 'function SceneSkeleton() {', color: 'text-cyan-400/60' },
  {
    prefix: '>',
    text: '  const introState = useSceneState((s) => s.introState);',
    color: 'text-cyan-400/60',
  },
  { prefix: '>', text: '  return (', color: 'text-cyan-400/60' },
  { prefix: '>', text: '    <Suspense fallback={<SceneLoader />}>', color: 'text-cyan-400/60' },
  {
    prefix: '>',
    text: '      <Canvas camera={{ position: [-5, 3.5, 10], fov: 50 }}>',
    color: 'text-cyan-400/60',
  },
  { prefix: '[~]', text: 'Generating Hitboxes [Car, Desk, Tools]...', color: 'text-white/60' },
  { prefix: '>', text: '        <SceneContent />', color: 'text-cyan-400/60' },
  { prefix: '>', text: '        <CameraRig />', color: 'text-cyan-400/60' },
  { prefix: '>', text: '      </Canvas>', color: 'text-cyan-400/60' },
  { prefix: '>', text: '    </Suspense>', color: 'text-cyan-400/60' },
  { prefix: '>', text: '  );', color: 'text-cyan-400/60' },
  { prefix: '>', text: '}', color: 'text-cyan-400/60' },
  { prefix: '[+]', text: 'Emissive materials baked.', color: 'text-white/60' },
  { prefix: '⚡', text: 'ENVIRONMENT ONLINE', color: 'text-green-400' },
];

const TYPE_SPEED_MS = 2;
const LINE_PAUSE_MS = 80;

export function TerminalBoot({ onComplete }: { onComplete: () => void }) {
  const [history, setHistory] = useState<typeof AI_LOGS>([]);
  const [currentLineText, setCurrentLineText] = useState('');
  const [logIndex, setLogIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (waitingForInput) return;

    if (logIndex >= AI_LOGS.length) {
      if (!waitingForInput) setWaitingForInput(true);
      const timer = setTimeout(() => {
        setLogIndex(0);
        setCharIndex(0);
      }, 500);
      return () => clearTimeout(timer);
    }

    const targetLog = AI_LOGS[logIndex];

    if (charIndex < targetLog.text.length) {
      const timer = setTimeout(
        () => {
          setCurrentLineText(targetLog.text.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        },
        Math.random() * TYPE_SPEED_MS + 2,
      ); // slightly randomized typing speed
      return () => clearTimeout(timer);
    }

    // Line complete
    const timer = setTimeout(() => {
      setHistory((prev) => {
        const next = [...prev, targetLog];
        // Keep history from getting infinitely long
        return next.length > 50 ? next.slice(next.length - 50) : next;
      });
      setCurrentLineText('');
      setLogIndex((l) => l + 1);
      setCharIndex(0);
    }, LINE_PAUSE_MS);

    return () => clearTimeout(timer);
  }, [logIndex, charIndex, waitingForInput]);

  useEffect(() => {
    // Auto-scroll to bottom of logs
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history, currentLineText]);

  useEffect(() => {
    if (!waitingForInput) return;

    function handleInput() {
      onComplete();
    }

    window.addEventListener('keydown', handleInput);
    window.addEventListener('click', handleInput);

    return () => {
      window.removeEventListener('keydown', handleInput);
      window.removeEventListener('click', handleInput);
    };
  }, [waitingForInput, onComplete]);

  return (
    <div className="pointer-events-auto absolute inset-0 z-50 flex h-full w-full bg-[#050505]">
      {/* Left Side: Large Image */}
      <div className="relative hidden w-[40%] border-r border-white/5 md:block lg:w-[50%]">
        <img
          src="/social/jossue-accord-photo.jpg"
          alt="Jossue"
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505]/90" />
      </div>

      {/* Right Side: AI Terminal Screen */}
      <div className="flex w-full flex-col justify-center p-8 md:w-[60%] lg:w-[50%] lg:p-16">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-3 w-3 animate-pulse rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
          <span className="font-mono text-xs tracking-widest text-orange-400">
            JOSSUE.AI // BUILD MODE
          </span>
        </div>

        <div
          ref={containerRef}
          className="h-[300px] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-black/50 p-6 font-mono text-sm leading-relaxed backdrop-blur-md"
        >
          {history.map((log, i) => (
            <div key={i} className="mb-1 flex gap-3">
              <span className="w-6 shrink-0 text-white/30">{log.prefix}</span>
              <span className={log.color}>{log.text}</span>
            </div>
          ))}

          {logIndex < AI_LOGS.length && (
            <div className="flex gap-3">
              <span className="w-6 shrink-0 text-white/30">{AI_LOGS[logIndex].prefix}</span>
              <span className={AI_LOGS[logIndex].color}>
                {currentLineText}
                <span className="animate-typing-cursor ml-[1px] inline-block h-[1em] w-[8px] bg-white align-middle" />
              </span>
            </div>
          )}

          {waitingForInput && (
            <div className="mt-8 animate-pulse text-cyan-400">
              [ READY : CLICK OR PRESS ANY KEY TO TAKE CONTROL ]
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
