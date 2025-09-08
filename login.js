document.addEventListener('DOMContentLoaded', ()=>{
  setupTheme();
  const btn = document.getElementById('theme-toggle');
  if(btn){ btn.addEventListener('click', toggleTheme); }

  const form = document.getElementById('login-form');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    let ok = true;
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      ok=false; document.getElementById('error-login-email').textContent='Enter a valid email.';
    } else document.getElementById('error-login-email').textContent='';
    if(password.length < 6){
      ok=false; document.getElementById('error-login-password').textContent='Password must be at least 6 characters.';
    } else document.getElementById('error-login-password').textContent='';
    if(ok){
      const success = document.getElementById('login-success');
      success.hidden = false;
      setTimeout(()=>{ window.location.href = 'index.html#objectives'; }, 900);
    }
  });
});

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


