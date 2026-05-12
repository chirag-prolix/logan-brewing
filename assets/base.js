function scrollAnimation() {

  if (window.innerWidth < 768) return;

  const elements = document.querySelectorAll('.js-scroll');
  const windowHeight = window.innerHeight;

  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();


    if (rect.top < windowHeight - 80 && rect.bottom > 0) {

      if (!el.classList.contains('active')) {

        el.classList.remove('scrolled');

        void el.offsetWidth;

        el.classList.add('scrolled', 'active');
      }

    } 
    else if (rect.top > windowHeight) {
      el.classList.remove('active');
    }

  });
}

window.addEventListener('scroll', scrollAnimation);
window.addEventListener('load', scrollAnimation);