import { describe, expect, it } from 'vitest';
import * as library from './index';

// Public runtime exports of the 0.x library, recorded before the tree-shakeable build (DS-060).
const PUBLIC_EXPORTS = [
  'Accordion',
  'AccordionContent',
  'AccordionItem',
  'AccordionTrigger',
  'Alert',
  'Badge',
  'Button',
  'Card',
  'CardBody',
  'CardDescription',
  'CardFooter',
  'CardHeader',
  'CardTitle',
  'Checkbox',
  'DataTable',
  'Dialog',
  'DialogBody',
  'DialogClose',
  'DialogContent',
  'DialogDescription',
  'DialogFooter',
  'DialogHeader',
  'DialogTitle',
  'DialogTrigger',
  'DropdownMenu',
  'DropdownMenuContent',
  'DropdownMenuGroup',
  'DropdownMenuItem',
  'DropdownMenuLabel',
  'DropdownMenuSeparator',
  'DropdownMenuTrigger',
  'Field',
  'FieldDescription',
  'FieldError',
  'FieldLabel',
  'Grid',
  'GridItem',
  'IconButton',
  'Input',
  'Pagination',
  'Popover',
  'PopoverClose',
  'PopoverContent',
  'PopoverTrigger',
  'Radio',
  'RadioGroup',
  'Select',
  'SelectGroup',
  'SelectItem',
  'SelectSeparator',
  'Skeleton',
  'Spinner',
  'Stack',
  'Switch',
  'Table',
  'TableBody',
  'TableCaption',
  'TableCell',
  'TableHead',
  'TableHeaderCell',
  'TableRow',
  'Tabs',
  'TabsContent',
  'TabsList',
  'TabsTrigger',
  'Textarea',
  'ToastProvider',
  'Tooltip',
  'TooltipProvider',
  'VisuallyHidden',
  'useFieldControl',
  'usePagination',
  'useTableSort',
  'useToast',
];

describe('public exports (DS-060)', () => {
  it('keeps exactly the same runtime exports', () => {
    expect(Object.keys(library).sort()).toEqual(PUBLIC_EXPORTS);
  });

  it('gives every component exported by src/index.ts a displayName equal to its export name', () => {
    const components = Object.entries(library).filter(
      ([name, value]) => /^[A-Z]/.test(name) && value !== undefined,
    );
    // Dialog, DropdownMenu, Popover, Tooltip providers... that are plain functions are checked too.
    expect(components.length).toBeGreaterThan(50);
    for (const [name, value] of components) {
      const displayName = (value as { displayName?: string }).displayName;
      const functionName = (value as { name?: string }).name;
      // Components that are plain function components keep their function name.
      expect(displayName ?? functionName, name).toBe(name);
    }
  });
});
