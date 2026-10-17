import {
  MatchStatus,
  PrismaClient,
  RegistrationStatus,
  SportGender,
  SportType,
  TournamentStatus,
  UserRole,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Senha única para todos os usuários de teste (mínimo de 8 caracteres exigido no login)
const TEST_PASSWORD = 'Unirv@2026';

const athleticsData = [
  { name: 'A.A.A. FAMERV', acronym: 'FAMERV', degreeProgram: 'Medicina', logoUrl: '/athletics/famerv.png' },
  { name: 'A.A.A. Grifo', acronym: 'GRIFO', degreeProgram: 'Direito', logoUrl: '/athletics/grifo.png' },
  { name: 'A.A.A. Víbora', acronym: 'VIBORA', degreeProgram: 'Enfermagem', logoUrl: '/athletics/viboras.png' },
  { name: 'A.A.A. Maníaca', acronym: 'MANIACA', degreeProgram: 'Psicologia', logoUrl: '/athletics/maniaca.png' },
  { name: 'A.A.A. Alcateia', acronym: 'ALCATEIA', degreeProgram: 'Medicina Veterinária', logoUrl: '/athletics/alcateia.png' },
  { name: 'A.A.A. Entorse', acronym: 'ENTORSE', degreeProgram: 'Fisioterapia', logoUrl: '/athletics/entorse.png' },
  { name: 'A.A.A. Kromus', acronym: 'KROMUS', degreeProgram: 'Educação Física / FADES', logoUrl: '/athletics/kromus.png' },
  { name: 'A.A.A. Neurótica', acronym: 'NEUROTICA', degreeProgram: 'Saúde / Geral', logoUrl: '/athletics/neurotica.png' },
  { name: 'A.A.A. AAAFORV', acronym: 'AAAFORV', degreeProgram: 'Odontologia', logoUrl: null },
  { name: 'A.A.A. Cerberus', acronym: 'CERBERUS', degreeProgram: 'Engenharias', logoUrl: '/athletics/cerberus.png' },
  { name: 'A.A.A. Fúria', acronym: 'FURIA', degreeProgram: 'Agronomia', logoUrl: '/athletics/furia.png' },
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

// Usuários de teste: diretor e atletas compartilham a mesma atlética para o fluxo de aprovação funcionar
const testUsers: { name: string; email: string; role: UserRole; athletics?: string; academicId?: string }[] = [
  { name: 'Admin UniRV Esportes', email: 'admin@unirvsports.dev', role: UserRole.ADMIN },
  { name: 'Diretor FAMERV', email: 'diretor.famerv@unirvsports.dev', role: UserRole.REPRESENTATIVE, athletics: 'FAMERV' },
  { name: 'Atleta FAMERV', email: 'atleta.famerv@unirvsports.dev', role: UserRole.ATHLETE, athletics: 'FAMERV', academicId: '20260001' },
  { name: 'Atleta FAMERV 2', email: 'atleta2.famerv@unirvsports.dev', role: UserRole.ATHLETE, athletics: 'FAMERV', academicId: '20260002' },
  { name: 'Diretor Grifo', email: 'diretor.grifo@unirvsports.dev', role: UserRole.REPRESENTATIVE, athletics: 'GRIFO' },
  { name: 'Atleta Grifo', email: 'atleta.grifo@unirvsports.dev', role: UserRole.ATHLETE, athletics: 'GRIFO', academicId: '20260003' },
  { name: 'Oficial de Mesa', email: 'mesario@unirvsports.dev', role: UserRole.TABLE_OFFICIAL },
  { name: 'Torcedor UniRV', email: 'torcedor@unirvsports.dev', role: UserRole.VISITOR },
];

// Inscrições iniciais: uma aprovada, pendentes (aparecem para o diretor) e uma recusada (pode ser reenviada)
const registrationsData = [
  { email: 'atleta.famerv@unirvsports.dev', sport: 'Futsal Masculino', status: RegistrationStatus.APPROVED },
  { email: 'atleta2.famerv@unirvsports.dev', sport: 'Vôlei Feminino', status: RegistrationStatus.PENDING },
  { email: 'atleta2.famerv@unirvsports.dev', sport: 'Beach Tennis Misto', status: RegistrationStatus.REJECTED },
  { email: 'atleta.grifo@unirvsports.dev', sport: 'Futsal Masculino', status: RegistrationStatus.PENDING },
];

const TOURNAMENT = { name: 'Jogos Universitários UniRV', year: 2026 };

function daysFromNow(days: number, hour: number, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date;
}

// Mandante x visitante, por modalidade (siglas das atléticas)
const matchesData = [
  { sport: 'Futsal Masculino', home: 'FAMERV', away: 'GRIFO', stage: 'Fase de Grupos', when: daysFromNow(2, 19, 30), court: 'Ginásio Campus Rio Verde' },
  { sport: 'Futsal Masculino', home: 'CERBERUS', away: 'KROMUS', stage: 'Fase de Grupos', when: daysFromNow(2, 21), court: 'Ginásio Campus Rio Verde' },
  { sport: 'Vôlei Feminino', home: 'FAMERV', away: 'NEUROTICA', stage: 'Semifinal', when: daysFromNow(4, 10), court: 'Ginásio Campus Rio Verde' },
  { sport: 'Beach Tennis Misto', home: 'ALCATEIA', away: 'AAAFORV', stage: 'Fase de Grupos', when: daysFromNow(5, 16), court: 'Arena de Areia UniRV' },
  { sport: 'Handebol Masculino', home: 'GRIFO', away: 'ENTORSE', stage: 'Quartas de Final', when: daysFromNow(7, 20), court: 'Ginásio Campus Rio Verde' },
];

async function seedAthletics() {
  for (const ath of athleticsData) {
    await prisma.athletics.upsert({
      where: { acronym: ath.acronym },
      update: { name: ath.name, degreeProgram: ath.degreeProgram, logoUrl: ath.logoUrl },
      create: ath,
    });
  }
}

async function seedSports() {
  for (const sport of sportsData) {
    await prisma.sport.upsert({
      where: { name: sport.name },
      update: {
        gender: sport.gender,
        type: sport.type,
        shortDesc: sport.shortDesc,
        iconUrl: sport.iconUrl,
      },
      create: sport,
    });
  }
}

async function seedUsers() {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);

  for (const user of testUsers) {
    const athletics = user.athletics
      ? await prisma.athletics.findUniqueOrThrow({ where: { acronym: user.athletics } })
      : null;

    const data = {
      name: user.name,
      role: user.role,
      passwordHash,
      academicId: user.academicId ?? null,
      athleticsId: athletics?.id ?? null,
      deletedAt: null,
    };

    await prisma.user.upsert({
      where: { email: user.email },
      update: data,
      create: { email: user.email, ...data },
    });
  }
}

async function seedRegistrations() {
  for (const reg of registrationsData) {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: reg.email } });
    const sport = await prisma.sport.findUniqueOrThrow({ where: { name: reg.sport } });

    await prisma.athleteSportRegistration.upsert({
      where: { userId_sportId: { userId: user.id, sportId: sport.id } },
      update: { status: reg.status, athleticsId: user.athleticsId!, deletedAt: null },
      create: { userId: user.id, sportId: sport.id, athleticsId: user.athleticsId!, status: reg.status },
    });
  }
}

