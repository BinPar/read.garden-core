import { z } from 'zod';

export const fontSize = z.number().min(8).max(24);
export const maxColumns = z.number().min(1).max(4);
export const minCharsPerColumn = z.number().min(40).max(60);
export const maxCharsPerColumn = z.number().min(70).max(90);

export const flowOptions = z.object({
  fontSize: fontSize.or(z.undefined()).default(16),
  maxColumns: maxColumns.or(z.undefined()).default(4),
  minCharsPerColumn: minCharsPerColumn.or(z.undefined()).default(50),
  maxCharsPerColumn: maxCharsPerColumn.or(z.undefined()).default(80),
});

export const flowConfig = z.object({
  fontSize,
  maxColumns,
  minCharsPerColumn,
  maxCharsPerColumn,
});
