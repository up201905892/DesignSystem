import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';

const meta = {
  title: 'Components/Stack',
  component: Stack,
  tags: ['autodocs'],
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const box = {
  padding: 'var(--ds-space-2) var(--ds-space-3)',
  background: 'var(--ds-color-bg-subtle)',
  color: 'var(--ds-color-text-default)',
  border: '1px solid var(--ds-color-border-strong)',
  borderRadius: 'var(--ds-radius-md)',
} as const;

const Box = ({ children, tall }: { children: string; tall?: boolean }) => (
  <div style={tall ? { ...box, paddingBlock: 'var(--ds-space-6)' } : box}>{children}</div>
);

const gaps = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16] as const;

export const Vertical: Story = {
  render: (args) => (
    <Stack {...args}>
      <Box>One</Box>
      <Box>Two</Box>
      <Box>Three</Box>
    </Stack>
  ),
};

export const Horizontal: Story = {
  args: { direction: 'horizontal' },
  render: (args) => (
    <Stack {...args}>
      <Box>One</Box>
      <Box>Two</Box>
      <Box>Three</Box>
    </Stack>
  ),
};

export const Gaps: Story = {
  render: () => (
    <Stack gap={6}>
      {gaps.map((gap) => (
        <Stack key={gap} direction="horizontal" gap={gap} align="center">
          <span style={{ width: '4rem', color: 'var(--ds-color-text-default)' }}>gap {gap}</span>
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </Stack>
      ))}
    </Stack>
  ),
};

export const AlignAndJustify: Story = {
  render: () => (
    <Stack gap={6}>
      {(['start', 'center', 'end', 'stretch', 'baseline'] as const).map((align) => (
        <Stack key={align} direction="horizontal" align={align} gap={2}>
          <span style={{ color: 'var(--ds-color-text-default)' }}>align {align}</span>
          <Box>Short</Box>
          <Box tall>Tall</Box>
        </Stack>
      ))}
      {(['start', 'center', 'end', 'between'] as const).map((justify) => (
        <Stack key={justify} direction="horizontal" justify={justify}>
          <Box>{`justify ${justify}`}</Box>
          <Box>B</Box>
        </Stack>
      ))}
    </Stack>
  ),
};

export const Wrap: Story = {
  render: () => (
    <div style={{ width: '16rem' }}>
      <Stack direction="horizontal" wrap gap={2}>
        {['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta'].map((t) => (
          <Box key={t}>{t}</Box>
        ))}
      </Stack>
    </div>
  ),
};

export const AsList: Story = {
  render: () => (
    <Stack asChild gap={2}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        <li style={box}>One</li>
        <li style={box}>Two</li>
      </ul>
    </Stack>
  ),
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => (
    <Stack gap={4}>
      <Stack direction="horizontal" gap={3} align="center">
        <Box>One</Box>
        <Box>Two</Box>
      </Stack>
      <Stack asChild gap={2}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          <li style={box}>Three</li>
          <li style={box}>Four</li>
        </ul>
      </Stack>
    </Stack>
  ),
};
