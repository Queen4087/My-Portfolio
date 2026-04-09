# Portfolio + Admin Dashboard

Full-stack portfolio with a secure admin panel.

## Stack
- **Frontend**: React, Framer Motion, react-icons, react-type-animation
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Multer

---

## Quick Start

### 1. Install MongoDB
Download and run MongoDB locally: https://www.mongodb.com/try/download/community
Or use a free cloud instance: https://www.mongodb.com/atlas

### 2. Configure the API
```bash
cd api
cp .env.example .env
```
Edit `api/.env`:
```
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_very_long_random_secret_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123!
CLIENT_URL=http://localhost:3000
```

### 3. Seed the database (first time only)
```bash
cd api
npm run seed
```
This creates your admin account and default data.

### 4. Start the API server
```bash
cd api
npm run dev        # development (auto-restart)
# or
npm start          # production
```
API runs on http://localhost:5000

### 5. Start the frontend
```bash
cd portfolio
npm start
```
Frontend runs on http://localhost:3000

---

## Admin Access
- URL: http://localhost:3000/admin
- Login with the username/password you set in `.env`
- Change your password anytime from Settings in the dashboard

## API Endpoints
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/login | — | Admin login |
| GET | /api/auth/me | ✓ | Verify token |
| POST | /api/auth/change-password | ✓ | Change password |
| GET | /api/profile | — | Get profile |
| PUT | /api/profile | ✓ | Update profile |
| POST | /api/profile/upload-image | ✓ | Upload photo |
| POST | /api/profile/upload-cv | ✓ | Upload CV |
| GET | /api/projects | — | List projects |
| POST | /api/projects | ✓ | Add project |
| PUT | /api/projects/:id | ✓ | Update project |
| DELETE | /api/projects/:id | ✓ | Delete project |
| GET | /api/skills | — | List skills |
| POST | /api/skills | ✓ | Add skill |
| PUT | /api/skills/:id | ✓ | Update skill |
| DELETE | /api/skills/:id | ✓ | Delete skill |
| POST | /api/messages | — | Send message (contact form) |
| GET | /api/messages | ✓ | List messages |
| PATCH | /api/messages/:id/read | ✓ | Mark read |
| DELETE | /api/messages/:id | ✓ | Delete message |

## Security
- JWT tokens expire in 7 days
- Login is rate-limited to 10 attempts per 15 minutes
- Contact form is rate-limited to 5 messages per hour per IP
- Passwords are hashed with bcrypt (12 rounds)
- Admin routes require a valid JWT — no one else can access them
