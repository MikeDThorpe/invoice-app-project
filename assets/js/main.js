function createNewInvoiceItem() {
  const newItemRow = document.createElement("div");
  newItemRow.classList.add("form-group");
  newItemRow.classList.add("row");

  // loop 3 times to create 3 inputs
  for (let i = 0; i < 3; i++) {
    let input = document.createElement("input");
    input.type = "text";
    input.classList.add("form-control");
    let inputContainer = document.createElement("div");
    let inputContainerClasses = ["col-4", "mb-3"];
    inputContainer.classList.add(...inputContainerClasses);
    inputContainer.appendChild(input);
    newItemRow.appendChild(inputContainer);
  }

  let refNode = undefined;

  const itemTable = document.getElementById("new-invoice-item-list");
  itemTable.insertBefore(newItemRow, refNode);
}
