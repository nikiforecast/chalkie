import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EditorApp from './EditorApp';
import DesignSystemPage from './pages/DesignSystemPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="*" element={<EditorApp />} />
      </Routes>
    </BrowserRouter>
  );
}
