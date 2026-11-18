(() => {
  const hero = document.getElementById('hero');
  const base = hero?.querySelector('img');
  if (!base || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const names = ['hero-couple', 'hero-veil', 'hero-bride'];
  const slides = [base];
  let current = 0;
  let visible = false;
  let timer;

  function schedule() {
    clearTimeout(timer);
    if (visible && !document.hidden) timer = setTimeout(advance, 4000);
  }

  async function advance() {
    const next = (current + 1) % (names.length + 1);
    let image = slides[next];
    if (!image) {
      const path = 'photos/' + names[next - 1];
      image = new Image();
      image.alt = '';
      image.className = 'hero-slide';
      image.fetchPriority = 'low';
      image.sizes = '100vw';
      image.srcset = path + '-mobile.webp 1200w, ' + path + '.jpg 2560w';
      image.src = path + '.jpg';
      hero.insertBefore(image, hero.querySelector('.cover-shade'));
      slides[next] = image;
    }
    try {
      await image.decode();
      if (visible && !document.hidden) {
        slides[current].classList.remove('is-visible');
        image.classList.add('is-visible');
        current = next;
      }
    } catch {
      if (image !== base) {
        image.remove();
        slides[next] = null;
      }
    }
    schedule();
  }

  base.classList.add('hero-slide', 'is-visible');
  function start() {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    }).observe(hero);
    document.addEventListener('visibilitychange', schedule);
  }
  if (base.complete) start();
  else {
    base.addEventListener('load', start, { once: true });
    base.addEventListener('error', start, { once: true });
  }
})();
