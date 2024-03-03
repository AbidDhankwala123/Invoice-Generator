import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import AddProduct from "./pages/AddProduct/AddProduct"
import InvoiceHistory from "./pages/InvoiceHistory/InvoiceHistory"
import PdfInvoice from "./pages/PdfInvoice/PdfInvoice"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/addProduct" element={<AddProduct/>}/>
          <Route path="/invoiceHistory" element={<InvoiceHistory/>}/>
          <Route path="/pdfInvoice" element={<PdfInvoice/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
