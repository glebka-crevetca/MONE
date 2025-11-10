document.addEventListener("DOMContentLoaded", function () {
  const burger = document.querySelector(".burger");
  const mobileMenu = document.querySelector(".mobile-menu");

  function closeMenu() {
    if (burger) burger.classList.remove("active");
    if (mobileMenu) mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      this.classList.toggle("active");
      mobileMenu.classList.toggle("active");
      document.body.style.overflow = mobileMenu.classList.contains("active")
        ? "hidden"
        : "";
    });

    const menuLinks = mobileMenu.querySelectorAll("a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    mobileMenu.addEventListener("click", function (e) {
      if (e.target === mobileMenu) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
        closeMenu();
      }
    });
  }

  if (window.location.hash) {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }
});