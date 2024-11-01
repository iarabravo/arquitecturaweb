const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");
const toggleSwitch = document.getElementById("color-toggle");
const body = document.body;
const aboutContainer = document.querySelector(".about__container");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});
navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});
const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};
// header container
ScrollReveal().reveal(".header__container p", {
  ...scrollRevealOption,
});
ScrollReveal().reveal(".header__container h1", {
  ...scrollRevealOption,
  delay: 500,
});
// about container
ScrollReveal().reveal(".about__image img", {
  ...scrollRevealOption,
  origin: "left",
});
ScrollReveal().reveal(".about__content .section__subheader", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".about__content .section__header", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".about__content .section__description", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".about__btn", {
  ...scrollRevealOption,
  delay: 2000,
});
// room container
ScrollReveal().reveal(".room__card", {
  ...scrollRevealOption,
  interval: 500,
});
// service container
ScrollReveal().reveal(".service__list li", {
  ...scrollRevealOption,
  interval: 500,
  origin: "right",
});

toggleSwitch.addEventListener("change", () => {
  if (toggleSwitch.checked) {
    // Tema oscuro
    body.style.backgroundColor = "#202020"; // Fondo negro
    body.style.color = "#FFFFFF"; // Texto blanco
    aboutContainer.style.backgroundColor = "#202020"; // Fondo negro para About

    // Cambiar color de los enlaces
    document.querySelectorAll('nav a').forEach(link => {
      link.style.color = "#FFFFFF"; // Enlaces blancos
    });
    
    // Cambiar color de los textos en about
    aboutContainer.style.color = "#FFFFFF"; // Texto blanco en About

  } else {
    // Tema claro
    body.style.backgroundColor = "#FFFFFF"; // Fondo blanco
    body.style.color = "#000000"; // Texto negro
    aboutContainer.style.backgroundColor = ""; // Fondo original para About

    // Cambiar color de los enlaces
    document.querySelectorAll('nav a').forEach(link => {
      link.style.color = "#000000"; // Enlaces negros
    });
    
    // Cambiar color de los textos en about
    aboutContainer.style.color = ""; // Texto original en About
  }
});