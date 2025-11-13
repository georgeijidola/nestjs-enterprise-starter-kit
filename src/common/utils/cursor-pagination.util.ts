import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';

export interface CursorPaginationOptions {
  size?: number;
  after?: string;
  before?: string;
  sort?: string[];
  filter?: Record<string, any>;
}

export interface PaginationMeta {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
  lastCursor?: string;
  totalCount?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
  links: {
    first?: string;
    prev?: string;
    next?: string;
    last?: string;
  };
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PrismaModel<T> {
  findMany: (args: any) => Promise<T[]>;
  count: (args: any) => Promise<number>;
}

const encode = (str: string): string =>
  Buffer.from(str, 'utf8').toString('base64url');
const decode = (str: string): string =>
  Buffer.from(str, 'base64url').toString('utf8');

export class CursorPaginationUtil {
  private static readonly DEFAULT_SIZE = 10;
  private static readonly MAX_SIZE = 50;

  static async paginate<T>(
    model: PrismaModel<T>,
    options: CursorPaginationOptions,
    baseUrl: string,
    include?: any,
    select?: any,
  ): Promise<PaginatedResult<T>> {
    const validatedOptions = this.validateOptions(options);
    const sortOptions = this.parseSortOptions(validatedOptions.sort);

    let whereConditions: any = {};

    if (validatedOptions.filter) {
      whereConditions = {
        ...whereConditions,
        ...this.buildPrismaWhereConditions(validatedOptions.filter, ['status']),
      };
    }

    if (validatedOptions.after) {
      const cursorConditions = this.buildPrismaCursorConditions(
        validatedOptions.after,
        sortOptions,
        false,
      );
      whereConditions = { ...whereConditions, ...cursorConditions };
    } else if (validatedOptions.before) {
      const cursorConditions = this.buildPrismaCursorConditions(
        validatedOptions.before,
        sortOptions,
        true,
      );
      whereConditions = { ...whereConditions, ...cursorConditions };
    }

    const queryArgs: any = {
      where: whereConditions,
      orderBy: this.buildPrismaOrderBy(sortOptions),
      take: validatedOptions.size! + 1,
    };

    if (include) queryArgs.include = include;
    if (select) queryArgs.select = select;

    const [records, totalCount] = await Promise.all([
      model.findMany(queryArgs),
      model.count({
        where: this.buildPrismaWhereConditions(validatedOptions.filter || {}, [
          'status',
        ]),
      }),
    ]);

    const hasNextPage = records.length === validatedOptions.size! + 1;
    const hasPreviousPage =
      !!validatedOptions.after || !!validatedOptions.before;

    if (hasNextPage) records.pop();
    if (validatedOptions.before) records.reverse();

    const meta: PaginationMeta = {
      hasNextPage: validatedOptions.before ? hasPreviousPage : hasNextPage,
      hasPreviousPage: validatedOptions.before ? hasNextPage : hasPreviousPage,
      startCursor:
        records.length > 0
          ? this.encodeCursor(records[0], validatedOptions.sort!)
          : undefined,
      endCursor:
        records.length > 0
          ? this.encodeCursor(
              records[records.length - 1],
              validatedOptions.sort!,
            )
          : undefined,
      totalCount,
      lastCursor: await this.getLastCursor(
        model,
        validatedOptions,
        include,
        select,
      ),
    };

    const links = this.generateLinks(baseUrl, validatedOptions, meta);
    return { data: records, meta, links };
  }

  private static async getLastCursor<T>(
    model: PrismaModel<T>,
    options: CursorPaginationOptions,
    include?: any,
    select?: any,
  ): Promise<string | undefined> {
    const reversedSort = this.buildPrismaOrderBy(
      this.parseSortOptions(options.sort).map((s) => ({
        field: s.field,
        direction: s.direction === 'asc' ? 'desc' : 'asc',
      })),
    );

    const where = this.buildPrismaWhereConditions(options.filter || {}, [
      'status',
    ]);
    const queryArgs: any = {
      where,
      orderBy: reversedSort,
      take: 1,
    };
    if (include) queryArgs.include = include;
    if (select) queryArgs.select = select;

    const lastRecords = await model.findMany(queryArgs);
    if (lastRecords.length === 0) return undefined;

    return this.encodeCursor(lastRecords[0], options.sort!);
  }

