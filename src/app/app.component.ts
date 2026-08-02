import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Lenis from 'lenis';

interface ThemeImgs {
  hero: string;
  m1: string;
  m2: string;
  explore: string;
}

interface Theme {
  cls: string;
  label: string;
  heading: string;
  big: string;
  tag: string;
  year?: string;
  col?: string;
  imgs: ThemeImgs | null;
}

interface Product {
  id: string;
  name: string;
  sub: string;
  price: number;
  tag: string;
  img: string;
  tabs: string[];
  g: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private disposers: Array<() => void> = [];
  private lenis: Lenis | null = null;
  private lenisRaf = 0;
  private readonly isBrowser: boolean;

   constructor(
     private hostRef: ElementRef<HTMLElement>,
     private zone: NgZone,
     @Inject(PLATFORM_ID) platformId: Object,
   ) {
     this.isBrowser = isPlatformBrowser(platformId);
   }

   // ============================================================
   // Lenis smooth scrolling
   // ============================================================
   private initSmoothScroll(): void {
     if (!this.isBrowser) return;

     // Respect users who ask for reduced motion — Lenis would fight that preference.
     const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
     if (reduceMotion.matches) return;

     // Coarse pointers already get native momentum scrolling from the OS, which is
     // smoother than anything we can synthesize. Only smooth the wheel.
     const isTouch = window.matchMedia('(pointer: coarse)').matches;

     // The whole loop lives outside Angular so scrolling never triggers change detection.
     this.zone.runOutsideAngular(() => {
       const lenis = new Lenis({
         duration: 1.05,
         // Exponential ease-out: fast pickup, long glide, no rubber-band at the end.
         easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
         orientation: 'vertical',
         gestureOrientation: 'vertical',
         smoothWheel: true,
         syncTouch: false,
         touchMultiplier: isTouch ? 1.6 : 2,
         wheelMultiplier: 1,
         infinite: false,
       });
       this.lenis = lenis;

       const raf = (time: number): void => {
         lenis.raf(time);
         this.lenisRaf = requestAnimationFrame(raf);
       };
       this.lenisRaf = requestAnimationFrame(raf);
     });

     this.disposers.push(() => {
       cancelAnimationFrame(this.lenisRaf);
       this.lenis?.destroy();
       this.lenis = null;
     });
   }

   // ==== Inline template handlers (replace inline on* attributes) ====
   onSubscribe(event: Event): void {
     event.preventDefault();
     const form = event.currentTarget as HTMLFormElement;
     const input = form.querySelector('input') as HTMLInputElement | null;
     if (input) input.value = '';
     alert('Subscribed ✿');
   }
 
   onExplore(): void {
     alert('Exploring 2025 Collection ✧');
   }
 
   onMzSubscribe(event: Event): void {
     event.preventDefault();
     const form = event.currentTarget as HTMLFormElement;
     const btn = form.querySelector('button');
     if (btn) btn.textContent = 'Welcome ✦';
   }
 
   ngAfterViewInit(): void {
     if (!this.isBrowser) return;
     // Wait a tick so the template is fully in the DOM before wiring things.
     // All of this is plain DOM work with its own listeners, so keep it out of the
     // zone — otherwise every carousel tick and scroll event runs change detection.
     this.zone.runOutsideAngular(() => {
       setTimeout(() => {
         this.initSmoothScroll();
         this.initCarouselAndNav();
         this.initProductGridAndMelt();
         this.initFooter();
       }, 0);
     });
   }
 
   ngOnDestroy(): void {
     this.disposers.forEach((fn) => {
       try {
         fn();
       } catch {
         /* noop */
       }
     });
     this.disposers = [];
   }
 
