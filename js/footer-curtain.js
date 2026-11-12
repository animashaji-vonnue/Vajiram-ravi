/* Curtain footer: the footer is parked behind the page (html.foot-curtain -> css/v49.css) and the page slides up off it, on every screen.
   It used to switch on only when the footer fitted the screen height, so a 2560 monitor got the curtain and a laptop got a plain scroll.
   A footer taller than the screen now sticks with its top at the top of the screen (bottom = screen height - footer height) while the page
   slides away, then scrolls the rest of the way. Re-checked on resize, load and font load. */
(() => {
  const foot = document.querySelector('footer.foot'); if (!foot) return;
  const root = document.documentElement;
  const check = () => {
    root.style.setProperty('--foot-off', Math.min(0, innerHeight - foot.offsetHeight) + 'px');
    root.classList.add('foot-curtain');
  };
  check(); addEventListener('resize', check); addEventListener('load', check);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(check);
})();
