import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Navbar, Footer  } from './Pages/Layout'
import { Home } from './Pages/Home'
import { Products } from './Pages/Products'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Products' element={<Products/>}/>
      </Routes>
    <Footer/>
    </BrowserRouter>
    {/* <Navbar/>
    <Home/>
    <Products/>
    <Footer/> */}
    </>
  ) 
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
