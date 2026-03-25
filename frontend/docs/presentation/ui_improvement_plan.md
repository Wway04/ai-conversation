# UI Improvement Plan - Sidebar & Toolbar

The goal is to refine the design of the sidebar and toolbar to make them feel more premium, modern, and interactive.

## Proposed Changes

### [Component] Sidebar Menu
#### [MODIFY] [sidebar-menu.tsx](file:///Users/kenn/kltn/cod-risk-advisor/src/layouts/demo1/components/sidebar-menu.tsx)
- Increase item height from `h-8` to `h-10`.
- Use `rounded-xl` for menu items.
- Update selected state background to `bg-primary/10` and text to `text-primary`.
- Add a subtle hover state with `bg-primary/5`.
- Adjust spacing between items to `space-y-1.5`.
- Update typography to `font-semibold` for active items.

### [Component] Sidebar Header
#### [MODIFY] [sidebar-header.tsx](file:///Users/kenn/kltn/cod-risk-advisor/src/layouts/demo1/components/sidebar-header.tsx)
- Adjust logo height for better visibility.
- Refine the collapse button styling to be more integrated.

### [Component] Toolbar
#### [MODIFY] [toolbar.tsx](file:///Users/kenn/kltn/cod-risk-advisor/src/partials/common/toolbar.tsx)
- Improve page title typography (weight and size).
- Ensure consistent padding and gap alignment.

## Verification Plan

### Manual Verification
- Verify the sidebar menu items have a modern, "bubble" look with rounded corners.
- Confirm that the active state is clearly visible with a light primary background.
- Ensure hover effects are smooth and subtle.
- Check the toolbar title for better readability and style.
- Verify responsiveness and sidebar collapse behavior.
