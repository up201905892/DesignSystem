import type { Meta, StoryObj } from '@storybook/react';
import * as icons from './index';

type IconComponent = typeof icons.CheckIcon;

const entries = Object.entries(icons).filter(([name]) => name.endsWith('Icon')) as [
  string,
  IconComponent,
][];

const meta = {
  title: 'Icons/Icons',
  component: icons.CheckIcon,
  tags: ['autodocs'],
} satisfies Meta<typeof icons.CheckIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
  gap: 16,
  fontSize: 24,
} as const;

const cellStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
} as const;

const labelStyle = { fontSize: 12, wordBreak: 'break-word', textAlign: 'center' } as const;

export const Gallery: Story = {
  render: () => (
    <div style={gridStyle}>
      {entries.map(([name, Icon]) => (
        <div key={name} style={cellStyle}>
          <Icon />
          <span style={labelStyle}>{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {[16, 20, 24].map((size) => (
        <span key={size} style={cellStyle}>
          <icons.SearchIcon size={size} />
          <span style={labelStyle}>{size}px</span>
        </span>
      ))}
    </div>
  ),
};

export const WithTitle: Story = {
  args: { title: 'Close', size: 24 },
  render: (args) => <icons.XIcon {...args} />,
};

export const DarkTheme: Story = {
  render: () => (
    <div
      data-theme="dark"
      // Fallbacks keep the story dark until Storybook loads the theme CSS (DS-006).
      style={{
        background: 'var(--ds-color-bg-canvas, #0f172a)',
        color: 'var(--ds-color-text-default, #f8fafc)',
        padding: 16,
        ...gridStyle,
      }}
    >
      {entries.map(([name, Icon]) => (
        <div key={name} style={cellStyle}>
          <Icon />
          <span style={labelStyle}>{name}</span>
        </div>
      ))}
    </div>
  ),
};
