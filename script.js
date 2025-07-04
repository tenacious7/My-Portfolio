// Performance optimization for portfolio website

document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS with reduced animations for better performance
  AOS.init({
    once: true, // Only animate elements once
    disable: 'mobile', // Disable animations on mobile for better performance
    duration: 800 // Reduce animation duration for better performance
  });
  
  // Lazy load the 3D model only when needed
  lazyLoadSpline();
  
  // Optimize project card animations using Intersection Observer
  setupIntersectionObserver();
  
  // Throttle scroll events for better performance
  setupScrollThrottling();
  
  // Reduce effects on low-end devices
  checkDevicePerformance();
});

// Hide loader after 2 seconds
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const loader = document.querySelector('.loader-container');
    loader.classList.add('loader-hidden');
    
    // Remove loader from DOM after transition completes
    loader.addEventListener('transitionend', () => {
      if (document.body.contains(loader)) {
        document.body.removeChild(loader);
      }
    });
  }, 3000); // Show loader for 2 seconds
});

// Lazy load Spline 3D viewer
function lazyLoadSpline() {
  const splineViewer = document.querySelector('.robot-3d');
  
  if (!splineViewer) return;
  
  // Only load the 3D model when scrolled to view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const url = splineViewer.getAttribute('data-url');
        if (url) {
          splineViewer.setAttribute('url', url);
          splineViewer.removeAttribute('data-url');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  splineViewer.setAttribute('data-url', splineViewer.getAttribute('url'));
  splineViewer.removeAttribute('url');
  observer.observe(splineViewer);
}

// Use Intersection Observer for better performance
function setupIntersectionObserver() {
  const projectCards = document.querySelectorAll('.project-card');
  const statItems = document.querySelectorAll('.stat-item');
  const sections = document.querySelectorAll('.portfolio-section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  // Observe elements
  projectCards.forEach(card => observer.observe(card));
  statItems.forEach(item => observer.observe(item));
  sections.forEach(section => observer.observe(section));
}

// Throttle scroll event for better performance
function setupScrollThrottling() {
  let lastScrollTime = 0;
  const scrollThreshold = 50; // ms between scroll events
  
  window.addEventListener('scroll', function() {
    const now = Date.now();
    if (now - lastScrollTime < scrollThreshold) return;
    lastScrollTime = now;
    
    // Handle any scroll-based animations here
  });
}

// Detect device performance and reduce effects if needed
function checkDevicePerformance() {
  const isLowEndDevice = 
    navigator.hardwareConcurrency <= 4 || // 4 or fewer CPU cores
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); // Mobile device
    
  if (isLowEndDevice) {
    document.body.classList.add('reduced-motion');
    reduceVisualEffects();
  }
}

// Reduce visual effects for better performance
function reduceVisualEffects() {
  // Remove expensive backdrop-filters
  document.querySelectorAll('.project-card, header, .project-tags span').forEach(el => {
    el.style.backdropFilter = 'none';
    el.style.webkitBackdropFilter = 'none';
  });
  
  // Simplify animations
  document.querySelectorAll('.tag-box').forEach(el => {
    el.style.animation = 'none';
  });
  
  // Reduce shadow effects
  document.querySelectorAll('[style*="box-shadow"]').forEach(el => {
    el.style.boxShadow = 'none';
  });
}