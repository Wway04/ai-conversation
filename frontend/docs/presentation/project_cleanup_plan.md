# Project Cleanup & API Refactoring

This plan outlines the steps to remove redundant template pages from the project while ensuring the core COD Risk Advisor logic remain functional and the codebase becomes more maintainable.

## Proposed Changes

### [API Refactoring]
Move all shared API logic to a central location to decouple it from specific page folders.

#### [NEW] [endpoints.js](file:///Users/kenn/kltn/cod-risk-advisor/src/api/endpoints.js)
Combine all API endpoint definitions for orders, products, and dashboards.

#### [NEW] [order-service.js](file:///Users/kenn/kltn/cod-risk-advisor/src/api/services/order-service.js)
Move the order API methods from `src/pages/orders/api/index.js` here.

#### [NEW] [dashboard-service.js](file:///Users/kenn/kltn/cod-risk-advisor/src/api/services/dashboard-service.js)
Move dashboard-related API methods here.

### [Page Cleanup]
Remove template directories that are not part of the current or near-future scope of the COD Risk Advisor.

#### [DELETE] Unused Page Folders
Delete the following directories from `src/pages/`:
- `orders/` (Replaced by `order-list` and `order-detail`)
- `fulfillment-orders/`
- `fulfillment-health/`
- `product_catalog/`
- `products/`
- `store-client/`
- `variants/`
- `mockups/`
- `artwork-library/`
- `collections/`
- `dashboards/user/`

### [Integrations & Account]
**KEEP** the following for future development:
- `account/`: Essential for profile and notification settings.
- `integrations/`: Essential for connecting to Shopee/Lazada APIs.
- `api-keys/`: Useful for B2B API access.

## Verification Plan

### Automated Tests
- Run `npm run build` in `cod-risk-advisor/` to ensure all imports are correct and the bundle can be generated.

### Manual Verification
1.  Verify the **Dashboard** still loads and displays real data.
2.  Verify the **Order List** still displays the order table.
3.  Verify **Order Detail** still shows risk analysis and allows decision submission.
