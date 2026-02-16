// ===== Theme Toggle =====
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  }
});

// ===== Sticky Header Shadow =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// ===== Mobile Menu =====
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const nav = document.getElementById('nav');

mobileMenuBtn.addEventListener('click', () => {
  nav.classList.toggle('open');
  mobileMenuBtn.classList.toggle('active');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    mobileMenuBtn.classList.remove('active');
  });
});

// ===== Hero Slider =====
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
let currentSlide = 0;
let slideInterval;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  indicators[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  indicators[currentSlide].classList.add('active');
}

function nextSlide() {
  goToSlide((currentSlide + 1) % slides.length);
}

function startSlider() {
  slideInterval = setInterval(nextSlide, 5000);
}

indicators.forEach(btn => {
  btn.addEventListener('click', () => {
    clearInterval(slideInterval);
    goToSlide(Number(btn.dataset.slide));
    startSlider();
  });
});

startSlider();

// ===== Scroll Fade-up Animation =====
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll(
  '.about-card, .center-card, .doctor-card, .info-card, .section-header'
).forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  observer.observe(el);
});

// ===== Contact Form =====
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = '전송 중...';

  try {
    const res = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      formStatus.textContent = '문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.';
      formStatus.style.color = '#0a6e5c';
      contactForm.reset();
    } else {
      formStatus.textContent = '전송에 실패했습니다. 다시 시도해주세요.';
      formStatus.style.color = '#e53e3e';
    }
  } catch {
    formStatus.textContent = '네트워크 오류가 발생했습니다.';
    formStatus.style.color = '#e53e3e';
  }
  submitBtn.disabled = false;
  submitBtn.textContent = '문의하기';
});
