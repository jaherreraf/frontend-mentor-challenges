;(function () {
  'use strict'

  // ========================
  // Mobile Nav Toggle
  // ========================

  const hamburger = document.querySelector('.header__hamburger')
  const mobileNav = document.getElementById('mobile-nav')
  const closeBtn = document.querySelector('.mobile-nav__close')
  const mobileLinks = document.querySelectorAll('.mobile-nav__link')

  function openMobileNav() {
    mobileNav.classList.add('mobile-nav--open')
    mobileNav.setAttribute('aria-hidden', 'false')
    hamburger.setAttribute('aria-expanded', 'true')
    document.body.style.overflow = 'hidden'
  }

  function closeMobileNav() {
    mobileNav.classList.remove('mobile-nav--open')
    mobileNav.setAttribute('aria-hidden', 'true')
    hamburger.setAttribute('aria-expanded', 'false')
    document.body.style.overflow = ''
  }

  hamburger.addEventListener('click', openMobileNav)
  closeBtn.addEventListener('click', closeMobileNav)

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileNav)
  })

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('mobile-nav--open')) {
      closeMobileNav()
    }
  })

  // ========================
  // Feature Tabs
  // ========================

  var tabs = document.querySelectorAll('.features__tab')
  var panels = document.querySelectorAll('.features__panel')

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var targetId = this.getAttribute('aria-controls')

      tabs.forEach(function (t) {
        t.classList.remove('features__tab--active')
        t.setAttribute('aria-selected', 'false')
      })

      panels.forEach(function (p) {
        p.classList.remove('features__panel--active')
        p.setAttribute('hidden', '')
      })

      this.classList.add('features__tab--active')
      this.setAttribute('aria-selected', 'true')

      var targetPanel = document.getElementById(targetId)
      if (targetPanel) {
        targetPanel.classList.add('features__panel--active')
        targetPanel.removeAttribute('hidden')
      }
    })
  })

  // ========================
  // Email Validation
  // ========================

  var form = document.querySelector('.contact__form')
  var emailInput = document.getElementById('email')
  var errorSpan = document.getElementById('email-error')

  if (form && emailInput && errorSpan) {
    form.addEventListener('submit', function (e) {
      var email = emailInput.value.trim()
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!email || !emailPattern.test(email)) {
        e.preventDefault()
        emailInput.classList.add('contact__input--error')
        errorSpan.removeAttribute('hidden')
      } else {
        emailInput.classList.remove('contact__input--error')
        errorSpan.setAttribute('hidden', '')
      }
    })

    emailInput.addEventListener('input', function () {
      if (emailInput.classList.contains('contact__input--error')) {
        emailInput.classList.remove('contact__input--error')
        errorSpan.setAttribute('hidden', '')
      }
    })
  }
})()
