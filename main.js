class LottoNumbers extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .lotto-number {
          display: inline-block;
          width: 50px;
          height: 50px;
          line-height: 50px;
          border-radius: 50%;
          background-color: #f0f0f0;
          text-align: center;
          font-size: 1.5em;
          font-weight: bold;
          color: #333;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin: 5px;
        }
      </style>
    `;
  }

  set numbers(numbers) {
    // Clear existing numbers
    this.shadowRoot.querySelectorAll('.lotto-number').forEach(el => el.remove());

    numbers.forEach(number => {
      const lottoNumber = document.createElement('div');
      lottoNumber.classList.add('lotto-number');
      lottoNumber.textContent = number;
      lottoNumber.style.backgroundColor = this.getColorForNumber(number);
      this.shadowRoot.appendChild(lottoNumber);
    });
  }

  getColorForNumber(number) {
    const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];
    return colors[number % colors.length];
  }
}

customElements.define('lotto-numbers', LottoNumbers);

document.getElementById('generate-btn').addEventListener('click', () => {
  const lottoNumbers = generateLottoNumbers();
  document.querySelector('lotto-numbers').numbers = lottoNumbers;
});

function generateLottoNumbers() {
  const numbers = new Set();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

// Theme toggle
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

// Contact form submission
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
      formStatus.textContent = '문의가 성공적으로 전송되었습니다!';
      formStatus.style.color = '#4CAF50';
      contactForm.reset();
    } else {
      formStatus.textContent = '전송에 실패했습니다. 다시 시도해주세요.';
      formStatus.style.color = '#f44336';
    }
  } catch {
    formStatus.textContent = '네트워크 오류가 발생했습니다.';
    formStatus.style.color = '#f44336';
  }
  submitBtn.disabled = false;
  submitBtn.textContent = '문의하기';
});

// Initial generation
document.querySelector('lotto-numbers').numbers = generateLottoNumbers();
