import type { Meta, StoryObj } from '@storybook/react';
import { PencilIcon } from '@up201905892/icons';
import { Button, IconButton, Input, Select, SelectItem, Textarea } from '@up201905892/ui';

/**
 * Every control that has a `size`, in every size, in one place. `pnpm test:a11y:sizes` measures the
 * rendered height of each one in a real browser (the minimum heights are 32px for `sm`, 40px for
 * `md` and 48px for `lg`; `IconButton` also has to be as wide as it is tall).
 */
const meta = {
  title: 'Accessibility/Sizes',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const sizes = ['sm', 'md', 'lg'] as const;
const row = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--ds-space-3)',
  alignItems: 'flex-start',
} as const;

export const Matrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)' }}>
      {sizes.map((size) => (
        <div key={size} style={row}>
          <Button size={size}>Button {size}</Button>
          <IconButton size={size} aria-label={`Edit ${size}`} icon={<PencilIcon />} />
          <Input size={size} aria-label={`Input ${size}`} placeholder={`Input ${size}`} />
          <Select size={size} aria-label={`Select ${size}`} placeholder={`Select ${size}`}>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </Select>
          <Textarea size={size} rows={1} aria-label={`Textarea ${size}`} placeholder={size} />
        </div>
      ))}
    </div>
  ),
};

export const DarkTheme: Story = { ...Matrix, parameters: { theme: 'dark' } };
