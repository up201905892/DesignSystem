import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../packages/ui/test/a11y';
import { App } from './App';
import { THEME_STORAGE_KEY } from './theme';

function mockSystemTheme(dark: boolean) {
  window.matchMedia = vi.fn().mockImplementation(
    (query: string) =>
      ({
        matches: dark && query.includes('dark'),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  mockSystemTheme(false);
});

describe('App', () => {
  it('renders the Overview view first', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview', selected: true })).toBeInTheDocument();
  });

  it('shows the Tasks view when the tab is chosen', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('tab', { name: 'Tasks' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Tasks' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1, name: 'Overview' })).not.toBeInTheDocument();
  });

  it('simulates loading and then shows the indicators', async () => {
    render(<App />);
    expect(screen.getByRole('status', { name: 'Loading indicators' })).toBeInTheDocument();
    expect(await screen.findByText('Open tasks')).toBeInTheDocument();
    expect(screen.queryByRole('status', { name: 'Loading indicators' })).not.toBeInTheDocument();
  });

  it('lets the user open a frequently asked question', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'How do I assign a task?' }));
    expect(screen.getByText(/choose a teammate/)).toBeVisible();
  });

  it('toggles the theme, sets data-theme and saves the choice', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('applies the saved theme on reload', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    render(<App />);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('respects prefers-color-scheme on the first visit', () => {
    mockSystemTheme(true);
    render(<App />);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('opens the user menu', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'User menu' }));
    const menu = await screen.findByRole('menu');
    expect(within(menu).getByRole('menuitem', { name: 'Sign out' })).toBeInTheDocument();
  });
});

describe('App accessibility', () => {
  it('has no axe violations in the Overview view', async () => {
    const { container } = render(<App />);
    await screen.findByText('Open tasks');
    await expectNoA11yViolations(container);
  });

  it('has no axe violations in the Tasks view', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(screen.getByRole('tab', { name: 'Tasks' }));
    await expectNoA11yViolations(container);
  });

  it('has the banner, navigation and main landmarks and one h1 per view', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    await user.click(screen.getByRole('tab', { name: 'Tasks' }));
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('reaches skip link, navigation, theme toggle and user menu by Tab, in that order', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.tab();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'User menu' })).toHaveFocus();
  });
});
