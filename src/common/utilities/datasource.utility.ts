import { APISortableFieldType } from '../types/api-sortable-field.type';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from '../dtos/pagination.dto';
import _, { flattenDeep, isEmpty } from 'lodash';

export const queryBuilderWithPagination = <T>(
  queryBuilder: SelectQueryBuilder<T>,
  pagination?: PaginationDto,
  searchFields: string | string[] = '',
  sortableFields: APISortableFieldType = {},
  filterableFields: APISortableFieldType = {},
) => {
  if (!pagination) return queryBuilder;

  let hasSearch = false;
  let hasWhere = !_.isEmpty(queryBuilder.getParameters());

  queryBuilder.andWhere(
    new Brackets((qb) => {
      if (!!pagination._search && !!searchFields) {
        const fields = flattenDeep([searchFields]);
        if (fields.length > 0) {
          fields.forEach((field, index) => {
            hasSearch = true;

            if (index === 0) {
              qb.where(`${field} LIKE :value`, { value: pagination._search });
            } else {
              qb.orWhere(`${field} LIKE :value`, { value: pagination._search });
            }
            hasWhere = true;
          });
        }
      }

      if (pagination?.filter?.length) {
        pagination.filter.forEach((filter, index) => {
          const filterColumnName = filterableFields[filter.columnName];
          if (filterColumnName) {
            hasWhere = true;
            if (index === 0 && !hasSearch) {
              qb.where(`${filterColumnName} ${filter.operation} ${filter.value}`);
            } else {
              qb.andWhere(`${filterColumnName} ${filter.operation} ${filter.value}`);
            }
          }
        });
      }

      /** In case of no WHERE, so qb need at least one WHERE to prevent error. */
      if (!hasWhere) {
        qb.where('true = true');
      }
    }),
  );

  if (!isEmpty(pagination.sort)) {
    const sortColumnName = sortableFields[pagination.sort.columnName];
    if (sortColumnName) {
      queryBuilder.orderBy(sortColumnName, pagination.sort.sortOrder);
    }
  }

  if (pagination.pageSize >= 0) {
    queryBuilder.skip((pagination.page - 1) * pagination.pageSize).take(pagination.pageSize);
  }
  return queryBuilder;
};
