# FocusForge ⚡
> Gamified Personal Productivity & Discipline Crucible

FocusForge is a full-stack gamified productivity web app. It combines task management, habit streaks, weekly timetable time-blocking, Pomodoro focus sessions, markdown notes and a calendar with an RPG progression system: experience points (XP), levels, rank titles and achievement badges.

The backend is built with **PHP 8+**, **PDO prepared statements** and **MySQL (via XAMPP)**, serving a **React 18** frontend.

---

## ✨ Features

- ✅ Tasks with filters, priorities and gamified completion
- 🔁 Habit tracking with daily logs and streaks
- 🗓️ Weekly timetable / time-blocking
- 🍅 Pomodoro focus sessions with history
- 🎯 Goals with milestones and progress tracking
- 📝 Markdown notes linked to tasks and goals
- 📆 Unified monthly calendar view
- 📊 Analytics: daily score, weekly/monthly stats, heatmap
- 🏆 XP, levels, rank titles and achievement badges
- 🌗 Dark / light theme, glassmorphism UI, level-up animations

---

## 🏗️ Architecture & Tech Stack

```
Frontend (React + Vite)
       │
       │ HTTP / JSON Requests
       ▼
PHP REST API (PHP 8+, PDO, Prepared Statements)
       │
       │ MySQL Driver / PDO
       ▼
XAMPP Apache (Port 80) & MySQL Database (Port 3306)
```

- **Frontend**: React 18, Vite, React Router v6, Axios, Recharts, Lucide Icons
- **Backend**: PHP 8+, PDO with MySQL/MariaDB, JSON REST APIs, JWT authentication (`HS256`)
- **Database**: MySQL / MariaDB (`focusforge` database)
- **Web Server**: Apache (XAMPP) with `mod_rewrite` clean URL routing

---

## 📋 Prerequisites

