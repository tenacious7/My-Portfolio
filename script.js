// Performance optimization for portfolio website

document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS with optimized settings
  AOS.init({
    once: true,
    disable: function() {
      return window.innerWidth < 768; // Disable on mobile for better performance
    },
    duration: 600,
    easing: 'ease-out-cubic',
    offset: 50
  });
  
  // Initialize all features
  initializeLoader();
  initializeSmoothScrolling();
  initializeGlassmorphismHeader();
  initializeIntersectionObserver();
  initializeSkillBars();
  initializeFormHandling();
  initializePerformanceOptimizations();
});

// Enhanced loader with smooth transition
function initializeLoader() {
  const loader = document.querySelector('.loader-container');
  
  // Minimum loading time for smooth experience
  const minLoadTime = 2000;
  const startTime = Date.now();
  
  window.addEventListener('load', () => {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadTime - elapsedTime);
    
    setTimeout(() => {
      loader.classList.add('loader-hidden');
      
      // Remove loader from DOM after transition
      loader.addEventListener('transitionend', () => {
        if (document.body.contains(loader)) {
          document.body.removeChild(loader);
        }
      });
    }, remainingTime);
  });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
  const navLinks = document.querySelectorAll('nav a[href^="#"], .btn[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Enhanced glassmorphism header effects
function initializeGlassmorphismHeader() {
  const header = document.querySelector('header');
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  function updateHeader() {
    const scrollY = window.scrollY;
    
    // Enhanced glassmorphism effect on scroll
    if (scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide header on scroll down, show on scroll up (improved)
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

// Enhanced Intersection Observer for animations
function initializeIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        
        // Trigger specific animations based on element type
        
        if (entry.target.classList.contains('skill-level')) {
          animateSkillBar(entry.target);
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements
  const elementsToObserve = document.querySelectorAll(
    '.project-item, .timeline-item, .contact-item, .skill-level'
  );
  
  elementsToObserve.forEach(el => observer.observe(el));
}

// Animate skill bars
function initializeSkillBars() {
  const skillBars = document.querySelectorAll('.skill-level');
  
  skillBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0%';
    bar.dataset.width = width;
  });
}

function animateSkillBar(skillBar) {
  const targetWidth = skillBar.dataset.width;
  let currentWidth = 0;
  const increment = parseInt(targetWidth) / 60; // 60 frames for 1 second at 60fps
  
  function animate() {
    currentWidth += increment;
    if (currentWidth >= parseInt(targetWidth)) {
      skillBar.style.width = targetWidth;
      return;
    }
    skillBar.style.width = currentWidth + '%';
    requestAnimationFrame(animate);
  }
  
  animate();
}


// Enhanced form handling
function initializeFormHandling() {
  const form = document.querySelector('.contact-form');
  const inputs = form.querySelectorAll('input, textarea');
  
  // Add floating label effect
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
    
    // Check if input has value on load
    if (input.value) {
      input.parentElement.classList.add('focused');
    }
  });
  
  // Form submission with validation
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.send-message');
    
    // Add loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
      submitBtn.textContent = 'Message Sent!';
      submitBtn.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
      
      setTimeout(() => {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        submitBtn.style.background = 'linear-gradient(45deg, #7f00ff, #e100ff)';
        form.reset();
      }, 2000);
    }, 1500);
  });
}

// Performance optimizations
function initializePerformanceOptimizations() {
  // Lazy load images
  const images = document.querySelectorAll('img[data-src]');
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
  
  // Optimize 3D model loading
  const splineViewer = document.querySelector('.robot-3d');
  if (splineViewer) {
    const splineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Load 3D model only when visible
          if (!splineViewer.hasAttribute('url')) {
            splineViewer.setAttribute('url', 'https://prod.spline.design/PKaBruzFCvVi3TEL/scene.splinecode');
          }
          splineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    splineObserver.observe(splineViewer);
  }
  
  // Reduce motion for users who prefer it
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
  }
  
  // Optimize for low-end devices
  if (navigator.hardwareConcurrency <= 4) {
    document.body.classList.add('low-performance');
    // Reduce particle effects, complex animations, etc.
  }
}

// Throttle function for performance
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

// Debounce function for performance
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

// Add resize handler for responsive adjustments
window.addEventListener('resize', debounce(() => {
  // Recalculate positions and sizes if needed
  const splineViewer = document.querySelector('.robot-3d');
  if (splineViewer && window.innerWidth <= 992) {
    // Mobile adjustments handled by CSS
  }
}, 250));

// Add touch support for mobile devices
if ('ontouchstart' in window) {
  document.body.classList.add('touch-device');
  
  // Add touch feedback for buttons
  const buttons = document.querySelectorAll('.btn, .project-link, .social-icon');
  buttons.forEach(btn => {
    btn.addEventListener('touchstart', () => {
      btn.style.transform = 'scale(0.95)';
    });
    
    btn.addEventListener('touchend', () => {
      btn.style.transform = '';
    });
  });
}

// Enhanced 3D model interaction
function enhance3DModelInteraction() {
  const splineViewer = document.querySelector('.robot-3d');
  
  if (splineViewer) {
    // Add loading state
    splineViewer.addEventListener('load', () => {
      splineViewer.style.opacity = '1';
    });
    
    // Add error handling
    splineViewer.addEventListener('error', () => {
      console.warn('3D model failed to load');
      splineViewer.style.display = 'none';
    });
  }
}

// Initialize 3D model enhancements
document.addEventListener('DOMContentLoaded', enhance3DModelInteraction);