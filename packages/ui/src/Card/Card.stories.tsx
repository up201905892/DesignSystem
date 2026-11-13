import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Grid } from '../Grid';
import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const content = (
  <>
    <CardHeader>
      <CardTitle>Project Atlas</CardTitle>
      <CardDescription>Updated two days ago</CardDescription>
    </CardHeader>
    <CardBody>A short summary of the project and where it stands.</CardBody>
  </>
);

export const Outlined: Story = {
  args: { variant: 'outlined' },
  render: (args) => <Card {...args}>{content}</Card>,
};

export const Elevated: Story = {
  args: { variant: 'elevated' },
  render: (args) => <Card {...args}>{content}</Card>,
};

export const Paddings: Story = {
  render: () => (
    <Grid columns={4} gap={4}>
      {(['none', 'sm', 'md', 'lg'] as const).map((padding) => (
        <Card key={padding} padding={padding}>
          <CardBody>Padding {padding}</CardBody>
        </Card>
      ))}
    </Grid>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Card>
      {content}
      <CardFooter>
        <Button variant="primary">Open</Button>
        <Button variant="secondary">Share</Button>
      </CardFooter>
    </Card>
  ),
};

export const AsLink: Story = {
  render: () => (
    <Card asChild>
      <a href="#project-atlas">{content}</a>
    </Card>
  ),
};

export const InGrid: Story = {
  play: ({ canvasElement }) => {
    const cards = canvasElement.querySelectorAll<HTMLElement>('.ds-card');
    if (cards.length === 0) throw new Error('Cards not found');
    cards.forEach((card) => {
      assertNoOverflow(card);
    });
  },
  render: () => (
    <Grid columns={3} gap={4}>
      {['Atlas', 'Borealis', longWord].map((name) => (
        <Card key={name} asChild>
          <article>
            <CardHeader>
              <CardTitle>{name}</CardTitle>
              <CardDescription>Team project</CardDescription>
            </CardHeader>
            <CardBody>Summary of {name}.</CardBody>
          </article>
        </Card>
      ))}
    </Grid>
  ),
};

const longWord = 'Supercalifragilistic'.repeat(10);

function assertNoOverflow(card: HTMLElement | null) {
  if (!card) throw new Error('Card not found');
  if (card.scrollWidth > card.clientWidth) throw new Error('Card content overflows horizontally');
}

export const LongWord: Story = {
  render: () => (
    <div style={{ maxWidth: '240px' }}>
      <Card>
        <CardHeader>
          <CardTitle>{longWord}</CardTitle>
          <CardDescription>{longWord}</CardDescription>
        </CardHeader>
        <CardBody>{longWord}</CardBody>
      </Card>
    </div>
  ),
  play: ({ canvasElement }) => {
    assertNoOverflow(canvasElement.querySelector<HTMLElement>('.ds-card'));
  },
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  play: ({ canvasElement }) => {
    const card = canvasElement.querySelector<HTMLElement>('.ds-card[data-variant="elevated"]');
    if (!card) throw new Error('Elevated card not found');
    const style = getComputedStyle(card);
    if (style.borderTopColor === 'rgba(0, 0, 0, 0)')
      throw new Error('The elevated card border is transparent in the dark theme');
    if (style.boxShadow === 'none') throw new Error('The elevated card has no shadow');
  },
  render: () => (
    <Grid columns={2} gap={4}>
      <Card variant="outlined">{content}</Card>
      <Card variant="elevated">
        {content}
        <CardFooter>
          <Button variant="primary">Open</Button>
        </CardFooter>
      </Card>
    </Grid>
  ),
};
