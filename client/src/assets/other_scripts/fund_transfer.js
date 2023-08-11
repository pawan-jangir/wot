const toggler = document.querySelector(".toggler");
const toggleContainer = document.querySelector(".toggler_circle_container");

toggleContainer.addEventListener("click", () => {
  toggler.classList.toggle("on");
  if (toggler.classList.contains("on")) {
    toggleContainer.style.justifyContent = "flex-end";
  } else {
    toggleContainer.style.justifyContent = "flex-start";
  }
});
