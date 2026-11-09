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
