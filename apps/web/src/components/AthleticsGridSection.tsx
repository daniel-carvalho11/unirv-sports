'use client';

import React from 'react';

const athletics = [
  { name: 'FAMERV', course: 'Medicina' },
  { name: 'GRIFO', course: 'Direito' },
  { name: 'MARFIM', course: 'Odontologia' },
  { name: 'CERBERUS', course: 'Engenharia' },
  { name: 'ENTORSE', course: 'Fisioterapia' },
  { name: 'FÚRIA', course: 'Agronomia' },
  { name: 'ALCATEIA', course: 'Medicina Veterinária' },
  { name: 'VÍBORAS', course: 'Enfermagem' },
];

export function AthleticsGridSection() {
  return (
    <section id="atleticas" className="py-20 px-4 bg-slate-950 border-b border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-unirv-green block mb-1">
            Sangue Universitário
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Atléticas Participantes
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {athletics.map((item, index) => (
            <div
              key={index}
              className="bg-slate-900 rounded-2xl p-6 text-center border border-slate-800 hover:border-unirv-green transition-all duration-300 hover:-translate-y-1 shadow-lg group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4 group-hover:bg-unirv-green/10 group-hover:border-unirv-green transition-colors">
                <span className="font-black text-lg text-white group-hover:text-unirv-green">
                  {item.name.substring(0, 2)}
                </span>
              </div>
              <h3 className="font-extrabold text-white text-base uppercase tracking-wide">
                {item.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {item.course}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}