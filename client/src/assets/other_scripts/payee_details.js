const cancelledCheque = document.querySelector(".pd-form-section input");
console.log(cancelledCheque.value);

function viewFile() {
  console.log(cancelledCheque.value);
}

function removeFile() {
  cancelledCheque.value = "";
}

// const dropArea = document.querySelectorAll(".pd-form-section label");

// dropArea.onclick = () => {
//   cancelledCheque.click();
// };
