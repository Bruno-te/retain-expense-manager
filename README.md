# Retain: Personal Expense & Budget Manager

Retain is a full-stack web application for recording personal expenses, setting a monthly budget, and seeing where the money goes. It has a React + TypeScript frontend built with Vite and a Node.js / Express REST API backed by MongoDB. Regular users manage their own expenses and budget. Admins manage expense categories and see platform-wide insights.

## Live demo

| | URL |
|---|---|
| Frontend | https://earnest-dragon-4eeba3.netlify.app |
| API |  https://retain-expense-manager-srdn.onrender.com (health check: `/api/health`) |

### Login creditions

|| Admin : admin@retain.com   password : Adminwork123
|| tester: test@example.com   password : secret123


**Cold starts:** the API runs on a free hosting plan that spins down after 15 minutes without traffic. The first request after a quiet period can take up to about 30 seconds. After that it responds normally.

**Accounts:** anyone can sign up as a regular user from the Sign up page. The admin demo account is supplied in the submission notes. To create your own admin locally, see [Create an admin account](#3-create-an-admin-account).

## Features

**Users**
- Sign up, sign in, sign out, with sessions that survive a page refresh
- Create, view, edit, and delete their own expenses (title, amount, category, date, payment method, optional notes)
- Search by title or notes, filter by category, payment method, date range, and amount range, and sort by date or amount
- Server-side pagination (10 per page)
- Set a budget per month and see whether they are within, approaching, or over it
- Dashboard for any chosen month: total spent, remaining budget, highest expense, spending by category, recent expenses

**Admins**
- Create, rename, and delete expense categories. Deleting a category moves its expenses to a protected default category called "Uncategorized"
- Platform insights: registered users, expenses recorded, total value, expenses recorded this month, spending per category, top 5 and bottom 5 most-used categories, recently added expenses, recently registered users

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, React Router, React Context (authentication), Redux Toolkit + React Redux (filters), Bootstrap |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB (MongoDB Atlas) |
| Auth | JSON Web Tokens, bcrypt password hashing |
| Hosting | Netlify (frontend), Render (API), MongoDB Atlas (database) |

## Project structure

```
retain-expense-manager/
├── client/                  React + TypeScript app (Vite)
│   ├── public/_redirects    SPA fallback rule for Netlify
│   └── src/
│       ├── api/             fetch wrapper and one module per API area
│       ├── components/      reusable UI (navbar, filter bar, tables, dialogs)
│       ├── context/         AuthContext, AuthProvider, useAuth
│       ├── hooks/           data-loading hooks
│       ├── pages/           route-level screens
│       ├── store/           Redux Toolkit slices, store, typed hooks
│       ├── types/           shared TypeScript types
│       └── utils/           formatting and month helpers
├── server/                  Express REST API
│   └── src/
│       ├── config/          database connection and category seeding
│       ├── controllers/     request handling and business logic
│       ├── middleware/      authentication and admin checks
│       ├── models/          Mongoose schemas
│       ├── routes/          URL to controller mapping
│       ├── scripts/         createAdmin script
│       └── utils/           month range helpers
└── docs/                    Postman collection
```

## Getting started locally

**Prerequisites:** Node.js (22 recommended; the server needs 20 or newer), npm, and a MongoDB database. A free MongoDB Atlas cluster works well.

### 1. Clone and install

```bash
git clone https://github.com/Bruno-te/retain-expense-manager.git
cd retain-expense-manager
```

### 2. Run the API

```bash
cd server
npm install
cp .env.example .env
```

Fill in `server/.env`:

| Variable | Meaning |
|---|---|
| `PORT` | Port for the API. Defaults to `5001` |
| `MONGODB_URI` | MongoDB connection string. Include a database name, for example `.../retain?retryWrites=true&w=majority` |
| `JWT_SECRET` | Long random string used to sign login tokens |
| `CLIENT_URL` | Exact origin of the frontend, for CORS. Locally `http://localhost:5173`, with no trailing slash |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Then start the API:

```bash
npm run dev
```

You should see `MongoDB connected`, and on the first run `Seeded default category: Uncategorized`. Check it with `curl http://localhost:5001/api/health`.

### 3. Create an admin account

Sign-up always creates a regular user, so admins are created from the command line:

```bash
cd server
npm run create-admin -- "Admin" admin@example.com yourpassword
```

### 4. Run the frontend

This project uses **Vite**. In a second terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

If `npm install` reports an `ERESOLVE` peer-dependency error, run `npm install --legacy-peer-deps` instead.

`client/.env` needs one variable: `VITE_API_URL`, the API base URL including `/api` (locally `http://localhost:5001/api`). Vite reads it at build time, so rebuild after changing it. Open http://localhost:5173.

### Production build

```bash
cd client
npm run build
```

## Testing

Automated tests were not required for this assessment, so there is no test suite. Testing was manual:

- **Postman:** import `docs/Retain.postman_collection.json`. It covers every endpoint, saves tokens automatically, and includes negative checks (for example, a normal user calling an admin endpoint must receive 403). Set the `baseUrl` variable to the local or deployed API.
- **Browser walkthrough:** sign up, add expenses, try each filter, sort, and the pagination, set a budget and watch the status change, then sign in as an admin, rename and delete a category that has expenses, and check that those expenses move to "Uncategorized".
- **Access checks:** a regular user must not see the Admin link, and opening `/admin` redirects to the dashboard. Requesting another user's expense by id returns "not found".

## API reference

All routes are under `/api`. Everything except health, register, and login requires `Authorization: Bearer <token>`.

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | `/health` | public | Health check |
| POST | `/auth/register` | public | Create a regular user, returns a token |
| POST | `/auth/login` | public | Sign in, returns a token |
| GET | `/auth/me` | user | Current user |
| GET | `/categories` | user | List categories |
| POST | `/categories` | admin | Create a category |
| PUT | `/categories/:id` | admin | Rename a category |
| DELETE | `/categories/:id` | admin | Delete a category, reassigning its expenses |
| GET | `/expenses` | user | List own expenses (see below) |
| POST | `/expenses` | user | Create an expense |
| GET | `/expenses/:id` | user | Get one of own expenses |
| PUT | `/expenses/:id` | user | Update one of own expenses |
| DELETE | `/expenses/:id` | user | Delete one of own expenses |
| GET | `/budgets?month=YYYY-MM` | user | Get the budget for a month |
| PUT | `/budgets` | user | Create or update a budget `{ month, limit }` |
| GET | `/dashboard?month=YYYY-MM` | user | Monthly summary |
| GET | `/admin/insights` | admin | Platform insights |

`GET /expenses` accepts these query parameters: `search`, `category`, `paymentMethod`, `startDate`, `endDate`, `minAmount`, `maxAmount`, `sortBy` (`date` or `amount`), `order` (`asc` or `desc`), `page`, and `limit` (maximum 50). It returns the expenses plus `page`, `limit`, `total`, and `totalPages`.

## Design decisions

### Authentication with React Context only
`AuthProvider` owns the user, the loading state, and the `login`, `register`, and `logout` actions, exposed through the `useAuth` hook. Components never read the stored token themselves. On page load the stored token is sent to `/auth/me`, and the server's response decides who the user is and what role they have. Only the token is persisted, never the role, so editing browser storage cannot turn a user into an admin in the UI.

`ProtectedRoute` guards routes using that context. It redirects visitors who are not signed in to the login page (remembering where they were heading), and with `requireAdmin` it also checks the role. This is a user-experience layer. The real enforcement is on the server: every protected endpoint checks the token, and admin endpoints also run an admin-role check, so the API refuses the request no matter what the interface shows.

### Filtering, searching, and sorting with Redux Toolkit only
The filter state (search text, category, payment method, date range, amount range, sort field and direction, page) lives in a Redux slice, and every filter control reads from and writes to it by dispatching actions. No `useState` is used for any filtering, searching, or sorting. Changing any filter resets the page to 1 so the user is never left on a page that no longer exists. A thunk reads the filters straight from the store and fetches the matching expenses, and it ignores responses from outdated requests so a slow earlier request cannot overwrite newer results. The expenses page refetches when the filters change, with a short delay so typing in the search box sends one request when the user pauses instead of one per keystroke.

Local component state is still used where it belongs: form drafts, dialogs, and the dashboard's selected month, none of which are expense filters.

### Filtering, sorting, and pagination happen on the server
The browser never downloads the whole expense list. MongoDB applies the filters, sorting, and `skip`/`limit`, so the approach holds up with large datasets. The search text is regex-escaped before it reaches the query, the sort field is whitelisted, and a stable tie-breaker keeps ordering consistent across pages.

### Data isolation
Every expense and budget query includes the signed-in user's id, and update and delete find the record by both its id and the owner. Asking for someone else's expense returns "not found", the same as for a record that does not exist, so it does not reveal that it exists.

### Categories and the default category
Expenses store a reference to their category, so renaming a category updates every expense automatically. An "Uncategorized" default category is seeded on server start and cannot be renamed or deleted. Deleting any other category first moves its expenses to "Uncategorized" and only then deletes the category, so a failure part-way never leaves expenses pointing at a missing category. The admin sees how many expenses were moved.

### Budget status
A budget is stored per user per month (`YYYY-MM`) with a unique index on that pair. The server computes the status and the client only displays it: **within** budget, **approaching** once spending reaches 80% of the limit, **over** when it exceeds it, or **no budget set**. The status is a TypeScript union type, and the display styles are keyed by it, so adding a status without styling it is a compile error.

### Months and dates
Months are handled as half-open UTC ranges (the first of the month up to, but not including, the first of the next), which avoids losing expenses logged late on the last day. Dates are displayed in UTC to match how they are stored. "Expenses recorded this month" in the admin insights counts by the date an expense was added to the platform, not the date the user entered.

### TypeScript
Shared types describe every API response and request. Payment methods are a single constant list from which the type is derived, so the dropdown, validation, and type cannot drift apart. Redux uses typed hooks, and the expense input and expense types are separate because they differ (a category id when sending, a category object when receiving).

### Styling and responsiveness
Bootstrap's grid and utility classes provide a responsive layout: the navbar collapses into a menu on small screens, the filters and dashboard cards stack, and tables scroll inside their cards instead of widening the page.

## Challenges and how I solved them

- **Files saved empty by the editor.** Several files looked correct in my editor but were 0 bytes on disk, which showed up as confusing "no default export" errors. I diagnosed it by checking line counts with `wc -l` and by asking the dev server for the raw module, then wrote files from the terminal and verified each with a line count.
- **A generic 500 hiding the real error.** Registration and login both failed with "Registration failed" and "Login failed". I added `console.error` calls to the controllers' catch blocks, which showed that the `JWT_SECRET` environment variable was empty. Logging the real error is now standard in every controller.
- **Data landing in the wrong database.** My MongoDB connection string had no database name, so MongoDB used its default `test` database, which mixed development data into what I meant to be the production database. I found it by printing just the database name from the parsed URI (without exposing the secret), added `retain_prod`, redeployed, and created the production admin in the clean database.
- **CORS and routing after deployment.** The API only accepts requests from the exact frontend origin, so the `CLIENT_URL` value must match the deployed address with no trailing slash. Refreshing on a client-side route returned a 404 until I added a `_redirects` rule that serves `index.html` for every path.
- **Dependency and network errors on install.** A peer-dependency conflict (`ERESOLVE`) and a transient SSL error while installing packages were solved with `--legacy-peer-deps` and a retry on a better connection.

## Known limitations

- The free API hosting plan spins down when idle, so the first request after a quiet period is slow.
- The login token is kept in `localStorage` so sessions survive a refresh. This is convenient but readable by any script running on the page. A hardened version would use httpOnly cookies.
- The month picker uses `<input type="month">`, which Chrome, Edge, and Safari support. Desktop Firefox may show a plain text field.
- No password reset, email verification, or rate limiting.
- The "Uncategorized" category appears in the admin's top and bottom category rankings like any other category.
- No automated test suite.

## Libraries and packages

**Client:** react, react-dom, react-router-dom, @reduxjs/toolkit, react-redux, bootstrap, typescript, vite, @vitejs/plugin-react.

**Server:** express, mongoose, cors, dotenv, bcryptjs, jsonwebtoken, nodemon (development only).
