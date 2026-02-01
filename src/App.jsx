import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AppShell from './AppShell';

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
