export interface Athletic {
  id: number;
  name: string;
  acronym: string;
  course: string;
  instagram: string;
  logoUrl?: string;
}

export const UNIRV_ATHLETICS: Athletic[] = [
  { id: 1, name: 'A.A.A. FAMERV', acronym: 'FAMERV', course: 'Medicina', instagram: '@aaafamerv', logoUrl: '/athletics/famerv.png' },
  { id: 2, name: 'A.A.A. Grifo', acronym: 'GRIFO', course: 'Direito', instagram: '@aaadgrifo', logoUrl: '/athletics/grifo.png' },
  { id: 3, name: 'A.A.A. Víbora', acronym: 'VÍBORA', course: 'Enfermagem', instagram: '@aaavenfermagem', logoUrl: '/athletics/viboras.png' },
  { id: 4, name: 'A.A.A. Maníaca', acronym: 'MANÍACA', course: 'Psicologia', instagram: '@aaapmaniaca', logoUrl: '/athletics/maniaca.png' },
  { id: 5, name: 'A.A.A. Alcateia', acronym: 'ALCATEIA', course: 'Medicina Veterinária', instagram: '@aaamvetunirv', logoUrl: '/athletics/alcateia.png' },
  { id: 6, name: 'A.A.A. Entorse', acronym: 'ENTORSE', course: 'Fisioterapia', instagram: '@aaafirv', logoUrl: '/athletics/entorse.png' },
  { id: 7, name: 'A.A.A. Kromus', acronym: 'KROMUS', course: 'Educação Física / FADES', instagram: '@aaafades', logoUrl: '/athletics/kromus.png' },
  { id: 8, name: 'A.A.A. Cerberus', acronym: 'CERBERUS', course: 'Engenharia / TI', instagram: '@aaacerberus', logoUrl: '/athletics/cerberus.png' },
  { id: 9, name: 'A.A.A. Fúria', acronym: 'FÚRIA', course: 'Agronomia', instagram: '@aaafuria', logoUrl: '/athletics/furia.png' },
  { id: 10, name: 'A.A.A. Neurótica', acronym: 'NEURÓTICA', course: 'Medicina', instagram: '@aaaneurotica', logoUrl: '/athletics/neurotica.png' },
];

export function getAthleticLogo(acronym?: string): string {
  if (!acronym) return '/athletics/default.png';
  
  // Trata acentos e minúsculas
  const clean = acronym.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Mapeamento específico para arquivos com plural ou variações
  if (clean === 'vibora') return '/athletics/viboras.png';
  
  return `/athletics/${clean}.png`;
}