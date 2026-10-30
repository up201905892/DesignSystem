import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: { type: 'single' },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = (
  <>
    <AccordionItem value="shipping">
      <AccordionTrigger>Shipping</AccordionTrigger>
      <AccordionContent>Orders ship within two business days.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="returns">
      <AccordionTrigger>Returns</AccordionTrigger>
      <AccordionContent>You can return items within 30 days.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="support">
      <AccordionTrigger>Support</AccordionTrigger>
      <AccordionContent>Write to support and we reply within a day.</AccordionContent>
    </AccordionItem>
  </>
);

export const Single: Story = {
  render: () => (
    <Accordion type="single" defaultValue="shipping">
      {items}
    </Accordion>
  ),
};

export const SingleCollapsible: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="shipping">
      {items}
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={['shipping', 'support']}>
      {items}
    </Accordion>
  ),
};

export const DisabledItem: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>Orders ship within two business days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns" disabled>
        <AccordionTrigger>Returns (unavailable)</AccordionTrigger>
        <AccordionContent>You can return items within 30 days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger>Support</AccordionTrigger>
        <AccordionContent>Write to support and we reply within a day.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

const paragraphs = Array.from({ length: 12 }, (_, i) => (
  <p key={i}>
    Paragraph {i + 1}. Long content shows that the height animation follows the real size of the
    panel and that the page keeps scrolling normally.
  </p>
));

export const LongContent: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="long">
      <AccordionItem value="long">
        <AccordionTrigger>Terms and conditions</AccordionTrigger>
        <AccordionContent>{paragraphs}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="short">
        <AccordionTrigger>Summary</AccordionTrigger>
        <AccordionContent>A short summary.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState('returns');
    return (
      <>
        <Accordion type="single" collapsible value={value} onValueChange={setValue}>
          {items}
        </Accordion>
        <p>Open item: {value === '' ? 'none' : value}</p>
      </>
    );
  },
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => (
    <Accordion type="multiple" defaultValue={['shipping']}>
      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>Orders ship within two business days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns" disabled>
        <AccordionTrigger>Returns (unavailable)</AccordionTrigger>
        <AccordionContent>You can return items within 30 days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger>Support</AccordionTrigger>
        <AccordionContent>Write to support and we reply within a day.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
