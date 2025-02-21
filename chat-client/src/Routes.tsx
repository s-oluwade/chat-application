// Routes.tsx
import { Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFoundPage';

const RoutesComponent = () => (
  <Routes>
    <Route path="/" element={<ChatPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default RoutesComponent;
