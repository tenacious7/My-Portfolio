// Performance optimization for portfolio website - NETLIFY OPTIMIZED

document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS with optimized settings
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      disable: function() {
        return window.innerWidth < 768; // Disable on mobile for better performance
      },
      duration: 600,
      easing: 'ease-out-cubic',
      offset: 50
    });
  }
  
  // Initialize all features
  initializeLoader();
  initializeSmoothScrolling();
  initializeGlassmorphismHeader();
  initializeIntersectionObserver();
  initializeSkillBars();
  initializeFormHandling();
  initializePerformanceOptimizations();
});

// FIXED: Enhanced loader with guaranteed hide mechanism
function initializeLoader() {
  const loader = document.querySelector('.loader-container');
  
  // If no loader element exists, skip
  if (!loader) {
    console.warn('Loader element not found - skipping loader initialization');
    return;
  }
  
  // Reduced maximum loading time for better UX
  const maxLoadTime = 2000; // Reduced from 3000ms
  const minLoadTime = 800;  // Minimum time to show loader
  const startTime = Date.now();
  
  let loaderHidden = false; // Track if loader is already hidden
  
  function hideLoader() {
    // Prevent multiple executions
    if (loaderHidden) return;
    loaderHidden = true;
    
    console.log('Hiding loader...');
    
    // Add fade-out class for smooth transition
    loader.classList.add('loader-hidden');
    
    // FALLBACK: Force remove after transition time
    setTimeout(() => {
      if (loader && document.body.contains(loader)) {
        loader.style.display = 'none';
        // Optionally remove from DOM
        loader.remove();
      }
    }, 500); // Give 500ms for CSS transition
    
    // Also listen for transition end
    loader.addEventListener('transitionend', () => {
      if (loader && document.body.contains(loader)) {
        loader.style.display = 'none';
        loader.remove();
      }
    }, { once: true });
  }
  
  // CRITICAL: Force hide after max time (Netlify safety net)
  const forceHideTimeout = setTimeout(() => {
    console.log('Force hiding loader after max time');
    hideLoader();
  }, maxLoadTime);
  
  // IMPROVED: Better load detection for Netlify
  function checkIfReady() {
    const elapsedTime = Date.now() - startTime;
    
    // Ensure minimum loading time for smooth UX
    if (elapsedTime >= minLoadTime) {
      clearTimeout(forceHideTimeout);
      hideLoader();
    } else {
      // Wait for minimum time
      setTimeout(() => {
        clearTimeout(forceHideTimeout);
        hideLoader();
      }, minLoadTime - elapsedTime);
    }
  }
  
  // Multiple triggers to ensure loader hides
  window.addEventListener('load', checkIfReady);
  
  // NETLIFY FIX: Also check document ready state
  if (document.readyState === 'complete') {
    setTimeout(checkIfReady, 100);
  }
  
  // ADDITIONAL SAFETY: Check if all critical resources are loaded
  setTimeout(() => {
    const images = document.querySelectorAll('img');
    const loadedImages = Array.from(images).filter(img => img.complete);
    
    if (images.length === 0 || loadedImages.length === images.length) {
      checkIfReady();
    }
  }, 1000);
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

// Enhanced glassmorphism header effects
function initializeGlassmorphismHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  
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
  // Check if IntersectionObserver is supported
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
        
        // Trigger specific animations based on element type
        if (entry.target.classList.contains('skill-level')) {
          animateSkillBar(entry.target);
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements with error handling
  try {
    const elementsToObserve = document.querySelectorAll(
      '.project-item, .timeline-item, .contact-item, .skill-level'
    );
    
    elementsToObserve.forEach(el => observer.observe(el));
  } catch (error) {
    console.warn('Error setting up intersection observer:', error);
  }
}

// Animate skill bars
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
  const increment = target / 60; // 60 frames for 1 second at 60fps
  
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

// Enhanced form handling
function initializeFormHandling() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  
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
    const submitBtn = form.querySelector('.send-message') || form.querySelector('button[type="submit"]');
    
    if (!submitBtn) return;
    
    // Add loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual form handling)
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

// Performance optimizations
function initializePerformanceOptimizations() {
  // Lazy load images with fallback
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
    // Fallback: load all images immediately
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
  
  // NETLIFY OPTIMIZED: 3D model loading with better error handling
  const splineViewer = document.querySelector('.robot-3d');
  if (splineViewer) {
    const splineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Load 3D model only when visible
          if (!splineViewer.hasAttribute('url')) {
            const modelUrl = 'https://prod.spline.design/PKaBruzFCvVi3TEL/scene.splinecode';
            
            // Add error handling for 3D model
            splineViewer.addEventListener('error', () => {
              console.warn('3D model failed to load');
              splineViewer.style.display = 'none';
            });
            
            splineViewer.setAttribute('url', modelUrl);
          }
          splineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    splineObserver.observe(splineViewer);
  }
  
  // Reduce motion for users who prefer it
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
  }
  
  // Optimize for low-end devices
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
    document.body.classList.add('low-performance');
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
    }, { passive: true });
    
    btn.addEventListener('touchend', () => {
      btn.style.transform = '';
    }, { passive: true });
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

// NETLIFY DEPLOYMENT FIX: Ensure everything runs even if DOM is already ready
if (document.readyState === 'loading') {
  // DOM is still loading
  document.addEventListener('DOMContentLoaded', enhance3DModelInteraction);
} else {
  // DOM is already ready
  enhance3DModelInteraction();
}
