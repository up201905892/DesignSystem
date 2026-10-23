import type { Meta, StoryObj } from '@storybook/react';
import { Grid, GridItem } from './Grid';

const meta = {
  title: 'Components/Grid',
  component: Grid,
  tags: ['autodocs'],
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const box = {
  padding: 'var(--ds-space-3)',
  background: 'var(--ds-color-bg-subtle)',
  color: 'var(--ds-color-text-default)',
  border: '1px solid var(--ds-color-border-strong)',
  borderRadius: 'var(--ds-radius-md)',
} as const;

const cells = (n: number) =>
  Array.from({ length: n }, (_, i) => (
    <div key={i} style={box}>
      {i + 1}
    </div>
  ));

export const Columns: Story = {
  render: () => (
    <Grid columns={1} gap={6}>
      {([1, 2, 3, 4, 6, 12] as const).map((n) => (
        <Grid key={n} columns={n} gap={2}>
          {cells(n)}
        </Grid>
      ))}
    </Grid>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Grid minColumnWidth="10rem" gap={3}>
      {cells(8)}
    </Grid>
  ),
};

export const Spans: Story = {
  render: () => (
    <Grid columns={4} gap={3}>
      <GridItem colSpan={4} style={box}>
        Span 4
      </GridItem>
      <GridItem colSpan={2} style={box}>
        Span 2
      </GridItem>
      <GridItem colSpan={2} style={box}>
        Span 2
      </GridItem>
      <GridItem style={box}>Span 1</GridItem>
      <GridItem colSpan={3} style={box}>
        Span 3
      </GridItem>
    </Grid>
  ),
};

export const AsList: Story = {
  render: () => (
    <Grid asChild columns={3} gap={3}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {['One', 'Two', 'Three'].map((t) => (
          <li key={t} style={box}>
            {t}
          </li>
        ))}
      </ul>
    </Grid>
  ),
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => (
    <Grid columns={3} gap={3}>
      <GridItem colSpan={2} style={box}>
        Span 2
      </GridItem>
      <GridItem style={box}>Span 1</GridItem>
      <GridItem style={box}>Four</GridItem>
      <GridItem colSpan={2} style={box}>
        Span 2
      </GridItem>
    </Grid>
  ),
};
