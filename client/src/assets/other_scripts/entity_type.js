let entityType;

function changedEntity() {
  entityType = document.querySelector(".entity-type-select");
  console.log(entityType.value);
}

function checkOptionalCIN() {
  if (entityType == "Partnership" || entityType == "Proprietor") {
    document.getElementById("business-cin").required = false;
  }
}
