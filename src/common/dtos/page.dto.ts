import { APIResponse } from './../interfaces/api-response.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PaginationMetaDto } from './pagination-meta.dto';
import { Exclude } from 'class-transformer';

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: any[];

  @Exclude()
  entities: T[];

  @ApiProperty({ type: () => PaginationMetaDto })
  readonly pagination: PaginationMetaDto;

  constructor(data: T[] = [], meta: PaginationMetaDto) {
    this.entities = data;
    this.data = data.map((x) => (typeof x['toAPIResponse'] === 'function' ? (x as APIResponse).toAPIResponse() : x));
    this.pagination = meta;
  }
}
