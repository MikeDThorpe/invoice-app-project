function deleteInvoiceItemRow(rowId) {
  let row = document.getElementById(rowId);
  row.remove();
}
let invoiceItems = 1;

function createNewInvoiceItem() {
  invoiceItems++;

  const newItemRowContainer = document.createElement("div");
  newItemRowContainer.setAttribute("id", `row-${invoiceItems}`);
  newItemRowContainer.classList.add("border-bottom");
  newItemRowContainer.classList.add("py-3");

  const newItemRow = document.createElement("div");
  newItemRow.classList.add("form-group");
  newItemRow.classList.add("row");

  for (let i = 0; i < 3; i++) {
    let input = document.createElement("input");
    input.classList.add("form-control");
    input.setAttribute("required", true);
    if (i === 0) {
      input.placeholder = "New Item";
      input.type = "text";
      input.name = `items[${invoiceItems}][name]`;
    }
    if (i === 1) {
      input.placeholder = "Qty";
      input.type = "text";
      input.value = "1";
      input.name = `items[${invoiceItems}][qty]`;
    }
    if (i === 2) {
      input.placeholder = "Price";
      input.type = "text";
      input.value = "0.00";
      input.name = `items[${invoiceItems}][price]`;
    }
    let inputContainer = document.createElement("div");
    let inputContainerClasses = ["col-xs-12", "col-sm-4", "my-2"];
    inputContainer.classList.add(...inputContainerClasses);
    inputContainer.appendChild(input);
    newItemRow.appendChild(inputContainer);
  }

  newItemRowContainer.appendChild(newItemRow);

  let deleteWord = document.createElement("p");
  deleteWord.innerHTML = "Delete item";
  deleteWord.classList.add("font-weight-bold");
  deleteWord.classList.add("ms-2");
  deleteWord.setAttribute(
    "onClick",
    `deleteInvoiceItemRow("row-${invoiceItems}")`
  );
  newItemRowContainer.appendChild(deleteWord);

  let refNode = undefined;
  const itemTable = document.getElementById("new-invoice-item-list");
  itemTable.insertBefore(newItemRowContainer, refNode);
}