/* ========================================
   RAM KRISHNA VIDYA MANDIR — Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
  initHeroSlider();
  initScrollAnimations();
  initStatCounters();
  initTestimonialSlider();
  initTabs();
  initFormValidation();
  initLightbox();
  initModalClose();
  initSmoothScroll();
  initTickerPause();
});

/* --- Mobile Navigation --- */
function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const overlay = document.querySelector('.mobile-overlay');
  const navItems = document.querySelectorAll('.nav-item');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Mobile dropdown toggle
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown');
    if (!link || !dropdown) return;

    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        item.classList.toggle('open');
        navItems.forEach(other => {
          if (other !== item) other.classList.remove('open');
        });
      }
    });
  });
}

/* --- Header Scroll Effect --- */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* --- Hero Image Slider --- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (slides.length === 0) return;

  let current = 0;
  let interval;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function startAutoPlay() {
    interval = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    clearInterval(interval);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoPlay();
      goToSlide(i);
      startAutoPlay();
    });
  });

  if (slides.length > 1) startAutoPlay();
}

/* --- Scroll Animations (Intersection Observer) --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* --- Animated Stat Counters --- */
function initStatCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* --- Testimonial Slider --- */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;

  function updateSlider() {
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      current = (current - 1 + cards.length) % cards.length;
      updateSlider();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      current = (current + 1) % cards.length;
      updateSlider();
    });
  }

  // Auto-rotate testimonials
  setInterval(() => {
    current = (current + 1) % cards.length;
    updateSlider();
  }, 6000);
}

/* --- Tab System --- */
function initTabs() {
  const tabContainers = document.querySelectorAll('[data-tabs]');

  tabContainers.forEach(container => {
    const buttons = container.querySelectorAll('.tab-btn');
    const panels = container.querySelectorAll('.tab-panel');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');

        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const panel = container.querySelector(`#${target}`);
        if (panel) panel.classList.add('active');
      });
    });
  });
}

/* --- Form Validation --- */
function initFormValidation() {
  const forms = document.querySelectorAll('[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
        input.classList.remove('error');
      });
      form.querySelectorAll('.form-error').forEach(err => {
        err.classList.remove('visible');
      });

      // Validate required fields
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          const error = field.parentElement.querySelector('.form-error');
          if (error) {
            error.textContent = 'This field is required';
            error.classList.add('visible');
          }
        }
      });

      // Validate email
      const emailFields = form.querySelectorAll('input[type="email"]');
      emailFields.forEach(field => {
        if (field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          isValid = false;
          field.classList.add('error');
          const error = field.parentElement.querySelector('.form-error');
          if (error) {
            error.textContent = 'Please enter a valid email address';
            error.classList.add('visible');
          }
        }
      });

      // Validate phone
      const phoneFields = form.querySelectorAll('input[type="tel"]');
      phoneFields.forEach(field => {
        if (field.value && !/^[0-9+\-\s()]{10,15}$/.test(field.value)) {
          isValid = false;
          field.classList.add('error');
          const error = field.parentElement.querySelector('.form-error');
          if (error) {
            error.textContent = 'Please enter a valid phone number';
            error.classList.add('visible');
          }
        }
      });

      if (isValid) {
        // Show success modal
        const modal = document.getElementById('successModal');
        if (modal) {
          modal.classList.add('active');
        }
        form.reset();
      }
    });

    // Live validation on blur
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('blur', () => {
        if (!field.value.trim()) {
          field.classList.add('error');
        } else {
          field.classList.remove('error');
          const error = field.parentElement.querySelector('.form-error');
          if (error) error.classList.remove('visible');
        }
      });
    });
  });
}

/* --- Lightbox --- */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || galleryItems.length === 0) return;

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  let currentIndex = 0;
  const images = [];

  galleryItems.forEach((item, i) => {
    const img = item.querySelector('img');
    if (img) images.push(img.src);

    item.addEventListener('click', () => {
      currentIndex = i;
      lightboxImg.src = images[currentIndex];
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      lightboxImg.src = images[currentIndex];
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % images.length;
      lightboxImg.src = images[currentIndex];
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });
}

/* --- Modal Close --- */
function initModalClose() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-close')) {
        modal.classList.remove('active');
      }
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay').classList.remove('active');
    });
  });
}

/* --- Smooth Scrolling --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* --- Ticker Pause on Hover --- */
function initTickerPause() {
  const ticker = document.querySelector('.ticker-track');
  if (!ticker) return;

  ticker.addEventListener('mouseenter', () => {
    ticker.style.animationPlayState = 'paused';
  });

  ticker.addEventListener('mouseleave', () => {
    ticker.style.animationPlayState = 'running';
  });
}
