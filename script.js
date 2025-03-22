document.addEventListener('DOMContentLoaded', () => {
    try {
        
        fadeInContent();

     
        initExpenseChart();
        initCardAnimation();
        initTransactionEffects();
        initButtonEffects();
        initNavigation();
        initScrollEffects();
        initTooltips();
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
    }
});


const fadeInContent = () => {
    const container = document.querySelector('.container');
    if (!container) return;

    container.style.opacity = '0';
    setTimeout(() => {
        container.style.opacity = '1';
    }, 100);
};


const initExpenseChart = () => {
    const ctx = document.getElementById('expenseChart');
    if (!ctx) {
        console.error('Canvas с ID "expenseChart" не найден.');
        return;
    }

    try {
     
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(74, 144, 226, 0.3)');
        gradient.addColorStop(1, 'rgba(74, 144, 226, 0)');

       
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь'],
                datasets: [{
                    data: [30000, 45000, 35000, 50000, 42000, 38000],
                    borderColor: '#4a90e2',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: gradient,
                    pointBackgroundColor: '#4a90e2',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1a365d',
                        titleFont: { family: 'Montserrat', size: 13 },
                        bodyFont: { family: 'Montserrat', size: 12 },
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: {
                            font: { family: 'Montserrat' },
                            callback: (value) => value.toLocaleString('ru') + ' '
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Montserrat' } }
                    }
                }
            }
        });

        console.log('График успешно инициализирован.');
    } catch (error) {
        console.error('Ошибка при инициализации графика:', error);
    }
};
const initCardAnimation = () => {
    const card = document.querySelector('.card');
    if (!card || !window.matchMedia('(hover: hover)').matches) return;

    let isAnimating = false;

    card.addEventListener('mousemove', (e) => {
        if (isAnimating) return;
        isAnimating = true;

        requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            card.style.transform = `
                perspective(1000px)
                rotateX(${y * 10}deg)
                rotateY(${-x * 10}deg)
                scale(1.02)
            `;
            isAnimating = false;
        });
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
};

// Модуль 
const initTransactionEffects = () => {
    const transactionItems = document.querySelectorAll('.transaction-item');
    if (!transactionItems.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
            }
        });
    }, { threshold: 0.1 });

    transactionItems.forEach((item) => {
        item.addEventListener('mouseenter', () => (item.style.transform = 'translateX(10px)'));
        item.addEventListener('mouseleave', () => (item.style.transform = 'translateX(0)'));

        const amountEl = item.querySelector('.transaction-amount');
        if (amountEl) observer.observe(item);
    });
};

// Модуль 
const initButtonEffects = () => {
    const buttons = document.querySelectorAll('.button');
    if (!buttons.length) return;

    buttons.forEach((button) => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            button.style.setProperty('--x', `${e.clientX - rect.left}px`);
            button.style.setProperty('--y', `${e.clientY - rect.top}px`);
        });
    });
};

// Модуль 
const initNavigation = () => {
    const navLinks = document.querySelectorAll('.nav-link');
    if (!navLinks.length) return;

    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            addPulseEffect(e.currentTarget);
        });
    });
};

// Модуль 
const initScrollEffects = () => {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        header.classList.toggle('header-scrolled', scrollY > 50);
    });
};

// Модуль
const initTooltips = () => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);

    const elements = document.querySelectorAll('[aria-label]');
    if (!elements.length) return;

    elements.forEach((el) => {
        el.addEventListener('mouseenter', (e) => {
            const text = el.getAttribute('aria-label');
            const rect = el.getBoundingClientRect();

            tooltip.textContent = text;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
            tooltip.classList.add('visible');
        });

        el.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
    });
};

// помогите мне
const animateValue = (transactionItem) => {
    const amountEl = transactionItem.querySelector('.transaction-amount');
    if (!amountEl) return;

    const originalValue = amountEl.textContent;
    const isPositive = originalValue.includes('+');
    const target = parseFloat(originalValue.replace(/[^\d.]/g, ''));

    let current = 0;
    const duration = 1000;
    const step = (target / duration) * 16;

    const update = () => {
        current += step;
        if (current < target) {
            amountEl.textContent = `${isPositive ? '+' : '-'}${Math.abs(current).toLocaleString('ru')} `;
            requestAnimationFrame(update);
        } else {
            amountEl.textContent = originalValue;
        }
    };
    requestAnimationFrame(update);
};

const addPulseEffect = (element) => {
    const pulse = document.createElement('div');
    pulse.className = 'nav-pulse';

    const rect = element.getBoundingClientRect();
    pulse.style.width = `${rect.width}px`;
    pulse.style.height = `${rect.height}px`;
    pulse.style.left = `${rect.left}px`;
    pulse.style.top = `${rect.top}px`;

    document.body.appendChild(pulse);
    setTimeout(() => pulse.remove(), 500);
};

// Обработка  твоего рта нахуй
window.onerror = (msg, url, line) => {
    console.error(`Ошибка: ${msg}\nФайл: ${url}\nСтрока: ${line}`);
    return true;
};
