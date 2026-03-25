import api from '@/api/axios';
import chatEndpoints from './chat.endpoints';

// ── Sessions ──────────────────────────────────────────

export const getSessions = () =>
  api.get(chatEndpoints.sessions());

export const createSession = (title) =>
  api.post(chatEndpoints.sessions(), { title });

export const getSessionById = (id) =>
  api.get(chatEndpoints.sessionById(id));

export const renameSession = (id, title) =>
  api.patch(chatEndpoints.renameSession(id), { title });

export const deleteSession = (id) =>
  api.delete(chatEndpoints.sessionById(id));

export const togglePinSession = (id) =>
  api.patch(chatEndpoints.pinSession(id));

// ── Messages ──────────────────────────────────────────

export const sendMessage = (sessionId, content, files = []) => {
  const form = new FormData();
  form.append('content', content);
  files.forEach((f) => form.append('files', f));
  return api.post(chatEndpoints.messages(sessionId), form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
