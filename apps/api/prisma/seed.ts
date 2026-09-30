import { PrismaClient } from '@prisma/client';

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
];

async function main() {
  console.log('Populando banco de dados com as atléticas da UniRV...');

  for (const ath of athleticsData) {
    await prisma.athletics.upsert({
      where: { acronym: ath.acronym },
      update: { name: ath.name, degreeProgram: ath.degreeProgram },
      create: { name: ath.name, acronym: ath.acronym, degreeProgram: ath.degreeProgram },
    });
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });