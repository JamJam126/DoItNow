import type { Board } from '#shared/types/board'

export const sampleBoard: Board = {
  version: 1,
  name: 'My board',
  columns: [
    {
      id: 'todo',
      title: 'To do',
      cards: [
        {
          id: 'c1',
          title: 'DevKit: Base64 encoder',
          description: 'Encode and decode text. Handle Unicode properly, not just ASCII.',
          createdAt: '2026-11-08T10:00:00Z',
        },
        {
          id: 'c2',
          title: 'DevKit: JWT decoder',
          description: '',
          createdAt: '2026-11-08T10:05:00Z',
        },
        {
          id: 'c3',
          title: 'DevKit: write README',
          description: 'What it is, that everything runs in the browser, how to run it, live link.',
          createdAt: '2026-11-08T10:10:00Z',
        },
        {
          id: 'c4',
          title: 'Set up Neon database',
          description: '',
          createdAt: '2026-11-08T10:15:00Z',
        },
      ],
    },
    {
      id: 'doing',
      title: 'Doing',
      cards: [
        {
          id: 'c5',
          title: 'DoItNow: board UI',
          description: 'Columns, cards and the card detail panel with sample data.',
          createdAt: '2026-11-08T11:00:00Z',
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      cards: [
        {
          id: 'c6',
          title: 'DevKit: JSON formatter',
          description: 'Live formatting, minify, indentation options and error locations.',
          createdAt: '2026-11-08T09:00:00Z',
        },
        {
          id: 'c7',
          title: 'Deploy DoItNow to Vercel',
          description: '',
          createdAt: '2026-11-08T09:30:00Z',
        },
      ],
    },
  ],
}
