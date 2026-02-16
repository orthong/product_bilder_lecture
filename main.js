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

// Initial generation
document.querySelector('lotto-numbers').numbers = generateLottoNumbers();
