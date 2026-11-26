/**
 * Every section marked .screen has to fit one viewport.
 * Content inside [data-fit] keeps its design size and is scaled down with CSS zoom
 * only when the window is too short for it. The sticky accent cards get the same treatment.
 */
const SCREEN_PADDING = 96; // .screen has 48px top + bottom
const CARD = 592;

export function fitScreens() {
  const vh = window.innerHeight;
  const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 56;

  const mobile = window.matchMedia('(max-width: 767px)').matches;

  document.querySelectorAll<HTMLElement>('[data-fit]').forEach((el) => {
    const hero = el.dataset.fit === 'hero';
    el.style.zoom = '1';
    el.style.minHeight = '';
    // phones: no scaling at all, blocks take their natural height; the hero still fills the first screen
    if (mobile) {
      if (hero) el.style.minHeight = `${el.parentElement?.clientHeight ?? vh}px`;
      return;
    }
    const natural = el.offsetHeight;
    const avail = hero ? (el.parentElement?.clientHeight ?? vh) : vh - SCREEN_PADDING;
    const z = Math.max(0.5, Math.min(1, avail / natural));
    el.style.zoom = z.toFixed(4);
    // the hero spreads its content over the whole first screen
    if (hero) el.style.minHeight = `${avail / z}px`;
  });

  if (mobile) { document.documentElement.style.setProperty('--card-scale', '1'); return; }
  const cardAvail = vh - (headerH + 24) - 24;
  const k = Math.max(0.55, Math.min(1, cardAvail / CARD));
  document.documentElement.style.setProperty('--card-scale', k.toFixed(3));
}
