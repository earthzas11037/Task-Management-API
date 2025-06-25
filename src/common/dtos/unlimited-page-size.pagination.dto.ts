import { IsOptional, Min, IsNumber, Max } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { Transform } from 'class-transformer';

export class UnlimitedPageSizePaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(-1)
  @Max(10000)
  @IsNumber()
  pageSize: number = -1;
}
