import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}
export class GenericFilter {
  @Transform(({ value }) => parseInt(value, 10) || 1)
  @IsNumber({}, { message: ' "page" atrribute should be a number' })
  @Min(1, { message: ' "page" attribute should be greater than or equal to 1' })
  public page: number;

  @Transform(({ value }) => parseInt(value, 10) || 10)
  @IsNumber({}, { message: ' "pageSize" attribute should be a number ' })
  @Min(1, { message: ' "pageSize" attribute should be greater than or equal to 1' })
  public pageSize: number;

  @IsOptional()
  public orderBy?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;
}

export async function filtersClause(validFields: string[], filters: any) {
  const where = {};
  validFields.forEach((field) => {
    if (filters[field] !== undefined) {
      where[field] = filters[field];
    }
  });
  return where;
}
