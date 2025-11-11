document.addEventListener("DOMContentLoaded", function () {
  const slidesData = [
    { src: "media/img/main-page/slider-photo-1.png", alt: "" },
    { src: "media/img/main-page/slider-photo-2.png", alt: "" },
    { src: "media/img/main-page/slider-photo-3.png", alt: "" },
    { src: "media/img/main-page/slider-photo-4.png", alt: "" },
    { src: "media/img/main-page/slider-photo-5.png", alt: "" },
    { src: "media/img/main-page/slider-photo-6.png", alt: "" },
    { src: "media/img/main-page/slider-photo-7.png", alt: "" },
    { src: "media/img/main-page/slider-photo-8.png", alt: "" },
    { src: "media/img/main-page/slider-photo-9.png", alt: "" },
  ];

  const sliderTrack = document.querySelector(".slider-track");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  if (!prevBtn || !nextBtn) {
    console.error("Кнопки навигации не найдены!");
    return;
  }

  let currentPosition = 0;
  let isAnimating = false;

  function initializeSlides() {
    sliderTrack.innerHTML = "";

    for (let i = -1; i < 6; i++) {
      const slide = document.createElement("div");
      const posClass = i === -1 ? "pos-prev" : `pos-${i + 1}`;
      slide.className = `slide ${posClass}`;

      const img = document.createElement("img");
      const dataIndex = (currentPosition + i + 1) % slidesData.length;
      img.src = slidesData[dataIndex].src;
      img.alt = slidesData[dataIndex].alt;

      img.onerror = function () {
        console.error("Ошибка загрузки изображения:", this.src);
      };

      slide.appendChild(img);
      sliderTrack.appendChild(slide);
    }
  }

  function nextSlide() {
    if (isAnimating) return;
    isAnimating = true;

    const slides = document.querySelectorAll(".slide");

    const newSlide = document.createElement("div");
    newSlide.className = "slide pos-next entering-right";

    const newImg = document.createElement("img");
    const newDataIndex = (currentPosition + 6) % slidesData.length;
    newImg.src = slidesData[newDataIndex].src;
    newImg.alt = slidesData[newDataIndex].alt;

    newImg.onerror = function () {
      console.error("Ошибка загрузки изображения:", this.src);
    };

    newSlide.appendChild(newImg);
    sliderTrack.appendChild(newSlide);

    const leftSlide = slides[0];
    leftSlide.classList.add("exiting-left");

    for (let i = 1; i < slides.length; i++) {
      const slide = slides[i];
      const currentPos = slide.className.match(/pos-(\w+)/)[1];

      const img = slide.querySelector("img");
      const newIndex = (currentPosition + i) % slidesData.length;
      img.src = slidesData[newIndex].src;
      img.alt = slidesData[newIndex].alt;

      if (currentPos === "1") {
        slide.classList.remove("pos-1");
        slide.classList.add("pos-prev");
      } else if (currentPos === "2") {
        slide.classList.remove("pos-2");
        slide.classList.add("pos-1");
      } else if (currentPos === "3") {
        slide.classList.remove("pos-3");
        slide.classList.add("pos-2");
      } else if (currentPos === "4") {
        slide.classList.remove("pos-4");
        slide.classList.add("pos-3");
      } else if (currentPos === "5") {
        slide.classList.remove("pos-5");
        slide.classList.add("pos-4");
      } else if (currentPos === "6") {
        slide.classList.remove("pos-6");
        slide.classList.add("pos-5");
      }
    }

    setTimeout(() => {
      if (leftSlide.parentNode) {
        leftSlide.parentNode.removeChild(leftSlide);
      }

      newSlide.classList.remove("pos-next", "entering-right");
      newSlide.classList.add("pos-6");

      currentPosition = (currentPosition + 1) % slidesData.length;
      isAnimating = false;
    }, 800);
  }

  function prevSlide() {
    if (isAnimating) return;
    isAnimating = true;

    currentPosition =
      (currentPosition - 1 + slidesData.length) % slidesData.length;

    const slides = document.querySelectorAll(".slide");

    const newSlide = document.createElement("div");
    newSlide.className = "slide pos-prev entering-left";

    const newImg = document.createElement("img");
    const newDataIndex =
      (currentPosition - 1 + slidesData.length) % slidesData.length;
    newImg.src = slidesData[newDataIndex].src;
    newImg.alt = slidesData[newDataIndex].alt;

    newImg.onerror = function () {
      console.error("Ошибка загрузки изображения:", this.src);
    };

    newSlide.appendChild(newImg);
    sliderTrack.insertBefore(newSlide, sliderTrack.firstChild);

    const rightSlide = slides[slides.length - 1];
    rightSlide.classList.add("exiting-right");

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const currentPos = slide.className.match(/pos-(\w+)/)[1];

      const img = slide.querySelector("img");
      const newIndex = (currentPosition + i) % slidesData.length;
      img.src = slidesData[newIndex].src;
      img.alt = slidesData[newIndex].alt;

      if (currentPos === "prev") {
        slide.classList.remove("pos-prev");
        slide.classList.add("pos-1");
      } else if (currentPos === "1") {
        slide.classList.remove("pos-1");
        slide.classList.add("pos-2");
      } else if (currentPos === "2") {
        slide.classList.remove("pos-2");
        slide.classList.add("pos-3");
      } else if (currentPos === "3") {
        slide.classList.remove("pos-3");
        slide.classList.add("pos-4");
      } else if (currentPos === "4") {
        slide.classList.remove("pos-4");
        slide.classList.add("pos-5");
      } else if (currentPos === "5") {
        slide.classList.remove("pos-5");
        slide.classList.add("pos-6");
      }
    }

    setTimeout(() => {
      if (rightSlide.parentNode) {
        rightSlide.parentNode.removeChild(rightSlide);
      }

      newSlide.classList.remove("entering-left");
      isAnimating = false;
    }, 800);
  }

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  initializeSlides();

  console.log("Слайдер инициализирован, кнопки подключены");
});
