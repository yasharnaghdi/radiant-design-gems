# Portfolio Category Filters

Add a category filter bar to the Portfolio gallery, filter the bento items on selection, persist the chosen filter across page reloads, and hide the featured video while a specific filter is active.

## What changes (only `src/components/Portfolio.tsx`)

### 1. Filter bar
- Derive categories from the existing `works` array: `All`, `Commercial`, `Cinematography`, `Color`, `Post-Production`, `Studio`, `Delivery`.
- Render a row of pill buttons above the bento grid, styled with existing tokens (glass-effect, accent colors) to match the cinematic dark theme.
- Active pill visually highlighted; smooth transition on hover/active (extremely slow timing per project animation rule).

### 2. Filtering logic
- `activeFilter` state controls which works are shown.
- `All` shows every item; any other value shows only matching `category`.
- Grid items animate in/out with framer-motion (`AnimatePresence`) keeping the existing scroll-reveal + hover behavior.

### 3. Persistence across reloads
- Initialize `activeFilter` from `localStorage` (key e.g. `portfolio-filter`), falling back to `All`.
- Write to `localStorage` whenever the filter changes.
- Guard against invalid stored values (e.g. a category that no longer exists → reset to `All`).

### 4. Featured video behavior
- The featured "The Lonely Journey" video block is shown only when `activeFilter === 'All'`.
- When any specific category is selected, hide the featured video and show only the filtered gallery.

## Notes
- No backend or new dependencies; framer-motion is already used.
- Bento `span` classes remain per item; asymmetric layout is preserved for whatever subset is visible.
- Scope stays entirely within the Portfolio component; no changes to other sections or contact form.
