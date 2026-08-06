/* ===========================
   HabitSync — Interactive JavaScript
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  // ===========================
  // 1. THEME TOGGLE (Dark / Light)
  // ===========================
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleFooter = document.getElementById('themeToggleFooter');

  // Load saved theme
  const savedTheme = localStorage.getItem('habitsync-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  function toggleTheme() {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('habitsync-theme', next);
    // Redraw chart on theme change
    drawChart();
  }

  themeToggle.addEventListener('click', toggleTheme);
  themeToggleFooter.addEventListener('click', toggleTheme);

  // ===========================
  // 2. NAVBAR & MOBILE MENU
  // ===========================
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navbar = document.getElementById('navbar');
  const allNavLinks = document.querySelectorAll('.nav-link');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Navbar shadow on scroll
  function updateNavbar() {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }

  window.addEventListener('scroll', () => {
    updateActiveLink();
    updateNavbar();
  }, { passive: true });

  // ===========================
  // 3. SCROLL ANIMATIONS (Intersection Observer)
  // ===========================
  const animatedElements = document.querySelectorAll('.animate-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));

  // ===========================
  // 4. COUNTER ANIMATION (Hero stats)
  // ===========================
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    const heroStats = document.querySelector('.hero__stats');
    if (!heroStats) return;
    const rect = heroStats.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      statsAnimated = true;
      statNumbers.forEach(el => {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          el.textContent = current.toLocaleString('ru-RU');
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters(); // Check on load

  // ===========================
  // 5. PRODUCTIVITY CALCULATOR
  // ===========================
  const sleepInput = document.getElementById('calcSleep');
  const focusInput = document.getElementById('calcFocus');
  const exerciseInput = document.getElementById('calcExercise');
  const screenTimeInput = document.getElementById('calcScreenTime');

  const sleepValue = document.getElementById('calcSleepValue');
  const focusValue = document.getElementById('calcFocusValue');
  const exerciseValue = document.getElementById('calcExerciseValue');
  const screenTimeValue = document.getElementById('calcScreenTimeValue');

  const productivityCircle = document.getElementById('productivityCircle');
  const productivityValueEl = document.getElementById('productivityValue');
  const productivityTip = document.getElementById('productivityTip');

  const circumference = 2 * Math.PI * 52; // 326.73

  function calcProductivity() {
    const sleep = parseFloat(sleepInput.value);
    const focus = parseFloat(focusInput.value);
    const exercise = parseInt(exerciseInput.value);
    const screenTime = parseFloat(screenTimeInput.value);

    // Update displayed values
    sleepValue.textContent = sleep + ' ч';
    focusValue.textContent = focus + ' ч';
    exerciseValue.textContent = exercise + ' мин';
    screenTimeValue.textContent = screenTime + ' ч';

    // Calculate productivity index (0-100)
    // Sleep: optimal 7-8h = max 30 points
    let sleepScore;
    if (sleep >= 7 && sleep <= 8) sleepScore = 30;
    else if (sleep >= 6 && sleep < 7) sleepScore = 22;
    else if (sleep > 8 && sleep <= 9) sleepScore = 24;
    else if (sleep >= 5 && sleep < 6) sleepScore = 14;
    else if (sleep > 9) sleepScore = 16;
    else sleepScore = 8;

    // Focus: max 12h = max 30 points
    let focusScore = Math.min(focus / 6 * 30, 30);

    // Exercise: max 120min = max 20 points
    let exerciseScore = Math.min(exercise / 60 * 20, 20);

    // Screen time penalty: 0-10h reduces, max -20 points
    let screenPenalty = Math.min(screenTime / 5 * 20, 20);

    let total = Math.round(sleepScore + focusScore + exerciseScore - screenPenalty);
    total = Math.max(0, Math.min(100, total));

    // Update ring
    const offset = circumference - (total / 100) * circumference;
    productivityCircle.style.strokeDashoffset = offset;
    productivityValueEl.textContent = total;

    // Update tip
    if (total >= 80) {
      productivityTip.textContent = '🔥 Отличный результат! Ты на пике продуктивности!';
    } else if (total >= 60) {
      productivityTip.textContent = '💪 Хороший уровень! Попробуй сократить экранное время.';
    } else if (total >= 40) {
      productivityTip.textContent = '⚠️ Средний уровень. Добавь физической активности и сна.';
    } else {
      productivityTip.textContent = '😴 Низкий индекс. Начни с нормализации сна и режима.';
    }

    // Color change based on score
    const ring = productivityCircle;
    if (total >= 70) {
      ring.style.stroke = '';  // use default accent
    } else if (total >= 40) {
      ring.style.stroke = '#ffab00';
    } else {
      ring.style.stroke = '#ff5252';
    }
  }

  [sleepInput, focusInput, exerciseInput, screenTimeInput].forEach(input => {
    input.addEventListener('input', calcProductivity);
  });

  // Initial calc
  calcProductivity();

  // ===========================
  // 6. WATER CALCULATOR
  // ===========================
  const weightInput = document.getElementById('calcWeight');
  const activityInput = document.getElementById('calcActivity');
  const goalInput = document.getElementById('calcGoal');

  const waterLitersEl = document.getElementById('waterLiters');
  const waterGlassesEl = document.getElementById('waterGlasses');
  const waterFillEl = document.getElementById('waterFill');

  function calcWater() {
    const weight = parseFloat(weightInput.value) || 70;
    const activity = parseFloat(activityInput.value);
    const goal = goalInput.value;

    // Base: 30ml per kg
    let base = weight * 30 / 1000;

    // Activity multiplier
    base *= activity;

    // Goal adjustment
    switch (goal) {
      case 'weight_loss': base *= 1.1; break;
      case 'muscle': base *= 1.15; break;
      case 'energy': base *= 1.05; break;
      default: break; // health - no change
    }

    const liters = Math.round(base * 10) / 10;
    const glasses = Math.round(liters / 0.25);

    waterLitersEl.textContent = liters.toFixed(1);
    waterGlassesEl.textContent = '≈ ' + glasses + ' стаканов';

    // Fill glass animation (max ~4 liters = 100%)
    const fillPercent = Math.min((liters / 4) * 100, 100);
    waterFillEl.style.height = fillPercent + '%';
  }

  [weightInput, activityInput, goalInput].forEach(input => {
    input.addEventListener('input', calcWater);
    input.addEventListener('change', calcWater);
  });

  calcWater();

  // ===========================
  // 7. HABIT TRACKER
  // ===========================
  const habitList = document.getElementById('habitList');
  const habitInput = document.getElementById('habitInput');
  const habitAddBtn = document.getElementById('habitAddBtn');
  const trackerPercent = document.getElementById('trackerPercent');
  const trackerProgressBar = document.getElementById('trackerProgressBar');

  let habitCounter = 7; // next ID

  function updateHabitProgress() {
    const items = habitList.querySelectorAll('.habit-item');
    const checked = habitList.querySelectorAll('.habit-item input:checked');
    const total = items.length;
    const done = checked.length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    trackerPercent.textContent = percent + '%';
    trackerProgressBar.style.width = percent + '%';
  }

  // Delegate checkbox & delete events
  habitList.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      updateHabitProgress();
    }
  });

  habitList.addEventListener('click', (e) => {
    if (e.target.classList.contains('habit-delete')) {
      const item = e.target.closest('.habit-item');
      item.style.transform = 'translateX(100%)';
      item.style.opacity = '0';
      setTimeout(() => {
        item.remove();
        updateHabitProgress();
      }, 300);
    }
  });

  function addHabit() {
    const text = habitInput.value.trim();
    if (!text) return;

    const li = document.createElement('li');
    li.className = 'habit-item';
    li.setAttribute('data-id', habitCounter++);
    li.innerHTML = `
      <label class="habit-checkbox">
        <input type="checkbox">
        <span class="checkmark"></span>
        <span class="habit-text">${escapeHtml(text)}</span>
      </label>
      <button class="habit-delete" title="Удалить">&times;</button>
    `;
    habitList.appendChild(li);
    habitInput.value = '';
    updateHabitProgress();

    // Scroll to new item
    li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  habitAddBtn.addEventListener('click', addHabit);
  habitInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addHabit();
  });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  updateHabitProgress();

  // ===========================
  // 8. WEEKLY CHART (Canvas)
  // ===========================
  const canvas = document.getElementById('weeklyChart');
  const ctx = canvas.getContext('2d');

  const weekData = {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    values: [62, 85, 73, 90, 68, 55, 78]
  };

  let chartType = 'bar'; // 'bar' or 'line'
  let chartAnimation = 0;

  // Chart tabs
  const chartTabs = document.querySelectorAll('.analytics-tab');
  chartTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      chartTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      chartType = tab.getAttribute('data-chart');
      chartAnimation = 0;
      animateChart();
    });
  });

  function getChartColors() {
    const theme = html.getAttribute('data-theme');
    const style = getComputedStyle(html);
    return {
      grid: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      text: theme === 'dark' ? '#8b8fa3' : '#5f6377',
      accent: theme === 'dark' ? '#00e676' : '#00c853',
      accentTeal: '#00bcd4',
      accentGlow: theme === 'dark' ? 'rgba(0,230,118,0.3)' : 'rgba(0,200,83,0.2)',
      barBg: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    };
  }

  function drawChart() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const colors = getChartColors();

    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      // Y labels
      ctx.fillStyle = colors.text;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText((100 - i * 25) + '', padding.left - 8, y + 4);
    }
    ctx.setLineDash([]);

    const barWidth = chartW / weekData.labels.length;
    const maxVal = 100;
    const animProgress = Math.min(chartAnimation, 1);

    if (chartType === 'bar') {
      weekData.values.forEach((val, i) => {
        const x = padding.left + barWidth * i + barWidth * 0.2;
        const bw = barWidth * 0.6;
        const barH = (val / maxVal) * chartH * animProgress;
        const y = padding.top + chartH - barH;

        // Bar background
        ctx.fillStyle = colors.barBg;
        ctx.beginPath();
        roundRect(ctx, x, padding.top, bw, chartH, 6);
        ctx.fill();

        // Bar fill with gradient
        const grad = ctx.createLinearGradient(x, y, x, padding.top + chartH);
        grad.addColorStop(0, colors.accent);
        grad.addColorStop(1, colors.accentTeal);
        ctx.fillStyle = grad;
        ctx.beginPath();
        roundRect(ctx, x, y, bw, barH, 6);
        ctx.fill();

        // Value on top
        if (animProgress >= 1) {
          ctx.fillStyle = colors.accent;
          ctx.font = '12px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(val + '%', x + bw / 2, y - 8);
        }
      });
    } else {
      // Line chart
      ctx.beginPath();
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      const points = [];
      weekData.values.forEach((val, i) => {
        const x = padding.left + barWidth * i + barWidth / 2;
        const barH = (val / maxVal) * chartH * animProgress;
        const y = padding.top + chartH - barH;
        points.push({ x, y, val });
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Area fill
      const areaGrad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      areaGrad.addColorStop(0, colors.accentGlow);
      areaGrad.addColorStop(1, 'transparent');
      ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
      ctx.lineTo(points[0].x, padding.top + chartH);
      ctx.closePath();
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // Dots
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = colors.accent;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = html.getAttribute('data-theme') === 'dark' ? '#1c1f28' : '#ffffff';
        ctx.fill();

        if (animProgress >= 1) {
          ctx.fillStyle = colors.accent;
          ctx.font = '12px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(p.val + '%', p.x, p.y - 14);
        }
      });
    }

    // X labels
    ctx.fillStyle = colors.text;
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    weekData.labels.forEach((label, i) => {
      const x = padding.left + barWidth * i + barWidth / 2;
      ctx.fillText(label, x, h - padding.bottom + 24);
    });
  }

  function roundRect(ctx, x, y, w, h, r) {
    if (h < 0) { y += h; h = -h; }
    r = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function animateChart() {
    chartAnimation = 0;
    const duration = 800;
    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      chartAnimation = Math.min(elapsed / duration, 1);
      // Ease out
      chartAnimation = 1 - Math.pow(1 - chartAnimation, 3);
      drawChart();
      if (chartAnimation < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  // Observe chart for animation trigger
  const chartSection = document.querySelector('.analytics-card');
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateChart();
        chartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (chartSection) chartObserver.observe(chartSection);

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      drawChart();
    }, 150);
  });

  // Update analytics summary
  const avgProd = document.getElementById('avgProductivity');
  const bestDayEl = document.getElementById('bestDay');
  const streakEl = document.getElementById('streak');

  const avg = Math.round(weekData.values.reduce((a, b) => a + b, 0) / weekData.values.length);
  const maxIdx = weekData.values.indexOf(Math.max(...weekData.values));
  avgProd.textContent = avg + '%';
  bestDayEl.textContent = weekData.labels[maxIdx];

  // ===========================
  // 9. CONTACT FORM VALIDATION
  // ===========================
  const contactForm = document.getElementById('contactForm');
  const formName = document.getElementById('formName');
  const formEmail = document.getElementById('formEmail');
  const formPhone = document.getElementById('formPhone');
  const formGoal = document.getElementById('formGoal');

  const formNameError = document.getElementById('formNameError');
  const formEmailError = document.getElementById('formEmailError');
  const formPhoneError = document.getElementById('formPhoneError');
  const formGoalError = document.getElementById('formGoalError');

  // Real-time validation
  function validateField(input, errorEl, rules) {
    const value = input.value.trim();
    let errorMsg = '';

    for (const rule of rules) {
      if (!rule.test(value)) {
        errorMsg = rule.message;
        break;
      }
    }

    if (errorMsg) {
      errorEl.textContent = errorMsg;
      input.classList.add('error');
      input.classList.remove('success');
      return false;
    } else {
      errorEl.textContent = '';
      if (value) {
        input.classList.add('success');
        input.classList.remove('error');
      } else {
        input.classList.remove('error', 'success');
      }
      return true;
    }
  }

  const nameRules = [
    { test: v => v.length > 0, message: 'Введи своё имя' },
    { test: v => v.length >= 2, message: 'Имя слишком короткое' },
    { test: v => /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(v), message: 'Только буквы, пробелы и дефисы' }
  ];

  const emailRules = [
    { test: v => v.length > 0, message: 'Введи email' },
    { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Некорректный email' }
  ];

  const phoneRules = [
    { test: v => v.length === 0 || /^[\+]?[\d\s\(\)\-]{7,18}$/.test(v), message: 'Некорректный номер телефона' }
  ];

  const goalRules = [
    { test: v => v.length > 0, message: 'Выбери цель' }
  ];

  formName.addEventListener('input', () => validateField(formName, formNameError, nameRules));
  formEmail.addEventListener('input', () => validateField(formEmail, formEmailError, emailRules));
  formPhone.addEventListener('input', () => validateField(formPhone, formPhoneError, phoneRules));
  formGoal.addEventListener('change', () => validateField(formGoal, formGoalError, goalRules));

  // Phone mask
  formPhone.addEventListener('input', (e) => {
    let val = e.target.value.replace(/[^\d+]/g, '');
    if (val.startsWith('+7') || val.startsWith('8')) {
      // Format as russian phone
      let digits = val.replace(/\D/g, '');
      if (digits.startsWith('8')) digits = '7' + digits.slice(1);
      if (digits.startsWith('7')) {
        let formatted = '+7';
        if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
        if (digits.length > 4) formatted += ') ' + digits.slice(4, 7);
        if (digits.length > 7) formatted += '-' + digits.slice(7, 9);
        if (digits.length > 9) formatted += '-' + digits.slice(9, 11);
        e.target.value = formatted;
      }
    }
  });

  // Form submit
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(formName, formNameError, nameRules);
    const isEmailValid = validateField(formEmail, formEmailError, emailRules);
    const isPhoneValid = validateField(formPhone, formPhoneError, phoneRules);
    const isGoalValid = validateField(formGoal, formGoalError, goalRules);

    if (isNameValid && isEmailValid && isPhoneValid && isGoalValid) {
      // Show toast
      showToast();
      // Reset form
      contactForm.reset();
      [formName, formEmail, formPhone, formGoal].forEach(f => {
        f.classList.remove('success', 'error');
      });
    }
  });

  // ===========================
  // 10. TOAST NOTIFICATION
  // ===========================
  const toast = document.getElementById('toast');
  const toastClose = document.getElementById('toastClose');

  function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  }

  toastClose.addEventListener('click', () => {
    toast.classList.remove('show');
  });

  // ===========================
  // 11. FEATURE CARD TILT EFFECT
  // ===========================
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ===========================
  // 12. SMOOTH SCROLL for anchor links
  // ===========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===========================
  // Initial draw
  // ===========================
  // Delay chart initial draw to let canvas size settle
  setTimeout(() => {
    drawChart();
  }, 100);
});