  static parseQueryParams(query: any): CursorPaginationOptions {
    const options: CursorPaginationOptions = {
      size: query['page[size]'] ? parseInt(query['page[size]'], 10) : undefined,
      after: query['page[after]'],
      before: query['page[before]'],
      sort: Array.isArray(query.sort)
        ? query.sort
        : (query.sort?.split(',') ?? []),
      filter: {},
    };

    Object.keys(query).forEach((key) => {
      if (key.startsWith('filter[') && key.endsWith(']')) {
        const filterPath = key.slice(7, -1);
        let value = query[key];

        if (typeof value === 'string' && value.includes(',')) {
          value = value.split(',');
        }

        if (filterPath.includes('][')) {
          const [field, operator] = filterPath.split('][');
          if (!options.filter![field]) {
            options.filter![field] = {};
          }
          options.filter![field][operator] = value;
        } else if (filterPath.includes('.')) {
          const parts = filterPath.split('.');
          let current = options.filter!;

          if (parts.length === 2 && parts[0] === 'category') {
            if (!current[parts[0]]) {
              current[parts[0]] = { is: {} };
            }
            current[parts[0]].is[parts[1]] = {
              contains: value,
              mode: 'insensitive',
            };
          } else {
            for (let i = 0; i < parts.length - 1; i++) {
              if (!current[parts[i]]) {
                current[parts[i]] = {};
              }
              current = current[parts[i]];
            }
            const lastPart = parts[parts.length - 1];
            current[lastPart] = { contains: value, mode: 'insensitive' };
          }
        } else {
          options.filter![filterPath] = value;
        }
      }
    });

    return options;
  }

  private static encodeCursor(record: any, sortFields: string[]): string {
    const cursorData: Record<string, any> = {};
    sortFields.forEach((field) => {
      const fieldName = field.replace(/^-/, '');
      const value = this.getNestedValue(record, fieldName);
      if (value === undefined) {
        throw new Error(`Cursor field "${fieldName}" not found in record.`);
      }
      cursorData[fieldName] = value;
    });
    cursorData.id = record.id;
    return encode(JSON.stringify(cursorData));
  }

  private static decodeCursor(cursor: string): Record<string, any> {
    try {
      return JSON.parse(decode(cursor));
    } catch {
      throw new BadRequestException('Invalid cursor format');
    }
  }

  private static parseSortOptions(sort: string[] = []): SortOption[] {
    return sort.map((s) => ({
      field: s.startsWith('-') ? s.slice(1) : s,
      direction: s.startsWith('-') ? 'desc' : 'asc',
    }));
  }

  private static validateOptions(
    options: CursorPaginationOptions,
  ): CursorPaginationOptions {
    const normalized = { ...options };
    if (
      normalized.size &&
      (normalized.size < 1 || normalized.size > this.MAX_SIZE)
    ) {
      throw new UnprocessableEntityException(
        `Page size must be between 1 and ${this.MAX_SIZE}`,
      );
    }
    if (!normalized.size) normalized.size = this.DEFAULT_SIZE;
    if (normalized.after && normalized.before) {
      throw new BadRequestException('Cannot use both after and before cursors');
    }
    if (normalized.after) this.decodeCursor(normalized.after);
    if (normalized.before) this.decodeCursor(normalized.before);
    if (!normalized.sort || normalized.sort.length === 0)
      normalized.sort = ['id'];
    return normalized;
  }