   // ============================================================
   // Section 1: nav-toast + multi-theme carousel (from original inline <script>)
   // ============================================================
   private initCarouselAndNav(): void {
     const toast = (label: string): void => {
       const el = document.createElement('div');
       el.textContent = '→ ' + label;
       el.style.cssText =
         'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#fff;color:#e63e6f;padding:10px 22px;border-radius:100px;font-family:Inter,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;box-shadow:0 10px 30px rgba(0,0,0,.15);z-index:99;animation:pop .4s';
       document.body.appendChild(el);
       setTimeout(() => el.remove(), 1400);
     };
 
     const navClick = (e: MouseEvent) => {
       const target = e.target as HTMLElement | null;
       const a = target?.closest('.nav a, .right-nav a') as HTMLAnchorElement | null;
       if (!a) return;
       const href = a.getAttribute('href');
       if (href && href.trim() !== '#') {
         return;
       }
       e.preventDefault();
       toast(a.textContent ?? '');
     };
     document.addEventListener('click', navClick);
     this.disposers.push(() => document.removeEventListener('click', navClick));
 
     // ===== Multi-theme carousel =====
     const U = (id: string, w = 900): string =>
       'https://gulumedia.blob.core.windows.net/images/gulu/creators/' +
       id +
       '?auto=format&fit=crop&w=' +
       w +
       '&q=75';
 
     const THEMES: Theme[] = [
       {
         cls: 'theme-pink',
         label: 'Pink · Blossom',
         heading: 'Angel Hair',
         big: 'White',
         tag: 'Premium white chocolate with a crispy angel hair pastry filling.',
         year: '2025',
         col: 'Collection',
         imgs: null,
       },
       {
         cls: 'theme-olive',
         label: 'Olive · Wilderness',
         heading: 'Pistachio',
         big: 'Kunafa',
         tag: 'Rich Belgian milk chocolate with creamy pistachio and crispy kunafa.',
         imgs: {
           hero: U('6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/EA9DC912115B.png', 1100),
           m1: U('6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/A8755ECA3EFF.jpg', 260),
           m2: U('6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/1B1BA046FC43.jpg', 260),
           explore: U('6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/A8755ECA3EFF.jpg', 600),
         },
       },
       {
         cls: 'theme-brown',
         label: 'Brown · Terracotta',
         heading: 'Kunafa',
         big: 'Dates',
         tag: 'Belgian milk chocolate with premium dates and crispy kunafa.',
         imgs: {
           hero: U('6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/B739BB240164.png', 1100),
           m1: U('6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/0C4AC967B9AF.jpeg', 260),
           m2: U('6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/D66833E4F9DA.png', 260),
           explore: U('6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/D66833E4F9DA.png', 600),
         },
       },
       {
         cls: 'theme-yellow',
         label: 'Yellow · Sunlit',
         heading: 'Kunafa',
         big: 'Mango',
         tag: 'Belgian milk chocolate with luscious mango filling and crispy kunafa.',
         imgs: {
           hero: U('6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/A60A1C9D5B73.png', 1100),
           m1: U('6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/A1D43E1DBD22.jpeg', 260),
           m2: U('6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/C427DD02F5BE.png', 260),
           explore: U('6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/C427DD02F5BE.png', 600),
         },
       },
       {
         cls: 'theme-lotus',
         label: 'Red · Ember',
         heading: 'Kunafa',
         big: 'Lotus',
         tag: 'Rich Belgian milk chocolate with Lotus Biscoff and crunchy kunafa.',
         imgs: {
           hero: U('6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/92273FCF0309.png', 1100),
           m1: U('6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/01BF79649B74.png', 260),
           m2: U('6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/077F716326CA.png', 260),
           explore: U('6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/077F716326CA.png', 600),
         },
       },
     ];
 
     // Preloading every theme up front put ~20 full-size requests on the wire at once,
     // starving the visible hero image of bandwidth. Warm themes progressively instead:
     // the next slide only, and only when the browser is idle.
     const warmed = new Set<number>();
     const idle: (cb: () => void) => void =
       'requestIdleCallback' in window
         ? (cb) => (window as any).requestIdleCallback(cb, { timeout: 2000 })
         : (cb) => setTimeout(cb, 200);

     const warmTheme = (index: number): void => {
       const t = THEMES[(index + THEMES.length) % THEMES.length];
       const key = (index + THEMES.length) % THEMES.length;
       if (!t?.imgs || warmed.has(key)) return;
       warmed.add(key);
       idle(() => {
         Object.values(t.imgs as ThemeImgs).forEach((src) => {
           const i = new Image();
           i.decoding = 'async';
           i.src = src;
         });
       });
     };
 
     const carousel = document.getElementById('carousel') as HTMLElement | null;
     if (!carousel) return;
     const first = carousel.querySelector('.slide') as HTMLElement | null;
     if (!first) return;
 
     // Build additional slides once. Slides are stacked, so changing slides only toggles classes
     // instead of using scrollIntoView + IntersectionObserver, which caused jank and delay.
     for (let i = 1; i < THEMES.length; i++) {
       const t = THEMES[i];
       const s = first.cloneNode(true) as HTMLElement;
       s.classList.remove('theme-pink', 'in-view', 'active');
       s.classList.add(t.cls);
       s.dataset['theme'] = t.cls;
       const grainEl = s.querySelector('.fashionable .grain');
       if (grainEl) grainEl.textContent = t.heading;
       const tagEl = s.querySelector('.tagline');
       if (tagEl) tagEl.textContent = t.tag;
       const bigEl = s.querySelector('.everyday');
       if (bigEl) bigEl.textContent = t.big;
       const yrEl = s.querySelector('.explore-meta .yr');
       if (yrEl) yrEl.textContent = t.year ?? '';
       const colEl = s.querySelector('.explore-meta .col');
       if (colEl) colEl.textContent = t.col ?? '';
       const chipEl = s.querySelector('.slide-chip');
       if (chipEl) {
         chipEl.innerHTML =
           '<span class="num">' +
           String(i + 1).padStart(2, '0') +
           '</span><span class="line"></span><span>' +
           t.label +
           '</span>';
       }
       if (t.imgs) {
         const heroImg = s.querySelector('.hero-model img') as HTMLImageElement | null;
         if (heroImg) {
           heroImg.src = t.imgs.hero;
           heroImg.alt = t.label + ' model';
         }
         const miniImgs = s.querySelectorAll('.minis .m img') as NodeListOf<HTMLImageElement>;
         if (miniImgs[0]) miniImgs[0].src = t.imgs.m1;
         if (miniImgs[1]) miniImgs[1].src = t.imgs.m2;
         const exploreImg = s.querySelector('.explore-card .imgwrap img') as HTMLImageElement | null;
         if (exploreImg) {
           exploreImg.src = t.imgs.explore;
           exploreImg.alt = (t.col ?? '') + ' collection';
         }
       }
       carousel.appendChild(s);
     }
 
     const dots = document.getElementById('dots') as HTMLElement | null;
     const slides = Array.from(carousel.querySelectorAll('.slide')) as HTMLElement[];

     // Below 900px each .slide becomes its own vertical scroll container (overflow-y:auto).
     // Lenis hijacks wheel/touch on the document, which would make that inner content
     // unscrollable, so flag the slides for Lenis to ignore — but only at those widths.
     // On desktop the slides are not scrollable and the flag would block page scroll
     // across the whole hero, so it has to be removed again above the breakpoint.
     const slideScrollQuery = window.matchMedia('(max-width: 900px)');
     const syncLenisPrevent = (): void => {
       slides.forEach((s) => {
         if (slideScrollQuery.matches) {
           s.setAttribute('data-lenis-prevent', '');
         } else {
           s.removeAttribute('data-lenis-prevent');
         }
       });
     };
     syncLenisPrevent();
     slideScrollQuery.addEventListener('change', syncLenisPrevent);
     this.disposers.push(() => slideScrollQuery.removeEventListener('change', syncLenisPrevent));
     const dotButtons: HTMLButtonElement[] = [];
     let current = 0;
     let paused = false;
     let autoTimer: ReturnType<typeof setTimeout> | 0 = 0;
     let wheelLock = false;
     let pointerStartX = 0;
     let pointerStartY = 0;
     let pointerDown = false;
     let animationFrame = 0;
 
     slides.forEach((s, i) => {
       s.querySelectorAll('img').forEach((img) => {
         const im = img as HTMLImageElement;
         im.decoding = 'async';
         const isHero = im.closest('.hero-model') !== null;
         // Only the first slide loads eagerly. Everything else waits so the visible
         // hero gets the full connection, and off-screen slides never block paint.
         im.loading = i === 0 ? 'eager' : 'lazy';
         (im as any).fetchPriority = i === 0 && isHero ? 'high' : 'low';
       });
 
       const b = document.createElement('button');
       b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
       b.addEventListener('click', () => goTo(i, true));
       dots?.appendChild(b);
       dotButtons.push(b);
     });
 
     const setActive = (idx: number, replay = true): void => {
       cancelAnimationFrame(animationFrame);
       dotButtons.forEach((b, i) => b.classList.toggle('active', i === idx));

       // Stay one slide ahead of the user so the next transition never waits on the
       // network, without paying for all five themes on first paint.
       warmTheme(idx + 1);
       slides[(idx + 1) % slides.length]
         ?.querySelectorAll('img')
         .forEach((img) => ((img as HTMLImageElement).loading = 'eager'));
 
       slides.forEach((s, i) => {
         if (i === idx) {
           s.classList.add('active');
         } else {
           s.classList.remove('active', 'in-view');
         }
       });
 
       const activeSlide = slides[idx];
       if (!replay) {
         activeSlide.classList.add('in-view');
         return;
       }
 
       // Replay the original reveal/swoop animations without forcing layout during scrolling.
       activeSlide.classList.remove('in-view');
       animationFrame = requestAnimationFrame(() => {
         activeSlide.classList.add('in-view');
       });
     };
 
     const goTo = (index: number, userAction = false): void => {
       const next = (index + slides.length) % slides.length;
       if (next === current) {
         if (userAction) restartAuto();
         return;
       }
       current = next;
       setActive(current, true);
       if (userAction) restartAuto();
     };
 
     const nextSlide = () => goTo(current + 1, false);
     const prevSlide = () => goTo(current - 1, true);
 
     const restartAuto = (): void => {
       clearTimeout(autoTimer as ReturnType<typeof setTimeout>);
       autoTimer = setTimeout(() => {
         if (!paused && document.visibilityState === 'visible') nextSlide();
         restartAuto();
       }, 5000);
     };
 
     const onEnter = () => { paused = true; };
     const onLeave = () => { paused = false; };
     const onFocusIn = () => { paused = true; };
     const onFocusOut = () => { paused = false; };
     carousel.addEventListener('pointerenter', onEnter);
     carousel.addEventListener('pointerleave', onLeave);
     carousel.addEventListener('focusin', onFocusIn);
     carousel.addEventListener('focusout', onFocusOut);
     document.addEventListener('visibilitychange', restartAuto);
 
     const onPointerDown = (e: PointerEvent) => {
       pointerDown = true;
       pointerStartX = e.clientX;
       pointerStartY = e.clientY;
     };
     carousel.addEventListener('pointerdown', onPointerDown, { passive: true });
 
     const onPointerUp = (e: PointerEvent) => {
       if (!pointerDown) return;
       pointerDown = false;
       const dx = e.clientX - pointerStartX;
       const dy = e.clientY - pointerStartY;
       if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.2) {
         dx < 0 ? goTo(current + 1, true) : prevSlide();
       }
     };
     carousel.addEventListener('pointerup', onPointerUp, { passive: true });
 
