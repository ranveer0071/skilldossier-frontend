// Utility: focus trap for modal
function trapFocus(container){
  const focusable = container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  function handle(e){
    if(e.key !== 'Tab') return;
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
  container.addEventListener('keydown', handle);
  return ()=> container.removeEventListener('keydown', handle);
}

// Global state
let courseData = null;
let carouselIndex = 0;
let carouselTimer = null;
let releaseTrap = null;

// Init
document.addEventListener('DOMContentLoaded', () => {
  setupNav();
  setupTheme();
  setupIntersectionObserver();
  setupCarousel();
  setupContactForm();
  fetch('data/course.json').then(r => r.json()).then(data => {
    courseData = data;
    renderObjectives(data.objectives);
    renderProgram(data.program);
    renderFaculty(data.faculty);
    renderSchedule(data.schedule);
  }).catch(() => {
    console.warn('Failed to load data');
  });
  animateCounters();
  setupGSAPAnimations();
  loadDummyQuotes();
});

// Navbar mobile toggle
function setupNav(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const list = document.getElementById('primary-navigation');
  const themeBtn = document.getElementById('theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  if(!toggle || !nav || !list) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  // hamburger for <=768px
  if(menuToggle){
    menuToggle.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
  }
  // close on link click (mobile)
  list.addEventListener('click', (e)=>{
    if(e.target.matches('a')){ nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }
  });
  if(themeBtn){
    themeBtn.addEventListener('click', toggleTheme);
  }
}

// Reveal on scroll
function setupIntersectionObserver(){
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: .15 });
  document.querySelectorAll('.section, .card, .timeline-item, .stat, .testimonial').forEach(el=>{
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// Render Objectives with accordion
function renderObjectives(items){
  const root = document.getElementById('objectives-list');
  if(!root) return;
  root.innerHTML = '';
  items.forEach((item, idx)=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('role','listitem');
    const btnId = `obj-btn-${idx}`;
    const regionId = `obj-panel-${idx}`;
    card.innerHTML = `
      <div class="card-head">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z"/></svg>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
        <button class="btn btn-primary" id="${btnId}" aria-expanded="false" aria-controls="${regionId}">More</button>
      </div>
      <div id="${regionId}" class="accordion" role="region" aria-labelledby="${btnId}">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur facilisis, nibh non blandit gravida, velit risus facilisis sem.</p>
      </div>`;
    const button = card.querySelector('button');
    const panel = card.querySelector('.accordion');
    button.addEventListener('click', ()=>{
      const open = panel.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    });
    root.appendChild(card);
  });
}

// Render Program timeline
function renderProgram(list){
  const root = document.getElementById('program-timeline');
  if(!root) return;
  root.innerHTML = '';
  list.forEach((it)=>{
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.setAttribute('role','listitem');
    item.innerHTML = `<div class="timeline-time">${it.time}</div><div class="timeline-title">${it.title}</div>`;
    item.addEventListener('click', ()=> openModal(it.title, `<p>${it.desc || ''}</p>${it.link ? `<p><a href="${it.link}" target="_blank" rel="noopener">Resource</a></p>`:''}`));
    item.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); item.click(); }});
    item.tabIndex = 0;
    root.appendChild(item);
  });
  const dl = document.getElementById('download-syllabus');
  if(dl){ dl.href = 'assets/syllabus.pdf'; }
}

// Render Faculty
function renderFaculty(members){
  const root = document.getElementById('faculty-cards');
  if(!root) return;
  root.innerHTML = '';
  members.forEach((m, i)=>{
    const card = document.createElement('article');
    card.className = 'card profile';
    card.setAttribute('role','listitem');
    card.innerHTML = `
      <img src="${m.photo || 'assets/avatar1.jpg'}" alt="${m.name}">
      <h3>${m.name}</h3>
      <p>${m.role}</p>
      <button class="btn btn-accent" data-index="${i}">View Bio</button>
    `;
    card.querySelector('button').addEventListener('click', ()=>{
      openModal(m.name, `<p>${m.bio || ''}</p><p><a href="mailto:${m.email || 'faculty@example.com'}">${m.email || 'faculty@example.com'}</a></p>`);
    });
    root.appendChild(card);
  });
}

