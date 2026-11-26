import { asset } from '../lib/asset';

// Page content taken from the Figma layout (d_mainpage / block_services).

export const compareSlides = Array.from({ length: 6 }, (_, i) => ({
  title: `Project ${i + 1}`,
  before: asset('/img/slider-before.webp'),
  after: asset('/img/slider-after.webp'),
}));

export const services = [
  { title: 'Paint', text: 'Walls, ceilings, trim and doors. Floors covered, clean lines, site cleaned after' },
  { title: 'Repairs', text: 'Drywall holes and dents, sticking doors, loose hardware, trim and the other small fixes on your list' },
  { title: 'Caulking', text: 'The old bead comes out completely before the new one goes on' },
  { title: 'Turnover', text: 'Getting a home ready to sell or rent:\nthe whole small-fix list, one person, one plan' },
  { title: 'Exterior', text: 'Fence and deck boards replaced, decks repainted, pressure washing for decks, patios and pool areas' },
  { title: 'Demolition', text: 'Carpet, floor tile, baseboards and old shelving taken out, so the room is ready for what comes next.' },
].map((s) =>
  s.title === 'Turnover'
    ? { ...s, before: asset('/img/turnover-before.webp'), after: asset('/img/turnover-after.webp') }
    : { ...s, before: asset('/img/service.webp'), after: asset('/img/service.webp') },
);

export const projects = [asset('/img/project-1.webp'), asset('/img/project-2.webp'), asset('/img/project-3.webp')].map((image) => ({
  tags: 'demolition / fast charge',
  title: 'Cottage in the Lisnyky district',
  image,
  href: '#works',
}));

const dianeText =
  'Furman Bogdan did an excellent job.\nHe worked diligently for almost 6 hours straight.\nEverything he put together was done with expertise and care.\n\nHe put together a full outdoor sitting set, 4 metal chairs and 2 nightstands that were a nightmare . We will use him again!';

export const reviews = [
  { name: 'Diane D.', text: dianeText, date: 'Aug 13,2025' },
  { name: 'Diane G.', text: dianeText, date: 'Oct 18,2025' },
  {
    name: 'Jeff S.',
    text: 'Bogdan was punctual, skilled, has a positive attitude and pays meticulous attention to detail.\n\nHe works igently, moves swiftly, and is relentless in ensur quality over mere completion. He delivered on time and on budget, as promised. Highly recommended.',
    date: 'Nov 4,2025',
  },
];

export const articles = [
  { tag: 'caulking', title: 'Why bathroom caulk turns black and peels in Florida', image: asset('/img/article.webp') },
  { tag: 'painting', title: "Peeling paint outside? Here's what usually causes it", image: asset('/img/article.webp') },
  { tag: 'turnover', title: 'Getting a rental ready between tenants: a simple checklist', image: asset('/img/article.webp') },
];
