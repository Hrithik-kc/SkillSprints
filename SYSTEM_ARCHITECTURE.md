# SkillSprints - System Architecture Document

## 1. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (React) |
| Backend | Next.js API Routes |
| Authentication | Firebase Authentication |
| Database | Firebase Firestore (NoSQL) |
| Styling | Tailwind CSS |

---

## 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js)                            │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Login   │  │Dashboard │  │  Quiz    │  │Practice  │              │
│  │  Page    │  │  Page    │  │  Pages   │  │  Pages   │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │             │             │             │                     │
│       └─────────────┴─────────────┴─────────────┘                     │
│                             │                                          │
│                    ┌────────▼────────┐                                │
│                    │   Firebase SDK  │                                │
│                    │   (Client-side) │                                │
│                    └────────┬────────┘                                │
└─────────────────────────────┼──────────────────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────────────────┐
│                         FIREBASE SERVICES                               │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐    ┌──────────────────────┐                │
│  │  Firebase Auth       │    │  Firebase Firestore  │                │
│  │  (Authentication)    │    │  (Database)          │                │
│  └──────────────────────┘    └──────────────────────┘                │
└────────────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────────────────┐
│                           BACKEND (API Routes)                         │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                   │
│  │ /api/       │  │ /api/       │  │ /api/       │                   │
│  │ question    │  │ feedback    │  │ explanation  │                   │
│  └─────────────┘  └─────────────┘  └─────────────┘                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Frontend Architecture (Next.js Pages)

### Page Structure:
```
app/
├── page.js                    # Landing/Home Page
├── login/
│   └── page.js               # Login & Registration
├── dashboard/
│   └── page.js               # Main Dashboard
├── profile/
│   └── page.js               # User Profile
├── leaderboard/
│   └── page.js               # Global Leaderboard
├── Quiz/
│   ├── page.js               # Quiz Listing
│   ├── take/
│   │   └── page.js           # Take Quiz
│   ├── result/
│   │   └── page.js           # Quiz Results
│   ├── answers/
│   │   └── page.js           # View Answers
│   └── leader/
│       └── page.js           # Quiz Leaderboard
├── practise/
│   ├── page.js               # Practice Mode Home
│   ├── easy/
│   │   └── page.js           # Easy Questions
│   ├── medium/
│   │   └── page.js           # Medium Questions
│   └── hard/
│       └── page.js           # Hard Questions
└── admin-dashboard/
    ├── page.js               # Admin Dashboard
    └── users/
        └── page.js           # User Management
```

---

## 4. Backend Architecture (API Routes)

### API Endpoints:

| Endpoint | Purpose |
|----------|---------|
| `/api/question` | Question CRUD operations |
| `/api/feedback` | User feedback collection |
| `/api/explanation` | Get question explanations |

---

## 5. Firebase Integration

### Firebase Configuration (`lib/firebase.js`):
```
javascript
// Firebase initialization
- initializeApp(firebaseConfig)
- getAuth(app)        → authFeature
- getFirestore(app)  → db
```

### Firebase Services Used:
1. **Firebase Authentication** - Email/Password authentication
2. **Firebase Firestore** - NoSQL database

---

## 6. Authentication Flow

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   User      │────▶│   Login Page    │────▶│  Firebase Auth   │
│             │     │  (login.js)     │     │  (signInWith     │
└─────────────┘     └─────────────────┘     │  EmailPassword)  │
                                           └────────┬─────────┘
                                                    │
                            ┌───────────────────────┼───────────────────────┐
                            │                       │                       │
                    ┌───────▼───────┐      ┌────────▼────────┐    ┌────────▼────────┐
                    │   Success     │      │   Failure       │    │  Create User    │
                    │   → Dashboard │      │  → Show Error   │    │  → Firestore    │
                    └───────────────┘      └─────────────────┘    │  (users col)     │
                                                                      └─────────────────┘
