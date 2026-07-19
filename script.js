(() => {
  const canvas = document.querySelector('#sky');
  const ctx = canvas.getContext('2d', { alpha: false });
  const hero = document.querySelector('.hero');
  const heroWords = document.querySelectorAll('.hero-word');
  let width = 0, height = 0, dpr = 1, pointerX = .62, pointerY = .38;
  let targetX = pointerX, targetY = pointerY, raf;
  const clouds = Array.from({ length: 16 }, (_, index) => ({
    x: ((index * 197) % 1000) / 1000,
    y: .12 + (((index * 83) % 620) / 1000),
    size: .06 + (((index * 47) % 145) / 1000),
    speed: .000012 + (index % 5) * .000004,
    opacity: .075 + (index % 6) * .018,
    phase: index * 1.93
  }));
  const cloudBanks = Array.from({ length: 5 }, (_, index) => ({
    x: ((index * 317) % 1100) / 1000 - .12,
    y: .18 + (((index * 71) % 430) / 1000),
    width: .42 + (((index * 43) % 380) / 1000),
    height: .075 + (((index * 29) % 90) / 1000),
    speed: .000006 + (index % 4) * .000002,
    opacity: .075 + (index % 4) * .018,
    phase: index * 2.47
  }));

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = rect.width; height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 1.7);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function cloud(x, y, radius, opacity, time) {
    const puffs = [[-.58,.13,.64],[-.28,-.09,.82],[.04,-.18,1.06],[.36,-.04,.78],[.64,.12,.56]];
    puffs.forEach(([offset, yOffset, scale], puffIndex) => {
      const puffX = x + radius * offset;
      const puffY = y + radius * (yOffset + Math.sin(time * 1.8 + puffIndex) * .055);
      const puffRadius = radius * scale;
      const gradient = ctx.createRadialGradient(puffX, puffY, 0, puffX, puffY, puffRadius);
      const puffOpacity = opacity * (.88 - puffIndex * .055);
      gradient.addColorStop(0, `rgba(255,252,242,${puffOpacity})`);
      gradient.addColorStop(.38, `rgba(248,239,222,${puffOpacity * .68})`);
      gradient.addColorStop(1, 'rgba(225,222,215,0)');
      ctx.fillStyle = gradient; ctx.beginPath();
      ctx.ellipse(puffX, puffY, puffRadius * (1.05 + Math.sin(time + puffIndex) * .06), puffRadius * .52, -.16, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function cloudBank(item, time) {
    const travel = (item.x + time * item.speed) % 1.34 - .17;
    const x = travel * width + Math.sin(time * .00008 + item.phase) * width * .025;
    const y = item.y * height + Math.sin(time * .00012 + item.phase) * height * .024;
    const bankWidth = item.width * width;
    const bankHeight = item.height * height;
    const puffs = 4;

    ctx.save();
    ctx.filter = `blur(${Math.max(5, width * .005)}px)`;
    for (let puff = 0; puff < puffs; puff += 1) {
      const ratio = puff / (puffs - 1);
      const puffX = x + bankWidth * (ratio - .5) * .92;
      const puffY = y + Math.sin(time * .00016 + item.phase + puff) * bankHeight * .38;
      const puffRadius = bankHeight * (1.65 - Math.abs(ratio - .5) * .72);
      const shadow = ctx.createRadialGradient(puffX, puffY + puffRadius * .12, 0, puffX, puffY, puffRadius * 1.8);
      shadow.addColorStop(0, `rgba(89,113,143,${item.opacity * .22})`);
      shadow.addColorStop(.68, 'rgba(130,145,164,0)');
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.ellipse(puffX, puffY + puffRadius * .16, puffRadius * 1.45, puffRadius * .54, -.04, 0, Math.PI * 2);
      ctx.fill();

      const highlight = ctx.createRadialGradient(puffX, puffY - puffRadius * .08, 0, puffX, puffY, puffRadius * 1.35);
      highlight.addColorStop(0, `rgba(255,252,241,${item.opacity * (1.08 - ratio * .22)})`);
      highlight.addColorStop(.42, `rgba(245,242,231,${item.opacity * .52})`);
      highlight.addColorStop(1, 'rgba(224,226,224,0)');
      ctx.fillStyle = highlight;
      ctx.beginPath();
      ctx.ellipse(puffX, puffY, puffRadius * 1.35, puffRadius * .66, -.04, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function render(time = 0) {
    pointerX += (targetX - pointerX) * .018; pointerY += (targetY - pointerY) * .018;
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#526f9b'); sky.addColorStop(.32, '#91a8c5');
    sky.addColorStop(.62, '#d8c9be'); sky.addColorStop(.82, '#c58f75'); sky.addColorStop(1, '#493e40');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, width, height);
    const sunX = width * (.72 + (pointerX - .5) * .05 + Math.sin(time * .00012) * .045), sunY = height * (.47 + (pointerY - .5) * .035 + Math.sin(time * .00009) * .02);
    const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, width * .42);
    sun.addColorStop(0, 'rgba(255,235,179,.52)'); sun.addColorStop(.25, 'rgba(252,205,160,.19)'); sun.addColorStop(1, 'rgba(255,196,153,0)');
    ctx.fillStyle = sun; ctx.fillRect(0, 0, width, height);
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    clouds.forEach((item, index) => {
      const travel = (item.x + time * item.speed) % 1.28 - .14;
      const drift = Math.sin(time * .00018 + item.phase) * height * .045;
      cloud(travel * width + (pointerX - .5) * width * (index % 3) * .015, item.y * height + drift, item.size * width, item.opacity, time * .0002 + item.phase);
    });
    cloudBanks.forEach(item => cloudBank(item, time));
    ctx.restore();
    const haze = ctx.createLinearGradient(0, height * .62, 0, height);
    haze.addColorStop(0, 'rgba(255,225,200,0)'); haze.addColorStop(.47, 'rgba(239,175,143,.1)'); haze.addColorStop(1, 'rgba(14,15,25,.16)');
    ctx.fillStyle = haze; ctx.fillRect(0, 0, width, height);
    raf = requestAnimationFrame(render);
  }

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    targetX = (event.clientX - rect.left) / rect.width; targetY = (event.clientY - rect.top) / rect.height;
    heroWords.forEach((word, index) => {
      const depth = .65 + (index % 4) * .28;
      word.style.setProperty('--drift-x', `${(targetX - .5) * 24 * depth}px`);
      word.style.setProperty('--drift-y', `${(targetY - .5) * 14 * depth}px`);
    });
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
