# Task: Backend Core — COD Risk Advisor

## Phase 1 — Infrastructure Setup
- [x] Tạo task.md
- [x] Khởi tạo NestJS project (`backend/`)
- [x] Tạo `docker-compose.yml` (PostgreSQL) ở root `kltn/`
- [x] Cấu hình `.env` + `.env.example`
- [x] Cài thêm dependencies (TypeORM, Passport, bcrypt, Swagger)
- [x] Cấu hình TypeORM + `app.module.ts`
- [x] Cấu hình `main.ts` (CORS, ValidationPipe, Swagger)

## Phase 2 — Database Entities & Migrations
- [x] Enums file
- [x] Entity: User
- [x] Entity: Buyer
- [x] Entity: Product
- [x] Entity: Order
- [x] Entity: OrderItem
- [x] Entity: BehavioralSignal
- [x] Entity: RiskPrediction
- [x] Entity: SellerDecision
- [x] Entity: OrderOutcome
- [x] Entity: ChatSession
- [x] Entity: ChatMessage
- [x] Migration (dùng synchronize=true trong dev, skip)

## Phase 3 — Common Layer
- [x] TransformResponseInterceptor
- [x] HttpExceptionFilter
- [x] JwtAuthGuard + CurrentUserDecorator
- [x] PaginationDto

## Phase 4 — API Modules
- [x] Auth module (register, login, refresh, me)
- [x] Users module (update profile, change password)
- [x] Orders module (list, pending, stats, detail)
- [x] Buyers module (profile, orders, signals)
- [x] Risk module (get prediction, assess, distribution, signals)
  - [x] IRiskEngine interface
  - [x] StubRiskEngine implementation
- [x] Decisions module (create, list, stats, detail)
- [x] Profit module (estimate)
- [x] Chat module (sessions CRUD, send message)
  - [x] IChatAI interface
  - [x] StubChatAI implementation
- [x] Dashboard module (overview, trends)
- [x] Dev module (seed, reset) — chỉ development

## Phase 5 — Seed Data
- [x] users.seed.ts (1 seller demo)
- [x] products.seed.ts (30 items)
- [x] buyers.seed.ts (80 buyers)
- [x] orders.seed.ts (300 orders)
- [x] risk_predictions.seed.ts (assessments for 300 orders)
- [x] decisions.seed.ts (70% decided)
- [x] outcomes.seed.ts (60% resolved)
- [x] chat_sessions.seed.ts (sample context-aware chats)

## Phase 6 — Verification
- [x] Unit test build (`npm run build`)
- [x] Manual: Login & get token
- [x] Manual: Check stats & distribution
- [x] Manual: Check chat context response
- [x] Manual: Check profit estimation logic
- [x] Final Walkthrough & handover

## Phase 7 — Frontend Integration & Cleanup
- [x] Refactor API layer to `src/api/` (Endpoints & Services)
- [x] Connect Dashboard với API thật
- [x] Nâng cấp bảng Order với cột Risk Score & Level
- [x] Xây dựng panel Risk Advisor trong chi tiết đơn hàng
- [x] Tích hợp AI Chat Advisor thật thành công
- [x] Chuyển Order List sang API thật (Xóa Mock)
- [x] Xóa các trang thừa (Cleanup template)
- [x] Resolve port conflicts (DB: 5433, Backend: 5176, Frontend: 5175)
- [x] Fix React Rule of Hooks in OrderListContent
- [x] Fix Data Mapping in OrderListProvider (Handled paginated response)
- [x] Final Testing & Polishing
- [x] i18n (EN/VI) Support
  - [x] Configure `src/i18n/config.ts` (EN/VI support)
  - [x] Create `vi.json` & update `en.json`
  - [x] Localize Dashboard, Order List, and Order Detail pages
    - [x] Dashboard
    - [x] Order List
    - [x] Order Detail
    - [x] Authentication (Sign In, Sign Up, Reset Password)
    - [x] Global UI (Sidebar, Header/User Dropdown)
    - [x] Settings Page
  - [x] Localize Chat and Decisions pages
  - [x] Verify language switcher/persistence
  - [x] Cleanup unused i18n assets (flags & unused files) — Restored flags to fix build breakage
  - [x] Fix JSON syntax error and duplicate keys in en.json

## Phase 8: Bug Fixes & Refinement
- [x] Fix missing i18n keys and ReferenceErrors
  - [x] Add missing keys to `en.json` and `vi.json` (Synchronized 290+ keys)
  - [x] Fix `ReferenceError: Link is not defined` in `OrderColumns.jsx`
  - [x] Fix `ReferenceError: useDashboard is not defined` in `DashboardContent.jsx`
  - [x] Fix `ReferenceError: Card is not defined` in `RiskDistributionChart`, `OrdersTrendChart`, `RecentRiskyOrders`
  - [x] Localized all dashboard chart components (Outcomes, Trends, Stats)
  - [x] Refactor `I18nProvider` to fix stale translation state (Vite/HMR related)
  - [x] Fix global `currenLanguage` typo to `currentLanguage`
  - [x] Verify Order List & Dashboard localization

## Phase 9: UI Enhancement & Polishing
- [x] Improve Sidebar Menu UI (Height, Rounding, Colors)
- [x] Fix sidebar icon-text spacing (Change justify-between to justify-start)
- [x] Enhance Sidebar Header (Logo sizing, Collapse button)
- [x] Polish Toolbar (Typography, Spacing)

## Phase 10: Documentation & Handover
- [x] Create detailed Application Overview for presentation (Vietnamese)
- [x] Create detailed Dashboard Page guide (Purpose & Rationale)
- [x] Create detailed Decisions Page guide (Metrics explanation)
- [x] Fix Order Detail "Failed to load" bug (API mismatch & Auto-assess)
- [x] Fix ReferenceErrors in Order Detail components (Missing imports & icons)
- [/] Create detailed guides for remaining pages (Order List, Detail, Chat, etc.)
- [x] Finalize walkthrough.md and task.md
