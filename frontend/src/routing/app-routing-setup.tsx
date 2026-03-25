import { ErrorRouting } from '@/errors/error-routing';
import { ChatPage } from '@/pages/chat';
import { Navigate, Route, Routes } from 'react-router';

export function AppRoutingSetup() {
  return (
    <Routes>
      {/* Full-screen, no layout wrapper */}
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route path="/chat" element={<ChatPage />} />

      <Route path="error/*" element={<ErrorRouting />} />
      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  );
}
