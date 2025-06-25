import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';
import _, { every } from 'lodash';

export const PaginationDtoCreator = () => PaginationDto;

const VALID_FILTER_OPERATION = ['=', '>=', '<=', '>', '<'];

type PaginationResponseType = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};
export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @IsNumber()
  @ApiProperty({ type: 'number', minimum: 1, name: 'page', default: 1 })
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @Max(100)
  @IsNumber()
  @ApiProperty({ type: 'number', minimum: 1, name: 'pageSize', default: 10 })
  pageSize: number = 10;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'object') return value;
    const [columnName, searchValue] = String(value).split(':');
    return { columnName, sortOrder: searchValue };
  })
  @IsObject()
  @ApiProperty({ type: 'string', name: 'sort', default: 'id:ASC' })
  sort: { columnName: string; sortOrder: 'ASC' | 'DESC' };

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'object') return value;
    const splitedValue = String(value)
      .split(',')
      .map((x) => x.split('|'));
    return splitedValue
      .map((x) => {
        return { columnName: String(_.get(x, 0)), operation: String(_.get(x, 1)), value: `"${String(_.get(x, 2))}"` };
      })
      .filter((x) => VALID_FILTER_OPERATION.includes(x.operation));
  })
  @IsArray()
  @ApiProperty({
    type: 'string',
    name: 'filter',
    required: false,
    default: '',
    example: '',
    description: 'fieldName|operation|value, fieldName|operation|value Ex. createdAt|>|2025-01-09T22:39:47.638Z,updatedAt|>|2025-01-09T22:39:47.638Z',
  })
  filter: { columnName: string; operation: string; value: string }[];

  @IsOptional()
  @Transform(({ value }) => {
    const v = value.replace(/\*/g, '%');
    if (every(v.split(''), (x) => x === '%')) return '';
    return v;
  })
  @IsString()
  @ApiProperty({
    type: 'string',
    name: '_search',
    default: '**',
    description: 'Value to search. Ex, *สมชาย*',
  })
  _search: string;

  totalEntities: number = 0;

  getPaginationResponse(): PaginationResponseType {
    if (!this.totalEntities) return undefined;
    return {
      page: this.page,
      pageSize: this.pageSize,
      pageCount: Math.ceil(this.totalEntities / this.pageSize),
      total: this.totalEntities,
    };
  }
}