- [XAMPP](https://www.apachefriends.org/) with PHP 8.0+ and MySQL
- [Node.js](https://nodejs.org/) 18 or newer
- [Git](https://git-scm.com/)

---

## 🚀 Setup Guide (Windows + XAMPP)

### Step 1: Clone the repository

```bash
git clone https://github.com/Riyabhamare/focusforge.git
cd focusforge
```

> In this guide, `project_wtl` and the cloned `focusforge` folder refer to the same project root (the folder containing `backend`, `frontend` and `database`).

### Step 2: Start Apache and MySQL

1. Open the **XAMPP Control Panel** (`C:\xampp\xampp-control.exe`).
2. Click **Start** next to **Apache**.
3. Click **Start** next to **MySQL**.

Both should turn green.

### Step 3: Create the database

1. Open [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/).
2. Click **New** in the left sidebar.
3. Database name: `focusforge`, collation: `utf8mb4_unicode_ci`.
4. Click **Create**.

### Step 4: Import the schema and seed data

1. Select the `focusforge` database.
2. Open the **Import** tab.
3. Choose the file `database/focusforge_mysql.sql` and click **Import**.
4. You should see 14 tables: `users`, `tasks`, `habits`, `habit_logs`, `streaks`, `daily_activity`, `timetable_blocks`, `goals`, `notes`, `calendar_events`, `pomodoro_sessions`, `badges`, `user_badges`, `xp_log`.

*Alternative (Command Prompt):*

```cmd
C:\xampp\mysql\bin\mysql.exe -u root focusforge < "C:\path\to\focusforge\database\focusforge_mysql.sql"
```

### Step 5: Configure database credentials

Edit `backend/config/database.php` if needed. Default XAMPP values:

| Setting | Value |
|---|---|
| Host | `127.0.0.1` |
| Port | `3306` |
| Database | `focusforge` |
| Username | `root` |
| Password | *(empty)* |

If your MySQL root user has a password, set the `DB_PASSWORD` environment variable or edit `database.php`.

### Step 6: Connect the backend to XAMPP `htdocs`

**Option A (recommended): directory junction**

Open Command Prompt and run (replace the path with where you cloned the project):

```cmd
mklink /J C:\xampp\htdocs\focusforge "C:\path\to\focusforge"
```

**Option B: copy**

Copy the `backend` folder to `C:\xampp\htdocs\focusforge\backend`.

Then confirm the API works by opening:
[http://localhost/focusforge/backend/api/health](http://localhost/focusforge/backend/api/health)

### Step 7: Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at [http://localhost:5173/](http://localhost:5173/). The Vite dev server proxies all `/api/*` requests to Apache at `http://localhost/focusforge/backend` (configured in `frontend/vite.config.js`).

---

## 🌐 Application URLs

| Service / Page | URL |
|---|---|
| Frontend | [http://localhost:5173/](http://localhost:5173/) |
| PHP Backend Root | [http://localhost/focusforge/backend/](http://localhost/focusforge/backend/) |
| API Health Check | [http://localhost/focusforge/backend/api/health](http://localhost/focusforge/backend/api/health) |
| phpMyAdmin | [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/) |

---

## 🔑 Demo Account

- **Email**: `demo@focusforge.app`
- **Password**: `password123`

Or click **Demo Warrior Login** on the login page.

> ⚠️ The demo account is for local testing only. Change or remove it before any public deployment.

---

## 🧪 Testing the API & Persistence

### Health check

Open [http://localhost/focusforge/backend/api/health](http://localhost/focusforge/backend/api/health). Expected response:

```json
{
  "status": "ok",
  "appName": "FocusForge PHP API",
  "dbMode": "mysql",
  "timestamp": "2026-09-29T..."
}
```

### Verify profile persistence

1. Log in at [http://localhost:5173/login](http://localhost:5173/login).
2. Go to **Profile** or **Settings** and click **Edit Profile**.
3. Change the display name and click **Save Profile Changes**.
4. Open the **Dashboard** and check the updated greeting.
5. Refresh the page (F5). The new name should remain.
6. In phpMyAdmin, open `focusforge` → `users` → **Browse** and confirm the `name` column was updated.

---

## 📂 Project Structure

```
focusforge/
├── database/
│   └── focusforge_mysql.sql       # Schema, indexes, constraints & seed data
├── backend/
│   ├── config/
│   │   └── database.php           # PDO connection & error handling
│   ├── middleware/
│   │   └── AuthMiddleware.php     # Bearer JWT verification
│   ├── utils/
│   │   ├── Response.php           # JSON responses & CORS handling
│   │   ├── Jwt.php                # HMAC-SHA256 JWT encoder/decoder
│   │   ├── Gamification.php       # XP, levels, streaks & badge logic
│   │   └── DailyScore.php         # Daily productivity score formula
│   ├── models/                    # User, Task, Habit, Streak, Timetable,
│   │                              # Goal, Note, Calendar, Pomodoro, Badge
│   ├── controllers/               # Auth, User, Task, Habit, Streak, Timetable,
│   │                              # Analytics, Goal, Note, Calendar, Pomodoro, Badge
│   ├── api/                       # Direct endpoints (profile, dashboard, tasks),
│   │                              # API router and .htaccess
│   ├── index.php                  # Master REST API router
│   └── .htaccess                  # mod_rewrite & Authorization header pass-through
└── frontend/
    ├── vite.config.js             # Vite config with proxy to Apache
    └── src/
        ├── services/api.js        # Axios API service
        ├── context/               # Auth, Gamification, Theme contexts
        ├── pages/                 # 25 application pages
        └── components/            # Reusable UI components
```

---

## 🎮 Gamification Engine

### Leveling formula

$$\text{Level}(\text{XP}) = \left\lfloor 1 + \sqrt{\frac{\text{XP}}{250}} \right\rfloor$$

### XP values

- **Complete Task**: +10 XP
- **Complete Habit**: +25 XP
- **Complete Milestone Goal**: +50 XP
- **Pomodoro Focus**: tracked in minutes toward badges

### Daily productivity score

$$\text{Score} = \min\left(100,\ 0.4 \cdot S_{\text{tasks}} + 0.3 \cdot S_{\text{habits}} + 0.15 \cdot S_{\text{timetable}} + 0.15 \cdot S_{\text{pomodoro}}\right)$$

- `S_tasks` = completed tasks / planned tasks × 100 (capped at 100)
- `S_habits` = completed habits / total habits × 100 (capped at 100)
- `S_timetable` = adherence rate across planned weekly blocks (0–100%)
- `S_pomodoro` = focus minutes / 120 × 100 (capped at 100)

---

## 🏆 Achievement Badges

| Badge | Key | How to earn |
|---|---|---|
| Early Bird | `early_bird` | 10 morning habit logs before 9:00 AM |
| Consistent Crusader | `consistent` | 30-day active streak |
| Focus Master | `focus_master` | 1,000 cumulative Pomodoro minutes |
| Century Club | `century_club` | Complete 100 tasks |
| First Week Champion | `first_week` | 7 consecutive active days |

---

## 🔒 Security

- **Passwords** are hashed with `bcrypt` and never returned by the API.
- **SQL injection protection**: all queries use PDO prepared statements.
- **User scoping**: every query filters by `user_id`, so users can only access their own data.
- **JWT auth**: protected endpoints require `Authorization: Bearer <token>` and return `401` otherwise.

### Before deploying publicly

- Set a strong, private JWT secret through an environment variable. Never commit real secrets.
- Restrict CORS in `Response.php` from `*` to your frontend's domain.
- Use a non-root MySQL user with a strong password.
- Remove or change the seeded demo account.
- Serve everything over HTTPS.

---

## 🛠️ Troubleshooting

| Problem | Possible cause | Solution |
|---|---|---|
| Apache won't start | Port 80/443 used by another service (IIS, Skype, VMware) | In XAMPP click **Config** → `httpd.conf` and change `Listen 80` to `Listen 8080`, or stop the conflicting service. |
| MySQL won't start | Port 3306 in use or crashed process | Stop other MySQL services, or check `C:\xampp\mysql\data\mysql_error.log`. |
| Port 3306 conflict | Another MySQL installed | Change the XAMPP MySQL port to `3307` in `my.ini` and update the port in `backend/config/database.php`. |
| Database connection failure | MySQL stopped or wrong credentials | Make sure MySQL is green; username `root`, empty password, host `127.0.0.1`. |
| API returns 404 | `focusforge` junction missing in `htdocs` | Re-run the `mklink /J` command from Step 6, or copy the `backend` folder. |
| CORS / preflight error | `mod_headers` disabled | Enable `mod_headers` in `httpd.conf`. `Response.php` already sends CORS headers and handles `OPTIONS`. |
| `npm install` fails | Old Node.js or network timeout | Use Node 18+ (`node -v`), run `npm cache clean --force`, retry. |
| Port 5173 in use | Another Vite process running | Vite tries 5174 automatically, or stop the other process. |
| Frontend can't reach API | Proxy target wrong or Apache stopped | Check the proxy in `vite.config.js` and test the health URL directly. |
| 401 Unauthorized | Expired or missing JWT | Log out and log in again to get a fresh token. |

---

## ☁️ Deployment Note

GitHub Pages cannot run this app because it needs PHP and MySQL. To host it online:

1. Deploy the `backend` folder to PHP hosting (or a VPS) with a MySQL database and import `focusforge_mysql.sql`.
2. Run `npm run build` in `frontend` and host the `dist` folder on Vercel, Netlify or similar.
3. Point Axios at your live API URL instead of relying on the Vite dev proxy.

---

## ✅ Local Verification Checklist

- [ ] Apache and MySQL are green in XAMPP
- [ ] `focusforge` database imported with 14 tables
- [ ] Health URL returns `{"status": "ok", "dbMode": "mysql"}`
- [ ] `npm install` completes without errors
- [ ] `npm run dev` serves the app at `http://localhost:5173/`
- [ ] Demo login redirects to `/dashboard`
- [ ] Dashboard shows score, XP bar, streak and today's tasks
- [ ] Profile edits and new tasks persist after refresh

---

## 👩‍💻 Author

Built by **Riya Bhamare**.