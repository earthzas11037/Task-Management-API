import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';
import { PaginationDto } from '../dtos/pagination.dto';
import _ from 'lodash';

type ColumnMapping = Record<string, keyof any>;

export const repositoryWithPagination = async <T>(
  repo: { findAndCount: (options: FindManyOptions<T>) => Promise<[T[], number]> },
  pagination: PaginationDto,
  baseWhere: FindOptionsWhere<T>,
  searchFields: (keyof T)[] = [],
  sortableFields: ColumnMapping = {},
  filterableFields: ColumnMapping = {},
  relations: string[] = [],
): Promise<[T[], number]> => {
  const { page = 1, pageSize = 10, _search, sort, filter = [] } = pagination;

  let where: FindOptionsWhere<T>[] = [];

  // Search
  if (_search && searchFields.length > 0) {
    where = searchFields.map((field) => ({
      ...baseWhere,
      [field]: ILike(`%${_search}%`) as any,
    }));
  } else {
    where.push(baseWhere);
  }

  // Filters
  if (filter?.length) {
    for (const f of filter) {
      const field = filterableFields[f.columnName];
      if (field) {
        where.forEach((w) => {
          (w as any)[field] = f.value;
        });
      }
    }
  }

  // Sorting
  const sortColumn = sortableFields[sort?.columnName] || 'createdAt';
  const sortOrder = sort?.sortOrder || 'DESC';

  const options: FindManyOptions<T> = {
    where,
    relations,
    order: { [sortColumn]: sortOrder } as FindOptionsOrder<T>,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };

  return await repo.findAndCount(options);
};
