# Implementation Plan - i18n (EN/VI) Support

The project currently has a `react-intl` (FormatJS) setup with several languages (EN, AR, FR, ZH). We will refactor this to support only English (EN) and Vietnamese (VI), populate the translation files, and integrate localization into the core components.

## Proposed Changes

### [Component] i18n Configuration

#### [MODIFY] [config.ts](file:///Users/kenn/kltn/cod-risk-advisor/src/i18n/config.ts)
- Add `vi` (Vietnamese) to `I18N_MESSAGES` and `I18N_LANGUAGES`.
- Remove `ar`, `fr`, and `zh` from the configuration.
- Set `vi` or `en` as the default language (preference: `vi`).
- Update flags (ensure Vietnamese flag is available).

#### [NEW] [vi.json](file:///Users/kenn/kltn/cod-risk-advisor/src/i18n/messages/vi.json)
- Create initial Vietnamese translation file.

#### [MODIFY] [en.json](file:///Users/kenn/kltn/cod-risk-advisor/src/i18n/messages/en.json)
- Update English translation file with comprehensive keys.

#### [DELETE] [ar.json, fr.json, zh.json](file:///Users/kenn/kltn/cod-risk-advisor/src/i18n/messages/)
- Remove unused translation files.

### [Component] UI Components (Localization)

#### [MODIFY] [DashboardContent.jsx](file:///Users/kenn/kltn/cod-risk-advisor/src/pages/dashboards/DashboardContent.jsx)
- Wrap strings like "Overview", "Trends", "Risk Distribution" with `FormattedMessage` or use `intl.formatMessage`.

#### [MODIFY] [OrderListContent.jsx](file:///Users/kenn/kltn/cod-risk-advisor/src/pages/order-list/OrderListContent.jsx)
- Localize table headers, tab labels, and search placeholders.

#### [MODIFY] [OrderDetailContent.jsx](file:///Users/kenn/kltn/cod-risk-advisor/src/pages/order-detail/OrderDetailPage.jsx)
- Localize panel headings, buttons, and status labels.

## Verification Plan

### Automated Tests
- Not applicable for this UI localization task, but will ensure the build passes: `npm run build`.

### Manual Verification
- Check the language switcher (if exists) or manually change the language in `localStorage` to verify EN/VI toggle.
- Verify that Vietnamese text displays correctly (UTF-8).
- Verify that numeric/date formats adapt to the locale if using `react-intl` helpers.
