# Phase 8: Bug Fixes & Refinement Plan

Address missing translation keys and `ReferenceError` in `OrderColumns.jsx`.

## Proposed Changes

### i18n Messages
Add missing keys to `en.json` and `vi.json`.

#### [MODIFY] [en.json](file:///Users/kenn/kltn/cod-risk-advisor/src/i18n/messages/en.json)
#### [MODIFY] [vi.json](file:///Users/kenn/kltn/cod-risk-advisor/src/i18n/messages/vi.json)
Keys to add:
- `USER.MY_PROFILE`
- `ORDER_LIST.*` (COLUMNS, TABS, SEARCH_PLACEHOLDER, etc.)

### Order List Component
Fix import error and ensure proper localization.

#### [MODIFY] [OrderColumns.jsx](file:///Users/kenn/kltn/cod-risk-advisor/src/pages/order-list/OrderColumns.jsx)
- Import `Link` from `react-router-dom`.
- Ensure headers and cells use `intl` correctly.

## Verification Plan
- Check the Order List page for missing translations.
- Verify the Profile dropdown.
- Ensure the page loads without ReferenceErrors.
