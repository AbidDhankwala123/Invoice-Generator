import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import AddProduct from "./pages/AddProduct/AddProduct"
import InvoiceHistory from "./pages/InvoiceHistory/InvoiceHistory"
import PdfInvoice from "./pages/PdfInvoice/PdfInvoice"
import { useState } from "react"
import { saveAs } from 'file-saver';
import axios from "axios";

function App() {
  const [invoiceData, setInvoiceData] = useState("");

  const handleDownload = (invoice) => {
    axios.post(`${import.meta.env.VITE_APP_BACKEND_URL_FOR_PRODUCTS}/create-pdf`, {invoice},
        {
            headers:
            {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwtToken")
            }
        }
    )
        .then(() => axios.get(`${import.meta.env.VITE_APP_BACKEND_URL_FOR_PRODUCTS}/fetch-pdf`, 
            {
                responseType: 'blob',
                headers:
            {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwtToken")
            }
        }
            ))
        .then((res) => {
            console.log("res= ",res);
            const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
            saveAs(pdfBlob, 'invoice.pdf')

        })
        .catch(error => {
          console.error("Error downloading invoice:", error);
          // Handle error here
      });

}

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/addProduct" element={<AddProduct setInvoiceData={setInvoiceData}/>}/>
          <Route path="/invoiceHistory" element={<InvoiceHistory handleDownload={handleDownload} setInvoiceData={setInvoiceData} invoiceData={invoiceData} />}/>
          <Route path="/pdfInvoice" element={<PdfInvoice invoiceData={invoiceData} handleDownload={handleDownload}  />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
