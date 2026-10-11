/* =========================================================
   PREVIO — main.js
   GSAP 3.12.5 + ScrollTrigger / Lenis 1.1.20 / Swiper 11
   ========================================================= */
(() => {
  gsap.registerPlugin(ScrollTrigger);

  const isPC = () => window.innerWidth >= 800;
  const rem = (v) => v * parseFloat(getComputedStyle(document.documentElement).fontSize);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const sineInOut = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

  /* ---------- Lenis（Human Eyes: duration 1） ---------- */
  const lenis = new Lenis({ duration: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ---------- 文字分割 ---------- */
  function splitChars(el) {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          if (!n.textContent.trim() && /\n/.test(n.textContent)) return;
          const frag = document.createDocumentFragment();
          [...n.textContent.replace(/\s+/g, ' ')].forEach((c) => {
            const s = document.createElement('span');
            s.className = 'c-ch';
            s.textContent = c === ' ' ? ' ' : c;
            frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') {
          walk(n);
        }
      });
    };
    walk(el);
    return el.querySelectorAll('.c-ch');
  }

  /* ---------- KV 英字を幅いっぱいにフィット（Human Eyes: 139.2rem / SP 33.65rem） ---------- */
  function fitText() {
    document.querySelectorAll('.js-fit').forEach((el) => {
      const target = el.parentElement.clientWidth;
      const row = el.querySelector('.kv-en__row');
      el.style.fontSize = '100px';
      const w = row.getBoundingClientRect().width;
      el.style.fontSize = (100 * target) / w + 'px';
    });
  }

  /* ---------- KV 黒オーバーレイ 0.08 → 0.5 ---------- */
  const heroBg = document.getElementById('heroBg');
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    onUpdate: (s) => heroBg.style.setProperty('--bg-black', 0.08 + (0.5 - 0.08) * s.progress),
  });

  /* ---------- オープニング（Human Eyes） ---------- */
  const kvCatchChars = splitChars(document.getElementById('kvCatch'));
  const kvEnChars = splitChars(document.querySelector('#heroContent .kv-en'));
  const inHeader = document.querySelector('.in-header');

  function playOpening() {
    const opened = sessionStorage.getItem('previo-opened');
    gsap.set(kvEnChars, { y: 200 });
    gsap.set(kvEnChars, { opacity: 0 });
    gsap.set(kvCatchChars, { opacity: 0 });
    document.documentElement.classList.remove('is-loading');

    if (opened) {
      document.documentElement.classList.add('is-opened');
      gsap.fromTo(kvCatchChars, { y: 20 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.005, delay: 0.1 });
      gsap.to(kvEnChars, { y: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.04, delay: 0.2 });
      gsap.to(kvEnChars, { opacity: 1, duration: 0.3, ease: 'expo.out', stagger: 0.04, delay: 0.2 });
      return;
    }

    sessionStorage.setItem('previo-opened', '1');
    lenis.stop();
    gsap.set(inHeader, { opacity: 0 });
    inHeader.style.visibility = 'visible';

    const canvas = document.getElementById('openingCanvas');
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio, 2);
    const W = window.innerWidth, H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const maxR = Math.hypot(W, H) / 2;
    const c = { r1: 0, r2: 0 };
    const draw = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#2546D8';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#1B36B0';
      ctx.beginPath(); ctx.arc(W / 2, H / 2, c.r1, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.arc(W / 2, H / 2, c.r2, 0, Math.PI * 2); ctx.fill();
    };
    draw();
    document.documentElement.classList.remove('is-opening');

    // ロゴは文字ごとの path（viewBox 高さ 730）。svg の外から下に隠しておく
    const logo = document.querySelectorAll('#openingLogo path');
    gsap.set(logo, { y: 800 });
    document.querySelector('.opening__svg').style.visibility = 'visible';
    const tl = gsap.timeline();
    tl.to(logo, { y: 0, duration: 0.52, stagger: 0.04, ease: 'back.out(2)' }, 0.3)
      .to(logo, { y: 800, duration: 0.5, stagger: 0.05, ease: 'expo.in' }, 1.2)
      .to(kvEnChars, { y: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.04 }, 2)
      .to(kvEnChars, { opacity: 1, duration: 0.3, ease: 'expo.out', stagger: 0.04 }, 2)
      .fromTo(kvCatchChars, { y: 10 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.005 }, 2.4)
      .to(c, { r1: maxR, duration: 1, ease: 'expo.inOut', onUpdate: draw }, 2.6)
      .to(c, { r2: maxR, duration: 1, ease: 'expo.inOut', onUpdate: draw }, 2.725)
      .to(inHeader, { opacity: 1, duration: 0.6 }, 3.2)
      .add(() => {
        document.documentElement.classList.add('is-opened');
        lenis.start();
      });
  }

  /* ---------- 追従ヘッダー（Human Eyes） ---------- */
  let footerIn = false;
  ScrollTrigger.create({
    trigger: '.js-footer',
    start: 'top 60%',
    onToggle: (s) => { footerIn = s.isActive; if (footerIn) document.documentElement.classList.remove('show-fixed-header'); },
  });
  lenis.on('scroll', ({ scroll, direction }) => {
    const root = document.documentElement.classList;
    if (direction === -1 && scroll > window.innerHeight + 100 && !footerIn) root.add('show-fixed-header');
    else if (direction === 1 || scroll <= window.innerHeight + 100) root.remove('show-fixed-header');
  });

  /* ---------- マーキー（Human Eyes: 1セット 20s、スクロール速度で加速、hover で停止） ---------- */
  document.querySelectorAll('.js-marquee').forEach((mq) => {
    const track = mq.querySelector('.marquee__track');
    const set = track.firstElementChild;
    const fill = () => {
      while (track.children.length > 1) track.lastElementChild.remove();
      const need = Math.ceil((window.innerWidth * 2) / set.offsetWidth) + 1;
      for (let i = 0; i < need; i++) track.appendChild(set.cloneNode(true));
    };
    fill();
    window.addEventListener('resize', fill);
    const st = { pos: 0, power: 1 };
    mq.addEventListener('mouseenter', () => gsap.to(st, { power: 0, duration: 0.3, ease: 'sine.out' }));
    mq.addEventListener('mouseleave', () => gsap.to(st, { power: 1, duration: 0.3, ease: 'sine.out' }));
    gsap.ticker.add((time, dt) => {
      const v = Math.min(Math.abs(lenis.velocity) / 40, 3);
      st.pos += (dt / 1000 / 20) * (st.power + 0.6 * v * st.power);
      track.style.transform = `translate3d(${-(st.pos % 1) * set.offsetWidth}px,0,0)`;
    });
  });

  // フッター巨大文字（Human Eyes: 半周 100s）
  const giant = document.querySelector('.js-giant');
  gsap.to(giant, { xPercent: -50, duration: 100, ease: 'none', repeat: -1 });

  /* ---------- Why PREVIO アコーディオン（Human Eyes: PC mouseenter / SP click） ---------- */
  const whyList = document.querySelector('.js-why');
  const whyItems = [...whyList.children];
  let whyActive = 0;
  function layoutWhy() {
    const overlap = rem(4);
    const headH = whyItems[0].querySelector('.why-item__head').offsetHeight;
    const step = headH - rem(1);
    let natural = 0, desired = 0, maxBottom = 0;
    whyItems.forEach((item, i) => {
      const h = item.offsetHeight;
      const shift = desired - natural;
      item.style.transform = `translateY(${shift}px)`;
      item.classList.toggle('is-active', i === whyActive);
      natural += h - overlap;
      desired += i === whyActive ? h - overlap : step;
    });
    // 一番高くなる状態（先頭が開いている時）に合わせてリストの高さを固定
    const fullH = whyItems[0].offsetHeight;
    maxBottom = (fullH - overlap) + (whyItems.length - 2) * step + headH;
    whyList.style.height = maxBottom + 'px';
  }
  whyItems.forEach((item, i) => {
    const head = item.querySelector('.why-item__head');
    item.addEventListener('mouseenter', () => { if (isPC() && whyActive !== i) { whyActive = i; layoutWhy(); } });
    head.addEventListener('click', () => { whyActive = i; layoutWhy(); });
  });

  /* ---------- The Problem（Human Eyes SMILE the NEXT） ---------- */
  const message = document.querySelector('.js-problem-message');
  const sticky = document.querySelector('.js-problem-sticky');
  function layoutProblem() {
    message.style.setProperty('--height', isPC() ? '300rem' : '280rem');
    sticky.style.setProperty('--top', (window.innerHeight - sticky.offsetHeight) / 2 + 'px');
  }
  const problem = document.getElementById('problem');
  const photos = [...document.querySelectorAll('.js-photo')].map((el) => ({
    el, k: parseFloat(el.dataset.lerp), off: parseFloat(el.dataset.offset), cur: 1,
  }));
  let problemProgress = 0;
  ScrollTrigger.create({
    trigger: problem,
    start: 'top 100%',
    end: () => `bottom+=${problem.offsetHeight * 0.1} 0%`,
    onUpdate: (s) => { problemProgress = s.progress; },
  });
  gsap.ticker.add(() => {
    const endVal = isPC() ? -1 : -1.1;
    const vh = window.innerHeight * (isPC() ? 1.35 : 1.2);
    photos.forEach((p) => {
      const t = sineInOut(clamp(problemProgress + p.off));
      const target = 1 + (endVal - 1) * t;
      p.cur = p.cur * p.k + target * (1 - p.k);
      p.el.style.transform = `translate3d(0,${vh * p.cur}px,0)`;
    });
  });

  /* ---------- How it works 横スクロール（Human Eyes member's voice） ---------- */
  const cards = document.querySelector('.js-cards');
  const cardsSticky = document.querySelector('.js-cards-sticky');
  const cardsList = document.querySelector('.js-cards-list');
  const cardState = { target: 0, cur: 0 };
  function layoutCards() {
    if (isPC()) {
      cards.style.setProperty('--height', 450 * cardsList.children.length + 'px');
      cardsSticky.style.setProperty('--top', (window.innerHeight - cardsSticky.offsetHeight) / 2 + 'px');
    } else {
      cards.style.removeProperty('--height');
      cardsSticky.style.setProperty('--top', '0px');
    }
  }
  ScrollTrigger.create({
    trigger: cards,
    start: 'top 98%',
    end: 'bottom 95%',
    onUpdate: (s) => { cardState.target = s.progress; },
  });
  gsap.ticker.add(() => {
    cardState.cur += (cardState.target - cardState.cur) * 0.1;
    cardsList.style.setProperty('--ratio', cardState.cur.toFixed(4));
  });

  /* ---------- Concept Movie ---------- */
  const movie = document.querySelector('.js-movie');
  const video = movie.querySelector('video');
  movie.querySelector('.mcard__play').addEventListener('click', () => {
    movie.classList.add('is-playing');
    video.controls = true;
    video.play();
  });

  /* ---------- Trust リスト hover で写真切替（ANA: fade 600ms） ---------- */
  const tList = document.querySelector('.js-tlist');
  const tSlides = document.querySelectorAll('.t-slide');
  const setSlide = (i) => tSlides.forEach((s, n) => s.classList.toggle('is-active', n === i));
  tList.querySelectorAll('li').forEach((li, i) => {
    li.addEventListener('mouseenter', () => {
      tList.querySelectorAll('li').forEach((l) => l.classList.toggle('is-active', l === li));
      setSlide(i);
    });
  });
  tList.addEventListener('mouseleave', () => {
    tList.querySelectorAll('li').forEach((l) => l.classList.remove('is-active'));
    setSlide(0);
  });

  /* ---------- Voices（ANA our team slider） ---------- */
  const voices = [
    { quote: '生成AIに聞いてたどり着いた、”精度が段違い”のAI転職サービス', name: 'Aさん', job: 'ITエンジニア', url: 'https://previo.jp/media/voices/case01', photo: 'assets/images/voice-a.webp', pos: '55% 50%' },
    { quote: '情報収集のために登録したら、“自分では思いつかない選択肢”を届けてくれた', name: 'Bさん', job: 'カスタマーサクセス', url: 'https://previo.jp/media/voices/case02', photo: 'assets/images/voice-b.webp', pos: '40% 50%' },
  ];
  const tpl = document.getElementById('vSlideTpl');
  document.querySelectorAll('.v-slide').forEach((slide, n) => {
    const v = voices[+slide.dataset.voice];
    const node = tpl.content.cloneNode(true);
    const card = node.querySelector('.v-card');
    card.href = v.url;
    const ph = node.querySelector('.js-vphoto');
    ph.src = v.photo;
    ph.style.objectPosition = v.pos;
    node.querySelector('.js-vcat').textContent = v.job;
    node.querySelector('.js-vnum').textContent = 'Voice #0' + (+slide.dataset.voice + 1);
    node.querySelector('.js-vname2').textContent = v.name;
    slide.appendChild(node);
  });

  const qEl = document.querySelector('.js-vquote');
  const nEl = document.querySelector('.js-vname');
  const curEl = document.querySelector('.js-vcur');
  const bar = document.querySelector('.js-vbar');
  const pager = document.querySelector('.js-vpager');
  const restartBar = () => { bar.classList.remove('is-run'); void bar.offsetWidth; bar.classList.add('is-run'); };

  const vSwiper = new Swiper('.js-vslider', {
    loop: true,
    centeredSlides: true,
    slidesPerView: 1,
    speed: 1200,
    allowTouchMove: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
    breakpoints: { 800: { slidesPerView: 3 } },
    on: {
      init(sw) {
        if (isPC()) gsap.set(sw.slides, { scale: 0.6 });
        if (isPC()) gsap.set(sw.slides[sw.activeIndex], { scale: 1 });
        restartBar();
      },
      slideChangeTransitionStart(sw) {
        const pc = isPC();
        if (pc) gsap.to(sw.slides, { scale: 0.6, duration: 0.8, ease: 'power2.out' });
        gsap.to(sw.el.querySelectorAll('.v-cat, .v-prof'), { opacity: 0, duration: 0.3 });
        gsap.to(sw.el.querySelectorAll('.v-badge'), { opacity: 0, scale: 0.8, duration: 0.4 });
        const v = voices[+sw.slides[sw.activeIndex].dataset.voice];
        qEl.classList.add('is-out'); nEl.classList.add('is-out');
        setTimeout(() => {
          qEl.textContent = v.quote;
          nEl.textContent = `${v.name}（${v.job}）`;
          qEl.classList.remove('is-out'); nEl.classList.remove('is-out');
        }, 500);
        curEl.textContent = '0' + (sw.realIndex % voices.length + 1);
        restartBar();
      },
      slideChangeTransitionEnd(sw) {
        const active = sw.slides[sw.activeIndex];
        if (isPC()) gsap.to(active, { scale: 1, duration: 1, ease: 'power2.out' });
        gsap.to(active.querySelectorAll('.v-cat, .v-prof'), { opacity: 1, scale: 1, duration: 0.8 });
        gsap.to(sw.el.querySelectorAll('.v-badge'), { opacity: 0.3, scale: 1, duration: 0.6, delay: 0.5 });
      },
    },
  });
  document.querySelector('.js-vpause').addEventListener('click', () => {
    if (vSwiper.autoplay.running) { vSwiper.autoplay.stop(); pager.classList.add('is-paused'); }
    else { vSwiper.autoplay.start(); pager.classList.remove('is-paused'); }
  });

  /* ---------- 見出し出現（Human Eyes js_heading: top 70% / back.out(2)） ---------- */
  document.querySelectorAll('.js-heading').forEach((h) => {
    const chars = splitChars(h);
    gsap.set(chars, { y: isPC() ? 200 : 70, opacity: 0 });
    ScrollTrigger.create({
      trigger: h,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        gsap.to(chars, { y: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.04, delay: 0.1 });
        gsap.to(chars, { opacity: 1, duration: 0.3, ease: 'expo.out', stagger: 0.04, delay: 0.1 });
      },
    });
  });

  /* ---------- scroll reveal（ANA: y30 / blur10 / 1s power2.out / stagger .2 / top 75%） ---------- */
  document.querySelectorAll('.js-reveal').forEach((wrap) => {
    gsap.fromTo(wrap.children,
      { opacity: 0, y: 30, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.out', stagger: 0.2,
        scrollTrigger: { trigger: wrap, start: 'top 75%' } });
  });

  /* ---------- 初期化・リサイズ ---------- */
  function layoutAll() {
    fitText();
    layoutWhy();
    layoutProblem();
    layoutCards();
    ScrollTrigger.refresh();
  }
  const ready = document.fonts ? document.fonts.ready : Promise.resolve();
  ready.then(() => {
    layoutAll();
    playOpening();
  });
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layoutAll, 150); });
})();
