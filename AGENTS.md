# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the React app (pages, components, styles).
- `public/` holds static assets served as-is, including `CNAME` for GitHub Pages.
- `branding/` includes the branding guide and logo assets; you must follow `branding/branding.md` and the provided logos for any visual changes.
- `old_site/` preserves the legacy static site for reference.
- `CNAME` is used for GitHub Pages custom domain configuration.

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` starts the Vite dev server for local development.
- `npm run build` produces the production build in `dist/`.
- `npm run preview` serves the production build locally for verification.
- `./cleanup_zone_files.sh` removes Windows Zone.Identifier files if they appear.

## Coding Style & Naming Conventions
- Indentation in JSX/CSS/JS uses 2 spaces; keep existing formatting consistent.
- Keep filenames lowercase and descriptive (e.g., `dataSources.js`, `schedule.jsx`).
- Use React components for shared UI and keep pages in `src/pages/`.

## Testing Guidelines
- No automated test framework is present.
- Validate changes by running `npm run dev` and checking responsive layouts.
- For visual changes, verify header, nav, menu, and schedule at common breakpoints.

## Data Sources & Responsive Views
- Menu data is loaded from a Google Sheets CSV in `src/config/dataSources.js`: `https://docs.google.com/spreadsheets/d/e/2PACX-1vT_2eL_BHhckqaISusOVhDGM97H2KQGMmWn76X9uS8-RIElvB9UPI-xNRFLG6m2uMfjsgFNoKmnq_Rw/pub?output=csv` and must include headers `category,item_name,price,description,column,special_notes`.
- Schedule data is loaded from a Google Sheets CSV in `src/config/dataSources.js`: `https://docs.google.com/spreadsheets/d/e/2PACX-1vTStRZ-LbPMrvSERpZWS8-HYj4CYF4L1vXcnf_X8ajOtrCa93xIslvdfKzZGFNzc5oeKHgdEmo-23GF/pub?output=csv` and must include headers `Test,Date,Start Date,End Date,Start Time,End Time,Days of Week,Location,Description`.
- Schedule parsing camel-cases CSV headers (e.g., `Start Date` -> `startDate`) and hides rows marked `Test` on production hosts.
- Schedule view modes: desktop shows a full calendar grid with a modal for details; mobile hides the grid and shows a minimal week card list. Keep both layouts aligned with the same CSV fields.

## Commit & Pull Request Guidelines
- Commit history favors short, descriptive messages (e.g., “Fix nav on mobile”, “Branding and UX fixes”).
- Keep commits scoped to a single change theme and avoid noisy formatting-only commits.
- PRs should include a brief summary, before/after screenshots for UI changes, and linked issues if applicable.

## Configuration Notes
- When updating domain or hosting settings, edit `CNAME` and document the change in the PR.
- New brand assets should be placed in `branding/` and referenced from the site via `old_site/`.
