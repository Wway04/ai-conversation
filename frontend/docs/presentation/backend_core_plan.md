# Backend Core — COD Risk Advisor

Xây dựng NestJS backend từ đầu, kết nối PostgreSQL (Docker), cung cấp đầy đủ REST API
cho frontend, bao gồm Auth (JWT), quản lý đơn hàng, phân tích rủi ro (stub), chat AI (stub),
và seed data thuyết phục cho demo KLTN.

---

## Proposed Changes

### Infrastructure & Project Setup

#### [NEW] `kltn/backend/` — Toàn bộ thư mục NestJS

Khởi tạo bằng `nest new backend --package-manager npm`, sau đó cấu hình:

#### [NEW] `kltn/docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports: ['5432:5432']
    environment:
      POSTGRES_DB: ai_conversation
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes: [pgdata:/var/lib/postgresql/data]

volumes:
  pgdata:
```

#### [NEW] `backend/.env`

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_conversation
DB_USER=postgres
DB_PASS=postgres

# JWT
JWT_ACCESS_SECRET=cod_risk_access_secret_change_in_prod
JWT_REFRESH_SECRET=cod_risk_refresh_secret_change_in_prod
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

### Layer 1 — Database Entities (TypeORM)

File path: `backend/src/database/entities/`

| File | Entity | Quan hệ chính |
|------|--------|---------------|
| `user.entity.ts` | User (Seller) | 1:N Order, Product, ChatSession, SellerDecision |
| `buyer.entity.ts` | Buyer | 1:N Order |
| `product.entity.ts` | Product | 1:N OrderItem |
| `order.entity.ts` | Order | N:1 User, Buyer; 1:N OrderItem, Signal, Decision; 1:1 RiskPrediction, Outcome |
| `order-item.entity.ts` | OrderItem | N:1 Order, Product |
| `behavioral-signal.entity.ts` | BehavioralSignal | N:1 Order, Buyer |
| `risk-prediction.entity.ts` | RiskPrediction | 1:1 Order |
| `seller-decision.entity.ts` | SellerDecision | N:1 Order, User |
| `order-outcome.entity.ts` | OrderOutcome | 1:1 Order |
| `chat-session.entity.ts` | ChatSession | N:1 User; 1:N ChatMessage |
| `chat-message.entity.ts` | ChatMessage | N:1 ChatSession |

**Enums dùng chung:**
```typescript
enum OrderStatus   { PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED, FAILED_DELIVERY }
enum RiskLevel     { LOW, MEDIUM, HIGH, CRITICAL }
enum DecisionAction { ACCEPT, ACCEPT_WITH_VERIFICATION, ADJUST_CONDITIONS, REJECT }
enum OutcomeResult { DELIVERED, CANCELLED_BY_BUYER, CANCELLED_BY_SELLER, FAILED_DELIVERY, RETURNED, REFUSED_AT_DOOR }
enum SignalType    { TEMPORAL, BEHAVIORAL, NETWORK, TRANSACTIONAL, GEOGRAPHIC }
```

---

### Layer 2 — Common Infrastructure

File path: `backend/src/common/`

| File | Mục đích |
|------|---------|
| `guards/jwt-auth.guard.ts` | Guard protect routes bằng JWT |
| `decorators/current-user.decorator.ts` | `@CurrentUser()` lấy user từ request |
| `interceptors/transform-response.interceptor.ts` | Wrap tất cả response thành `{ success, data, timestamp }` |
| `filters/http-exception.filter.ts` | Catch exception, trả lỗi đúng format |
| `dto/pagination.dto.ts` | `page`, `limit`, query chung |
| `dto/api-response.dto.ts` | Generic response wrapper type |

---

### Layer 3 — Modules API

#### 3.1 Auth Module

**Endpoints:**
```
POST /api/v1/auth/register   → { email, password, fullName, shopName? }
POST /api/v1/auth/login      → { email, password } → { accessToken, refreshToken, user }
POST /api/v1/auth/refresh    → { refreshToken } → { accessToken }
GET  /api/v1/auth/me         → UserProfile (protected)
```

**Implementation:**
- `auth.service.ts`: `register()` bcrypt hash password, `login()` validate + sign JWT, `refresh()` verify refresh token
- `strategies/jwt.strategy.ts`: Passport JWT strategy validate payload
- Access token: 15 phút | Refresh token: 7 ngày (lưu trong DB hoặc stateless)

#### 3.2 Users Module

```
PATCH /api/v1/users/me          → Update profile (fullName, shopName, preferences)
PATCH /api/v1/users/me/password → Đổi mật khẩu (oldPassword, newPassword)
```

#### 3.3 Orders Module

```
GET /api/v1/orders
  Query: page, limit, status, riskLevel (comma-sep), dateFrom, dateTo, search, sortBy, sortOrder
  Response: paginated list + meta

