// Entrada inicial
gsap.to(".overlay", {
  duration: 5.5,
  y: "-100%",
  ease: "power4.inOut",
  delay: 2
});

// Registramos el plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
// Fade in de secciones al hacer scroll
document.querySelectorAll(".fade-in").forEach(section => {
  gsap.fromTo(section, {
    opacity: 0,
    y: 50
  }, {
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none none"
    },
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power2.out"
  });
});
let lastScrollTop = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", function () {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    // Bajando
    header.style.top = "-100px"; // Oculta
  } else {
    // Subiendo
    header.style.top = "0"; // Muestra
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

(function () {

    const link = document.querySelectorAll('nav > .hover-this');
    const cursor = document.querySelector('.cursor');

    const animateit = function (e) {
          const span = this.querySelector('span');
          const { offsetX: x, offsetY: y } = e,
          { offsetWidth: width, offsetHeight: height } = this,

          move = 25,
          xMove = x / width * (move * 2) - move,
          yMove = y / height * (move * 2) - move;

          span.style.transform = `translate(${xMove}px, ${yMove}px)`;

          if (e.type === 'mouseleave') span.style.transform = '';
    };

    const editCursor = e => {
          const { clientX: x, clientY: y } = e;
          cursor.style.left = x + 'px';
          cursor.style.top = y + 'px';
    };

    link.forEach(b => b.addEventListener('mousemove', animateit));
    link.forEach(b => b.addEventListener('mouseleave', animateit));
    window.addEventListener('mousemove', editCursor);

})();
