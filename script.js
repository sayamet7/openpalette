(() => {
  const canvas = document.querySelector('#sky');
  const ctx = canvas.getContext('2d', { alpha: false });
  const hero = document.querySelector('.hero');
  let width = 0, height = 0, dpr = 1, pointerX = .62, pointerY = .38;
  let targetX = pointerX, targetY = pointerY, raf;
  const clouds = Array.from({ length: 22 }, (_, index) => ({
    x: ((index * 197) % 1000) / 1000,
    y: .12 + (((index * 83) % 620) / 1000),
    size: .08 + (((index * 47) % 130) / 1000),
    speed: .000004 + (index % 5) * .000001,
    opacity: .035 + (index % 6) * .012,
    phase: index * 1.93
  }));

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = rect.width; height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 1.7);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function cloud(x, y, radius, opacity, time) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(255,250,234,${opacity})`);
    gradient.addColorStop(.35, `rgba(248,238,218,${opacity * .65})`);
    gradient.addColorStop(1, 'rgba(225,222,215,0)');
    ctx.fillStyle = gradient; ctx.beginPath();
    ctx.ellipse(x, y, radius * (1.7 + Math.sin(time) * .12), radius * .72, -.16, 0, Math.PI * 2);
    ctx.fill();
  }

  function render(time = 0) {
    pointerX += (targetX - pointerX) * .018; pointerY += (targetY - pointerY) * .018;
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#526f9b'); sky.addColorStop(.32, '#91a8c5');
    sky.addColorStop(.62, '#d8c9be'); sky.addColorStop(.82, '#c58f75'); sky.addColorStop(1, '#493e40');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, width, height);
    const sunX = width * (.72 + (pointerX - .5) * .05), sunY = height * (.47 + (pointerY - .5) * .035);
    const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, width * .42);
    sun.addColorStop(0, 'rgba(255,235,179,.52)'); sun.addColorStop(.25, 'rgba(252,205,160,.19)'); sun.addColorStop(1, 'rgba(255,196,153,0)');
    ctx.fillStyle = sun; ctx.fillRect(0, 0, width, height);
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    clouds.forEach((item, index) => {
      const travel = (item.x + time * item.speed) % 1.28 - .14;
      const drift = Math.sin(time * .00012 + item.phase) * height * .018;
      cloud(travel * width + (pointerX - .5) * width * (index % 3) * .015, item.y * height + drift, item.size * width, item.opacity, time * .0002 + item.phase);
    });
    ctx.restore();
    const haze = ctx.createLinearGradient(0, height * .62, 0, height);
    haze.addColorStop(0, 'rgba(255,225,200,0)'); haze.addColorStop(.47, 'rgba(239,175,143,.1)'); haze.addColorStop(1, 'rgba(14,15,25,.16)');
    ctx.fillStyle = haze; ctx.fillRect(0, 0, width, height);
    raf = requestAnimationFrame(render);
  }

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    targetX = (event.clientX - rect.left) / rect.width; targetY = (event.clientY - rect.top) / rect.height;
  });
  window.addEventListener('resize', resize); resize(); render();
  const header = document.querySelector('[data-header]');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`; revealObserver.observe(element);
  });

  const lineLab = document.querySelector('[data-line-lab]');
  const flowPaths = lineLab.querySelectorAll('.flow');
  const controlGroup = lineLab.querySelector('.control-points');
  const basePath = 'M-50 476C78 472 82 167 238 184S344 558 507 532 659 198 950 246';
  lineLab.addEventListener('pointermove', event => {
    const rect = lineLab.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 900, y = ((event.clientY - rect.top) / rect.height) * 700;
    const path = `M-50 476C78 472 ${x - 156} ${y - 17} ${x} ${y}S${x + 106} ${y + 374} 507 532 659 198 950 246`;
    flowPaths.forEach(item => item.setAttribute('d', path)); controlGroup.style.transform = `translate(${x - 238}px,${y - 184}px)`;
  });
  lineLab.addEventListener('pointerleave', () => {
    flowPaths.forEach(item => item.setAttribute('d', basePath)); controlGroup.style.transform = '';
  });

  const menuButton = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('.mobile-nav');
  const setMenu = open => {
    menuButton.classList.toggle('active', open); mobileNav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open)); mobileNav.setAttribute('aria-hidden', String(!open));
    menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    document.body.classList.toggle('menu-open', open);
  };
  menuButton.addEventListener('click', () => setMenu(!mobileNav.classList.contains('open')));
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('visibilitychange', () => document.hidden ? cancelAnimationFrame(raf) : render());
})();
