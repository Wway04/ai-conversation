# Frontend - Backend Integration Plan

This plan outlines the steps to connect the Metronic-based React frontend to the NestJS backend, enabling real-time COD risk assessment and the AI Risk Advisor features.

## Proposed Changes

### 1. Configuration & Environment
#### [MODIFY] [.env](file:///Users/kenn/kltn/cod-risk-advisor/.env)
- Add `VITE_APP_API_URL=http://localhost:8888/api/v1` to point to the local NestJS backend.

### 2. Authentication Integration
#### [MODIFY] [supabase-provider.tsx](file:///Users/kenn/kltn/cod-risk-advisor/src/auth/providers/supabase-provider.tsx)
- Replace mock logic with real `axios` calls to the NestJS backend.
- **login**: Call `POST /auth/login`, store `accessToken` and `refreshToken`.
- **getUser**: Call `GET /auth/me` to populate the user context.
- **logout**: Clear tokens and state.

### 3. API Layer
#### [MODIFY] [endpoints.js](file:///Users/kenn/kltn/cod-risk-advisor/src/pages/orders/api/endpoints.js)
- Update paths to match NestJS controllers:
  - `list`: `/orders`
  - `byId`: `/orders/:id`
  - Add `stats`: `/orders/stats`
  - Add `riskAssessment`: `/risk/orders/:id`
  - Add `signals`: `/risk/orders/:id/signals`

#### [MODIFY] [index.js](file:///Users/kenn/kltn/cod-risk-advisor/src/pages/orders/api/index.js)
- Update axios interceptors or individual methods to extract data from the `{ success, data }` wrapper.

### 4. Dashboard Implementation
#### [MODIFY] [DashboardPage.jsx](file:///Users/kenn/kltn/cod-risk-advisor/src/pages/dashboards/DashboardPage.jsx)
- Replace `mock-dashboard-data.js` usage with a new `useDashboardData` hook.
- Implement fetching from `/dashboard/overview` and `/dashboard/trends`.

### 5. Order Table Enhancements
#### [MODIFY] [column-defs.jsx](file:///Users/kenn/kltn/cod-risk-advisor/src/pages/orders/blocks/components/order-table/columns/column-defs.jsx)
- **[NEW]** `riskScoreColumn`: Displays risk score as a percentage with a progress bar or colored text.
- **[NEW]** `riskLevelColumn`: Displays a colored badge (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).

### 6. Risk Advisor Features
#### [NEW] [RiskAdvisorPanel.jsx](file:///Users/kenn/kltn/cod-risk-advisor/src/pages/orders/blocks/components/RiskAdvisorPanel.jsx)
- A side panel or section in order details showing:
  - Risk score gauge.
  - List of behavioral signals (e.g., "Frequent address changes").
  - AI-generated recommendations.

#### [NEW] [RiskChatAdvisor.jsx](file:///Users/kenn/kltn/cod-risk-advisor/src/pages/orders/blocks/components/RiskChatAdvisor.jsx)
- A conversational interface that allows the seller to ask: "Why is this order risky?" or "Should I ship this?".
- Connects to `POST /chat/sessions/:id/messages`.

## Verification Plan

### Automated Tests
- Run `npm run build` in the frontend to ensure no TypeScript/linting breakages.

### Manual Verification
1. **Login**: Verify that logging in with `seller@demo.com` / `demo123` works and redirects to the dashboard.
2. **Dashboard**: Confirm the charts show the seeded data (300 orders, risk distribution).
3. **Order List**: Check the new "Risk" columns for correct values and colors.
4. **Risk Advisor**: Open an order and verify the signals and AI recommendations match the seeded data.
5. **Chat**: Send a message in the advisor chat and verify a response from the NestJS `StubChatAI`.