```

### Registration Flow:
```
User enters email/password → createUserWithEmailAndPassword → 
Create user document in Firestore (users collection) → 
Store: uid, email, role, xp, level, title, leaderboardPoints
```

### Role-based Access:
- **Admin** (teacher@gmail.com) - Full access to admin dashboard
- **Student** - Regular user access

---

## 7. Database Schema (Firestore)

### Collections:

#### 1. `users` Collection
```
javascript
{
  uid: string,           // Firebase Auth UID
  email: string,         // User email
  role: string,          // "admin" or "student"
  xp: number,            // Experience points (default: 0)
  level: number,         // Level 1-5 (default: 1)
  title: string,         // "Beginner", "Challenger", "Expert", etc.
  leaderboardPoints: number,
  streak: number,
  totalQuizzes: number,
  createdAt: timestamp
}
```

#### 2. `questions` Collection
```
javascript
{
  id: string,
  question: string,
  options: array,
  correctAnswer: number,
  explanation: string,
  difficulty: string,   // "easy", "medium", "hard"
  category: string
}
```

#### 3. `feedback` Collection
```
javascript
{
  id: string,
  userId: string,
  message: string,
  createdAt: timestamp
}
```

---

## 8. Data Flow

### User Authentication Flow:
```
1. User visits /login
2. Enters email & password
3. Firebase Auth validates credentials
4. On success: Store user data in Firestore (if new user)
5. Redirect to /dashboard
```

### Quiz Flow:
```
1. User navigates to /Quiz
2. Selects a quiz to take
3. Goes to /Quiz/take
4. Answers questions
5. Submits quiz
6. Gets results at /Quiz/result
7. XP is awarded based on score
8. User data updated in Firestore
```

### Practice Mode Flow:
```
1. User navigates to /practise
2. Selects difficulty (Easy/Medium/Hard)
3. Practices questions
4. Gets instant feedback/explanations
5. Earns XP for completed questions
```

### Leaderboard Flow:
```
1. User completes quiz/practice
2. XP is updated in Firestore
3. Leaderboard queries users collection
4. Sorted by XP/level in descending order
5. Display rankings
```

---

## 9. Component Relationships

```
┌─────────────────────────────────────────────────────────────────────┐
│                        COMPONENT DIAGRAM                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────────┐         ┌──────────────┐                        │
│   │ authLogic.js │────────▶│ firebaseApp │                        │
│   │  (Auth)      │         │   .js        │                        │
│   └──────────────┘         └──────┬───────┘                        │
│                                   │                                 │
│   ┌──────────────┐                │                                 │
│   │leaderboard   │◀───────────────┤                                 │
│   │System.js     │                │                                 │
│   └──────────────┘                │                                 │
│                                   │                                 │
│   ┌──────────────┐                │                                 │
│   │ levelSystem  │◀───────────────┘                                 │
│   │ .js          │                                                │
│   └──────────────┘                                                   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 10. Key Modules

### `lib/firebase.js`
- Initializes Firebase app
- Exports `authFeature` (Firebase Auth)
- Exports `db` (Firestore instance)

### `app/core/authLogic.js`
- `loginComponent(email, password)` - User login
- `registerComponent(email, password, role)` - User registration
- Role management (admin/student)

### `lib/leaderboardsystem.js`
- `fetchLeaderboardData()` - Get leaderboard rankings
- `fetchCurrentUserData()` - Get current user stats
- `findUserRank()` - Find user position

### `lib/levelSystem.js`
- `calculateLevel(xp)` - Calculate level based on XP
- Level titles: Beginner → Challenger → Expert → Aptitude Ninja → Placement Warrior

---

## 11. Security Rules

### Firestore Rules:
- Users can read/write their own data only
- Admins can read all user data
- Questions and feedback are publicly readable

---

## 12. Summary

| Component | Description |
|-----------|-------------|
| **Frontend** | Next.js 14+ with App Router |
| **Backend** | Next.js API Routes |
| **Auth** | Firebase Authentication (Email/Password) |
| **Database** | Firebase Firestore |
| **State** | React hooks (useState, useEffect) |
| **Styling** | Tailwind CSS |

---

*Document Version: 1.0*
*Last Updated: 2024*
