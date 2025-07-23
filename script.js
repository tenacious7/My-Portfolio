// Performance optimization for portfolio website - NETLIFY/VERCEL OPTIMIZED

document.addEventListener('DOMContentLoaded', function() {
  initializeLoader(); // Uncommented to enable loader
  initializeSmoothScrolling();
  initializeGlassmorphismHeader();
  initializeIntersectionObserver();
  initializeSkillBars();
  initializeFormHandling();
  initializePerformanceOptimizations();
});

function initializeLoader() {
  const loader = document.querySelector('.loader-container');
  if (!loader) {
    console.warn('Loader element not found - skipping loader initialization');
    return;
  }
  const maxLoadTime = 3000; // Increased for slower networks
  const minLoadTime = 800; // Minimum time to show loader
  const startTime = Date.now();
  let loaderHidden = false;

  function hideLoader() {
    if (loaderHidden) return;
    loaderHidden = true;
    console.log('Hiding loader...');
    loader.classList.add('loader-hidden');
    setTimeout(() => {
      if (loader && document.body.contains(loader)) {
        loader.style.display = 'none';
        loader.remove();
      }
    }, 500); // Matches CSS transition duration
    loader.addEventListener('transitionend', () => {
      if (loader && document.body.contains(loader)) {
        loader.style.display = 'none';
        loader.remove();
      }
    }, { once: true });
  }

  const forceHideTimeout = setTimeout(() => {
    console.log('Force hiding loader after max time');
    hideLoader();
  }, maxLoadTime);

  function checkIfReady() {
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime >= minLoadTime) {
      clearTimeout(forceHideTimeout);
      hideLoader();
    } else {
      setTimeout(() => {
        clearTimeout(forceHideTimeout);
        hideLoader();
      }, minLoadTime - elapsedTime);
    }
  }

  // Robust check for Netlify/Vercel
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(checkIfReady, 100); // Small delay for asset loading
  } else {
    window.addEventListener('load', checkIfReady);
  }

  // Check critical resources (images and 3D model)
  setTimeout(() => {
    const images = document.querySelectorAll('img');
    const loadedImages = Array.from(images).filter(img => img.complete);
    const splineViewer = document.querySelector('.robot-3d');
    const isSplineLoaded = splineViewer ? splineViewer.style.opacity === '1' : true;
    if ((images.length === 0 || loadedImages.length === images.length) && isSplineLoaded) {
      checkIfReady();
    }
  }, 2000); // Increased timeout for reliability
}

// The rest of your functions remain unchanged
function initializeSmoothScrolling() {
  const navLinks = document.querySelectorAll('nav a[href^="#"], .btn[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function initializeGlassmorphismHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  let lastScrollY = window.scrollY;
  let ticking = false;
  function updateHeader() {
    const scrollY = window.scrollY;
    if (scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    if (scrollY > lastScrollY && scrollY > 200) {
      header.style.transform = 'translateY(-100%)';
      header.style.opacity = '0';
    } else {
      header.style.transform = 'translateY(0)';
      header.style.opacity = '1';
    }
    lastScrollY = scrollY;
    ticking = false;
  }
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }
  window.addEventListener('scroll', requestTick, { passive: true });
}

function initializeIntersectionObserver() {
  if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver not supported');
    return;
  }
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (entry.target.classList.contains('skill-level')) {
          animateSkillBar(entry.target);
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  try {
    const elementsToObserve = document.querySelectorAll(
      '.project-item:not(.hidden), .timeline-item:not(.hidden), .contact-item:not(.hidden), .skill-level:not(.hidden)'
    );
    elementsToObserve.forEach(el => observer.observe(el));
  } catch (error) {
    console.warn('Error setting up intersection observer:', error);
  }
}

function initializeSkillBars() {
  const skillBars = document.querySelectorAll('.skill-level');
  skillBars.forEach(bar => {
    const width = bar.style.width || bar.getAttribute('data-width');
    if (width) {
      bar.style.width = '0%';
      bar.dataset.width = width;
    }
  });
}

function animateSkillBar(skillBar) {
  const targetWidth = skillBar.dataset.width;
  if (!targetWidth) return;
  let currentWidth = 0;
  const target = parseInt(targetWidth);
  const increment = target / 60;
  function animate() {
    currentWidth += increment;
    if (currentWidth >= target) {
      skillBar.style.width = targetWidth;
      return;
    }
    skillBar.style.width = currentWidth + '%';
    requestAnimationFrame(animate);
  }
  animate();
}

function initializeFormHandling() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
    if (input.value) {
      input.parentElement.classList.add('focused');
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.send-message') || form.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.textContent = 'Message Sent!';
      submitBtn.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = 'linear-gradient(45deg, #7f00ff, #e100ff)';
        form.reset();
      }, 2000);
    }, 1500);
  });
}

function initializePerformanceOptimizations() {
  const images = document.querySelectorAll('img[data-src]');
  if (window.IntersectionObserver && images.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    images.forEach(img => imageObserver.observe(img));
  } else {
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
  const splineViewer = document.querySelector('.robot-3d');
  if (splineViewer) {
    const splineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!splineViewer.hasAttribute('url')) {
            const modelUrl = 'https://prod.spline.design/PKaBruzFCvVi3TEL/scene.splinecode';
            splineViewer.setAttribute('url', modelUrl);
            setTimeout(() => {
              if (splineViewer.style.opacity !== '1') {
                console.warn('3D model timed out');
                splineViewer.style.display = 'none';
              }
            }, 5000);
          }
          splineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    splineObserver.observe(splineViewer);
  }
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
  }
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
    document.body.classList.add('low-performance');
  }
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

window.addEventListener('resize', debounce(() => {
  const splineViewer = document.querySelector('.robot-3d');
  if (splineViewer && window.innerWidth <= 992) {
    // Mobile adjustments handled by CSS
  }
}, 250));

if ('ontouchstart' in window) {
  document.body.classList.add('touch-device');
  const buttons = document.querySelectorAll('.btn, .project-link, .social-icon');
  buttons.forEach(btn => {
    btn.addEventListener('touchstart', () => {
      btn.style.transform = 'scale(0.95)';
    }, { passive: true });
    btn.addEventListener('touchend', () => {
      btn.style.transform = '';
    }, { passive: true });
  });
}

function enhance3DModelInteraction() {
  const splineViewer = document.querySelector('.robot-3d');
  if (splineViewer) {
    splineViewer.addEventListener('load', () => {
      splineViewer.style.opacity = '1';
    });
    splineViewer.addEventListener('error', () => {
      console.warn('3D model failed to load');
      splineViewer.style.display = 'none';
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhance3DModelInteraction);
} else {
  enhance3DModelInteraction();
}