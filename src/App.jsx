import { HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Schedule from './pages/Schedule';

function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/schedule" element={<Schedule />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
