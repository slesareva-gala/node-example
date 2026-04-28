const form = document.querySelector(".form-input");
const file = document.querySelector(".file");
const preview = document.querySelector(".preview");

let imageBase64 = "";

file.addEventListener("change", (event) => {
  if (event.target.files.length > 0) {
    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      imageBase64 = e.target.result;
      const src = URL.createObjectURL(event.target.files[0]);

      preview.src = src;
      preview.style.display = "block";
      console.log(imageBase64);
    });

    reader.readAsDataURL(event.target.files[0]);
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (imageBase64) {
    fetch(form.action, {
      method: "POST",
      body: JSON.stringify({ base64Data: imageBase64 }),
    });
  }
});
