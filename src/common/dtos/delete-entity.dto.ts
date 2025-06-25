import { ArrayMinSize, IsNumber } from 'class-validator';

export class DeleteEntityDto {
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  ids: number[];
}
