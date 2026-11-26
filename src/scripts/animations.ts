import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { fitScreens } from './fit';

fitScreens();
let resizeTimer = 0;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => { fitScreens(); ScrollTrigger.refresh(); }, 150);
});

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  [...root.querySelectorAll<T>(sel)] as unknown as T[];

/** Wrap every word of an element in a masked span so it can slide up. Keeps <br> and inline tags. */
function splitWords(el: HTMLElement): HTMLElement[] {
  const words: HTMLElement[] = [];
  const walk = (node: Node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          const mask = document.createElement('span');
          mask.className = 'split-mask';
          const inner = document.createElement('span');
          inner.className = 'split-word';
          inner.textContent = p;
          mask.appendChild(inner);
          frag.appendChild(mask);
          words.push(inner);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(el);
  return words;
}

const style = document.createElement('style');
style.textContent = `
  .split-mask{display:inline-block;overflow:hidden;vertical-align:top;padding:0 .12em .06em 0;margin:0 -.12em -.06em 0}
  .split-word{display:inline-block;will-change:transform}
`;
document.head.appendChild(style);

if (reduce) {
  gsap.set('[data-reveal]', { opacity: 1 });
} else {
  /* ---------- hero intro ---------- */
  const heroTitle = document.querySelector<HTMLElement>('[data-split]');
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('[data-hero-bg]', { scale: 1.12, duration: 2, ease: 'power2.out' }, 0);
  if (heroTitle) {
    tl.from(splitWords(heroTitle), { yPercent: 110, duration: 1.1, stagger: 0.08 }, 0.15);
  }
  tl.from('[data-hero-item]', { y: 40, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.55);

  // subtle parallax of the hero photo
  gsap.to('[data-hero-bg]', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  /* ---------- big headings: words slide up ---------- */
  $$('h2.t-h1:not([data-card-text])').forEach((h) => {
    const words = splitWords(h);
    h.removeAttribute('data-reveal');
    gsap.set(h, { opacity: 1 });
    gsap.from(words, {
      yPercent: 110,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.06,
      scrollTrigger: { trigger: h, start: 'top 85%' },
    });
  });

  /* ---------- generic reveal (texts, cards, images) ---------- */
  const from = (el: Element) => {
    const dir = (el as HTMLElement).dataset.reveal;
    if (dir === 'left') return { x: -80, y: 0 };
    if (dir === 'right') return { x: 80, y: 0 };
    return { x: 0, y: 40 };
  };
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => {
      batch.forEach((el, i) => {
        const f = from(el);
        gsap.fromTo(el, { opacity: 0, x: f.x, y: f.y }, {
          opacity: 1, x: 0, y: 0, duration: 1, delay: i * 0.1, ease: 'power3.out', clearProps: 'transform',
        });
      });
    },
  });

  /* ---------- icon tiles pop in ---------- */
  $$('[data-tile]').forEach((t) => {
    gsap.from(t, {
      scale: 0.4, rotation: -20, duration: 0.9, ease: 'back.out(2)',
      scrollTrigger: { trigger: t, start: 'top 90%' },
    });
    gsap.from(t.querySelector('.tile__icon'), {
      scale: 0, duration: 0.6, delay: 0.25, ease: 'back.out(3)',
      scrollTrigger: { trigger: t, start: 'top 90%' },
    });
  });

  /* ---------- sticky blocks: the accent card appears first, then the list on the right ---------- */
  const cardReady = new Map<Element, Promise<void>>();
  $$('.bcard').forEach((card) => {
    const section = card.closest('section')!;
    let done: () => void = () => {};
    cardReady.set(section, new Promise<void>((r) => { done = r; }));
    const t = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 70%' } });
    t.from(card, { y: 60, opacity: 0, duration: 1, ease: 'power3.out' })
      .from(card.querySelectorAll('[data-card-text]'), { y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, '-=0.6')
      .from(card.querySelectorAll('[data-card-tool]'), { x: -120, rotation: -8, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out' }, '-=0.7')
      .call(() => done(), [], 1.3);
  });
  /** play a list item's timeline when it scrolls in, but never before its section's card */
  const gated = (item: HTMLElement, tl: gsap.core.Timeline) => {
    tl.pause();
    const ready = cardReady.get(item.closest('section')!) ?? Promise.resolve();
    ScrollTrigger.create({
      trigger: item,
      start: 'top 85%',
      once: true,
      onEnter: () => ready.then(() => tl.play()),
    });
  };

  // rating counter
  $$('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count ?? '0');
    const o = { v: 0 };
    gsap.to(o, {
      v: target, duration: 1.6, ease: 'power2.out',
      onUpdate: () => { el.textContent = o.v.toFixed(1); },
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
  });

  /* ---------- services list (right column) ---------- */
  $$('[data-service]').forEach((s) => {
    const title = s.querySelector<HTMLElement>('[data-service-title]')!;
    const words = splitWords(title);
    const t = gsap.timeline();
    t.from(words, { yPercent: 110, duration: 0.9, ease: 'power4.out' })
      .from(s.querySelector('[data-service-text]'), { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.6')
      .from(s.querySelectorAll('[data-service-img]'), { y: 50, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, '-=0.5');
    gated(s, t);
  });

  /* ---------- reviews list (right column) ---------- */
  $$('[data-list-item]').forEach((item, i) => {
    const t = gsap.timeline();
    t.from(item, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: i === 0 ? 0 : 0.05 });
    gated(item, t);
  });

  /* ---------- brick decor ---------- */
  $$('[data-bricks]').forEach((b) => {
    gsap.from(b.querySelectorAll('rect'), {
      opacity: 0, y: -12, duration: 0.6, stagger: { each: 0.05, from: 'random' }, ease: 'power2.out',
      scrollTrigger: { trigger: b, start: 'top 85%' },
    });
  });

  /* ---------- footer logo ---------- */
  gsap.from('[data-footer-logo]', {
    yPercent: 70, opacity: 0, duration: 1.2, ease: 'power4.out',
    scrollTrigger: { trigger: '.footer', start: 'top 90%' },
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
