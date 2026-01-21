import React, { useContext, Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Result = lazy(() => import('./pages/Result'));
const BuyCredit = lazy(() => import('./pages/BuyCredit'));
const Login = lazy(() => import('./components/Login'));

const App = () => {
  const { showLogin } = useContext(AppContext);

  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50'>
      <ToastContainer position='bottom-right' />
      <Navbar />

      {/* Lazy load Login */}
      {showLogin && (
        <Suspense fallback={<div className="text-center mt-10">Loading login...</div>}>
          <Login />
        </Suspense>
      )}

      <Suspense fallback={<div className="text-center mt-10">Loading page...</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/result' element={<Result />} />
          <Route path='/buy' element={<BuyCredit />} />
        </Routes>
      </Suspense>

      <Footer />
    </div>
  );
};

export default App;
