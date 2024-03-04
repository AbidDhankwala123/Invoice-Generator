import React from 'react'
import { useNavigate } from 'react-router-dom';
import styles from "./PdfInvoice.module.css"


const PdfInvoice = ({ invoiceData, handleDownload }) => {
  let navigate = useNavigate();
  const invoiceTitle = "INVOICE GENERATOR";
  const logoSrc =
    "https://levitation.in/wp-content/uploads/2023/04/levitation-Infotech.png";
  const productList = invoiceData.products;
  const totalAmount = invoiceData.totalAmount;
  const grandTotal = invoiceData.grandTotal;
  return (
    <div className={styles.invoiceContainer}>
      <header className={styles.invoiceHeader}>
        <h1 className={styles.title} >{invoiceTitle}</h1>
        <div className={styles.logo}>
          <img className={styles.logoImage} src={logoSrc} alt="logo" />
        </div>
      </header>
      <main className={styles.invoiceMain}>
        <table className={styles.invoiceTable}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Product</th>
              <th className={styles.tableHeader}>Qty</th>
              <th className={`${styles.tableHeader} ${styles.rateCol}`}>Rate</th>
              <th className={styles.tableHeader}>Total</th>
            </tr>
          </thead>

          <tr className={styles.lineRow}>
            <td colPpan="5" className={styles.line}></td>
          </tr>
          <tbody>
            {productList.map((product, index) => {
              return (
                <tr key={index}>
                  <td className={styles.tableData}>{product.name}</td>
                  <td className={styles.tableData}>{product.quantity}</td>
                  <td className={styles.tableData}>{product.rate}</td>
                  <td className={styles.tableData}>{product.total}</td>
                </tr>
              )
            })}
          </tbody>
          <tr className={styles.lineRow}>
            <td colSpan="5" className={styles.line}></td>
          </tr>
        </table>
        <div className={styles.invoiceSummary}>
          <div className={styles.total}>
            <div>Total</div>
            <div>INR {totalAmount}</div>
          </div>
          <div className={styles.gst} >
            <div>GST</div>
            <div>18%</div>
          </div>
          <div className={styles.grandline}> </div>
          <div className={styles.grandTotal}>
            <div>Grand Total</div>
            <div>INR {grandTotal}</div>

          </div>
          <div className={styles.grandline}> </div>
        </div>
      </main>
      <footer className={styles.invoiceFooter}>
        <p className={styles.validity}>
          Valid Until: <span className="text-slate-600">12/04/23</span>
        </p>
        <p className={styles.tnc}>
          Terms and Conditions:
          <br /> We are happy to supply any further information you may need and
          trust that you call on us to fill your order, which will receive our
          prompt and careful attention.
        </p>
      </footer>
      <div className='mt-2'>
        <button className='bg-green-800 text-white rounded-lg h-9 w-24 cursor-pointer' onClick={() => navigate("/addProduct")}>Back</button>
        <button className='bg-green-800 text-white rounded-lg h-9 w-1/6 absolute right-4 cursor-pointer' onClick={() => handleDownload(invoiceData)}>Download</button>
      </div>
    </div>
  )
}

export default PdfInvoice