     const onWheel = (e: WheelEvent) => {
       if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.5 || wheelLock) return;
       e.preventDefault();
       wheelLock = true;
       e.deltaX > 0 ? goTo(current + 1, true) : prevSlide();
       setTimeout(() => { wheelLock = false; }, 850);
     };
     carousel.addEventListener('wheel', onWheel, { passive: false });
 
     const onKey = (e: KeyboardEvent) => {
       if (e.key === 'ArrowRight') goTo(current + 1, true);
       if (e.key === 'ArrowLeft') prevSlide();
     };
     document.addEventListener('keydown', onKey);
 
     setActive(0, false);
     restartAuto();
 
     this.disposers.push(() => {
       clearTimeout(autoTimer as ReturnType<typeof setTimeout>);
       cancelAnimationFrame(animationFrame);
       carousel.removeEventListener('pointerenter', onEnter);
       carousel.removeEventListener('pointerleave', onLeave);
       carousel.removeEventListener('focusin', onFocusIn);
       carousel.removeEventListener('focusout', onFocusOut);
       document.removeEventListener('visibilitychange', restartAuto);
       carousel.removeEventListener('pointerdown', onPointerDown);
       carousel.removeEventListener('pointerup', onPointerUp);
       carousel.removeEventListener('wheel', onWheel);
       document.removeEventListener('keydown', onKey);
     });
   }
 
   // ============================================================
   // Section 2: product grid tabs + melt video visibility control
   // ============================================================
   private initProductGridAndMelt(): void {
     const IMGS = {
       mango: 'https://gulumedia.blob.core.windows.net/images/gulu/creators/6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/69D15F5EAD04.png',
       date: 'https://gulumedia.blob.core.windows.net/images/gulu/creators/6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/CEF36FCCFDCF.png',
       dubai: 'https://gulumedia.blob.core.windows.net/images/gulu/creators/6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/119CECA9E20D.png',
       angel: 'https://gulumedia.blob.core.windows.net/images/gulu/creators/6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/4BEA8C76EB01.png',
       lotus: 'https://gulumedia.blob.core.windows.net/images/gulu/creators/6d3fa87a-11f6-4f5e-a2ef-cf8717bca0e7/portfolio/2026/07/12/D17AE572463C.png',
       hero: 'https://project--e8f4c652-a452-4a77-b899-f748c26303cf-dev.lovable.app/__l5e/assets-v1/2ef1d11c-3da5-4874-a5b3-2f6117a4205a/melizzo-hero.jpg',
     };
     const PRODUCTS: Product[] = [
       { id: 'dubai', name: 'Pistachio Kunafa Dubai Chocolate', sub: 'A luxurious blend of creamy Belgian milk chocolate filled with rich roasted pistachio cream and crispy golden kunafa, delivering the authentic taste of Dubai in every bite.', price: 12.99, tag: 'Bestseller', img: IMGS.dubai, tabs: ['best', 'gift', 'new'], g: 100 },
       { id: 'angel', name: 'Angel Hair White Dubai Chocolate', sub: 'Smooth premium white chocolate wrapped around a delicate, crispy angel hair pastry filling, creating a light, crunchy, and irresistibly creamy experience.', price: 12.99, tag: 'Bestseller', img: IMGS.angel, tabs: ['best', 'new', 'gift'], g: 135 },
       { id: 'mango', name: 'Kunafa Mango Dubai Chocolate', sub: 'A tropical twist on the Dubai classic, combining silky Belgian milk chocolate, luscious mango filling, and crunchy kunafa for a perfectly refreshing indulgence.', price: 12.99, tag: 'New', img: IMGS.mango, tabs: ['best', 'new', 'gift'], g: 105 },
       { id: 'lotus', name: 'Kunafa Lotus Dubai Chocolate', sub: 'A rich fusion of creamy Lotus Biscoff spread, crispy kunafa, and premium Belgian milk chocolate, offering a delicious caramelized biscuit flavor with every bite.', price: 12.99, tag: 'New', img: IMGS.lotus, tabs: ['best', 'new', 'gift'], g: 105 },
       { id: 'date', name: 'Kunafa Dates Dubai Chocolate', sub: 'A delightful combination of naturally sweet premium dates, crunchy kunafa, and smooth Belgian milk chocolate, inspired by the rich flavors of the Middle East.', price: 12.99, tag: 'Signature', img: IMGS.date, tabs: ['best', 'gift', 'new'], g: 105 },
     ];
     const fmt = (n: number): string => '$' + n.toFixed(2);
     const grid = document.getElementById('productGrid') as HTMLElement | null;
     if (!grid) return;
 
     const renderGrid = (tab: string): void => {
       const list = PRODUCTS.filter((p) => p.tabs.includes(tab));
       grid.innerHTML = list.map((p) => `
       <article class="product">
         <div class="p-img">
           <span class="p-tag">${p.tag}</span>
           <img src="${p.img}" alt="${p.name}" loading="lazy"/>
           <button class="p-add" data-add="${p.id}">Add to Cart — ${fmt(p.price)}</button>
         </div>
         <div class="p-info">
           <div class="p-name">${p.name}</div>
           <div class="p-sub">${p.sub}</div>
           <div class="p-price"><b>${fmt(p.price)}</b> · ${p.g}g</div>
         </div>
       </article>`).join('');
       requestAnimationFrame(() => requestAnimationFrame(() => {
         grid.querySelectorAll('.product').forEach((el, i) => setTimeout(() => el.classList.add('in'), i * 110));
       }));
     };
     renderGrid('best');
 
     // Add to Cart -> open WhatsApp with product details
     const WA_NUMBER = '17059270127';
     const gridClick = (ev: Event) => {
       const target = ev.target as HTMLElement | null;
       const btn = target?.closest('[data-add]') as HTMLElement | null;
       if (!btn) return;
       ev.preventDefault();
       const id = btn.dataset['add'];
       const p = PRODUCTS.find((x) => x.id === id);
       if (!p) return;
       const msg =
         'Hello Melizzo! 👋\n\n' +
         "I'm interested in ordering:\n\n" +
         '📦 ' + p.name + '\n\n' +
         p.sub + '\n\n' +
         '💰 Price: CAD ' + p.price.toFixed(2) + '\n\n' +
         'Could you please provide more details about:\n' +
         '• Availability\n' +
         '• Delivery options\n' +
         '• Payment methods\n\n' +
         'Thank you! 😊';
       const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
       window.open(url, '_blank', 'noopener');
     };
     grid.addEventListener('click', gridClick);
 
     const tabEls = document.querySelectorAll('.mz .tab');
     const tabHandlers: Array<{ el: Element; fn: () => void }> = [];
     tabEls.forEach((t) => {
       const fn = () => {
         document.querySelectorAll('.mz .tab').forEach((x) => x.classList.remove('active'));
         t.classList.add('active');
         renderGrid((t as HTMLElement).dataset['tab'] ?? 'best');
       };
       t.addEventListener('click', fn);
       tabHandlers.push({ el: t, fn });
     });
 
     const io = new IntersectionObserver((entries) => {
       entries.forEach((e) => {
         if (e.isIntersecting) {
           e.target.classList.add('in');
           io.unobserve(e.target);
         }
       });
     }, { threshold: 0.12 });
     document.querySelectorAll('.mz .mz-reveal').forEach((el) => io.observe(el));
 
     // Melt video: no tap/click/gesture feature. The section itself controls playback.
     const meltVideo = document.getElementById('meltVideo') as HTMLVideoElement | null;
     const meltSection = document.getElementById('melt');
     let preIo: IntersectionObserver | null = null;
     let meltIo: IntersectionObserver | null = null;
 
     if (meltVideo && meltSection) {
       let armed = false;
       let visible = false;
 
       const warm = (): void => {
         if (armed) return;
         armed = true;
         try {
           // Attach the real source only now — the markup ships without one so the
           // MP4 never competes with above-the-fold images during initial load.
           const src = meltVideo.dataset['src'];
           if (src && !meltVideo.querySelector('source')) {
             const source = document.createElement('source');
             source.src = src;
             source.type = 'video/mp4';
             meltVideo.appendChild(source);
           }
           meltVideo.preload = 'auto';
           meltVideo.autoplay = true;
           meltVideo.playsInline = true;
           meltVideo.load();
         } catch (_) { /* noop */ }
       };
 
       const forceUnmuted = (): void => {
         meltVideo.removeAttribute('muted');
         meltVideo.defaultMuted = false;
         meltVideo.muted = false;
         meltVideo.volume = 1;
       };
 
       const playVisible = (): void => {
         if (!visible) return;
         warm();
         forceUnmuted();
         const playPromise = meltVideo.play();
         if (playPromise && typeof playPromise.catch === 'function') {
           playPromise.then(forceUnmuted).catch(() => {
             forceUnmuted();
           });
         }
       };
 
       const pauseHidden = (): void => {
         try { meltVideo.pause(); } catch (_) { /* noop */ }
         try { meltVideo.muted = true; } catch (_) { /* noop */ }
       };
 
       ['loadedmetadata', 'loadeddata', 'canplay', 'playing', 'volumechange'].forEach((ev) => {
         meltVideo.addEventListener(ev, () => {
           if (visible) forceUnmuted();
         });
       });
 
       preIo = new IntersectionObserver((entries) => {
         if (entries.some((e) => e.isIntersecting)) {
           warm();
           preIo?.disconnect();
         }
       }, { rootMargin: '400px 0px' });
       preIo.observe(meltSection);
 
       meltIo = new IntersectionObserver((entries) => {
         entries.forEach((entry) => {
           visible = entry.isIntersecting && entry.intersectionRatio >= 0.3;
           if (visible) {
             playVisible();
           } else {
             pauseHidden();
           }
         });
       }, { threshold: [0, 0.3, 0.6, 1] });
       meltIo.observe(meltSection);
     }
 
     this.disposers.push(() => {
       grid.removeEventListener('click', gridClick);
       tabHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn));
       io.disconnect();
       preIo?.disconnect();
       meltIo?.disconnect();
     });
   }
 
   // ============================================================
   // Section 3: footer year + big-logo parallax
   // ============================================================
   private initFooter(): void {
     const yr = document.getElementById('mzYear');
     if (yr) yr.textContent = String(new Date().getFullYear());
 
     const io = new IntersectionObserver((entries) => {
       entries.forEach((e) => {
         if (e.isIntersecting) {
           e.target.classList.add('in');
           io.unobserve(e.target);
         }
       });
     }, { threshold: 0.15 });
     document.querySelectorAll('.mz-footer .mz-f-reveal').forEach((el) => io.observe(el));
 
     // Parallax subtle drift on the big logo.
     // Reading getBoundingClientRect() on every scroll event forces a synchronous
     // layout mid-scroll — the classic cause of scroll jank. Instead we measure only
     // when geometry can actually change and do the per-frame maths from a cached
     // document offset.
     const big = document.querySelector('.mz-bigmark img') as HTMLImageElement | null;
     let scrollHandler: (() => void) | null = null;
     let resizeHandler: (() => void) | null = null;
     let ro: ResizeObserver | null = null;
     let parallaxFrame = 0;

     if (big) {
       let docTop = 0;
       let height = 0;

       const measure = (): void => {
         // Neutralise our own transform before measuring so the offset stays stable.
         const prev = big.style.transform;
         big.style.transform = '';
         const r = big.getBoundingClientRect();
         docTop = r.top + window.scrollY;
         height = r.height;
         big.style.transform = prev;
       };

       const apply = (scrollY: number): void => {
         const vh = window.innerHeight;
         const top = docTop - scrollY;
         if (top >= vh || top + height <= 0) return;
         const p = (vh - top) / (vh + height);
         big.style.transform = `translate3d(0, ${(1 - p) * 20}px, 0) scale(${1 + p * 0.02})`;
       };

       scrollHandler = () => {
         if (parallaxFrame) return;
         parallaxFrame = requestAnimationFrame(() => {
           parallaxFrame = 0;
           apply(this.lenis ? this.lenis.scroll : window.scrollY);
         });
       };

       resizeHandler = () => {
         measure();
         scrollHandler?.();
       };

       measure();
       apply(window.scrollY);

       // Prefer Lenis's scroll event so the parallax samples the same smoothed
       // position Lenis just wrote; fall back to native scroll when Lenis is off
       // (reduced-motion users).
       if (this.lenis) {
         this.lenis.on('scroll', scrollHandler);
       } else {
         window.addEventListener('scroll', scrollHandler, { passive: true });
       }
       window.addEventListener('resize', resizeHandler, { passive: true });

       // The logo is a remote image — re-measure once it actually has a height.
       if (typeof ResizeObserver !== 'undefined') {
         ro = new ResizeObserver(() => resizeHandler?.());
         ro.observe(big);
       }
     }
 
     this.disposers.push(() => {
       io.disconnect();
       ro?.disconnect();
       cancelAnimationFrame(parallaxFrame);
       if (scrollHandler) {
         if (this.lenis) {
           this.lenis.off('scroll', scrollHandler);
         } else {
           window.removeEventListener('scroll', scrollHandler);
         }
       }
       if (resizeHandler) window.removeEventListener('resize', resizeHandler);
     });
   }
}
