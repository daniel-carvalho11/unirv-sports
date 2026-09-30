export interface Athletic {
  id: number;
  name: string;
  acronym: string;
  course: string;
  instagram: string;
}

export const UNIRV_ATHLETICS: Athletic[] = [
  { id: 1, name: 'A.A.A. FAMERV', acronym: 'FAMERV', course: 'Medicina', instagram: '@aaafamerv' },
  { id: 2, name: 'A.A.A. Grifo', acronym: 'GRIFO', course: 'Direito', instagram: '@aaadgrifo' },
  { id: 3, name: 'A.A.A. Víbora', acronym: 'VÍBORA', course: 'Enfermagem', instagram: '@aaadgrifo' },
  { id: 4, name: 'A.A.A. Maníaca', acronym: 'MANÍACA', course: 'Psicologia', instagram: '@aaapmaniaca' },
  { id: 5, name: 'A.A.A. Alcateia', acronym: 'ALCATEIA', course: 'Medicina Veterinária', instagram: '@aaamvetunirv' },
  { id: 6, name: 'A.A.A. Entorse', acronym: 'ENTORSE', course: 'Fisioterapia', instagram: '@aaafirv' },
  { id: 7, name: 'A.A.A. Kromus', acronym: 'KROMUS', course: 'Educação Física / FADES', instagram: '@aaafades' },
  { id: 8, name: 'A.A.A. Neurótica', acronym: 'NEURÓTICA', course: 'Saúde / Geral', instagram: '@atleticaneuroticarv' },
  { id: 9, name: 'A.A.A. AAAFORV', acronym: 'AAAFORV', course: 'Odontologia', instagram: '@aaaforv' },
];