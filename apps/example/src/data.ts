// Fictional, local data for the example app. There are no network calls.

export interface Indicator {
  id: string;
  label: string;
  value: string;
  status: string;
  variant: 'success' | 'warning' | 'danger' | 'info';
}

export const indicators: Indicator[] = [
  { id: 'open', label: 'Open tasks', value: '24', status: 'On track', variant: 'success' },
  { id: 'review', label: 'In review', value: '7', status: 'Needs attention', variant: 'warning' },
  { id: 'overdue', label: 'Overdue', value: '3', status: 'Late', variant: 'danger' },
  { id: 'done', label: 'Done this week', value: '18', status: '+12%', variant: 'info' },
];

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    id: 'assign',
    question: 'How do I assign a task?',
    answer: 'Open the task and choose a teammate in the assignee field.',
  },
  {
    id: 'due',
    question: 'Can I change a due date?',
    answer: 'Yes. Any member of the team can change the due date of a task.',
  },
  {
    id: 'archive',
    question: 'What happens to finished tasks?',
    answer: 'Finished tasks are archived after 30 days and can still be searched.',
  },
];

export const currentUser = { name: 'Ada Lovelace', email: 'ada@example.com' };

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: Priority;
  status: TaskStatus;
  /** Due date as `YYYY-MM-DD`. */
  due: string;
  urgent: boolean;
  notify: boolean;
}

export const team = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson'];

export const priorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const priorityRank: Record<Priority, number> = { low: 0, medium: 1, high: 2 };

export const statusLabels: Record<TaskStatus, string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
};

const titles = [
  'Draft the release notes',
  'Review the onboarding flow',
  'Fix the login redirect',
  'Plan the sprint demo',
  'Update the pricing page',
  'Audit the colour contrast',
  'Write the API guide',
  'Clean up old branches',
  'Prepare the quarterly report',
  'Translate the help centre',
  'Test the export feature',
  'Refactor the settings page',
];
const priorities: Priority[] = ['low', 'medium', 'high'];
const statuses: TaskStatus[] = ['todo', 'in-progress', 'done'];

function pick<T>(list: readonly T[], index: number): T {
  return list[index % list.length] as T;
}

/** 34 fictional tasks, generated from fixed lists so the data is the same on every load. */
export const initialTasks: Task[] = Array.from({ length: 34 }, (_, index) => {
  const day = String(((index * 7) % 28) + 1).padStart(2, '0');
  const month = String((index % 6) + 1).padStart(2, '0');
  return {
    id: `task-${index + 1}`,
    title: `${pick(titles, index)} ${Math.floor(index / titles.length) + 1}`,
    description: 'A fictional task used to show the example app.',
    assignee: pick(team, index),
    priority: pick(priorities, index),
    status: pick(statuses, index * 2),
    due: `2027-${month}-${day}`,
    urgent: index % 9 === 0,
    notify: index % 2 === 0,
  };
});
