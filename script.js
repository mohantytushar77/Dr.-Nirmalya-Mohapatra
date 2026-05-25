/* script.js - Interactive functions for Dr. Nirmalya Mohapatra's Website */

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initMobileMenu();
  initScrollAnimations();
  initScrollSpy();
  initAppointmentForm();
});

/**
 * Dark/Light Mode Theme Toggle
 */
function initDarkMode() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
    moonIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
  } else {
    document.documentElement.classList.remove('dark');
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }

  // Toggle Theme Function
  themeToggleBtn.addEventListener('click', () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      moonIcon.classList.add('hidden');
      sunIcon.classList.remove('hidden');
    }
  });
}

/**
 * Mobile Hamburger Navigation Menu
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = mobileMenu.querySelectorAll('a');

  function openMenu() {
    mobileMenu.classList.remove('translate-x-full');
    document.body.classList.add('overflow-hidden');
  }

  function closeMenu() {
    mobileMenu.classList.add('translate-x-full');
    document.body.classList.remove('overflow-hidden');
  }

  menuBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * Intersection Observer for Entrance Scroll Animations
 */
function initScrollAnimations() {
  const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once animated to save cycles
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elementsToReveal.forEach(el => {
    animationObserver.observe(el);
  });
}

/**
 * Scroll Spy Navbar Active Link Highlighter
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('#desktop-nav .nav-link');
  const mobileLinks = document.querySelectorAll('#mobile-menu .mobile-nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 120; // Offset for sticky header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    // Fallback for bottom of the page
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
      currentId = 'contact';
    }

    // Update active state on Desktop Links
    desktopLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });

    // Update active state on Mobile Drawer Links
    mobileLinks.forEach(link => {
      link.classList.remove('text-[#FF7722]', 'font-semibold');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('text-[#FF7722]', 'font-semibold');
      }
    });
  });
}

/**
 * Appointment / Contact Form Validation & Submission Mocking
 */
function initAppointmentForm() {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Standard HTML5 validation succeeds here
    const name = document.getElementById('form-name').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const date = document.getElementById('form-date').value;
    const notes = document.getElementById('form-notes').value.trim();

    // Visual feedback - Show loading spinner on button
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin h-5 w-5 text-white inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Scheduling...
    `;

    // Simulate Network Request to Clinic Manager
    setTimeout(() => {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Show beautiful response banner
      showNotification(name, date);

      // Reset form fields
      form.reset();
    }, 1800);
  });
}

/**
 * Display clean confirmation card
 */
function showNotification(patientName, appointmentDate) {
  // Remove existing notification if any
  const existingAlert = document.getElementById('appointment-success-alert');
  if (existingAlert) {
    existingAlert.remove();
  }

  // Parse Date
  let formattedDate = 'soon';
  if (appointmentDate) {
    const d = new Date(appointmentDate);
    formattedDate = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  const alertContainer = document.createElement('div');
  alertContainer.id = 'appointment-success-alert';
  alertContainer.className = 'fixed bottom-5 right-5 left-5 md:left-auto md:max-w-md bg-white dark:bg-slate-900 border-l-4 border-[#FF7722] rounded-r-lg shadow-2xl p-5 z-50 transform translate-y-20 opacity-0 transition-all duration-500 ease-out flex gap-4 items-start';
  alertContainer.innerHTML = `
    <div class="p-2 bg-orange-100 dark:bg-orange-950/50 rounded-full text-[#FF7722]">
      <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </div>
    <div class="flex-1">
      <h4 class="font-bold text-slate-900 dark:text-white text-lg">Booking Submitted Successfully</h4>
      <p class="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
        Thank you, <strong>${patientName}</strong>. Your request for <strong>${formattedDate}</strong> has been logged. Dr. Nirmalya's clinic coordinator will call you shortly to confirm the exact time.
      </p>
      <button onclick="document.getElementById('appointment-success-alert').remove()" class="text-xs font-semibold text-[#FF7722] mt-3 hover:text-orange-600 transition-colors uppercase tracking-wider">Dismiss</button>
    </div>
  `;

  document.body.appendChild(alertContainer);

  // Trigger Slide-up Transition
  setTimeout(() => {
    alertContainer.classList.remove('translate-y-20', 'opacity-0');
  }, 100);

  // Auto-dismiss after 8 seconds
  setTimeout(() => {
    if (document.body.contains(alertContainer)) {
      alertContainer.classList.add('translate-y-20', 'opacity-0');
      setTimeout(() => {
        if (document.body.contains(alertContainer)) {
          alertContainer.remove();
        }
      }, 500);
    }
  }, 8000);
}