  private static buildPrismaOrderBy(sortOptions: SortOption[]): any[] {
    return sortOptions.map((sort) => {
      if (sort.field.includes('.')) {
        const parts = sort.field.split('.');
        const orderBy: any = {};
        let current = orderBy;

        for (let i = 0; i < parts.length - 1; i++) {
          current[parts[i]] = {};
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = sort.direction;

        return orderBy;
      } else {
        return { [sort.field]: sort.direction };
      }
    });
  }

  private static buildPrismaCursorConditions(
    cursor: string,
    sortOptions: SortOption[],
    isPrevious = false,
  ): any {
    const cursorData = this.decodeCursor(cursor);
    if (sortOptions.length === 1) {
      const { field, direction } = sortOptions[0];
      const value = cursorData[field];
      if (value === undefined) return {};
      const operator = (isPrevious ? direction === 'asc' : direction === 'desc')
        ? 'gt'
        : 'lt';
      return { [field]: { [operator]: value } };
    }

    const conditions: any[] = [];
    for (let i = 0; i < sortOptions.length; i++) {
      const current = sortOptions[i];
      const value = cursorData[current.field];
      if (value === undefined) continue;
      const condition: any = {};
      for (let j = 0; j < i; j++) {
        const prev = sortOptions[j];
        condition[prev.field] = cursorData[prev.field];
      }
      const operator = (
        isPrevious ? current.direction === 'asc' : current.direction === 'desc'
      )
        ? 'gt'
        : 'lt';
      condition[current.field] = { [operator]: value };
      conditions.push(condition);
    }
    return { OR: conditions };
  }

  private static buildPrismaWhereConditions(
    filters: Record<string, any>,
    enumFields: string[] = [],
  ): Record<string, any> {
    const conditions: Record<string, any> = {};

    for (const [key, value] of Object.entries(filters)) {
      if (['OR', 'AND', 'NOT'].includes(key)) {
        if (Array.isArray(value)) {
          conditions[key] = value.map((item: any) => {
            if (typeof item === 'object') {
              if (item.category?.equals) {
                return {
                  ...this.buildPrismaWhereConditions(
                    Object.fromEntries(
                      Object.entries(item).filter(([k]) => k !== 'category'),
                    ),
                    enumFields,
                  ),
                  category: {
                    is: item.category.equals,
                  },
                };
              }
              return this.buildPrismaWhereConditions(item, enumFields);
            }
            return item;
          });
        } else if (typeof value === 'object' && value !== null) {
          conditions[key] = this.buildPrismaWhereConditions(value, enumFields);
        } else {
          conditions[key] = value;
        }
      } else {
        if (key === 'category') {
          if (value?.equals) {
            conditions[key] = { is: value.equals };
          } else if (value?.is) {
            conditions[key] = value;
          } else {
            conditions[key] = { is: value };
          }
        } else {
          this.assignNestedKey(conditions, key, value);
        }
      }
    }

    return conditions;
  }

  private static assignNestedKey(obj: any, key: string, value: any) {
    const keys = key.replace(/\]/g, '').split(/\[|\./);
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    const dateFields = ['publishedAt', 'createdAt', 'updatedAt', 'deletedAt'];
    const isDateField = dateFields.includes(lastKey);
    const enumFields = ['status'];
    const isEnumField = enumFields.includes(lastKey);
    const relationFields = ['category'];
    const isRelationField = relationFields.includes(keys[0]);

    if (
      typeof value === 'object' &&
      value !== null &&
      Object.keys(value).some((k) =>
        ['equals', 'not', 'in', 'lt', 'lte', 'gt', 'gte', 'contains'].includes(
          k,
        ),
      )
    ) {
      if (isDateField) {
        const dateConditions: Record<string, any> = {};
        for (const [op, val] of Object.entries(value)) {
          if (typeof val === 'string') {
            const parsedDate = new Date(val);
            if (op === 'gte') {
              dateConditions[op] = new Date(
                Date.UTC(
                  parsedDate.getUTCFullYear(),
                  parsedDate.getUTCMonth(),
                  parsedDate.getUTCDate(),
                  0,
                  0,
                  0,
                  0,
                ),
              );
            } else if (op === 'lte') {
              dateConditions[op] = new Date(
                Date.UTC(
                  parsedDate.getUTCFullYear(),
                  parsedDate.getUTCMonth(),
                  parsedDate.getUTCDate(),
                  23,
                  59,
                  59,
                  999,
                ),
              );
            } else {
              dateConditions[op] = parsedDate;
            }
          } else {
            dateConditions[op] = val;
          }
        }
        current[lastKey] = dateConditions;
      } else if (isRelationField) {
        const relationConditions: Record<string, any> = {};
        for (const [op, val] of Object.entries(value)) {
          if (op === 'equals') {
            relationConditions['is'] = val;
          } else {
            relationConditions[op] = val;
          }
        }
        current[lastKey] = relationConditions;
      } else {
        current[lastKey] = value;
      }
      return;
    }

    if (isDateField && typeof value === 'string') {
      const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
      const parsedDate = new Date(value);

      if (dateOnlyPattern.test(value)) {
        const startOfDay = new Date(
          Date.UTC(
            parsedDate.getUTCFullYear(),
            parsedDate.getUTCMonth(),
            parsedDate.getUTCDate(),
            0,
            0,
            0,
            0,
          ),
        );
        const endOfDay = new Date(
          Date.UTC(
            parsedDate.getUTCFullYear(),
            parsedDate.getUTCMonth(),
            parsedDate.getUTCDate(),
            23,
            59,
            59,
            999,
          ),
        );

        current[lastKey] = { gte: startOfDay, lte: endOfDay };
      } else {
        current[lastKey] = { equals: parsedDate };
      }
      return;
    }

    if (lastKey === 'status') {
      current[lastKey] = typeof value === 'object' ? value : { equals: value };
      return;
    }

    if (lastKey === 'deletedAt') {
      if (value === null) {
        current[lastKey] = value;
      } else {
        current[lastKey] = { equals: value };
      }
      return;
    }

    if (isEnumField) {
      current[lastKey] = { equals: value };
      return;
    }

    if (typeof value === 'string') {
      const searchValue = value.replace(/\*/g, '');
      current[lastKey] = { contains: searchValue, mode: 'insensitive' };
      return;
    }

    if (value === null) {
      current[lastKey] = value;
    } else {
      current[lastKey] = { is: value };
    }
  }

  private static generateLinks(
    baseUrl: string,
    options: CursorPaginationOptions,
    meta: PaginationMeta,
  ) {
    const links: any = {};
    const params = new URLSearchParams();

    if (options.size && options.size !== this.DEFAULT_SIZE)
      params.set('page[size]', options.size.toString());
    if (options.sort?.length) params.set('sort', options.sort.join(','));

    if (options.filter) {
      for (const [key, value] of Object.entries(options.filter)) {
        if (value === null || value === undefined) continue;
        if (key === 'OR') {
          continue;
        } else if (typeof value === 'object' && value !== null) {
          for (const [subKey, subValue] of Object.entries(value)) {
            if (subValue === null || subValue === undefined) continue;
            params.set(`filter[${key}.${subKey}]`, subValue.toString());
          }
        } else {
          params.set(
            `filter[${key}]`,
            Array.isArray(value) ? value.join(',') : value.toString(),
          );
        }
      }
    }

    const baseParams = params.toString();
    links.first = `${baseUrl}?${baseParams}`;

    if (meta.hasPreviousPage && meta.startCursor) {
      const prevParams = new URLSearchParams(baseParams);
      prevParams.set('page[before]', meta.startCursor);
      links.prev = `${baseUrl}?${prevParams.toString()}`;
    }

    if (meta.hasNextPage && meta.endCursor) {
      const nextParams = new URLSearchParams(baseParams);
      nextParams.set('page[after]', meta.endCursor);
      links.next = `${baseUrl}?${nextParams.toString()}`;
    }

    if (meta.lastCursor) {
      const lastParams = new URLSearchParams(baseParams);
      lastParams.set('page[after]', meta.lastCursor);
      links.last = `${baseUrl}?${lastParams.toString()}`;
    }

    return links;
  }

  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}