GET /api/v1/orders/pending-decisions
  → Đơn isDecisionMade=false, sắp xếp riskScore DESC

GET /api/v1/orders/stats
  → { total, pendingDecision, avgRiskScore, byRiskLevel: {LOW,MEDIUM,HIGH,CRITICAL} }

GET /api/v1/orders/:id
  → Order + buyer + riskPrediction + signals + latestDecision + outcome (joins)
```

**Lưu ý:** Filter bằng `QueryBuilder` TypeORM, không dùng `find()` cho queries phức tạp.

#### 3.4 Buyers Module

```
GET /api/v1/buyers/:id           → Buyer profile + stats
GET /api/v1/buyers/:id/orders    → Order history của buyer (paginated, query: page, limit, status)
GET /api/v1/buyers/:id/signals   → Behavioral signals của buyer
```

#### 3.5 Risk Module

```
GET  /api/v1/risk/orders/:id         → RiskPrediction của đơn
POST /api/v1/risk/orders/:id/assess  → Trigger assess (gọi StubRiskEngine)
GET  /api/v1/risk/distribution       → { LOW: n, MEDIUM: n, HIGH: n, CRITICAL: n }
GET  /api/v1/risk/orders/:id/signals → BehavioralSignals cho đơn
```

**StubRiskEngine** (rule-based scoring):
```typescript
score = 0;
if (buyer.cancelRate > 0.3)          score += 0.25;
if (buyer.totalOrders < 3)           score += 0.15;
if (order.totalAmount > 2_000_000)   score += 0.20;
if (!buyer.hasVerifiedPhone)         score += 0.10;
if (buyer.addressChangeCount > 2)    score += 0.10;
if (isLateNightOrder(order))         score += 0.10;
if (buyer.returnRate > 0.2)          score += 0.10;
```

**FeatureImportances** stub: trả array hardcoded tương ứng với signal triggers.  
**RecommendedActions** stub: map score range → action recommendation.

#### 3.6 Decisions Module

```
POST /api/v1/decisions
  Body: { orderId, action, reason?, conditions? }
  → Lưu SellerDecision, update Order.isDecisionMade = true

GET /api/v1/decisions         → Paginated list (filter: action, dateFrom, dateTo)
GET /api/v1/decisions/stats   → { total, byAction, followedAiRate, avgRiskScore }
GET /api/v1/decisions/:id     → Chi tiết quyết định + order + riskPrediction
```

#### 3.7 Profit Module

```
GET /api/v1/profit/orders/:id
  → {
      expectedProfit,      // = revenue * deliveryProb - shippingCost
      deliveryProbability, // 1 - riskScore (stub)
      returnCost,          // phí hoàn về (shippingCost * 2)
      scenarios: {
        success: { revenue, cost, profit },
        failure: { revenue: 0, cost: returnCost, profit: -returnCost }
      }
    }
```

#### 3.8 Chat Module

```
POST   /api/v1/chat/sessions              → Tạo session mới { contextOrderId? }
GET    /api/v1/chat/sessions              → List sessions của user
GET    /api/v1/chat/sessions/:id          → Session + messages
POST   /api/v1/chat/sessions/:id/messages → Gửi tin nhắn { content } → AI response
DELETE /api/v1/chat/sessions/:id          → Xóa session
```

**StubChatAI** (keyword matching):

| Keyword | Response template |
|---------|------------------|
| `risk`, `rủi ro`, `tại sao` | Giải thích risk score + top factors |
| `người mua`, `buyer`, `lịch sử` | Tóm tắt buyer stats |
| `lợi nhuận`, `profit`, `lãi` | Ước tính profit + scenario |
| `nên`, `hành động`, `recommend` | Đề xuất action với lý do |
| default | Liệt kê câu hỏi gợi ý |

#### 3.9 Dashboard Module

```
GET /api/v1/dashboard/overview
  → {
      totalOrders, pendingDecision, avgRiskScore,
      totalRevenue, byRiskLevel, recentRiskyOrders[5]
    }

GET /api/v1/dashboard/trends?period=7d|30d|90d
  → Array điểm dữ liệu theo ngày: { date, orders, revenue, avgRisk }
