// change paid status of invoice
let setPaidStatusButton = document.getElementsByClassName(
  "mark-paid-status-button"
);
for (let i = 0; i < setPaidStatusButton.length; i++) {
  setPaidStatusButton[i].addEventListener("click", async () => {
    const urlPaths = window.location.pathname.split("/");
    const id = urlPaths[urlPaths.length - 1];
    try {
      const { data } = await axios({
        url: `http://localhost:3001/api/invoices/edit/${id}?changePaid=true`,
        method: "put",
      });
      const paidToken = document.getElementById("paid-status-token");
      const paidTokenText = document.querySelector(".paid-status-token > p");

      if (data.paid) {
        paidToken.classList.remove("pending");
        paidToken.classList.add("paid");
        paidTokenText.textContent = "Paid";
        setPaidStatusButton[0].textContent = "Mark Pending";
      } else {
        paidToken.classList.remove("paid");
        paidToken.classList.add("pending");
        paidTokenText.textContent = "Pending";
        setPaidStatusButton[0].textContent = "Mark Paid";
      }
    } catch (err) {
      console.error(err);
    }
  });
}
// filter invoices from dropdown
let invoiceFilter = document.getElementById("invoice-all-filter");
invoiceFilter.addEventListener("change", async (e) => {
  const filter = e.target.value;
  if (filter === "all") {
    loadInvoices();
    searchInvoiceBar.classList.remove("d-none");
    return;
  } else {
    searchInvoiceBar.classList.add("d-none");
    searchInvoiceBar.value = "";
  }
  try {
    const { data: invoices } = await axios({
      url: `http://localhost:3001/api/invoices/all?filter=${filter}`,
      method: "get",
    });
    manageInvoiceDisplay(invoices);
  } catch (err) {
    console.error(err);
  }
});
// load invoices from database using API
const loadInvoices = async () => {
  try {
    const { data: invoices } = await axios({
      url: "http://localhost:3001/api/invoices/all",
      method: "get",
    });
    manageInvoiceDisplay(invoices);
  } catch (err) {
    console.error(err);
  }
};
// create invoice HTML with api Data
const manageInvoiceDisplay = (invoiceArr) => {
  let invoiceCardContainer = document.getElementById("invoice-cards-container");
  const noInvoiceGraphic = document.getElementById("no-invoice-graphic");
  noInvoiceGraphic.classList.add("d-none");
  if (invoiceArr.length === 0) {
    noInvoiceGraphic.classList.add("d-flex");
    noInvoiceGraphic.classList.remove("d-none");
    invoiceCardContainer.innerHTML = "";
    return;
  }
  const paidToken = `
  <div class="paid paid-status-token">
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
      fill="currentColor"
      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"
    ></path>
  </svg>
  <p>Paid</p>
  </div>`;
  const pendingToken = `
  <div class="pending paid-status-token">
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
      fill="currentColor"
      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"
    ></path>
  </svg>
  <p>Pending</p>
  </div>`;
  const invoiceCards = invoiceArr
    .map((invoice) => {
      return `<a href="/invoices/${invoice._id}">
          <article class="mt-4 p-3 index-invoice-card paid-${invoice.paid}">
            <div class="mb-2 d-flex flex-wrap justify-content-between align-items-center">
              <div>
                <p>
                  <strong>#57E7H5</strong>
                </p>
                <p>Due ${String(invoice.invoiceDate).slice(0, 10)}</p>
              </div>
              <p>${invoice.clientName}</p>
            </div>
            <div class="d-flex flex-wrap justify-content-between align-items-center">
              <h5>£${invoice.invoiceTotal}</h5>
              ${invoice.paid ? paidToken : pendingToken}
            </div>
          </article>
        </a>`
        ;
    })
    .join("");
  invoiceCardContainer.innerHTML = invoiceCards;
};
// search invoices by client name using search input field
let searchInvoiceBar = document.getElementById("invoice-search-bar");
searchInvoiceBar.addEventListener("input", async (e) => {
  const searchValue = e.target.value;
  if (!searchValue) {
    loadInvoices();
    return;
  }
  try {
    const { data: invoices } = await axios({
      url: `http://localhost:3001/api/invoices/all?clientName=${searchValue}`,
      method: "get",
    });
    manageInvoiceDisplay(invoices);
  } catch (err) {
    console.error(err);
  }
});

loadInvoices();