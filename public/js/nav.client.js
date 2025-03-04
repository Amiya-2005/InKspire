document.addEventListener("DOMContentLoaded", function() {
    // Active link detection with improved path matching
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        // More precise path matching
        if (
          href === currentPath || 
          (href !== '/home' && currentPath.startsWith(href)) ||
          (href === '/home' && (currentPath === '/' || currentPath === '/home'))
        ) {
          link.classList.add('active');
        }
      }
    });
    
    // Enhance dropdown behavior with smooth animations
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
      const dropdownMenu = userDropdown.querySelector('.dropdown-menu');
      const dropdownToggle = userDropdown.querySelector('.dropdown-toggle');
      
      dropdownToggle.addEventListener('show.bs.dropdown', function() {
        dropdownMenu.style.display = 'block';
        setTimeout(() => dropdownMenu.classList.add('show-menu'), 10);
      });
      
      dropdownToggle.addEventListener('hide.bs.dropdown', function() {
        dropdownMenu.classList.remove('show-menu');
        setTimeout(() => dropdownMenu.style.display = '', 300);
      });
    }
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Add scroll effect to navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    });
  });