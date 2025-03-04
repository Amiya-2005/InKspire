document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
  
    // Password visibility toggle
    passwordToggle.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      passwordToggle.querySelector('i').classList.toggle('fa-eye');
      passwordToggle.querySelector('i').classList.toggle('fa-eye-slash');
    });
  
    // Password strength indicator
    function checkPasswordStrength(password) {
      const strengthChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
      };
  
      let strength = Object.values(strengthChecks).filter(Boolean).length;
      
      strengthBar.style.width = `${strength * 20}%`;
      strengthBar.style.backgroundColor = 
        strength <= 2 ? '#ff4d4d' : 
        strength <= 3 ? '#ffbf00' : 
        '#4caf50';
  
      strengthText.textContent = 
        strength <= 2 ? 'Weak' : 
        strength <= 3 ? 'Medium' : 
        'Strong';
    }
  
    // Validation functions
    function validateFullName(name) {
      return name.length >= 2 && name.length <= 50;
    }
  
    function validateEmail(email) {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
    }
  
    function validatePassword(password) {
      return password.length >= 8;
    }
  
    // Real-time validation
    fullNameInput.addEventListener('input', () => {
      const isValid = validateFullName(fullNameInput.value);
      const errorEl = fullNameInput.nextElementSibling;
      errorEl.style.display = isValid ? 'none' : 'block';
    });
  
    emailInput.addEventListener('input', () => {
      const isValid = validateEmail(emailInput.value);
      const errorEl = emailInput.nextElementSibling;
      errorEl.style.display = isValid ? 'none' : 'block';
    });
  
    passwordInput.addEventListener('input', () => {
      const isValid = validatePassword(passwordInput.value);
      const errorEl = passwordInput.nextElementSibling.nextElementSibling;
      errorEl.style.display = isValid ? 'none' : 'block';
      
      checkPasswordStrength(passwordInput.value);
    });
  
    // Form submission validation
    form.addEventListener('submit', (e) => {
      const fullNameValid = validateFullName(fullNameInput.value);
      const emailValid = validateEmail(emailInput.value);
      const passwordValid = validatePassword(passwordInput.value);
  
      if (!fullNameValid || !emailValid || !passwordValid) {
        e.preventDefault();
        
        // Show specific errors
        const fullNameErrorEl = fullNameInput.nextElementSibling;
        const emailErrorEl = emailInput.nextElementSibling;
        const passwordErrorEl = passwordInput.nextElementSibling.nextElementSibling;
        
        fullNameErrorEl.style.display = !fullNameValid ? 'block' : 'none';
        emailErrorEl.style.display = !emailValid ? 'block' : 'none';
        passwordErrorEl.style.display = !passwordValid ? 'block' : 'none';
      }
    });
  });