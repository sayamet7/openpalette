(() => {
  const hero = document.querySelector('.hero-film');
  const filmStage = document.querySelector('[data-film-stage]');
  const filmWords = [...document.querySelectorAll('[data-film-word]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const loopDuration = 28;
  const filmTickMs = 80;
  const phaseStops = [
    [0, 'type'],
    [7.2, 'statement'],
    [11.0, 'detail'],
    [15.4, 'type'],
    [20.1, 'collage'],
    [24.4, 'lockup']
  ];
  const wordStarts = [.78, 1.08, 1.38, 1.72, 2.08, 2.42];
  let filmTimer = 0;
  let filmTime = 0;
  let filmStart = 0;
  let filmVisible = true;
  let currentFilmPhase = '';

  const setFilmPhase = (phase) => {
    if (phase === currentFilmPhase) return;
    currentFilmPhase = phase;
    filmStage.className = `film-stage phase-${phase}`;
  };

  const phaseFor = (time) => {
    let current = phaseStops[0][1];
    phaseStops.forEach(([start, phase]) => { if (time >= start) current = phase; });
    return current;
  };

  const updateFilm = () => {
    if (!filmVisible || reduceMotion.matches) return;
    filmTime = ((performance.now() - filmStart) / 1000) % loopDuration;
    setFilmPhase(phaseFor(filmTime));
    filmWords.forEach((word, index) => {
      const visible = filmTime >= wordStarts[index] && filmTime < 4.75;
      word.classList.toggle('is-visible', visible);
    });
    filmTimer = window.setTimeout(updateFilm, filmTickMs);
  };

  const startFilm = () => {
    if (reduceMotion.matches) {
      setFilmPhase('lockup');
      filmWords.forEach(word => word.classList.remove('is-visible'));
      return;
    }
    window.clearTimeout(filmTimer);
    filmStart = performance.now() - filmTime * 1000;
    filmTimer = window.setTimeout(updateFilm, 0);
  };

  if (hero && filmStage) {
    const filmObserver = new IntersectionObserver(([entry]) => {
      filmVisible = entry.isIntersecting;
      if (filmVisible) startFilm(); else window.clearTimeout(filmTimer);
    }, { threshold: .05 });
    filmObserver.observe(hero);
    reduceMotion.addEventListener?.('change', startFilm);
    startFilm();
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

  const menuButton = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('.mobile-nav');
  const setMenu = open => {
    menuButton.classList.toggle('active', open);
    mobileNav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    mobileNav.setAttribute('aria-hidden', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
  };
  menuButton.addEventListener('click', () => setMenu(!mobileNav.classList.contains('open')));
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

  const researchToc = document.querySelector('.research-toc');
  if (researchToc) {
    const researchLinks = [...researchToc.querySelectorAll('a[href^="#"]')];
    const researchSections = researchLinks
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);
    const setResearchSection = id => researchLinks.forEach(link => {
      if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const researchObserver = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach(entry => setResearchSection(entry.target.id));
    }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 });
    researchSections.forEach(section => researchObserver.observe(section));
    setResearchSection(researchSections[0]?.id);
  }

  const newsList = document.querySelector('[data-news-list]');
  if (newsList) {
    const renderNews = items => {
      newsList.replaceChildren(...items.map((item, index) => {
        const article = document.createElement('article');
        article.className = 'news-item reveal visible';
        const meta = document.createElement('div');
        meta.className = 'news-item-meta';
        const date = document.createElement('time');
        date.dateTime = item.date;
        date.textContent = item.date.replaceAll('-', '.');
        const tag = document.createElement('span');
        tag.textContent = item.tag;
        meta.append(date, tag);
        const copy = document.createElement('div');
        copy.className = 'news-item-copy';
        const title = document.createElement('h3');
        title.textContent = item.title;
        const summary = document.createElement('p');
        summary.textContent = item.summary;
        copy.append(title, summary);
        const number = document.createElement('span');
        number.className = 'news-item-number';
        number.textContent = String(index + 1).padStart(2, '0');
        article.append(meta, copy, number);
        return article;
      }));
    };
    fetch('./news.json').then(response => response.json()).then(renderNews).catch(() => {
      renderNews([{ date: '2026-07-20', tag: 'OPEN PALETTE', title: 'Open Palette is now live', summary: 'A toolkit for shaping Illustrator paths and color with more intention.' }]);
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.clearTimeout(filmTimer);
    else if (filmVisible) startFilm();
  });
})();
