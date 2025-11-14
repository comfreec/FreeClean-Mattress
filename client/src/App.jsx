import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ApplicationPage from './pages/ApplicationPage';
import BoardPage from './pages/BoardPage';
import BoardWritePage from './pages/BoardWritePage';
import BoardDetailPage from './pages/BoardDetailPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/application" element={<ApplicationPage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/board/write" element={<BoardWritePage />} />
            <Route path="/board/:id" element={<BoardDetailPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
