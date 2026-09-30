'use client';

import React, { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: string; // Ex: '2026-10-15T09:00:00'
  title?: string;
}

export function CountdownTimer({ targetDate, title = 'Grande Abertura dos Jogos UniRV' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-unirv-green/30 p-6 md:p-8 rounded-3xl shadow-2xl text-center space-y-4">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-unirv-green/10 border border-unirv-green/20 rounded-full text-[11px] font-extrabold text-unirv-green uppercase tracking-widest">
        <span>⏱️</span> Contagem Regressiva de Lançamento
      </div>
      <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">{title}</h3>

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto pt-2">
        <div className="bg-slate-950/80 border border-slate-800 p-3 md:p-4 rounded-2xl">
          <span className="block text-2xl md:text-4xl font-black text-unirv-green">{timeLeft.days}</span>
          <span className="text-[10px] md:text-xs font-bold uppercase text-slate-400">Dias</span>
        </div>
        <div className="bg-slate-950/80 border border-slate-800 p-3 md:p-4 rounded-2xl">
          <span className="block text-2xl md:text-4xl font-black text-white">{timeLeft.hours}</span>
          <span className="text-[10px] md:text-xs font-bold uppercase text-slate-400">Horas</span>
        </div>
        <div className="bg-slate-950/80 border border-slate-800 p-3 md:p-4 rounded-2xl">
          <span className="block text-2xl md:text-4xl font-black text-white">{timeLeft.minutes}</span>
          <span className="text-[10px] md:text-xs font-bold uppercase text-slate-400">Min</span>
        </div>
        <div className="bg-slate-950/80 border border-slate-800 p-3 md:p-4 rounded-2xl">
          <span className="block text-2xl md:text-4xl font-black text-white">{timeLeft.seconds}</span>
          <span className="text-[10px] md:text-xs font-bold uppercase text-slate-400">Seg</span>
        </div>
      </div>
    </div>
  );
}