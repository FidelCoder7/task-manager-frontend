# Task Manager Frontend

A React single-page application for managing personal tasks, 
consuming the [Task Manager Auth API](https://github.com/FidelCoder7/task-manager-auth).

## Features

- Register and log in with JWT authentication
- Session persistence — refreshing the page keeps you logged in
- Task dashboard: create, edit, delete, filter by status/priority, search
- Paginated task list with summary strip (total/pending/in-progress/done)
- Role-based UI — admin users see an Admin Panel with all users and all tasks
- Clean, responsive interface

## Tech Stack

React · Vite · React Router · axios · plain CSS

## Quick Start

```bash
npm install
cp .env.example .env    # set VITE_API_URL=http://localhost:8000
npm run dev
```

Make sure the backend API is running first:
```bash
# In task-manager-auth/
uvicorn app.main:app --reload
```

## Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Login form |
| `/register` | Public | Registration form |
| `/dashboard` | Authenticated | Task management |
| `/admin` | Admin only | All users + all tasks |

## Project Structure

src/

├── api/           # axios client, authApi, tasksApi

├── context/       # AuthContext (global auth state)

├── components/    # Navbar, TaskCard, TaskForm, Pagination, ProtectedRoute, AdminRoute

└── pages/         # LoginPage, RegisterPage, DashboardPage, AdminPage


## Related Projects

- [Auth System](https://github.com/FidelCoder7/auth-system)
- [Task Manager REST API](https://github.com/FidelCoder7/task-manager-auth)

## License

MIT