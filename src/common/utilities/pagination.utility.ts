import { SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from '../dtos/pagination.dto';
import { isEmpty } from 'lodash';

export const queryBuilderWithPagination = <T>(queryBuilder: SelectQueryBuilder<T>, pagination: PaginationDto, searchField?: string) => {
  if (!pagination) return queryBuilder;

  if (!!pagination._search && !!searchField) {
    queryBuilder.andWhere(`${searchField} LIKE :value`, { value: pagination._search });
  }

  if (!isEmpty(pagination.sort)) {
    queryBuilder.orderBy(pagination.sort.columnName, pagination.sort.sortOrder);
  }
  return queryBuilder.skip((pagination.page - 1) * pagination.pageSize).take(pagination.pageSize);
};
