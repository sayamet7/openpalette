(() => {
  const hero = document.querySelector('.hero-film');
  const filmStage = document.querySelector('[data-film-stage]');
  const filmWords = [...document.querySelectorAll('[data-film-word]')];
  const filmPath = document.querySelector('.film-path-main');
  const filmPathGlow = document.querySelector('.film-path-glow');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const loopDuration = 18;
  const phaseStops = [
    [0, 'intro'],
    [1.35, 'main'],
    [4.55, 'statement'],
    [7.15, 'detail'],
    [10.7, 'collage'],
    [14.75, 'lockup']
  ];
  const wordStarts = [.78, 1.08, 1.38, 1.72, 2.08, 2.42];
  let filmRaf = 0;
  let filmTime = 0;
  let filmStart = 0;
  let filmVisible = true;

  const setFilmPhase = (phase) => {
    filmStage.className = `film-stage phase-${phase}`;
  };

  const phaseFor = (time) => {
    let current = phaseStops[0][1];
    phaseStops.forEach(([start, phase]) => { if (time >= start) current = phase; });
    return current;
  };

  const updateFilm = (now) => {
    if (!filmVisible || reduceMotion.matches) return;
    filmTime = ((now - filmStart) / 1000) % loopDuration;
    setFilmPhase(phaseFor(filmTime));
    filmWords.forEach((word, index) => {
      const visible = filmTime >= wordStarts[index] && filmTime < 4.35;
      word.classList.toggle('is-visible', visible);
    });

    if (filmPath && filmPathGlow) {
      const drawProgress = Math.min(1, Math.max(0, (filmTime - .45) / 3.15));
      const length = filmPath.getTotalLength();
      const offset = length * (1 - drawProgress);
      filmPath.style.strokeDasharray = length;
      filmPath.style.strokeDashoffset = offset;
      filmPathGlow.style.strokeDasharray = length;
      filmPathGlow.style.strokeDashoffset = offset;
    }
    filmRaf = requestAnimationFrame(updateFilm);
  };

  const startFilm = () => {
    if (reduceMotion.matches) {
      setFilmPhase('lockup');
      filmWords.forEach(word => word.classList.remove('is-visible'));
      return;
    }
    cancelAnimationFrame(filmRaf);
    filmStart = performance.now() - filmTime * 1000;
    filmRaf = requestAnimationFrame(updateFilm);
  };

  if (hero && filmStage) {
    const filmObserver = new IntersectionObserver(([entry]) => {
      filmVisible = entry.isIntersecting;
      if (filmVisible) startFilm(); else cancelAnimationFrame(filmRaf);
    }, { threshold: .05 });
    filmObserver.observe(hero);
    reduceMotion.addEventListener?.('change', startFilm);
    startFilm();
    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      filmStage.style.setProperty('--parallax-x', `${x * 7}px`);
      filmStage.style.setProperty('--parallax-y', `${y * 5}px`);
    }, { passive: true });
  }

  const header = document.querySelector('[data-header]');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
    revealObserver.observe(element);
  });

  const lineLab = document.querySelector('[data-line-lab]');
  if (lineLab) {
    const flowPaths = lineLab.querySelectorAll('.flow');
    const controlGroup = lineLab.querySelector('.control-points');
    const basePath = 'M-50 476C78 472 82 167 238 184S344 558 507 532 659 198 950 246';
    lineLab.addEventListener('pointermove', event => {
      const rect = lineLab.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 900;
      const y = ((event.clientY - rect.top) / rect.height) * 700;
      const path = `M-50 476C78 472 ${x - 156} ${y - 17} ${x} ${y}S${x + 106} ${y + 374} 507 532 659 198 950 246`;
      flowPaths.forEach(item => item.setAttribute('d', path));
      controlGroup.style.transform = `translate(${x - 238}px,${y - 184}px)`;
    });
    lineLab.addEventListener('pointerleave', () => {
      flowPaths.forEach(item => item.setAttribute('d', basePath));
      controlGroup.style.transform = '';
    });
  }

  const menuButton = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('.mobile-nav');
  const setMenu = open => {
    menuButton.classList.toggle('active', open);
    mobileNav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    mobileNav.setAttribute('aria-hidden', String(!open));
    menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    document.body.classList.toggle('menu-open', open);
  };
  menuButton.addEventListener('click', () => setMenu(!mobileNav.classList.contains('open')));
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(filmRaf);
    else if (filmVisible) startFilm();
  });
})();
