document.addEventListener('DOMContentLoaded', () => {
  const passwordToggle = document.querySelector('.password-toggle');
  const passwordInput = document.querySelector('input[type="password"]');
  const emailInput = document.querySelector('input[type="email"]');
  const loginForm = document.getElementById('loginForm');

  // Password visibility toggle with improved accessibility
  passwordToggle.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    
    const eyeIcon = passwordToggle.querySelector('i');
    eyeIcon.classList.toggle('fa-eye', !isPassword);
    eyeIcon.classList.toggle('fa-eye-slash', isPassword);
    
    // Accessibility improvement
    passwordToggle.setAttribute('aria-label', 
      isPassword ? 'Show password' : 'Hide password'
    );
  });
})
 