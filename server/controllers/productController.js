const Invoice = require("../models/product");
const puppeteer = require("puppeteer");
// const pdfTemplate = require('../documents/index');
const pdf = require('html-pdf');
const path = require('path');

//Get All Products
const getAllInvoicesByUserId = async (req, res, next) => {
    try {
        const { ownerId } = req.params;

        //Get All Products
        const invoices = await Invoice.find({ ownerId }).sort({ createdAt: 1 });

        res.status(200).json({
            status: "SUCCESS",
            invoices
        });
    } catch (error) {
        console.log(error);
        res.status(400);
        return next(new Error(error.message));
    }
};

//Create product
const createInvoice = async (req, res, next) => {
    try {
        const { ownerId, products, totalAmount, grandTotal } = req.body;

        const newInvoice = await Invoice.create({ ownerId, products, totalAmount, grandTotal });

        // const browser = await puppeteer.launch();
        // const page = await browser.newPage();

        // // Read the styles from an external CSS file

        // // Dynamic content
        // const invoiceTitle = "INVOICE GENERATOR";
        // const logoSrc = "https://levitation.in/wp-content/uploads/2023/04/levitation-Infotech.png";

        res.status(200).json({
            message: "Invoice created successfully",
            newInvoice
        })
    } catch (error) {
        console.log(error);
        res.status(400);
        return next(new Error(error.message));
    }
}
const createPDf = (req, res, next) => {
    try {
        const invoiceTitle = "INVOICE GENERATOR";
        const logoSrc =
            "https://levitation.in/wp-content/uploads/2023/04/levitation-Infotech.png";


        const { invoice } = req.body;
        console.log("------------------------------------");
        // console.log("invoice= ",invoice);
        const productList = invoice.products;
        const totalAmount = invoice.totalAmount;
        const grandTotal = invoice.grandTotal;
        const pdfTemplate = `
<html>
  <head>
     <style>
html {
-webkit-print-color-adjust: exact;
}
    body,
html {
min-height: 100vh;
margin : 2rem;
}

.invoiceContainer {
display: flex;
flex-direction: column;
width : 100%;
min-height: 85vh;
font-size : 1.5rem;
}

.invoiceHeader {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 5rem;
}

.title {
font-size: 1.5rem;
font-weight: bold;
}

.invoiceMain {
flex-grow: 1;
}

.invoiceTable {
text-align: left;
}

tbody {
margin-top: 20px;
}


.invoiceSummary {
display: flex;
flex-direction: column;
align-items: flex-end;
margin-top: 20px; /* Adjust the margin as needed */
}

.invoiceSummary div {
display: flex;
align-items: flex-end;
gap: 2rem;
width: 20rem;
justify-content: flex-end;
}
.grandline {
width: 16rem;
background: gray;
height : 1px;
}
.gst {
color: gray;
}

.invoiceFooter {
margin-top: auto;
position: relative;
}
.validity {
position: absolute;
left: 0;
bottom: 14rem;
}
.logo-image {
width : 200px;
height : 72px;
}
.tnc {
background: black;
color: lightgray;
padding: 1rem 5rem;
margin: auto;
text-align: left;
border-radius: 72px 72px;
font-size : 15px;
}
.line {
width: 250%;  
background: gray;
height : 0.1px;
}

.tableData{
font-size: 1.2rem;
max-width: 200px; /* Adjust the maximum width as needed */
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
word-wrap: break-word; /* Add this line */
margin : 10px;
padding : 10px;
}

.rateCol{
min-width : 100px;
}
</style>
  </head>
  <body>
    <div class="invoiceContainer">
      <header class="invoiceHeader">
        <h1 class="title">${invoiceTitle}</h1>
        <div class="logo">
          <img class="logo-image" src="${logoSrc}" alt="logo" />
        </div>
      </header>
      <main class="invoiceMain">
        <table class="invoiceTable">
          <thead>
            <tr>
              <th class="tableHeader">Product</th>
              <th class="tableHeader">Qty</th>
              <th class="tableHeader rateCol">Rate</th>
              <th class="tableHeader">Total</th>
            </tr>
          </thead>

        <tr class="line-row">
            <td colspan="5" class="line"></td>
          </tr>
          <tbody>
            ${productList
                .map(
                    (product, index) =>
                        `
    <tr key=${index}>
                <td class="tableData">${product.name}</td>
                <td class="tableData">${product.quantity}</td>
                <td class="tableData">${product.rate}</td>
                <td class="tableData">${product.total}</td>
              </tr>`,
                )
                .join("")}
          </tbody>
          <tr class="line-row">
            <td colspan="5" class="line"></td>
         </tr>
        </table>
        <div class="invoiceSummary">
          <div class="total">
            <div>Total</div>
            <div>INR ${totalAmount}</div>
          </div>
          <div class="gst">
            <div>GST</div>
            <div>18%</div>
          </div>
          <div class="grandline"> </div>
          <div class="grandTotal">
            <div>Grand Total</div>
            <div>INR ${grandTotal}</div>

          </div>
          <div class="grandline"> </div>
        </div>
      </main>
      <footer class="invoiceFooter">
        <p class="validity">
          Valid Until: <span class="text-slate-600">12/04/23</span>
        </p>
        <p class="tnc">
          Terms and Conditions:
          <br /> We are happy to supply any further information you may need and
          trust that you call on us to fill your order, which will receive our
          prompt and careful attention.
        </p>
      </footer>
    </div>
  </body>
</html>
    
`
        // console.log("Create pdf");
        // console.log(pdfTemplate);

        pdf.create(pdfTemplate, {}).toFile('./invoice.pdf', (error) => {
            if (error) {
                console.log('error');
                res.status(400);
                return next(new Error(error.message));
            }
            res.send(Promise.resolve())
        });
    } catch (error) {
        console.log(error);
        res.status(400);
        return next(new Error(error.message));
    }

}

const fetchPdf = (req, res, next) => {
    const filePath = path.join(__dirname, '../invoice.pdf');
    console.log(filePath);
    res.sendFile(filePath);
}


module.exports = { createInvoice, getAllInvoicesByUserId, createPDf, fetchPdf }