// Render Schedule table
function renderSchedule(schedule){
  const root = document.getElementById('schedule-grid');
  if(!root) return;
  const days = ['monday','tuesday','wednesday','thursday','friday'];
  const times = Array.from({length:9}, (_,i)=> `${9+i}:00`);
  const table = document.createElement('table');
  table.className = 'schedule-table';
  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  trh.innerHTML = `<th>Time</th>${days.map(d=>`<th>${capitalize(d)}</th>`).join('')}`;
  thead.appendChild(trh);
  const tbody = document.createElement('tbody');
  times.forEach(t=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${t}</td>${days.map(d=>`<td class='schedule-cell' data-day='${d}' data-time='${t}'>${(schedule[d]||[]).find(x=>x.time===t)?.topic||''}</td>`).join('')}`;
    tbody.appendChild(tr);
  });
  table.appendChild(thead); table.appendChild(tbody);
  root.innerHTML = ''; root.appendChild(table);
  root.querySelectorAll('.schedule-cell').forEach(cell=>{
    cell.addEventListener('click', ()=> showSlot(cell.dataset.day, cell.dataset.time, cell.textContent.trim()));
  });
}

function showSlot(day, time, topic){
  const detail = document.getElementById('schedule-detail');
  const text = `${topic || ''}`.trim();
  if(text){
    detail.innerHTML = `<strong>${capitalize(day)} ${time}</strong>: ${text}`;
  } else {
    detail.innerHTML = `<strong>${capitalize(day)} ${time}</strong>: No session scheduled.`;
  }
  detail.classList.add('open');
}

// Carousel
function setupCarousel(){
  const track = document.getElementById('testimonial-track');
  const prev = document.querySelector('.carousel-control.prev');
  const next = document.querySelector('.carousel-control.next');
  if(!track || !prev || !next) return;
  const slides = Array.from(track.children);
  function update(){
    track.style.transform = `translateX(-${carouselIndex*100}%)`;
  }
  function move(dir){
    carouselIndex = (carouselIndex + dir + slides.length) % slides.length;
    update();
  }
  prev.addEventListener('click', ()=> move(-1));
  next.addEventListener('click', ()=> move(1));
  // auto rotate
  carouselTimer = setInterval(()=> move(1), 5000);
  track.addEventListener('mouseenter', ()=> clearInterval(carouselTimer));
  track.addEventListener('mouseleave', ()=> carouselTimer = setInterval(()=> move(1), 5000));
  // keyboard
  track.tabIndex = 0;
  track.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowLeft') move(-1);
    if(e.key==='ArrowRight') move(1);
  });
}

// Counters
function animateCounters(){
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count || '0');
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const duration = 1200;
      const start = performance.now();
      function tick(now){
        const p = Math.min(1, (now-start)/duration);
        const val = (target * p).toFixed(decimals);
        el.textContent = val;
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold:.6 });
  counters.forEach(c=> observer.observe(c));
}

// Modal
function openModal(title, bodyHtml){
  const modal = document.getElementById('modal');
  const mTitle = document.getElementById('modal-title');
  const mBody = document.getElementById('modal-body');
  if(!modal || !mTitle || !mBody) return;
  mTitle.textContent = title;
  mBody.innerHTML = bodyHtml || '';
  modal.hidden = false;
  const content = modal.querySelector('.modal-content');
  releaseTrap = trapFocus(content);
  document.addEventListener('keydown', onModalKey);
  content.querySelector('[data-close]').focus();
  // start fade/slide
  requestAnimationFrame(()=> modal.classList.add('open'));
  modal.addEventListener('click', (e)=>{ if(e.target.hasAttribute('data-close')) closeModal(); });
}
function onModalKey(e){ if(e.key==='Escape') closeModal(); }
function closeModal(){
  const modal = document.getElementById('modal');
  if(!modal) return;
  // remove open to trigger transition, then hide after end
  modal.classList.remove('open');
  const onEnd = (e)=>{
    const content = modal.querySelector('.modal-content');
    const backdrop = modal.querySelector('.modal-backdrop');
    if(e.target !== content && e.target !== backdrop) return;
    modal.hidden = true;
    modal.removeEventListener('transitionend', onEnd, true);
  };
  modal.addEventListener('transitionend', onEnd, true);
  document.removeEventListener('keydown', onModalKey);
  if(releaseTrap) releaseTrap();
}

// Contact form validation
function setupContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    let valid = true;
    // name
    if(!name){ valid=false; setError('name','Please enter your name.'); } else setError('name','');
    // email
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ valid=false; setError('email','Enter a valid email.'); } else setError('email','');
    // message
    if(message.length < 10){ valid=false; setError('message','Please write at least 10 characters.'); } else setError('message','');
    if(valid){
      document.getElementById('form-success').hidden = false;
      form.reset();
    }
  });
}
function setError(field, text){
  const el = document.getElementById(`error-${field}`);
  if(el) el.textContent = text;
}

function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

// Theme switching
function setupTheme(){
  const saved = localStorage.getItem('theme');
  if(saved === 'dark'){
    document.documentElement.classList.add('dark');
    const btn = document.getElementById('theme-toggle');
    if(btn){ btn.setAttribute('aria-pressed','true'); btn.textContent = 'Light'; }
  }
}
function toggleTheme(){
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  const btn = document.getElementById('theme-toggle');
  if(btn){ btn.setAttribute('aria-pressed', String(isDark)); btn.textContent = isDark ? 'Light' : 'Dark'; }
}

// GSAP animations
function setupGSAPAnimations(){
  if(typeof gsap === 'undefined') return;
  if(typeof ScrollTrigger !== 'undefined'){
    // Ensure plugin is registered before any scrollTrigger usage
    gsap.registerPlugin(ScrollTrigger);
  }
  gsap.from('.hero-title', { y: 20, opacity: 0, duration: .8, ease: 'power2.out' });
  gsap.from('.hero-subtitle', { y: 20, opacity: 0, duration: .8, ease: 'power2.out', delay: .1 });
  gsap.from('.btn-accent', { scale: .95, opacity: 0, duration: .6, ease: 'power2.out', delay: .2 });
  gsap.utils.toArray('.timeline-item').forEach((el, i)=>{
    gsap.from(el, { x: 40, opacity: 0, duration: .6, ease: 'power2.out', delay: i * .05, scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 30%', scrub: false } });
  });
  gsap.utils.toArray('.card').forEach((el)=>{
    gsap.from(el, { y: 16, opacity: 0, duration: .6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 30%', scrub: false } });
  });
}

// Quotes via DummyJSON with fallback
async function loadDummyQuotes(){
  const container = document.getElementById('quotes');
  if(!container) return;
  const fallback = [
    { quote: 'Learning never exhausts the mind.', author: 'Leonardo da Vinci' },
    { quote: 'Education is the passport to the future.', author: 'Malcolm X' },
    { quote: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' }
  ];
  try{
    const res = await fetch('https://dummyjson.com/quotes?limit=3');
    if(!res.ok) throw new Error('Bad response');
    const data = await res.json();
    const items = (data.quotes || []).slice(0,3).map(q=>({ quote: q.quote, author: q.author }));
    renderQuotes(container, items.length ? items : fallback);
  } catch(e){
    renderQuotes(container, fallback);
  }
}
function renderQuotes(container, items){
  container.innerHTML = items.map(q=>`
    <article class="card" role="listitem">
      <h3 style="margin:0 0 8px">“${q.quote}”</h3>
      <p style="margin:0;color:var(--muted)">— ${q.author}</p>
    </article>
  `).join('');
}

