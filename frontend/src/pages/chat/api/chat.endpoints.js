const chatEndpoints = {
  sessions: () => '/chat/sessions',
  sessionById: (sessionId) => `/chat/sessions/${sessionId}`,
  messages: (sessionId) => `/chat/sessions/${sessionId}/messages`,
  renameSession: (sessionId) => `/chat/sessions/${sessionId}/rename`,
  pinSession: (sessionId) => `/chat/sessions/${sessionId}/pin`,
};

export default chatEndpoints;
