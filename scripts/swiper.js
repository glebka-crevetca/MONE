const swiper = new Swiper(".swiper", {
  direction: "horizontal",
  loop: true,
  slidesPerView: "auto",
  spaceBetween: 30,

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});



let currentImageIndex = 0;
let imageSources = [];

function collectImageSources() {
  imageSources = [];
  document
    .querySelectorAll(".swiper-slide img")
    .forEach((img) => {
      imageSources.push(img.src);
    });
}

function openModal(index) {
  if (window.innerWidth <= 440) return;

  collectImageSources();
  currentImageIndex = index;

  const modal = document.getElementById("sliderModal");
  const modalImage = document.getElementById("modalImage");

  modalImage.src = imageSources[currentImageIndex];
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("sliderModal");
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % imageSources.length;
  document.getElementById("modalImage").src = imageSources[currentImageIndex];
}

function showPrevImage() {
  currentImageIndex =
    (currentImageIndex - 1 + imageSources.length) % imageSources.length;
  document.getElementById("modalImage").src = imageSources[currentImageIndex];
}

document
  .querySelectorAll(".swiper-slide")
  .forEach((slide, index) => {
    slide.style.cursor = "pointer";

    slide.addEventListener("click", () => {
      openModal(index);
    });
  });

document.querySelector(".close-modal").addEventListener("click", closeModal);
document.querySelector(".modal-prev").addEventListener("click", showPrevImage);
document.querySelector(".modal-next").addEventListener("click", showNextImage);

document.getElementById("sliderModal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("sliderModal");
  if (!modal.classList.contains("active")) return;

  if (e.key === "ArrowLeft") {
    showPrevImage();
  } else if (e.key === "ArrowRight") {
    showNextImage();
  }
});