```

#### 3.10 Dev Module (chỉ khi NODE_ENV=development)

```
POST /api/v1/dev/seed   → Chạy seed data
POST /api/v1/dev/reset  → Truncate tables + re-seed
```

---

### Layer 4 — Seed Data

File path: `backend/src/database/seeds/`

| File | Số lượng | Chi tiết |
|------|---------|---------|
| `users.seed.ts` | 1 seller | email: `seller@demo.com`, pass: `demo123` |
| `products.seed.ts` | 30 sản phẩm | 5 categories: Điện tử, Thời trang, Mỹ phẩm, Gia dụng, Phụ kiện |
| `buyers.seed.ts` | 80 buyers | 4 profile types: tốt (20%), trung bình (40%), rủi ro (30%), nguy hiểm (10%) |
| `orders.seed.ts` | 300 orders | Mix trạng thái, risk levels, thời gian 3 tháng gần đây |
| `signals.seed.ts` | 3–8/order | Random từ signal template pool |
| `risk-predictions.seed.ts` | 1/order | Tính toán bằng StubRiskEngine |
| `decisions.seed.ts` | ~70% orders | 30% đơn còn pending |
| `outcomes.seed.ts` | ~60% orders | Cho các đơn đã có quyết định |
| `chat-sessions.seed.ts` | 5 sessions | Sample chat conversations |

---

## Verification Plan

### Automated Tests

Dùng Jest (built-in NestJS). Tạo unit test cho service layer:

```bash
cd backend
npm run test           # Unit tests
npm run test:e2e       # End-to-end tests
npm run test:cov       # Coverage report
```

**Test cases cần viết (mới):**
1. `auth.service.spec.ts` — `register()`, `login()` happy path + error cases
2. `risk.service.spec.ts` — StubRiskEngine scoring logic cho từng rule
3. `orders.service.spec.ts` — Filter, pagination, query builder
4. `decisions.service.spec.ts` — Tạo decision + update `isDecisionMade`

### Manual API Verification

Sau khi server chạy (`npm run start:dev`), test bằng curl hoặc Postman:

**Bước 1 — Khởi động môi trường:**
```bash
# Terminal 1: Start database
docker-compose up -d postgres

# Terminal 2: Start backend
cd backend && npm run start:dev

# Seed data
curl -X POST http://localhost:3000/api/v1/dev/seed
```

**Bước 2 — Test Auth:**
```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"seller@demo.com","password":"demo123","fullName":"Demo Seller"}'

# Login → lấy accessToken
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seller@demo.com","password":"demo123"}'

# Get me (dùng token từ bước trên)
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**Bước 3 — Test Orders:**
```bash
# List orders
curl "http://localhost:3000/api/v1/orders?page=1&limit=10&riskLevel=HIGH,CRITICAL" \
  -H "Authorization: Bearer <TOKEN>"

# Order detail
curl http://localhost:3000/api/v1/orders/<ORDER_ID> \
  -H "Authorization: Bearer <TOKEN>"

# Pending decisions
curl http://localhost:3000/api/v1/orders/pending-decisions \
  -H "Authorization: Bearer <TOKEN>"
```

**Bước 4 — Test Decision Flow:**
```bash
# Tạo decision
curl -X POST http://localhost:3000/api/v1/decisions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"orderId":"<ORDER_ID>","action":"ACCEPT","reason":"Buyer uy tín"}'

# Verify order.isDecisionMade = true
curl http://localhost:3000/api/v1/orders/<ORDER_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

**Bước 5 — Test Chat:**
```bash
# Tạo session
curl -X POST http://localhost:3000/api/v1/chat/sessions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"contextOrderId":"<ORDER_ID>"}'

# Gửi tin nhắn
curl -X POST http://localhost:3000/api/v1/chat/sessions/<SESSION_ID>/messages \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"content":"Tại sao đơn này rủi ro cao?"}'
```

### Frontend Integration Check

Sau khi backend chạy ổn định:
1. Chạy frontend `cd cod-risk-advisor && npm run dev`
2. Đăng nhập bằng `seller@demo.com / demo123`
3. Kiểm tra danh sách đơn hàng hiển thị data thực (không còn mock)
4. Click vào 1 đơn HIGH/CRITICAL → xem risk analysis
5. Ra quyết định → verify không lỗi

---

## Thứ tự triển khai đề xuất

```
Week 1:
  Day 1: Setup NestJS + Docker + TypeORM + Migrations
  Day 2: Common layer (guards, interceptors, filters)
  Day 3: Auth module (register/login/JWT)
  Day 4: Orders + Buyers modules
  Day 5: Risk + Decisions + Profit modules

Week 2:
  Day 1: Chat + Dashboard modules
  Day 2: Seed data (sẽ tốn thời gian nhất)
  Day 3: Unit tests cho service layer
  Day 4: Kết nối frontend (thay mock → API)
  Day 5: Bug fix + polish
```
