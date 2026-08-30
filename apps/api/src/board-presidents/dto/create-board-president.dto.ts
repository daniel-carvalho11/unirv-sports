export class CreateBoardPresidentDto {
  athleticsId: number;
  name: string;
  tenureYear: number;
  photoUrl?: string;
  role?: string;
  isCurrent?: boolean;
}