async function seedTournamentAndMatches() {
  let tournament = await prisma.tournament.findFirst({ where: { ...TOURNAMENT, deletedAt: null } });
  if (!tournament) {
    tournament = await prisma.tournament.create({
      data: {
        ...TOURNAMENT,
        startDate: daysFromNow(0, 0),
        endDate: daysFromNow(30, 0),
        status: TournamentStatus.IN_PROGRESS,
      },
    });
  }

  const official = await prisma.user.findUniqueOrThrow({ where: { email: 'mesario@unirvsports.dev' } });

  for (const m of matchesData) {
    const sport = await prisma.sport.findUniqueOrThrow({ where: { name: m.sport } });

    const tournamentSport =
      (await prisma.tournamentSport.findFirst({ where: { tournamentId: tournament.id, sportId: sport.id } })) ??
      (await prisma.tournamentSport.create({ data: { tournamentId: tournament.id, sportId: sport.id } }));

    const teamIds: number[] = [];
    for (const acronym of [m.home, m.away]) {
      const athletics = await prisma.athletics.findUniqueOrThrow({ where: { acronym } });
      const team =
        (await prisma.team.findFirst({ where: { athleticsId: athletics.id, tournamentSportId: tournamentSport.id } })) ??
        (await prisma.team.create({ data: { athleticsId: athletics.id, tournamentSportId: tournamentSport.id } }));
      teamIds.push(team.id);
    }
    const [homeTeamId, awayTeamId] = teamIds;

    // Reexecutar o seed reposiciona as datas para o futuro, sem duplicar partidas
    const matchData = {
      stage: m.stage,
      scheduledAt: m.when,
      locationCourt: m.court,
      tableOfficialId: official.id,
      status: MatchStatus.SCHEDULED,
      homeScore: 0,
      awayScore: 0,
      stopwatchSeconds: 0,
    };

    const existing = await prisma.match.findFirst({
      where: { tournamentSportId: tournamentSport.id, homeTeamId, awayTeamId, deletedAt: null },
    });

    if (existing) {
      await prisma.match.update({ where: { id: existing.id }, data: matchData });
    } else {
      await prisma.match.create({
        data: { tournamentSportId: tournamentSport.id, homeTeamId, awayTeamId, ...matchData },
      });
    }
  }
}

async function main() {
  console.log('Populando banco: atléticas, modalidades, usuários, inscrições e partidas...');

  await seedAthletics();
  await seedSports();
  await seedUsers();
  await seedRegistrations();
  await seedTournamentAndMatches();

  console.log('Seed concluído com sucesso!');
  console.log(`\nUsuários de teste (senha: ${TEST_PASSWORD}):`);
  console.table(testUsers.map(({ email, role, athletics }) => ({ email, role, atletica: athletics ?? '-' })));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
