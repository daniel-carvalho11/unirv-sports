import { PrismaClient, SportGender, SportType } from '@prisma/client';

const prisma = new PrismaClient();

const athleticsData = [
  { name: 'A.A.A. FAMERV', acronym: 'FAMERV', degreeProgram: 'Medicina' },
  { name: 'A.A.A. Grifo', acronym: 'GRIFO', degreeProgram: 'Direito' },
  { name: 'A.A.A. Víbora', acronym: 'VIBORA', degreeProgram: 'Enfermagem' },
  { name: 'A.A.A. Maníaca', acronym: 'MANIACA', degreeProgram: 'Psicologia' },
  { name: 'A.A.A. Alcateia', acronym: 'ALCATEIA', degreeProgram: 'Medicina Veterinária' },
  { name: 'A.A.A. Entorse', acronym: 'ENTORSE', degreeProgram: 'Fisioterapia' },
  { name: 'A.A.A. Kromus', acronym: 'KROMUS', degreeProgram: 'Educação Física / FADES' },
  { name: 'A.A.A. Neurótica', acronym: 'NEUROTICA', degreeProgram: 'Saúde / Geral' },
  { name: 'A.A.A. AAAFORV', acronym: 'AAAFORV', degreeProgram: 'Odontologia' },
  { name: 'A.A.A. Cerberus', acronym: 'CERBERUS', degreeProgram: 'Engenharias' },
];

const sportsData = [
  {
    name: 'Futsal Masculino',
    gender: SportGender.MALE,
    type: SportType.DIRECT_SCORE,
    shortDesc: 'Treinos terças e quintas no Ginásio do Campus.',
    iconUrl: '⚽',
  },
  {
    name: 'Futsal Feminino',
    gender: SportGender.FEMALE,
    type: SportType.DIRECT_SCORE,
    shortDesc: 'Treinos segundas e quartas no Ginásio do Campus.',
    iconUrl: '⚽',
  },
  {
    name: 'Beach Tennis Misto',
    gender: SportGender.MIXED,
    type: SportType.SETS_PARTIALS,
    shortDesc: 'Jogos e treinos funcionais na Arena de Areia.',
    iconUrl: '🎾',
  },
  {
    name: 'Vôlei Feminino',
    gender: SportGender.FEMALE,
    type: SportType.SETS_PARTIALS,
    shortDesc: 'Treinos segundas e quartas no Ginásio do Campus.',
    iconUrl: '🏐',
  },
  {
    name: 'Handebol Masculino',
    gender: SportGender.MALE,
    type: SportType.DIRECT_SCORE,
    shortDesc: 'Preparatório para os Jogos Universitários.',
    iconUrl: '🤾',
  },
  {
    name: 'Basquete 3x3',
    gender: SportGender.MIXED,
    type: SportType.DIRECT_SCORE,
    shortDesc: 'Treinos ao ar livre e torneios relâmpago.',
    iconUrl: '🏀',
  },
];

async function main() {
  console.log('Populando banco com Atléticas e Modalidades...');

  for (const ath of athleticsData) {
    await prisma.athletics.upsert({
      where: { acronym: ath.acronym },
      update: { name: ath.name, degreeProgram: ath.degreeProgram },
      create: { name: ath.name, acronym: ath.acronym, degreeProgram: ath.degreeProgram },
    });
  }

  for (const sport of sportsData) {
    await prisma.sport.upsert({
      where: { name: sport.name },
      update: {
        gender: sport.gender,
        type: sport.type,
        shortDesc: sport.shortDesc,
        iconUrl: sport.iconUrl,
      },
      create: {
        name: sport.name,
        gender: sport.gender,
        type: sport.type,
        shortDesc: sport.shortDesc,
        iconUrl: sport.iconUrl,
      },
    });
  }

  console.log('Seed de Atléticas e Esportes concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });