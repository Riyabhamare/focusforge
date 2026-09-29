# FOCUSFORGE: GAMIFIED PRODUCTIVITY AND TASK MANAGEMENT SYSTEM
## Academic Project Report (B.Tech Computer Engineering)

---

# 1. TITLE PAGE

```
================================================================================
                                   A PROJECT REPORT ON

                                       FOCUSFORGE
                 Gamified Productivity and Task Management System

================================================================================

                                       Submitted by:

                     [Student Name 1]       (Roll No: [Roll Number 1])
                     [Student Name 2]       (Roll No: [Roll Number 2])
                     [Student Name 3]       (Roll No: [Roll Number 3])
                     [Student Name 4]       (Roll No: [Roll Number 4])

                                 Class / Division / Batch:
                                   [Class / Division / Batch]

                            Under the Esteemed Guidance of:
                                    [Guide Name]
                              [Designation of Guide]
                        Department of Computer Engineering

================================================================================

                             In Partial Fulfillment of the
                      Requirements for the Award of the Degree of

                                BACHELOR OF TECHNOLOGY
                                          IN
                                 COMPUTER ENGINEERING

================================================================================

                           DEPARTMENT OF COMPUTER ENGINEERING
                               [Name of the College / Institute]
                             [Affiliated to / Name of University]
                                  [City, State, PIN Code]
                                  ACADEMIC YEAR: [2025–2026]
================================================================================
```

---

# 2. INTRODUCTION

Personal productivity management represents one of the most critical challenges confronting students, software engineers, and knowledge workers in modern academic and professional environments. While digital devices offer unprecedented access to information, they simultaneously introduce cognitive fragmentation, pervasive digital distractions, and disorganized workflow patterns. Individuals routinely attempt to balance academic coursework, software development milestones, daily habits, personal wellness routines, and long-term career aspirations. However, standard scheduling methods—such as physical planners, fragmented note-taking utilities, and static to-do applications—frequently fail because they treat human motivation as purely mechanical, failing to provide immediate positive reinforcement, centralized feedback loops, or dynamic progress visualization.

A fundamental cause of productivity attrition is the absence of intrinsic and extrinsic motivational feedback. In conventional task managers, checking off a critical task or maintaining a rigorous habit yields minimal psychological payoff, leading to rapid user burnout, broken streaks, and task abandonment. Psychological and behavioral economics research underscores the efficacy of gamification—the integration of game design principles, such as experience points (XP), player progression tiers, streak mechanics, and milestone trophies, into non-gaming contexts. By translating mundane tasks and routines into tangible progression markers, gamification activates neurochemical reward pathways, fostering sustained consistency, focus, and a sense of mastery.

**FocusForge** was conceived, architected, and engineered to bridge this gap by delivering a centralized, gamified productivity ecosystem. Operating as a responsive full-stack web application powered by a React frontend, an asynchronous PHP RESTful backend, and a relational MySQL database running in the local XAMPP environment, FocusForge unifies daily task planning, habit streak tracking, weekly timetable time-blocking, interval-based Pomodoro focus tracking, markdown documentation, and milestone management. By binding every completed task and habit to dynamic XP accumulation, real-time level computations, and unlockable achievement badges, FocusForge transforms arduous personal discipline into an engaging, quantifiable quest for mastery.

---

# 3. PROBLEM STATEMENT

Contemporary productivity tracking suffers from acute platform fragmentation, poor motivational mechanics, and inadequate progress transparency. Specifically, modern computer engineering students and knowledge professionals encounter the following persistent challenges:

1. **Scattered Task and Information Management**: Users frequently distribute their responsibilities across disjointed utilities—such as separate applications for to-do items, habit checklists, weekly calendar schedules, and study notes. This lack of centralization causes context-switching overhead and missed deadlines.
2. **Difficulty in Habit Formation and Consistency**: Building positive daily habits (e.g., algorithmic coding practice, textbook reading, health routines) demands consistent daily repetition. Traditional tools fail to highlight streak momentum or penalize missed days through meaningful visual feedback.
3. **Lack of Motivational Payoff and Gamified Incentives**: Conventional productivity software provides passive, transactional checklists that lack psychological incentives, causing users to abandon routines within days.
4. **Poor Multi-Pillar Progress Visibility**: Existing tools rarely calculate an aggregated, multi-dimensional score that evaluates an individual's complete day across planned tasks, completed habits, scheduled timetable adherence, and dedicated deep-work focus sessions.
5. **Data Isolation and Lack of Seamless Cross-Device Accessibility**: Many productivity tools are either bloated native desktop installations or cloud-locked applications requiring persistent paid subscriptions, lacking a lightweight, self-hosted web implementation accessible across varied viewports.

Therefore, the objective of this project is to design, develop, and deploy **FocusForge**—a full-stack, gamified productivity and task management web application that resolves scattered workflows, provides real-time progress analytics, and reinforces discipline through a robust RPG-inspired progression engine.

---

# 4. OBJECTIVES

The primary engineering and functional objectives achieved in the development of FocusForge include:

1. **Architecting a Robust Full-Stack Web Platform**: Design and implement a modular, responsive Single Page Application (SPA) using React 18 and Vite, backed by an object-oriented PHP 8+ REST API and a relational MySQL database running in XAMPP.
2. **Implementing Secure Stateless Authentication**: Develop token-based JSON Web Token (JWT) authentication with bcrypt password hashing and user-scoped data access to ensure multi-user isolation and data privacy.
3. **Developing Comprehensive Task Lifecycle Management**: Build full CRUD (Create, Read, Update, Delete) task workflows featuring priority stratification (High, Medium, Low), categorical classification (Coding, Study, Work, Health, General), target completion dates, and dynamic completion toggling.
4. **Engineering an Active Habit and Streak Tracking Engine**: Create daily habit check-in mechanisms that automatically compute active and longest consecutive streaks, logging historical compliance into dedicated relational tables.
5. **Constructing a Weekly Timetable Time-Blocking System**: Implement a visual 7-day weekly schedule matrix enabling users to allocate prioritized time slots to specific categories with customizable color codes.
6. **Integrating Interval-Based Pomodoro Focus Telemetry**: Provide an active Pomodoro timer logging deep-work intervals (25-minute default) directly into the database to quantify focused study hours.
7. **Formulating an Algorithmic RPG Gamification Core**: Formulate and execute dynamic mathematical algorithms for experience points ($XP$), level progressions ($\text{Level} = \lfloor 1 + \sqrt{\text{XP}/250} \rfloor$), and automatic milestone badge triggers (e.g., Early Bird, Consistent Crusader, Century Club).
8. **Synthesizing Consolidated Dashboard Telemetry and Analytics**: Engineer an aggregated daily productivity scoring algorithm combining task completion, habit execution, timetable compliance, and Pomodoro focus minutes into a single 0–100 index visualized via interactive charts.
9. **Ensuring Flawless Cross-Device Responsive Layout**: Implement an adaptive CSS design system supporting seamless operation across standard desktop viewports, tablets, and mobile screens (from 320px to 430px) without horizontal scrolling or UI distortion.

---

# 5. SCOPE OF THE PROJECT

### 5.1 Target Users
- Undergraduate and graduate engineering students balancing heavy coursework, laboratory assignments, and project deliverables.
- Software developers, competitive programmers, and tech professionals requiring time-boxed coding blocks, structured habits, and documentation storage.
- Self-directed learners and knowledge workers seeking an intuitive, gamified alternative to complex commercial project management software.

### 5.2 Current Scope (Implemented and Verified Features)
- **Authentication & Security**: Secure registration, login, guest/demo warrior login, JWT issuance, and bcrypt password encryption.
- **Task Management**: Comprehensive task creation, priority levels, categories, due dates, completion state toggling, and task editing.
- **Habit & Streak System**: Daily habit creation, frequency tracking, one-click completion logging, and continuous streak calculations.
- **Time-Blocking Timetable**: 7-day weekly grid for scheduling study, coding, work, and wellness blocks with visual color indicators.
- **Gamification Engine**: Automatic calculation of XP points upon task (+10 XP) and habit (+25 XP) completion, algorithmic level up detection, and automatic badge award evaluation.
- **Executive Dashboard**: Unified telemetry displaying daily productivity scores, streak badges, level progress bars, and high-priority action items.
- **Deep-Work Pomodoro Tracker**: Configurable focus timer with automatic session logging into the database.
- **Markdown Notes & Documentation**: Integrated notes module with support for markdown syntax, tagging, and cross-linking to specific tasks and goals.
- **Productivity Analytics**: Daily, weekly, and monthly visual graphs rendered via Recharts, including category distributions and streak heatmaps.
- **Unified Monthly Calendar**: Consolidated view uniting calendar events, scheduled tasks, and habit milestones.
- **Profile & Settings Management**: Custom warrior avatar selection, username modification, display name customization, and persistent theme switching (Dark / Light mode).
- **Responsive Web Access**: Fully optimized fluid layout verified on mobile (320px–430px), tablet (768px–820px), and desktop (1024px–1440px) screen resolutions.

### 5.3 Future Scope (Post-Academic Roadmap)
- Migration from local XAMPP Apache/MySQL hosting to production cloud infrastructure (e.g., AWS EC2/RDS or DigitalOcean).
- Implementation of WebSockets or Server-Sent Events (SSE) for real-time multi-device synchronization and multiplayer team quests.
- Native mobile application builds using React Native or Capacitor for background push notifications and home screen widgets.
- Integration with third-party calendar APIs (e.g., Google Calendar, Outlook) for two-way schedule synchronization.
- Machine Learning (ML) recommendation engine to analyze historical completion trends and suggest optimal daily study timetables.

---

# 6. PROPOSED SYSTEM / SYSTEM ARCHITECTURE

### 6.1 Architectural Overview
FocusForge is built upon a 3-tier, decoupled client-server architecture. The presentation tier (Frontend) is completely decoupled from the application logic tier (Backend), communicating strictly via asynchronous HTTP JSON REST requests. The application logic tier interfaces with the persistent data tier (Database) using PHP Data Objects (PDO) with prepared statements.

#### System Architecture Flow Diagram (Text Representation):

```
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|                        End-User Web Browser                             |
|          (Desktop 1920x1080 / Tablet 768x1024 / Mobile 393x852)         |
+-------------------------------------------------------------------------+
                                    │
                                    │ HTTP / HTTPS (Vite Port 5173)
                                    ▼
+-------------------------------------------------------------------------+
|                           FRONTEND LAYER                                |
|                   Single Page Application (SPA)                         |
|  - React 18.3.1 (Virtual DOM, Hooks, Context API)                       |
|  - React Router DOM 6.28.2 (Client-Side Navigation & Route Guards)       |
|  - Centralized Axios API Service (`api.js`) with JWT Request Interceptor |
|  - Recharts (Data Visualization) & Lucide React (Visual Icons)          |
|  - Theme Context (Dark / Light Mode) & Gamification Audio/Modal Engine  |
+-------------------------------------------------------------------------+
                                    │
                                    │ Asynchronous JSON Requests (/api/*)
                                    │ Reverse Proxy (Vite Dev / Apache Rewrite)
                                    ▼
+-------------------------------------------------------------------------+
|                           BACKEND LAYER                                 |
|            XAMPP Apache HTTP Server (Port 80) + PHP 8+ Engine           |
|  - `backend/index.php`: Master RESTful Router & Path Normalizer         |
|  - `AuthMiddleware.php`: Bearer Token Extraction & JWT Validation       |
|  - Specialized Controllers:                                             |
|      * AuthController, UserController, TaskController, HabitController  |
|      * StreakController, TimetableController, AnalyticsController      |
|      * GoalController, NoteController, CalendarController               |
|      * PomodoroController, BadgeController                              |
|  - Utilities & Gamification Engine:                                     |
|      * `Jwt.php` (HMAC-SHA256 Token Encoder / Decoder)                  |
|      * `Gamification.php` (Level, XP, Streak, and Badge Evaluator)      |
|      * `DailyScore.php` (Multi-Pillar Productivity Score Computation)   |
|      * `Response.php` (Standardized JSON Payloads & CORS Headers)       |
+-------------------------------------------------------------------------+
                                    │
                                    │ Parameterized SQL via PDO
                                    ▼
+-------------------------------------------------------------------------+
|                           DATABASE LAYER                                |
|                     MySQL / MariaDB (Port 3306)                         |
|  - Database: `focusforge` (utf8mb4_unicode_ci)                           |
|  - Relational Schema with Foreign Key Constraints & Cascading Deletes   |
|  - 14 Persistent Tables: `users`, `tasks`, `habits`, `habit_logs`,      |
|    `streaks`, `daily_activity`, `timetable_blocks`, `goals`, `notes`,   |
|    `calendar_events`, `pomodoro_sessions`, `badges`, `user_badges`,     |
|    `xp_log`                                                             |
+-------------------------------------------------------------------------+
```

### 6.2 Layer Descriptions

1. **Frontend Presentation Layer**: Built with React 18, utilizing the component-driven paradigm. State management is handled through native React Hooks (`useState`, `useEffect`, `useCallback`) and React Context providers (`AuthContext`, `GamificationContext`, `ThemeContext`). Dynamic styling is managed via a centralized, glassmorphism-styled CSS design token system (`index.css`), ensuring responsive rendering across all breakpoints.
2. **Backend API Logic Layer**: Implemented in clean, modern PHP 8+ using an object-oriented controller-model pattern. The application features a front-controller routing mechanism (`index.php`) that parses incoming URIs, normalizes path prefixes, handles CORS preflight `OPTIONS` requests, and delegates execution to designated controller classes.
3. **Database & Persistence Layer**: Hosted on MySQL/MariaDB via XAMPP. Centralized PDO database connections enforce strict exception handling (`PDO::ERRMODE_EXCEPTION`) and disabled prepared statement emulation (`PDO::ATTR_EMULATE_PREPARES => false`) to eliminate SQL injection vulnerabilities.
4. **Authentication & Session Flow**: Employs stateless JSON Web Tokens signed with HMAC-SHA256. Upon successful authentication, the token is delivered to the client and stored in `localStorage`. Subsequent HTTP requests pass the token inside the `Authorization: Bearer <token>` header, verified server-side by `AuthMiddleware`.

### 6.3 Data Flow Sequences

#### 1. Data Flow: User Login
```
User -> [Enter Credentials] -> LoginPage (React)
  -> authApi.login(email, password) -> Axios POST /api/auth/login
  -> Apache (XAMPP Port 80) -> backend/index.php -> AuthController::login()
  -> PDO Query: SELECT * FROM users WHERE email = ?
  -> password_verify(password, password_hash)
  -> Jwt::encode(['id' => $user['id'], 'email' => $user['email']])
  -> Response::json(['token' => $jwt, 'user' => $userData])
  -> React AuthContext saves token to localStorage -> Redirect to /dashboard
```

#### 2. Data Flow: Profile Update
```
User -> [Edit Display Name] -> ProfilePage / SettingsPage
  -> userApi.updateProfile({ name: 'New Name' }) -> Axios PUT /api/user/settings
  -> AuthMiddleware extracts JWT & identifies user_id
  -> UserController::updateSettings($userId)
  -> PDO Query: UPDATE users SET name = ? WHERE id = ?
  -> Response::json(['success' => true, 'user' => $updatedUserData])
  -> AuthContext updates local state -> UI reflects updated name immediately
```

#### 3. Data Flow: Task Creation & Gamified Completion
```
Task Creation:
User -> [Fill Task Form] -> AddTaskPage
  -> taskApi.create({ title, category, priority, due_date, estimated_minutes })
  -> TaskController::createTask($userId)
  -> PDO Query: INSERT INTO tasks (user_id, title, ...) VALUES (?, ?, ...)
  -> Response::json(['success' => true, 'task' => $newTask])

Task Completion:
User -> [Click Complete Checkbox] -> TaskCard.jsx
  -> taskApi.complete(taskId) -> PATCH /api/tasks/{id}/complete
  -> TaskController::completeTask($taskId, $userId)
  -> PDO Query: UPDATE tasks SET status = 'completed', completed_at = NOW() WHERE id = ?
  -> Gamification::addXp($userId, 10, 'Completed task: ...')
  -> PDO Query: INSERT INTO xp_log, UPDATE users SET xp = xp + 10
  -> Gamification::updateStreak($userId)
  -> Gamification::checkAndAwardBadges($userId)
  -> Response::json(['success' => true, 'xpGained' => 10, 'leveledUp' => bool])
  -> GamificationContext triggers audio chime and LevelUpModal if level increased
```

#### 4. Data Flow: Consolidated Dashboard Data Retrieval
```
User -> [Navigate to /dashboard] -> DashboardPage.jsx
  -> userApi.getDashboard() -> Axios GET /api/dashboard
  -> AuthMiddleware validates JWT Bearer token
  -> Controller queries:
      1. UserModel::findById($userId)
      2. UserModel::getStatsSummary($userId)
      3. TaskModel::findAll($userId, ['status' => 'all'])
      4. HabitModel::findAll($userId)
      5. StreakModel::getByUserId($userId)
      6. DailyScore::calculate($userId, today)
  -> Response::json({ user, stats, tasks, habits, streak, dailyScore })
  -> Dashboard renders XP progression, daily circular score, streaks, and urgent tasks
```

---

# 7. HARDWARE REQUIREMENTS

The application has been engineered to run efficiently on standard consumer-grade development hardware and client workstations.

### Table 7.1: Local Development & Server Hardware Requirements
| Parameter | Minimum Requirement | Recommended Specification |
|---|---|---|
| **Processor (CPU)** | Intel Core i3 (4th Gen) / AMD Ryzen 3 or equivalent (2.0 GHz) | Intel Core i5 / i7 (8th Gen+) or AMD Ryzen 5 / Apple Silicon |
| **Random Access Memory (RAM)**| 4 GB DDR3/DDR4 | 8 GB or 16 GB DDR4/DDR5 |
| **Secondary Storage** | 2 GB available free disk space (HDD) | 10 GB available SSD storage (NVMe/SATA) |
| **Display Monitor** | 1366 × 768 resolution | 1920 × 1080 (Full HD) or higher |
| **Input Devices** | Standard Keyboard and Optical Mouse | Standard Keyboard and Precision Mouse / Trackpad |
| **Network Interface** | Local loopback adapter (127.0.0.1) | 100/1000 Mbps Ethernet or 802.11ac Wi-Fi |

### Table 7.2: Client Device Hardware Requirements
| Parameter | Mobile Devices | Desktop / Laptop |
|---|---|---|
| **Screen Resolution** | 320 × 568 px (minimum), 393 × 852 px (standard) | 1024 × 768 px (minimum), 1920 × 1080 px (standard) |
| **System Memory** | 2 GB RAM | 4 GB RAM |
| **Browser Compatibility** | Chrome Mobile, Safari Mobile, Edge Mobile | Chrome 90+, Firefox 88+, Edge 90+, Safari 14+ |

---

# 8. SOFTWARE REQUIREMENTS

### Table 8.1: Verified Software Stack & Environment
| Software Component | Verified Technology & Exact Version | Purpose in FocusForge |
|---|---|---|
| **Operating System** | Microsoft Windows 10 / 11 (64-bit) | Local development and hosting operating system |
| **Web Server Environment**| XAMPP for Windows (Version 8.0+) | Integrated runtime for Apache HTTP Server and MySQL |
| **HTTP Web Server** | Apache HTTP Server 2.4.x | Serves backend PHP scripts with `mod_rewrite` enabled |
| **Backend Language** | PHP 8.1+ / 8.2+ | Server-side execution engine, business logic, REST APIs |
| **Database Engine** | MySQL 8.0+ / MariaDB 10.4+ | Relational database management system |
| **Frontend Framework** | React 18.3.1 | Declarative component UI library |
| **DOM Renderer** | React DOM 18.3.1 | Document Object Model rendering engine |
| **Client Router** | React Router DOM 6.28.2 | Client-side routing, route protection, history management |
| **Build & Dev Tool** | Vite 6.1.0 (with `@vitejs/plugin-react` 4.3.4) | Fast Hot Module Replacement (HMR) bundler and proxy |
| **Runtime Environment** | Node.js (v18.x or v20.x) with npm (v9.x or v10.x)| JavaScript package manager and frontend dev runner |
| **HTTP Client** | Axios 1.7.9 | Promise-based asynchronous HTTP client for browser |
| **Data Visualization** | Recharts 2.15.1 | Composable SVG-based charting library |
| **Iconography Library**| Lucide React 0.475.0 | Modern SVG iconography set |
| **Code Editor / IDE** | Visual Studio Code (VS Code) | Code authoring, debugging, and terminal management |

---

# 9. PROJECT SETUP, INSTALLATION AND EXECUTION

This section provides a comprehensive, beginner-friendly setup guide. A developer with no prior exposure to FocusForge can follow these sequential instructions to run the application from scratch.

### 9.1 Prerequisites
Before beginning, verify that the target computer has the following software installed:
1. **XAMPP** (containing Apache 2.4+ and MySQL/MariaDB): [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. **Node.js** (LTS version 18.x or 20.x): [https://nodejs.org/](https://nodejs.org/)
3. **Modern Web Browser**: Google Chrome, Mozilla Firefox, or Microsoft Edge.
4. **Git** (optional, for repository management).

Verify installations in Command Prompt / PowerShell:
```cmd
node -v
npm -v
php -v
```

### 9.2 Obtaining the Project
Extract the project archive or navigate to the workspace directory:
```
c:\Users\Riya Bhamare\OneDrive\Documents\b-tech\5th sem\wtl\final wtl project\focus_forge\project_wtl
```

### 9.3 Project Directory Structure
```
project_wtl/
├── database/
│   └── focusforge_mysql.sql       # Complete MySQL schema, indexes, constraints & seed data
├── backend/
│   ├── config/
│   │   └── database.php           # Centralized PDO connection with MySQL fallback
│   ├── middleware/
│   │   └── AuthMiddleware.php     # Bearer JWT verification & session scoping
│   ├── utils/
│   │   ├── Response.php           # Standardized JSON responses & CORS header handler
│   │   ├── Jwt.php                # Lightweight HMAC-SHA256 JWT encoder & decoder
│   │   ├── Gamification.php       # XP rewards, level calculations, streaks & badge logic
│   │   └── DailyScore.php         # Multi-pillar daily productivity score formula
│   ├── models/                    # Data access models (UserModel, TaskModel, etc.)
│   ├── controllers/               # Route logic controllers (AuthController, TaskController, etc.)
│   ├── api/                       # Direct access endpoints & routing scripts
│   ├── index.php                  # Master REST API router
│   └── .htaccess                  # Apache mod_rewrite router & Authorization header pass-through
├── frontend/
│   ├── package.json               # Frontend dependencies & scripts
│   ├── vite.config.js             # Vite development server config & backend proxy
│   ├── index.html                 # Single-page HTML entry point
│   └── src/
│       ├── services/api.js        # Centralized Axios API service with JWT interceptor
│       ├── context/               # React Contexts (AuthContext, GamificationContext, ThemeContext)
│       ├── components/            # Reusable UI components
│       ├── pages/                 # 25 Complete application pages
│       └── index.css              # Centralized glassmorphic design token stylesheet
└── README.md                      # Developer documentation and execution instructions
```

### 9.4 XAMPP Setup & Web Server Configuration
1. Open the **XAMPP Control Panel** (`C:\xampp\xampp-control.exe`).
2. Click **Start** adjacent to **Apache**. Verify that the module turns green and indicates port 80 (or 443).
3. Click **Start** adjacent to **MySQL**. Verify that the module turns green and indicates port 3306.
4. Link the backend to XAMPP's `htdocs` directory:
   - **Method A (Recommended Directory Junction)**: Open Command Prompt as Administrator and run:
     ```cmd
     mklink /J C:\xampp\htdocs\focusforge "c:\Users\Riya Bhamare\OneDrive\Documents\b-tech\5th sem\wtl\final wtl project\focus_forge\project_wtl"
     ```
   - **Method B (Direct Copy)**: Copy the `backend` folder to `C:\xampp\htdocs\focusforge\backend`.
5. Test Apache configuration by navigating to:
   `http://localhost/focusforge/backend/api/health`
   The browser should output: `{"status":"ok","appName":"FocusForge PHP API","dbMode":"mysql",...}`.

### 9.5 Database Setup
1. Launch your browser and navigate to phpMyAdmin:
   `http://localhost/phpmyadmin/`
2. Click **New** in the left sidebar.
3. Enter the database name: `focusforge`.
4. Select collation `utf8mb4_unicode_ci` and click **Create**.
5. Select the newly created `focusforge` database, navigate to the **Import** tab.
6. Click **Choose File**, select `database/focusforge_mysql.sql`, and click **Import** (or **Go**).
7. Confirm that all 14 tables are populated with initial seed records.

*Command Line Alternative:*
```cmd
C:\xampp\mysql\bin\mysql.exe -u root focusforge < "c:\Users\Riya Bhamare\OneDrive\Documents\b-tech\5th sem\wtl\final wtl project\focus_forge\project_wtl\database\focusforge_mysql.sql"
```

### 9.6 PHP Backend Configuration
The database parameters are declared in `backend/config/database.php`:
- **DB_HOST**: `127.0.0.1` (or `localhost`)
- **DB_PORT**: `3306`
- **DB_NAME**: `focusforge`
- **DB_USER**: `root`
- **DB_PASSWORD**: `""` *(empty string by default in XAMPP)*

If custom credentials are required, define them via operating system environment variables or modify `database.php` accordingly.

### 9.7 Frontend Setup
Open PowerShell or Terminal in the frontend directory and install dependencies:
```bash
cd "c:\Users\Riya Bhamare\OneDrive\Documents\b-tech\5th sem\wtl\final wtl project\focus_forge\project_wtl\frontend"
npm install
```

### 9.8 Frontend-PHP Connection & Proxy Configuration
In `frontend/vite.config.js`, the Vite proxy is pre-configured to forward API calls seamlessly:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost/focusforge/backend',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
```
This enables the React client on `http://localhost:5173` to dispatch requests to `/api/*` without triggering cross-origin browser blocking.

### 9.9 Running the Complete Project (Step-by-Step Order)
1. **Launch XAMPP**: Start `xampp-control.exe`.
2. **Start Apache**: Click Start (Port 80 active).
3. **Start MySQL**: Click Start (Port 3306 active).
4. **Verify Database**: Confirm tables in phpMyAdmin at `http://localhost/phpmyadmin/`.
5. **Start Frontend Dev Server**:
   ```bash
   cd project_wtl/frontend
   npm run dev
   ```
6. **Open Browser**: Launch Google Chrome or Microsoft Edge.
7. **Access Application**: Navigate to `http://localhost:5173/`.

### 9.10 First-Time Usage & Feature Verification
1. **Login**: Click **Login** on the navigation bar. Enter the pre-seeded demo credentials:
   - **Email**: `demo@focusforge.app`
   - **Password**: `password123`
   *(Or click "Demo Warrior Login" for 1-click access).*
2. **Explore Dashboard**: View current warrior rank, XP level progress bar, today's productivity score, and active streak.
3. **Create a Task**: Navigate to `/tasks/new`, fill in title, category (`Coding`), priority (`High`), due date, and save.
4. **Complete a Task**: On `/tasks/today`, click the checkbox. Observe +10 XP added and visual completion state.
5. **Log a Habit**: Navigate to `/habits`, click the completion checkmark on "Code for 1 Hour". Observe +25 XP reward.
6. **Create a Goal**: Navigate to `/goals`, add a milestone with target date and target percentage.
7. **Verify Profile Persistence**: Navigate to `/profile`, edit display name to `"Riya Bhamare (Champion)"`, save changes, return to `/dashboard` to observe updated greeting, and refresh the browser to confirm data persistence in MySQL.

### 9.11 Troubleshooting Matrix
| Problem | Possible Cause | Solution |
|---|---|---|
| **Apache fails to start in XAMPP** | Port 80 or 443 is blocked by IIS, Skype, or VMware. | In XAMPP, open `httpd.conf`, change `Listen 80` to `Listen 8080`, or disable conflicting services via `services.msc`. |
| **MySQL fails to start in XAMPP** | Port 3306 in use or corrupt PID lock file. | Terminate rogue `mysqld.exe` processes via Task Manager or remove corrupted `aria_log_control` in `C:\xampp\mysql\data`. |
| **MySQL Port 3306 Conflict** | Standalone MySQL / MariaDB already installed on machine. | Change XAMPP MySQL port to `3307` in `my.ini` and set `DB_PORT=3307` in `backend/config/database.php`. |
| **Frontend Port 5173 Conflict** | Another Vite process is already running on port 5173. | Vite automatically offers port 5174, or kill node tasks using `Stop-Process -Name node -Force` in PowerShell. |
| **Database Connection Failure** | MySQL is offline or wrong credentials in `database.php`. | Confirm MySQL is green in XAMPP. Verify host is `127.0.0.1`, user is `root`, and password is empty `""`. |
| **PHP API returns 404 Not Found** | Missing symlink or folder name mismatch in `C:\xampp\htdocs`. | Re-create symlink: `mklink /J C:\xampp\htdocs\focusforge "<path-to-project_wtl>"`. |
| **CORS / Preflight Failure** | Apache headers module disabled or rewrite rule error. | Verify Apache `mod_headers` and `mod_rewrite` are active in `httpd.conf`. `Response.php` automatically emits wildcard CORS headers. |
| **`npm install` fails in frontend** | Node version mismatch or corrupted npm cache. | Clear cache via `npm cache clean --force` and run `npm install` using Node.js LTS 18+ or 20+. |
| **Frontend unable to call backend** | Proxy target mismatch in `vite.config.js`. | Check that proxy target matches `http://localhost/focusforge/backend`. Test `http://localhost/focusforge/backend/api/health` directly. |
| **401 Unauthorized errors** | Expired, invalid, or missing JWT token in browser. | Log out from the UI and log in again with `demo@focusforge.app`. A fresh token will be written to `localStorage`. |

### 9.12 Verification Checklist
- [x] Apache web server is running on port 80.
- [x] MySQL database server is running on port 3306.
- [x] Database `focusforge` successfully imported with 14 relational tables.
- [x] PHP health endpoint `http://localhost/focusforge/backend/api/health` returns HTTP 200 JSON status.
- [x] Frontend packages installed without errors via `npm install`.
- [x] Vite dev server active on `http://localhost:5173/`.
- [x] Authentication and JWT generation functioning.
- [x] Dashboard aggregates telemetry and calculates daily score.
- [x] Tasks, habits, goals, notes, and timetable updates persist permanently in MySQL.

---

# 10. DATABASE DESIGN

The FocusForge database schema comprises 14 normalized relational tables operating under the `InnoDB` storage engine with `utf8mb4_unicode_ci` character encoding.

### Table 10.1: Relational Database Schema Summary
| Table Name | Purpose | Primary Key | Foreign Keys & Constraints |
|---|---|---|---|
| `users` | Stores warrior credentials, profile avatar, total XP, and current level | `id` (INT) | None |
| `tasks` | Stores planned to-do tasks, priority, category, due date, and status | `id` (INT) | `user_id` $\rightarrow$ `users(id)` ON DELETE CASCADE |
| `habits` | Stores habitual routines, category, target frequency, and target count | `id` (INT) | `user_id` $\rightarrow$ `users(id)` ON DELETE CASCADE |
| `habit_logs` | Logs daily completion records for habits on specific calendar dates | `id` (INT) | `habit_id` $\rightarrow$ `habits(id)` ON DELETE CASCADE; UNIQUE(`habit_id`, `date`) |
| `streaks` | Tracks active continuous streaks, longest streaks, and last active date | `id` (INT) | `user_id` $\rightarrow$ `users(id)` ON DELETE CASCADE; UNIQUE(`user_id`) |
| `daily_activity`| Stores aggregated daily activity points and intensity buckets (0–4) | `id` (INT) | `user_id` $\rightarrow$ `users(id)` ON DELETE CASCADE; UNIQUE(`user_id`, `date`) |
| `timetable_blocks`| Stores weekly 7-day scheduled time blocks with color codes and times | `id` (INT) | `user_id` $\rightarrow$ `users(id)` ON DELETE CASCADE |
| `goals` | Stores long-term milestone goals, descriptions, target dates, and % progress| `id` (INT) | `user_id` $\rightarrow$ `users(id)` ON DELETE CASCADE |
| `notes` | Stores markdown notes with tags and optional links to tasks/goals | `id` (INT) | `user_id` $\rightarrow$ `users(id)` ON DELETE CASCADE |
| `calendar_events`| Stores custom calendar events, date/time markers, and reference links | `id` (INT) | `user_id` $\rightarrow$ `users(id)` ON DELETE CASCADE |
| `pomodoro_sessions`| Records completed deep-work focus sessions with duration in minutes | `id` (INT) | `user_id` $\rightarrow$ `users(id)` ON DELETE CASCADE |
| `badges` | Master definitions of unlockable achievement badges and icons | `id` (INT) | UNIQUE(`key`) |
| `user_badges` | Relational join table mapping unlocked badges to specific users | `id` (INT) | `user_id` $\rightarrow$ `users(id)`, `badge_id` $\rightarrow$ `badges(id)`; UNIQUE(`user_id`, `badge_id`) |
| `xp_log` | Historical audit log of every experience point transaction and reason | `id` (INT) | `user_id` $\rightarrow$ `users(id)` ON DELETE CASCADE |

---

# 11. ENTITY-RELATIONSHIP (ER) DIAGRAM

### 11.1 Entities and Key Attributes
1. **USER**: `{id (PK), name, email, password_hash, avatar, xp, level, created_at, updated_at}`
2. **TASK**: `{id (PK), user_id (FK), title, description, category, priority, status, due_date, estimated_minutes, completed_at, created_at}`
3. **HABIT**: `{id (PK), user_id (FK), title, category, frequency, target_count, created_at}`
4. **HABIT_LOG**: `{id (PK), habit_id (FK), date, completed, created_at}`
5. **STREAK**: `{id (PK), user_id (FK), current_streak, longest_streak, last_active_date}`
6. **DAILY_ACTIVITY**: `{id (PK), user_id (FK), date, activity_points, intensity_bucket}`
7. **TIMETABLE_BLOCK**: `{id (PK), user_id (FK), day_of_week, start_time, end_time, category, color, title}`
8. **GOAL**: `{id (PK), user_id (FK), title, description, target_date, status, progress_percent, created_at}`
9. **NOTE**: `{id (PK), user_id (FK), title, content_markdown, linked_task_id, linked_goal_id, tags, created_at}`
10. **CALENDAR_EVENT**: `{id (PK), user_id (FK), title, date, time, type, ref_id, created_at}`
11. **POMODORO_SESSION**: `{id (PK), user_id (FK), started_at, duration_minutes, task_id}`
12. **BADGE**: `{id (PK), key, name, description, icon}`
13. **USER_BADGE**: `{id (PK), user_id (FK), badge_id (FK), unlocked_at}`
14. **XP_LOG**: `{id (PK), user_id (FK), amount, reason, created_at}`

### 11.2 Text / ASCII ER Diagram

```
 +-------------------------+
 |          USERS          |
 |-------------------------|
 | PK  id                  |<---------+
 |     name                |          |
 |     email (UQ)          |          |
 |     password_hash       |          |
 |     avatar              |          |
 |     xp                  |          |
 |     level               |          |
 +-------------------------+          |
       | 1                            |
       |                              |
       | 1:N                          | 1:N
       +--------------------+---------+--------------------+--------------------+
       |                    |                              |                    |
       ▼                    ▼                              ▼                    ▼
+----------------+   +----------------+             +----------------+   +----------------+
|     TASKS      |   |     HABITS     |             |TIMETABLE_BLOCKS|   |     GOALS      |
|----------------|   |----------------|             |----------------|   |----------------|
| PK  id         |   | PK  id         |<---+        | PK  id         |   | PK  id         |
| FK  user_id    |   | FK  user_id    |    |        | FK  user_id    |   | FK  user_id    |
|     title      |   |     title      |    |        |     day_of_week|   |     title      |
|     priority   |   |     category   |    |        |     start_time |   |     target_date|
|     status     |   |     frequency  |    |        |     end_time   |   |     progress_% |
+----------------+   +----------------+    |        +----------------+   +----------------+
                            | 1            |
                            | 1:N          |
                            ▼              |
                     +----------------+    |
                     |   HABIT_LOGS   |    |
                     |----------------|    |
                     | PK  id         |    |
                     | FK  habit_id   |----+
                     |     date       |
                     |     completed  |
                     +----------------+

       +--------------------+---------+--------------------+--------------------+
       |                    |                              |                    |
       ▼                    ▼                              ▼                    ▼
+----------------+   +----------------+             +----------------+   +----------------+
|    STREAKS     |   | DAILY_ACTIVITY |             |POMODORO_SESSION|   |     NOTES      |
|----------------|   |----------------|             |----------------|   |----------------|
| PK  id         |   | PK  id         |             | PK  id         |   | PK  id         |
| FK  user_id    |   | FK  user_id    |             | FK  user_id    |   | FK  user_id    |
|     cur_streak |   |     date       |             |     duration_m |   |     title      |
|     long_streak|   |     act_points |             |     started_at |   |     markdown   |
+----------------+   +----------------+             +----------------+   +----------------+

       |                                                                        |
       | 1:N                                                                    | 1:N
       ▼                                                                        ▼
+----------------+   +----------------+             +----------------+   +----------------+
|     XP_LOG     |   |  USER_BADGES   |             |     BADGES     |   |CALENDAR_EVENTS |
|----------------|   |----------------|             |----------------|   |----------------|
| PK  id         |   | PK  id         |   N:1       | PK  id         |   | PK  id         |
| FK  user_id    |   | FK  user_id    |------------>|     key (UQ)   |   | FK  user_id    |
|     amount     |   | FK  badge_id   |             |     name       |   |     title      |
|     reason     |   |     unlocked_at|             |     icon       |   |     date       |
+----------------+   +----------------+             +----------------+   +----------------+
```

### 11.3 Cardinality Rules
- **USER to TASKS**: One-to-Many ($1:N$). A user can manage multiple tasks; each task belongs to one user.
- **USER to HABITS**: One-to-Many ($1:N$). A user defines multiple habits.
- **HABIT to HABIT_LOGS**: One-to-Many ($1:N$). Each habit has multiple date-stamped completion logs.
- **USER to STREAKS**: One-to-One ($1:1$). Each user possesses a single active streak record.
- **USER to DAILY_ACTIVITY**: One-to-Many ($1:N$). Records activity points for each calendar day.
- **USER to TIMETABLE_BLOCKS**: One-to-Many ($1:N$). Represents recurring weekly schedule entries.
- **USER to GOALS**: One-to-Many ($1:N$). A user can track multiple milestone goals.
- **USER to NOTES**: One-to-Many ($1:N$). A user writes multiple markdown notes.
- **USER to POMODORO_SESSIONS**: One-to-Many ($1:N$). Records individual focus sessions.
- **USER to BADGES (via USER_BADGES)**: Many-to-Many ($M:N$). A user can earn many badges; each badge can be awarded to many users.

---

# 12. IMPLEMENTATION

### 12.1 Frontend Implementation
The frontend is structured as a modular React 18 Single Page Application.
- **Routing**: `App.jsx` registers 25 distinct page routes utilizing `react-router-dom` v6. Protected routes are wrapped in a `<ProtectedRoute>` component that validates authentication status before rendering.
- **State Management**: React Context providers encapsulate cross-cutting concerns:
  - `AuthContext.jsx`: Manages user credentials, JWT tokens in `localStorage`, and login/logout state transitions.
  - `GamificationContext.jsx`: Listens to XP rewards, triggers sound notifications, and displays level-up modals.
  - `ThemeContext.jsx`: Manages dark/light theme switching with document attribute toggling.
- **API Communication**: The centralized Axios service (`api.js`) handles request serialization, token attachment via request interceptors, and automated logout redirection on 401 Unauthorized responses.

### 12.2 Backend Implementation
The backend is written in object-oriented PHP 8+ without heavy third-party framework overhead, optimizing execution speed in local environments.
- **Master Router (`backend/index.php`)**: Inspects `$_SERVER['REQUEST_URI']`, strips script directory prefixes, removes `.php` extensions, handles CORS headers via `Response::initCors()`, and routes requests to corresponding controllers.
- **Controllers**: Controller classes (`TaskController`, `HabitController`, etc.) read raw JSON payloads (`file_get_contents('php://input')`), invoke data models, and return structured JSON responses via `Response::json()`.

### 12.3 Authentication Module
- User registration validates input fields, verifies email uniqueness, hashes passwords using `password_hash($pwd, PASSWORD_BCRYPT)`, and initializes user records with default warrior attributes (XP: 0, Level: 1).
- Authentication generates stateless tokens via a custom, secure JWT implementation (`Jwt.php`) signed using HMAC-SHA256.
- The `AuthMiddleware` class extracts the token from `Authorization: Bearer <token>` (with Apache `HTTP_AUTHORIZATION` compatibility) and scopes all downstream queries to the authenticated `user_id`.

### 12.4 Database Implementation
- Database access is encapsulated within `backend/config/database.php` using the Singleton design pattern.
- All SQL transactions utilize parameterized PDO prepared statements (`$stmt->execute([$param])`), eliminating SQL injection vulnerabilities.
- Foreign key constraints enforce referential integrity with `ON DELETE CASCADE` actions.

### 12.5 Task Management Module
- Enables users to categorize tasks (Coding, Study, Work, Health, General) with three priority tiers (High, Medium, Low).
- Features dynamic filtering across "Today", "Upcoming", and "All" views.
- Toggling task completion stamps the `completed_at` timestamp and triggers the gamification engine (+10 XP).

### 12.6 Habit Management Module
- Enables users to establish recurring positive habits with daily or weekly frequencies.
- Habit check-ins insert or update records in `habit_logs` with a unique constraint on `(habit_id, date)`.
- Each completed habit yields +25 XP and automatically updates the user's active streak.

### 12.7 Goal Management Module
- Manages high-level milestones with targeted completion deadlines.
- Supports progress tracking via interactive slider adjustments ($0\% - 100\%$) and completion state toggles (+50 XP).

### 12.8 Focus & Productivity Tracking (Pomodoro)
- An interactive client-side timer enforces 25-minute focus intervals and 5-minute restorative breaks.
- Completed sessions are dispatched to `/api/pomodoro/sessions` and logged into the `pomodoro_sessions` table, contributing to the daily productivity score and unlocking focus badges.

### 12.9 Gamification Engine
The gamification engine (`Gamification.php`) implements three core algorithms:
1. **Level Progression Formula**:
   $$\text{Level}(\text{XP}) = \left\lfloor 1 + \sqrt{\frac{\text{XP}}{250}} \right\rfloor$$
   This non-linear square-root curve ensures attainable early milestones while maintaining long-term engagement.
2. **Streak Computation Logic**: Compares `last_active_date` with current date $T$. If $T - \text{lastActive} = 1\text{ day}$, streak increments by 1. If $T - \text{lastActive} > 1\text{ day}$, streak resets to 1.
3. **Automated Badge Evaluation**:
   - `early_bird`: Awarded upon completing $\ge 10$ habit logs before 9:00 AM.
   - `consistent`: Awarded upon reaching an active streak of $\ge 30$ days.
   - `focus_master`: Awarded upon accumulating $\ge 1,000$ Pomodoro minutes.
   - `century_club`: Awarded upon completing $\ge 100$ tasks.
   - `first_week`: Awarded upon reaching an active streak of $\ge 7$ days.

### 12.10 Executive Dashboard
The consolidated dashboard executes a unified backend endpoint (`GET /api/dashboard`) that computes the **Daily Productivity Score**:
$$\text{Score} = \min\left(100,\ 0.40 \cdot S_{\text{tasks}} + 0.30 \cdot S_{\text{habits}} + 0.15 \cdot S_{\text{timetable}} + 0.15 \cdot S_{\text{pomodoro}}\right)$$
Where:
- $S_{\text{tasks}} = \min(100, (\text{Completed} / \max(1, \text{Planned})) \times 100)$
- $S_{\text{habits}} = \min(100, (\text{Completed} / \max(1, \text{Total})) \times 100)$
- $S_{\text{timetable}} = \text{Weekly time-block adherence rate } (0\% - 100\%)$
- $S_{\text{pomodoro}} = \min(100, (\text{Focus Minutes} / 120) \times 100)$

### 12.11 Profile & Settings Management
- Users can customize their display name, warrior avatar (Warrior, Mage, Rogue, Paladin), and theme preferences.
- Changes are persisted to the `users` table via `PUT /api/user/settings` and reflected across the client interface.

### 12.12 Responsive Design Implementation
- Built with a fluid CSS flexbox and grid architecture in `index.css`.
- Uses modern CSS clamp functions (`clamp(1.1rem, 2.5vw, 1.75rem)`), dynamic container widths, and adaptive media queries (`@media (max-width: 768px)` and `@media (max-width: 480px)`).
- Eliminates horizontal overflow across all tested screen widths (320px, 360px, 393px, 414px, 768px, 1024px, 1440px).

---

# 13. SCREENSHOTS / RESULTS

The following figures illustrate the primary views of the implemented FocusForge web application:

- **Figure 13.1: User Authentication & Login Screen (`/login`)**  
  *Demonstrates*: Secure email and password entry form, password visibility toggle, error handling banners, and the "Demo Warrior Login" shortcut.
- **Figure 13.2: User Registration Screen (`/register`)**  
  *Demonstrates*: New warrior registration form, avatar selection carousel, password validation rules, and direct redirect to login.
- **Figure 13.3: Gamified Executive Dashboard (`/dashboard`)**  
  *Demonstrates*: High-level warrior status, total XP, dynamic level progress bar, circular daily productivity score gauge ($0–100\%$), streak counter, and urgent daily tasks.
- **Figure 13.4: Today's Tasks Management Matrix (`/tasks/today`)**  
  *Demonstrates*: Filtered task list for current day, category badges, priority indicators (High, Medium, Low), one-click completion checkboxes, and quick-add actions.
- **Figure 13.5: Task Creation & Edit Modal (`/tasks/new`, `/tasks/edit/:id`)**  
  *Demonstrates*: Input fields for task title, description, category selector, priority buttons, date picker, estimated completion minutes, and database submission.
- **Figure 13.6: Habit Tracker & Daily Check-in Matrix (`/habits`)**  
  *Demonstrates*: Active habit list, weekly completion grids, streak tally, and instant habit log check-ins.
- **Figure 13.7: Long-Term Milestone Goals Overview (`/goals`)**  
  *Demonstrates*: Strategic goals cards, target completion dates, status badges (In Progress / Completed), and overall progress completion meters.
- **Figure 13.8: Goal Progress & Metric Adjuster (`/goals/progress`)**  
  *Demonstrates*: Detailed milestone view, interactive percentage slider ($0–100\%$), linked notes, and completion triggers.
- **Figure 13.9: Streak Activity & Heatmap Grid (`/streaks`)**  
  *Demonstrates*: Continuous streak count, longest streak record, and an intensity-shaded 30-day activity matrix (Levels 0–4) reflecting daily engagement.
- **Figure 13.10: Productivity Analytics & Visual Charts (`/analytics/daily`, `/analytics/weekly`)**  
  *Demonstrates*: Interactive Recharts data visualizations showing daily focus trends, weekly task vs. habit completion bars, and category time distribution pie charts.
- **Figure 13.11: Unified Monthly Calendar Matrix (`/calendar`)**  
  *Demonstrates*: Grid view combining scheduled calendar events, task deadlines, and habit milestones with date-specific event modals.
- **Figure 13.12: Pomodoro Deep-Work Focus Timer (`/pomodoro`)**  
  *Demonstrates*: Circular countdown timer (25 min focus / 5 min break), session controls (Start, Pause, Reset), task linkage, and completed session history.
- **Figure 13.13: Weekly Timetable Time-Blocking Schedule (`/timetable`)**  
  *Demonstrates*: 7-day visual weekly schedule from 08:00 to 22:00, color-coded task blocks, and time-slot creation modals.
- **Figure 13.14: Warrior Profile & Avatar Customizer (`/profile`)**  
  *Demonstrates*: Warrior avatar display, earned achievement badges, total XP log, and display name customization.
- **Figure 13.15: System Settings & Theme Switcher (`/settings`)**  
  *Demonstrates*: Account configuration, display name updates, and instant Dark / Light mode toggling.

---

# 14. ADVANTAGES

1. **Integrated All-in-One Architecture**: Consolidates tasks, habits, time-blocking, focus timers, notes, and calendar events into a single platform, eliminating workflow fragmentation.
2. **Behavioral Reinforcement Through Gamification**: Leverages mathematically balanced XP curves, rank tiers, and streak counters to sustain intrinsic and extrinsic user motivation.
3. **Multi-Pillar Productivity Index**: Evaluates performance using a weighted daily score across tasks, habits, timetable adherence, and Pomodoro focus rather than simple binary checklists.
4. **Permanent Local Relational Persistence**: Complete MySQL data persistence ensures user records, tasks, and streaks survive browser reloads and server restarts.
5. **Secure Authentication & Scoped Queries**: Enforces bcrypt password encryption, stateless JWT validation, and user-scoped SQL queries to prevent unauthorized data access.
6. **Zero External Framework Overhead in Backend**: Native PHP 8+ and PDO implementation ensures high execution speed, simple maintenance, and minimal dependencies.
7. **Verified Cross-Device Responsiveness**: Adaptive CSS design token architecture guarantees smooth rendering on mobile phones (320px–430px), tablets, and desktops.
8. **Cost-Effective & Self-Hosted**: Runs entirely within open-source local environments (XAMPP + Node.js), requiring zero paid third-party cloud subscriptions for local academic evaluation.

---

# 15. LIMITATIONS

While FocusForge fulfills all academic project specifications, the current local implementation possesses the following known limitations:
1. **Local Host Dependency (XAMPP Environment)**: The current deployment relies on local Apache and MySQL instances via XAMPP, requiring the host machine to remain running for client accessibility.
2. **Absence of Native Mobile Push Notifications**: Because FocusForge is delivered as a progressive web application rather than a native mobile application (iOS/Android), background push notifications for upcoming task deadlines are not natively supported.
3. **Lack of Third-Party Calendar Synchronization**: Calendar events and time-blocks currently reside exclusively within the local `focusforge` MySQL database and do not automatically synchronize with external services such as Google Calendar or Microsoft Outlook.
4. **Single-User Workspace Scoping**: While the database supports multiple registered users with strict data isolation, the application currently lacks collaborative multi-user features such as shared team quests or peer leaderboards.

---

# 16. FUTURE SCOPE

The architecture of FocusForge provides a solid foundation for several planned post-academic enhancements:
1. **Cloud Deployment & Containerization**: Containerize the entire application using Docker and Docker Compose, deploying the backend to scalable cloud infrastructure (e.g., AWS Elastic Beanstalk or DigitalOcean) with managed PostgreSQL/MySQL.
2. **Cross-Platform Native Mobile Applications**: Develop native Android and iOS mobile clients using React Native or Capacitor, unlocking device-native background alarms, haptic feedback, and lock-screen habit widgets.
3. **Two-Way External Calendar Sync**: Implement OAuth 2.0 integrations with the Google Calendar API and Microsoft Graph API to enable bidirectional synchronization of tasks and timetable blocks.
4. **Multiplayer Guilds & Cooperative Quests**: Introduce cooperative team mechanics where study groups or project teams can embark on shared "boss battles" completed by collectively finishing engineering tasks and maintaining group study streaks.
5. **Machine Learning Productivity Insights**: Integrate a lightweight machine learning pipeline to analyze historical productivity patterns and predict optimal study intervals, suggesting tailored timetable adjustments.

---

# 17. CONCLUSION

The modern academic and professional landscape presents knowledge workers with an overwhelming volume of conflicting priorities, digital distractions, and fragmented tools. Traditional productivity software often fails because it treats task management as an uninspired administrative duty, offering no immediate positive feedback or unified tracking across diverse productivity pillars.

**FocusForge** addresses these challenges by delivering an integrated, gamified productivity web application engineered specifically for students and engineers. By uniting daily tasks, habit streaks, weekly timetable scheduling, deep-work Pomodoro tracking, and markdown notes within a cohesive Single Page Application, FocusForge eliminates application fragmentation. The integration of a mathematically balanced RPG gamification engine—featuring dynamic experience points, algorithmic level calculations, streak counters, and milestone achievement badges—transforms daily self-discipline into an engaging, quantifiable pursuit of mastery.

Built upon a robust, decoupled architecture combining a modern React 18 frontend, an asynchronous PHP 8+ REST API, and a normalized MySQL relational schema running in XAMPP, FocusForge achieves fast local performance, bulletproof data persistence, and verified mobile responsiveness. The system fulfills all specified engineering objectives, providing an accessible, extensible, and high-impact digital productivity companion for undergraduate engineering students and beyond.

---

# 18. REFERENCES

1. **React Documentation**: Facebook Open Source. *React – A JavaScript library for building user interfaces (v18.3)*. Available online: `https://react.dev/` (Accessed 2026).
2. **PHP Manual**: The PHP Group. *PHP Data Objects (PDO) and Prepared Statements (PHP 8.x)*. Available online: `https://www.php.net/manual/en/book.pdo.php` (Accessed 2026).
3. **MySQL Reference Manual**: Oracle Corporation. *MySQL 8.0 Reference Manual: Relational Database Architecture and InnoDB Storage Engine*. Available online: `https://dev.mysql.com/doc/refman/8.0/en/` (Accessed 2026).
4. **Apache HTTP Server Documentation**: The Apache Software Foundation. *Apache HTTP Server Version 2.4 Documentation: URL Rewriting with mod_rewrite*. Available online: `https://httpd.apache.org/docs/2.4/` (Accessed 2026).
5. **Vite Development Tool**: Evan You & Vite Core Team. *Vite: Next Generation Frontend Tooling (v6.x)*. Available online: `https://vite.dev/` (Accessed 2026).
6. **Axios HTTP Client**: Axios Core Contributors. *Promise-based HTTP client for the browser and node.js (v1.7)*. Available online: `https://axios-http.com/` (Accessed 2026).
7. **Recharts Documentation**: Recharts Community. *A composable charting library built on React components (v2.15)*. Available online: `https://recharts.org/` (Accessed 2026).
8. **Lucide Icons**: Lucide Project. *Beautiful & consistent open-source icons for React*. Available online: `https://lucide.dev/` (Accessed 2026).
9. **RFC 7519**: Jones, M., Bradley, J., and Sakimura, N. *JSON Web Token (JWT)*. Internet Engineering Task Force (IETF), RFC 7519, 2015.
10. **Deterding, S., Dixon, D., Khaled, R., & Nacke, L.** (2011). *From game design elements to gamefulness: defining "gamification"*. Proceedings of the 15th International Academic MindTrek Conference, 9–15.

---

# PROJECT FACTS VERIFIED FROM CODEBASE

The following table summarizes the verified technical parameters and codebase facts obtained through direct inspection of the FocusForge repository:

| Verification Parameter | Exact Codebase Implementation Fact |
|---|---|
| **Frontend Technology & Version** | React `18.3.1`, React DOM `18.3.1`, React Router DOM `6.28.2`, Vite `6.1.0` |
| **Backend Technology & Version** | PHP `8.0+` / `8.2+`, Native Object-Oriented Controllers, PDO Prepared Statements |
| **Database System & Engine** | MySQL `8.0+` / MariaDB `10.4+` via XAMPP, `InnoDB` storage engine, `utf8mb4_unicode_ci` |
| **XAMPP Web Server Usage** | Apache HTTP Server `2.4.x` (Port 80) + MySQL Daemon (Port 3306) |
| **Authentication Mechanism** | Stateless JSON Web Tokens (JWT, HMAC-SHA256) via `Jwt.php`, bcrypt password hashing |
| **Core Application Modules** | Auth, Dashboard, Tasks, Habits, Streaks, Timetable, Analytics, Goals, Notes, Calendar, Pomodoro, Badges, Profile |
| **Database Tables Count** | **14 Tables**: `users`, `tasks`, `habits`, `habit_logs`, `streaks`, `daily_activity`, `timetable_blocks`, `goals`, `notes`, `calendar_events`, `pomodoro_sessions`, `badges`, `user_badges`, `xp_log` |
| **Main API Groups** | `authApi`, `taskApi`, `habitApi`, `streakApi`, `timetableApi`, `analyticsApi`, `goalApi`, `noteApi`, `calendarApi`, `pomodoroApi`, `badgeApi`, `userApi` |
| **Frontend Run Command** | `npm run dev` (executed inside `project_wtl/frontend` on `http://localhost:5173/`) |
| **Backend API URL** | Direct: `http://localhost/focusforge/backend/` \| Proxy: `/api/*` via Vite dev server |
| **Database Setup Method** | Import `database/focusforge_mysql.sql` into phpMyAdmin under database `focusforge` |
| **Mobile Responsiveness Verification**| Verified across 320px, 360px, 375px, 390px, 393px, 414px, 430px, 768px, 1024px, 1440px with 0px horizontal overflow |
