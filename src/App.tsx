import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import { HomePage } from './pages/HomePage';
import { EditorPage } from './pages/EditorPage';

export default function App() {
  return (
    <ResumeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </Router>
    </ResumeProvider>
  );
}
