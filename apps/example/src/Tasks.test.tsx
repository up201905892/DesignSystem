import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../packages/ui/test/a11y';
import { App } from './App';
import { initialTasks } from './data';

type User = ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  window.localStorage.clear();
  window.matchMedia = vi.fn().mockImplementation(
    (query: string) =>
      ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  );
});

async function openTasks(user: User) {
  render(<App />);
  await user.click(screen.getByRole('tab', { name: 'Tasks' }));
  return screen.getByRole('table', { name: 'Team tasks' });
}

/** Titles in the body rows of the table, in order. */
function titles() {
  const table = screen.getByRole('table', { name: 'Team tasks' });
  return within(table)
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0]?.textContent);
}

async function fillTitle(user: User, value: string) {
  await user.type(screen.getByRole('textbox', { name: /Title/ }), value);
}

describe('Tasks view', () => {
  it('has at least 30 fictional tasks and shows them 10 per page', async () => {
    expect(initialTasks.length).toBeGreaterThanOrEqual(30);
    const user = userEvent.setup();
    await openTasks(user);
    expect(titles()).toHaveLength(10);
    expect(screen.getByText(`1–10 of ${initialTasks.length}`)).toBeInTheDocument();
    expect(screen.getAllByText('To do').length).toBeGreaterThan(0);
  });

  it('changes page', async () => {
    const user = userEvent.setup();
    await openTasks(user);
    const first = titles()[0];
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(titles()[0]).not.toBe(first);
    expect(screen.getByText(`11–20 of ${initialTasks.length}`)).toBeInTheDocument();
  });

  it('sorts by due date', async () => {
    const user = userEvent.setup();
    const table = await openTasks(user);
    const header = within(table).getByRole('columnheader', { name: /Due date/ });
    await user.click(within(header).getByRole('button'));
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    const dueDates = within(table)
      .getAllByRole('row')
      .slice(1)
      .map((row) => within(row).getAllByRole('cell')[4]?.textContent ?? '');
    expect(dueDates).toEqual([...dueDates].sort());
    await user.click(within(header).getByRole('button'));
    expect(header).toHaveAttribute('aria-sort', 'descending');
  });

  it('filters by status', async () => {
    const user = userEvent.setup();
    await openTasks(user);
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(screen.getByRole('radio', { name: 'Done' }));
    const table = screen.getByRole('table', { name: 'Team tasks' });
    const rows = within(table).getAllByRole('row').slice(1);
    const doneCount = initialTasks.filter((task) => task.status === 'done').length;
    expect(doneCount).toBeLessThan(initialTasks.length);
    expect(rows.length).toBe(Math.min(10, doneCount));
    for (const row of rows) expect(within(row).getByText('Done')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`of ${doneCount}$`))).toBeInTheDocument();
  });

  it('creates a valid task, shows a toast and returns the focus to "New task"', async () => {
    const user = userEvent.setup();
    await openTasks(user);
    const newTask = screen.getByRole('button', { name: 'New task' });
    await user.click(newTask);
    const dialog = screen.getByRole('dialog', { name: 'New task' });
    await fillTitle(user, 'Brand new task');
    await user.click(within(dialog).getByRole('button', { name: 'Save task' }));
    expect(within(dialog).getByRole('button', { name: 'Save task' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(titles()[0]).toBe('Brand new task');
    expect(screen.getByText('Task created')).toBeInTheDocument();
    expect(newTask).toHaveFocus();
  });

  it('shows the error and keeps the dialog open when the title is empty', async () => {
    const user = userEvent.setup();
    await openTasks(user);
    await user.click(screen.getByRole('button', { name: 'New task' }));
    const dialog = screen.getByRole('dialog', { name: 'New task' });
    await user.click(within(dialog).getByRole('button', { name: 'Save task' }));
    const title = within(dialog).getByRole('textbox', { name: /Title/ });
    expect(within(dialog).getByText('Enter a title for the task.')).toBeInTheDocument();
    expect(title).toHaveAttribute('aria-invalid', 'true');
    expect(title).toHaveFocus();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('edits a task', async () => {
    const user = userEvent.setup();
    await openTasks(user);
    const firstTitle = titles()[0] ?? '';
    const actions = screen.getByRole('button', { name: `Actions for ${firstTitle}` });
    await user.click(actions);
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    const dialog = screen.getByRole('dialog', { name: 'Edit task' });
    const title = within(dialog).getByRole('textbox', { name: /Title/ });
    expect(title).toHaveValue(firstTitle);
    await user.clear(title);
    await user.type(title, 'Renamed task');
    await user.click(within(dialog).getByRole('button', { name: 'Save task' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(titles()[0]).toBe('Renamed task');
    expect(screen.getByText('Task updated')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Actions for Renamed task' })).toHaveFocus();
  });

  it('deletes a task and brings it back with Undo', async () => {
    const user = userEvent.setup();
    await openTasks(user);
    const firstTitle = titles()[0] ?? '';
    await user.click(screen.getByRole('button', { name: `Actions for ${firstTitle}` }));
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));
    const dialog = screen.getByRole('dialog', { name: 'Delete task' });
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(titles()).not.toContain(firstTitle);
    expect(screen.getByText('Task deleted')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(titles()[0]).toBe(firstTitle);
  });

  it('closes the dialog with Esc without saving', async () => {
    const user = userEvent.setup();
    await openTasks(user);
    const newTask = screen.getByRole('button', { name: 'New task' });
    await user.click(newTask);
    await fillTitle(user, 'Never saved');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(titles()).not.toContain('Never saved');
    expect(newTask).toHaveFocus();
  });

  it('completes the form with the keyboard only', async () => {
    const user = userEvent.setup();
    await openTasks(user);
    const newTask = screen.getByRole('button', { name: 'New task' });
    // Tab until "New task" has the focus, as a keyboard user would.
    for (let i = 0; i < 40 && document.activeElement !== newTask; i += 1) await user.tab();
    expect(newTask).toHaveFocus();
    await user.keyboard('{Enter}');
    const dialog = await screen.findByRole('dialog', { name: 'New task' });
    await user.keyboard('Keyboard task');
    // Title -> Description -> Assignee
    await user.tab();
    await user.tab();
    const assignee = within(dialog).getByRole('combobox', { name: 'Assignee' });
    expect(assignee).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => expect(assignee).toHaveTextContent('Grace Hopper'));
    // Assignee -> Due date -> Priority
    await user.tab();
    await user.tab();
    expect(within(dialog).getByRole('radio', { name: 'Medium' })).toHaveFocus();
    // Radix selects a radio on focus only while the arrow key is still down (jsdom needs it held).
    await user.keyboard('{ArrowRight>}');
    await user.keyboard('{/ArrowRight}');
    await waitFor(() => expect(within(dialog).getByRole('radio', { name: 'High' })).toBeChecked());
    // Priority -> Urgent
    await user.tab();
    const urgent = within(dialog).getByRole('checkbox', { name: 'Mark as urgent' });
    expect(urgent).toHaveFocus();
    await user.keyboard(' ');
    expect(urgent).toBeChecked();
    // Urgent -> Notify -> Cancel -> Save
    await user.tab();
    await user.tab();
    await user.tab();
    expect(within(dialog).getByRole('button', { name: 'Save task' })).toHaveFocus();
    await user.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(titles()[0]).toBe('Keyboard task');
    expect(newTask).toHaveFocus();
  });
});

describe('Tasks view accessibility', () => {
  it('has no axe violations in the view', async () => {
    const user = userEvent.setup();
    await openTasks(user);
    await expectNoA11yViolations(document.body);
  });

  it('has no axe violations with the dialog open', async () => {
    const user = userEvent.setup();
    await openTasks(user);
    await user.click(screen.getByRole('button', { name: 'New task' }));
    await screen.findByRole('dialog', { name: 'New task' });
    await expectNoA11yViolations(document.body);
  });

  it('has no axe violations with the form in error', async () => {
    const user = userEvent.setup();
    await openTasks(user);
    await user.click(screen.getByRole('button', { name: 'New task' }));
    await user.click(screen.getByRole('button', { name: 'Save task' }));
    await screen.findByText('Enter a title for the task.');
    await expectNoA11yViolations(document.body);
  });
});
