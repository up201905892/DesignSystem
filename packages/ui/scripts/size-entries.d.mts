export const COMPONENT_LIMIT: string;
export const STYLES_LIMIT: string;

export type SizeEntry = {
  name: string;
  path: string;
  import?: string;
  limit?: string;
  gzip?: boolean;
  rolldown?: boolean;
  ignore?: string[];
};

export function valueExports(source?: string): string[];
export function externalPackages(): string[];
export function sizeEntries(exportNames?: string[]): SizeEntry[];
