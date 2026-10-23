import { useEffect, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { ToastProvider, useToast, type ToastOptions, type ToastProviderProps } from './Toast';

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minHeight: '20rem', padding: 'var(--ds-space-8)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const row = { display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-space-3)' } as const;

function Trigger({ label, options }: { label: string; options: ToastOptions }) {
  const { toast } = useToast();
  return (
    <Button variant="secondary" onClick={() => toast(options)}>
      {label}
    </Button>
  );
}

function OpenOnMount({ items, children }: { items: ToastOptions[]; children?: ReactNode }) {
  const { toast } = useToast();
  useEffect(() => {
    items.forEach((item) => toast({ duration: Infinity, ...item }));
    // Runs once on mount: the story shows a fixed set of toasts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}

export const Default: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <Trigger
        label="Show toast"
        options={{ title: 'Changes saved', description: 'Your profile is up to date.' }}
      />
    </ToastProvider>
  ),
};

const variants = ['info', 'success', 'warning', 'danger'] as const;

export const Variants: Story = {
  render: (args) => (
    <ToastProvider {...args} max={4}>
      <div style={row}>
        {variants.map((variant) => (
          <Trigger
            key={variant}
            label={variant}
            options={{ title: `This is a ${variant} toast`, variant }}
          />
        ))}
      </div>
    </ToastProvider>
  ),
};

export const WithAction: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <Trigger
        label="Delete item"
        options={{
          title: 'Item deleted',
          description: 'You can still undo this.',
          action: { label: 'Undo', altText: 'Undo the deletion', onClick: () => undefined },
        }}
      />
    </ToastProvider>
  ),
};

export const Persistent: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <Trigger
        label="Show persistent toast"
        options={{
          title: 'Connection lost',
          description: 'It stays until you close it.',
          variant: 'warning',
          duration: Infinity,
        }}
      />
    </ToastProvider>
  ),
};

function StackedDemo() {
  const { toast } = useToast();
  return (
    <Button
      variant="secondary"
      onClick={() => {
        for (let i = 1; i <= 5; i += 1) toast({ title: `Notification ${i}`, duration: 8000 });
      }}
    >
      Show five toasts (max 3)
    </Button>
  );
}

export const Stacked: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <StackedDemo />
    </ToastProvider>
  ),
};

const positions = ['top-right', 'top-center', 'bottom-right', 'bottom-center'] as const;

function PositionsDemo() {
  const [position, setPosition] = useState<ToastProviderProps['position']>('bottom-right');
  return (
    <ToastProvider position={position}>
      <div style={row}>
        {positions.map((value) => (
          <Trigger
            key={value}
            label={value}
            options={{ title: `Toast at ${value}`, duration: 6000 }}
          />
        ))}
      </div>
      <div style={{ marginTop: 'var(--ds-space-4)' }}>
        <label>
          Position{' '}
          <select
            value={position}
            onChange={(event) => setPosition(event.target.value as typeof position)}
          >
            {positions.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
      </div>
    </ToastProvider>
  );
}

export const Positions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Choose a position, then press any button: toasts appear in the selected corner or edge.',
      },
    },
  },
  render: () => <PositionsDemo />,
};

function AfterLoadingDemo() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fail, setFail] = useState(false);
  return (
    <div style={row}>
      <Button
        loading={loading}
        loadingLabel="Saving"
        onClick={async () => {
          setLoading(true);
          await wait(1000);
          setLoading(false);
          if (fail) {
            toast({ title: 'Could not save', description: 'Try again.', variant: 'danger' });
          } else {
            toast({ title: 'Saved', description: 'Your changes were saved.', variant: 'success' });
          }
        }}
      >
        Save
      </Button>
      <label>
        <input type="checkbox" checked={fail} onChange={(event) => setFail(event.target.checked)} />{' '}
        Simulate an error
      </label>
    </div>
  );
}

export const AfterLoading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pattern "button in loading, then a toast with the result". The button is `loading` during a simulated wait (1 s). When it ends, a toast announces the outcome to screen readers: the button does not announce it. The focus stays on the button the whole time; the toast never takes it. Tick "Simulate an error" to see the `danger` toast.',
      },
    },
  },
  render: (args) => (
    <ToastProvider {...args}>
      <AfterLoadingDemo />
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector<HTMLButtonElement>('button');
    if (!button) throw new Error('No button');
    button.focus();
    button.click();
    await wait(100);
    if (button.getAttribute('aria-busy') !== 'true') throw new Error('Button is not loading');
    await wait(1300);
    const region = document.querySelector('[role="region"]');
    if (!region?.textContent?.includes('Saved')) throw new Error('Success toast did not appear');
    if (button.getAttribute('aria-busy') === 'true') throw new Error('Button is still busy');
    if (document.activeElement !== button) throw new Error('Focus left the button');
  },
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: (args) => (
    <ToastProvider {...args} max={4}>
      <OpenOnMount
        items={[
          { title: 'Information', description: 'Something to know.', variant: 'info' },
          { title: 'Success', description: 'It worked.', variant: 'success' },
          {
            title: 'Warning',
            description: 'Check this.',
            variant: 'warning',
            action: { label: 'Review', altText: 'Review the warning', onClick: () => undefined },
          },
          { title: 'Error', description: 'It failed.', variant: 'danger' },
        ]}
      />
    </ToastProvider>
  ),
};
