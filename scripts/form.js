document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("feedbackForm");
  const fileInput = document.getElementById("file");
  const filePreviews = document.getElementById("filePreviews");
  const submitButton = document.getElementById("submitButton");
  const messageContainer = document.getElementById("messageContainer");

  let selectedFiles = [];

  fileInput.addEventListener("change", function (e) {
    const files = Array.from(this.files);

    files.forEach((file) => {
      if (
        !selectedFiles.some((f) => f.name === file.name && f.size === file.size)
      ) {
        selectedFiles.push(file);
      }
    });

    updateFilePreviews();
  });

  function updateFilePreviews() {
    filePreviews.innerHTML = "";

    selectedFiles.forEach((file, index) => {
      const filePreview = document.createElement("div");
      filePreview.className = "file-preview";

      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.alt = file.name;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "file-preview-remove";
      removeBtn.innerHTML = "×";
      removeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        selectedFiles.splice(index, 1);
        updateFilePreviews();
      });

      filePreview.appendChild(img);
      filePreview.appendChild(removeBtn);
      filePreviews.appendChild(filePreview);
    });
  }

  function setButtonState(state) {
    submitButton.classList.remove("loading-state", "success-state");

    if (state === "loading") {
      submitButton.classList.add("loading-state");
      submitButton.innerHTML =
        '<span class="loading-spinner"></span> Идёт отправка';
      submitButton.disabled = true;
    } else if (state === "success") {
      submitButton.classList.add("success-state");
      submitButton.innerHTML = "Отправлено";
      submitButton.disabled = true;

      setTimeout(() => {
        setButtonState("normal");
      }, 3000);
    } else {
      submitButton.innerHTML = "Отправить";
      submitButton.disabled = false;
    }
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const city = document.getElementById("city").value.trim();

    if (!name || !phone || !city) {
      showMessage("Пожалуйста, заполните все обязательные поля", "error");
      return;
    }

    for (const file of selectedFiles) {
      if (file.size > 10 * 1024 * 1024) {
        showMessage(
          `Файл "${file.name}" слишком большой. Максимальный размер: 10MB`,
          "error"
        );
        return;
      }
    }

    if (selectedFiles.length > 10) {
      showMessage("Максимальное количество файлов: 10", "error");
      return;
    }

    setButtonState("loading");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("city", city);
      formData.append(
        "comment",
        document.getElementById("comment").value.trim()
      );

      selectedFiles.forEach((file) => {
        formData.append("files[]", file);
      });

      const response = await fetch("form.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        form.reset();
        selectedFiles = [];
        updateFilePreviews();
        setButtonState("success");
      } else {
        showMessage(result.message, "error");
        setButtonState("normal");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      showMessage(
        "Произошла ошибка при отправке формы. Попробуйте еще раз.",
        "error"
      );
      setButtonState("normal");
    }
  });

  function showMessage(text, type) {
    if (messageContainer && type === "error") {
      messageContainer.innerHTML = `<div class="message ${type}">${text}</div>`;

      setTimeout(() => {
        if (messageContainer) {
          messageContainer.innerHTML = "";
        }
      }, 5000);
    }
  }
});
