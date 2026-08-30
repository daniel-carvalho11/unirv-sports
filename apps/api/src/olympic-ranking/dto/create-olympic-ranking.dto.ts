export class CreateOlympicRankingDto {
  tournamentId: number;
  athleticsId: number;
  totalPoints?: number;
  goldCount?: number;
  silverCount?: number;
  bronzeCount?: number;
}