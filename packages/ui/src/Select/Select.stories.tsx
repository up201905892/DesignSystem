import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { Field, FieldDescription, FieldError, FieldLabel } from '../Field';
import { Input } from '../Input';
import { Select, SelectGroup, SelectItem, SelectSeparator } from './Select';

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: { 'aria-label': 'Fruit', placeholder: 'Pick a fruit' },
  render: (args) => (
    <div style={{ width: '16rem' }}>
      <Select {...args}>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </Select>
    </div>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = { display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-3)' } as const;
const row = { display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center' } as const;
const heights = { sm: 32, md: 40, lg: 48 } as const;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Default: Story = {};

export const WithDefaultValue: Story = { args: { defaultValue: 'banana' } };

export const Sizes: Story = {
  render: () => (
    <div style={{ ...column, width: '20rem' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={row}>
          <Select aria-label={`Select ${size}`} size={size} placeholder={`Select ${size}`}>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </Select>
          <Input aria-label={`Input ${size}`} size={size} placeholder={`Input ${size}`} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const [size, min] of Object.entries(heights)) {
      const select = canvasElement.querySelector<HTMLElement>(`.ds-select[data-size="${size}"]`);
      const input = canvasElement.querySelector<HTMLElement>(`.ds-input[data-size="${size}"]`);
      if (!select || !input) throw new Error(`Missing select or input for size ${size}`);
      const a = select.getBoundingClientRect().height;
      const b = input.getBoundingClientRect().height;
      if (a < min) throw new Error(`Select ${size} is ${a}px, expected >= ${min}px`);
      if (Math.abs(a - b) > 0.5) throw new Error(`Size ${size}: select ${a}px, input ${b}px`);
    }
  },
};

export const Groups: Story = {
  render: (args) => (
    <div style={{ width: '16rem' }}>
      <Select {...args} defaultOpen>
        <SelectGroup label="Fruit">
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup label="Vegetables">
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="leek">Leek</SelectItem>
        </SelectGroup>
      </Select>
    </div>
  ),
};

export const DisabledItem: Story = {
  render: (args) => (
    <div style={{ width: '16rem' }}>
      <Select {...args} defaultOpen>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana" disabled>
          Banana (sold out)
        </SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ ...column, width: '16rem' }}>
      <Select {...args} disabled />
      <Select {...args} disabled defaultValue="apple">
        <SelectItem value="apple">Apple</SelectItem>
      </Select>
    </div>
  ),
};

export const WithField: Story = {
  render: () => (
    <div style={{ width: '20rem' }}>
      <Field invalid required>
        <FieldLabel>Country</FieldLabel>
        <Select placeholder="Choose a country">
          <SelectItem value="pt">Portugal</SelectItem>
          <SelectItem value="es">Spain</SelectItem>
          <SelectItem value="fr">France</SelectItem>
        </Select>
        <FieldDescription>Where you live.</FieldDescription>
        <FieldError>Choose a country.</FieldError>
      </Field>
    </div>
  ),
};

export const LongList: Story = {
  render: (args) => (
    <div style={{ width: '16rem' }}>
      <Select {...args} defaultOpen>
        {Array.from({ length: 30 }, (_, i) => (
          <SelectItem key={i} value={`item-${i + 1}`}>
            Item {i + 1}
          </SelectItem>
        ))}
      </Select>
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  render: () => (
    <div style={{ width: '16rem' }}>
      <Select aria-label="Fruit" placeholder="Pick a fruit">
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana" disabled>
          Banana
        </SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
        <SelectItem value="date">Date</SelectItem>
      </Select>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const body = within(document.body);
    const trigger = within(canvasElement).getByRole('combobox');
    const option = (name: string) => body.getByRole('option', { name });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(await body.findByRole('listbox')).toBeInTheDocument();

    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(option('Cherry')).toHaveFocus());

    await userEvent.keyboard('{End}');
    await waitFor(() => expect(option('Date')).toHaveFocus());

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(trigger).not.toHaveTextContent('Date');
  },
};

export const Offset: Story = {
  decorators: [
    (Story) => (
      <div style={{ minHeight: '16rem' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox');
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    await within(document.body).findByRole('listbox');
    await wait(300);
    const content = document.querySelector<HTMLElement>('.ds-select__content');
    if (!content) throw new Error('Select did not open');
    const probe = document.createElement('div');
    probe.style.height = 'var(--ds-space-1)';
    document.body.append(probe);
    const expected = probe.getBoundingClientRect().height;
    probe.remove();
    const gap = content.getBoundingClientRect().top - trigger.getBoundingClientRect().bottom;
    if (Math.abs(gap - expected) > 1) throw new Error(`Gap is ${gap}px, expected ${expected}px`);
  },
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: (args) => (
    <div style={{ width: '16rem' }}>
      <Select {...args} defaultOpen defaultValue="banana">
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry" disabled>
          Cherry
        </SelectItem>
      </Select>
    </div>
  ),
};
