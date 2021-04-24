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
// filter invoices from dropdown
let invoiceFilter = document.getElementById("invoice-all-filter");
invoiceFilter.addEventListener("change", async (e) => {
  const filter = e.target.value;
  try {
    const { data: invoices } = await axios({
      url: `http://localhost:3001/api/all?filter=${filter}`,
      method: "get",
    });
    manageInvoiceDisplay(invoices);
  } catch (err) {
    console.error(err);
  }
});

const loadInvoices = async () => {
  try {
    const { data: invoices } = await axios({
      url: "http://localhost:3001/api/all",
      method: "get",
    });
    manageInvoiceDisplay(invoices);
  } catch (err) {
    console.error(err);
  }
};
const manageInvoiceDisplay = (invoiceArr) => {
  let invoiceCardContainer = document.getElementById("invoice-cards-container");
  const noInvoiceGraphic = document.getElementById("no-invoice-graphic");
  noInvoiceGraphic.classList.add("d-none");
  if (invoiceArr.length === 0) {
    noInvoiceGraphic.classList.add("d-flex");
    noInvoiceGraphic.classList.remove("d-none");
    invoiceCardContainer.innerHTML = ""
    return;
  }
  const paidToken = `
  <div class="paid">
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="circle"
      class="svg-inline--fa fa-circle fa-w-16"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      >
      <path
      fill="##33D69F"
      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"
    ></path>
  </svg>
  Paid
  </div>`;
  const pendingToken = `
  <div class="pending">
    <svg
    focusable="false"
    aria-hidden="true"
    data-prefix="fas"
    data-icon="circle"
    class="svg-inline--fa fa-circle fa-w-16"
    role="img"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/>
    <path
      fill="#FF8F00"
      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"
    ></path>
  </svg>
  Pending
  </div>`;
  const invoiceCards = invoiceArr
    .map((invoice) => {
      return `
      <a href="/invoices/${invoice._id}">
        <article class="mt-5 p-3 index-invoice-card paid-${invoice.paid}%>">
          <div class="mb-2 d-flex flex-wrap justify-content-between align-items-center">
            <div>
              <p><strong>#57E7H5</strong></p>
              <p>Due ${String(invoice.invoiceDate).slice(0, 10)}</p>
            </div>
            <p>${invoice.clientName}</p>
          </div>
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <h5>£${invoice.invoiceTotal}</h5>
            ${invoice.paid ? paidToken : pendingToken}
          </div>
        </article>
        </a>
    `;
    })
    .join();
  invoiceCardContainer.innerHTML = invoiceCards;
};

loadInvoices();
