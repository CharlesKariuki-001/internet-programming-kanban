export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'To Do' | 'In Progress' | 'Done';

/**
 * User profile attached to a task as the assignee.
 */
export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
}

/**
 * A board owns a set of tasks. Multiple boards are supported.
 */
export interface Board {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

/**
 * Canonical Task shape.
 * Required: id, title, description, status, priority, dueDate, boardId.
 * Auxiliary: assignee, comments, attachments, completedAt.
 */
export interface Task {
  id: string;
  boardId: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  assignee: User;
  comments: number;
  attachments: number;
  completedAt?: string;
}

export const users: Record<string, User> = {
  alice: {
    id: 'u1',
    name: 'Alice Chen',
    initials: 'AC',
    color: 'from-pink-500 to-rose-500'
  },
  bob: {
    id: 'u2',
    name: 'Bob Smith',
    initials: 'BS',
    color: 'from-cyan-500 to-blue-500'
  },
  charlie: {
    id: 'u3',
    name: 'Charlie Davis',
    initials: 'CD',
    color: 'from-amber-400 to-orange-500'
  },
  diana: {
    id: 'u4',
    name: 'Diana Prince',
    initials: 'DP',
    color: 'from-emerald-400 to-teal-500'
  }
};

export const seedBoards: Board[] = [
{
  id: 'b1',
  name: 'Project Alpha',
  color: 'bg-cyan-500',
  createdAt: '2023-09-01'
},
{ id: 'b2', name: 'Personal', color: 'bg-rose-500', createdAt: '2023-09-15' },
{
  id: 'b3',
  name: 'Side Project',
  color: 'bg-amber-500',
  createdAt: '2023-10-01'
}];


// Helper: a date N days ago, ISO YYYY-MM-DD
const daysAgo = (n: number) => {
  const d = new Date('2023-10-26');
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};
const daysAhead = (n: number) => {
  const d = new Date('2023-10-26');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const seedTasks: Task[] = [
// Project Alpha
{
  id: 't1',
  boardId: 'b1',
  title: 'Design System Audit',
  description:
  'Review current components and document inconsistencies across the main app.',
  priority: 'High',
  status: 'To Do',
  dueDate: daysAhead(20),
  assignee: users.alice,
  comments: 3,
  attachments: 1
},
{
  id: 't2',
  boardId: 'b1',
  title: 'Implement Dark Mode',
  description:
  'Add dark mode support using Tailwind CSS variables and update all surfaces.',
  priority: 'Medium',
  status: 'In Progress',
  dueDate: daysAhead(2),
  assignee: users.bob,
  comments: 8,
  attachments: 0
},
{
  id: 't3',
  boardId: 'b1',
  title: 'User Onboarding Flow',
  description:
  'Create the new 3-step onboarding modal for first-time signups.',
  priority: 'High',
  status: 'In Progress',
  dueDate: daysAgo(1),
  assignee: users.charlie,
  comments: 12,
  attachments: 4
},
{
  id: 't4',
  boardId: 'b1',
  title: 'Fix Navigation Bug',
  description:
  "Mobile sidebar doesn't close when clicking outside the drawer area.",
  priority: 'Low',
  status: 'Done',
  dueDate: daysAgo(6),
  assignee: users.diana,
  comments: 2,
  attachments: 0,
  completedAt: daysAgo(2)
},
{
  id: 't5',
  boardId: 'b1',
  title: 'Update Landing Copy',
  description: 'Sync with marketing team to update the hero section text.',
  priority: 'Medium',
  status: 'To Do',
  dueDate: daysAhead(10),
  assignee: users.alice,
  comments: 0,
  attachments: 0
},
{
  id: 't6',
  boardId: 'b1',
  title: 'Migrate to React 18',
  description: 'Test concurrent features and update root rendering API.',
  priority: 'High',
  status: 'Done',
  dueDate: daysAgo(16),
  assignee: users.bob,
  comments: 5,
  attachments: 0,
  completedAt: daysAgo(8)
},
{
  id: 't7',
  boardId: 'b1',
  title: 'Add Analytics Events',
  description:
  'Track button clicks on the pricing page and signup conversions.',
  priority: 'Low',
  status: 'To Do',
  dueDate: daysAhead(25),
  assignee: users.charlie,
  comments: 1,
  attachments: 0
},
{
  id: 't8',
  boardId: 'b1',
  title: 'Optimize Image Loading',
  description:
  'Implement lazy loading and WebP formats for all marketing assets.',
  priority: 'Medium',
  status: 'In Progress',
  dueDate: daysAhead(7),
  assignee: users.diana,
  comments: 4,
  attachments: 2
},
{
  id: 't9',
  boardId: 'b1',
  title: 'Accessibility Audit',
  description:
  'Run axe checks and fix contrast and keyboard navigation issues.',
  priority: 'High',
  status: 'Done',
  dueDate: daysAgo(20),
  assignee: users.alice,
  comments: 3,
  attachments: 0,
  completedAt: daysAgo(4)
},

// Personal
{
  id: 't10',
  boardId: 'b2',
  title: 'Weekly Meal Plan',
  description: 'Plan meals for the week and prep grocery list.',
  priority: 'Medium',
  status: 'To Do',
  dueDate: daysAhead(1),
  assignee: users.diana,
  comments: 0,
  attachments: 0
},
{
  id: 't11',
  boardId: 'b2',
  title: 'Book Dentist Appointment',
  description: "Annual checkup — call Dr. Patel's office.",
  priority: 'Low',
  status: 'To Do',
  dueDate: daysAhead(5),
  assignee: users.diana,
  comments: 0,
  attachments: 0
},
{
  id: 't12',
  boardId: 'b2',
  title: 'Finish Reading "Atomic Habits"',
  description: 'Last 3 chapters left.',
  priority: 'Low',
  status: 'In Progress',
  dueDate: daysAhead(14),
  assignee: users.diana,
  comments: 0,
  attachments: 0
},
{
  id: 't13',
  boardId: 'b2',
  title: 'Renew Gym Membership',
  description: 'Annual renewal due before end of month.',
  priority: 'High',
  status: 'Done',
  dueDate: daysAgo(3),
  assignee: users.diana,
  comments: 0,
  attachments: 0,
  completedAt: daysAgo(1)
},

// Side Project
{
  id: 't14',
  boardId: 'b3',
  title: 'Domain Name Research',
  description: 'Find available .io and .app domains for the launch.',
  priority: 'Medium',
  status: 'In Progress',
  dueDate: daysAhead(3),
  assignee: users.charlie,
  comments: 2,
  attachments: 0
},
{
  id: 't15',
  boardId: 'b3',
  title: 'Build MVP Backend',
  description: 'Set up Supabase and define the database schema.',
  priority: 'High',
  status: 'To Do',
  dueDate: daysAhead(8),
  assignee: users.bob,
  comments: 0,
  attachments: 0
},
{
  id: 't16',
  boardId: 'b3',
  title: 'Logo Concepts',
  description: 'Draft 3 logo directions.',
  priority: 'Medium',
  status: 'Done',
  dueDate: daysAgo(8),
  assignee: users.alice,
  comments: 4,
  attachments: 3,
  completedAt: daysAgo(5)
}];