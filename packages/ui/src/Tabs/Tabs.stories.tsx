import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const panels = (
  <>
    <TabsContent value="account">Manage your account details.</TabsContent>
    <TabsContent value="security">Change your password and sessions.</TabsContent>
    <TabsContent value="billing">Invoices and payment methods.</TabsContent>
  </>
);

export const Default: Story = {
  args: { defaultValue: 'account' },
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="Settings">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      {panels}
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="account" orientation="vertical">
      <TabsList aria-label="Settings">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      {panels}
    </Tabs>
  ),
};

export const ManualActivation: Story = {
  render: () => (
    <Tabs defaultValue="account" activationMode="manual">
      <TabsList aria-label="Settings">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      {panels}
    </Tabs>
  ),
};

export const DisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <TabsList aria-label="Settings">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security" disabled>
          Security
        </TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      {panels}
    </Tabs>
  ),
};

// Values become part of element ids, so they must not contain spaces.
const many = Array.from({ length: 15 }, (_, i) => ({
  value: `section-${i + 1}`,
  name: `Section ${i + 1}`,
}));

export const ManyTabs: Story = {
  render: () => (
    <div style={{ maxWidth: '24rem' }}>
      <Tabs defaultValue="section-1">
        <TabsList aria-label="Sections">
          {many.map(({ value, name }) => (
            <TabsTrigger key={value} value={value}>
              {name}
            </TabsTrigger>
          ))}
        </TabsList>
        {many.map(({ value, name }) => (
          <TabsContent key={value} value={value}>
            Content of {name}.
          </TabsContent>
        ))}
      </Tabs>
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState('security');
    return (
      <Tabs value={value} onValueChange={setValue}>
        <TabsList aria-label="Settings">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        {panels}
        <p>Current tab: {value}</p>
      </Tabs>
    );
  },
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => (
    <Tabs defaultValue="account">
      <TabsList aria-label="Settings">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security" disabled>
          Security
        </TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      {panels}
    </Tabs>
  ),
};
