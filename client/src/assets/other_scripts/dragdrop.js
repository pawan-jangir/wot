const dropAreas = document.querySelectorAll(".drop_box");

dropAreas.forEach((dropArea) => {
  const button = dropArea.lastElementChild;
  const input = dropArea.children[1];
  // console.log(button, input);
  button.onclick = () => {
    input.click();
  };

  input.addEventListener("change", function (e) {
    var fileName = e.target.files[0].name;
    let filedata = `
      <form action="" method="post">
      <div class="form">
      <h4>${fileName}</h4>
  
      <button class="btn">Upload</button>
      </div>
      </form>`;
    dropArea.innerHTML = filedata;
  });
});
