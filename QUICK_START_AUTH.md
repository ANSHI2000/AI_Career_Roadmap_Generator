# 🚀 Quick Start - JWT + OTP Authentication

## Prerequisites

- Node.js installed
- MongoDB running locally or connection string ready
- Gmail account (for SMTP testing) or any SMTP provider

---

## 🔧 Backend Setup (5 minutes)

### 1. Configure Backend Environment

```bash
cd backend
```

Edit `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ai-career-roadmap

JWT_SECRET=mysupersecretjwtkeythatisatleast32characterslong
JWT_EXPIRES_IN=7d

# Gmail SMTP - Get app password from https://myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM="AI Career Roadmap <your_email@gmail.com>"

OTP_EXPIRES_IN_MINUTES=10

CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

FRONTEND_URL=http://localhost:5173
```

### 2. Start Backend Server

```bash
npm run dev
# Server running on http://localhost:5000
```

You should see:
```
✅ Connected to MongoDB
✅ Server running on http://localhost:5000
✅ SMTP configured successfully
```

---

## 🎨 Frontend Setup (2 minutes)

The frontend is already configured. Just start it:

```bash
cd frontend
npm run dev
# Frontend running on http://localhost:5173
```

---

## ✅ Test the Flow

### Test 1: Register New User

1. Open http://localhost:5173 in browser
2. Click "Create Account"
3. Fill form:
   - Name: `John Doe`
   - Email: `your_email@gmail.com`
   - Password: `password123`
   - Confirm: `password123`
4. Click "Create Account"
5. **Check your email** for 6-digit OTP
6. Enter OTP on verification page
7. ✅ Logged in! Dashboard shows your name and email

### Test 2: Logout and Login Again

1. On dashboard, click "Sign Out"
2. Click "Sign In"
3. Fill:
   - Email: `your_email@gmail.com`
   - Password: `password123`
4. Click "Sign In"
5. **Check email** for new OTP
6. Enter OTP
7. ✅ Logged back in!

### Test 3: Protected Routes

1. Open browser DevTools (F12)
2. Go to Application/Storage → Local Storage
3. Delete `authToken` and `authUser`
4. Refresh page
5. ✅ Redirected to login automatically

---

## 📁 What Was Created

### Backend
```
✅ User Model (Mongoose schema)
✅ Auth Controller (5 endpoints)
✅ Auth Routes (register, login, OTP verification)
✅ Auth Middleware (JWT verification)
✅ SMTP Configuration (Nodemailer)
✅ Token generation utilities
✅ OTP generation utilities
✅ Email templates
```

### Frontend
```
✅ Auth Context (global state)
✅ Protected Route component
✅ Login page
✅ Register page
✅ OTP verification pages (2)
✅ Dashboard page
✅ API service layer
✅ Token storage utilities
```

---

## 🔐 Authentication Flow Diagram

```
REGISTER FLOW:
─────────────
User Input (name, email, password)
         ↓
POST /auth/register
         ↓
Backend: Hash password, Generate OTP, Send email
         ↓
User receives OTP in email
         ↓
User enters OTP
         ↓
POST /auth/verify-register-otp
         ↓
Backend: Verify OTP, Generate JWT
         ↓
Frontend: Save token to localStorage
         ↓
Redirect to /dashboard


LOGIN FLOW:
──────────
User Input (email, password)
         ↓
POST /auth/login
         ↓
Backend: Validate credentials, Generate OTP, Send email
         ↓
User receives OTP in email
         ↓
User enters OTP
         ↓
POST /auth/verify-login-otp
         ↓
Backend: Verify OTP, Generate JWT
         ↓
Frontend: Save token to localStorage
         ↓
Redirect to /dashboard


PROTECTED ROUTE ACCESS:
──────────────────────
User visits /dashboard
         ↓
Check localStorage for token
         ↓
If exists: Load dashboard
If not: Redirect to /login
         ↓
All API calls include token in header:
Authorization: Bearer <token>
```

---

## 🛠️ API Endpoints Reference

### Public Endpoints

```
POST /api/auth/register
├─ Body: { name, email, password, confirmPassword }
└─ Response: { success, message, data: { email } }

POST /api/auth/verify-register-otp
├─ Body: { email, otp }
└─ Response: { success, message, data: { token, user } }

POST /api/auth/login
├─ Body: { email, password }
└─ Response: { success, message, data: { email } }

POST /api/auth/verify-login-otp
├─ Body: { email, otp }
└─ Response: { success, message, data: { token, user } }
```

### Protected Endpoints

```
GET /api/auth/profile
├─ Headers: { Authorization: "Bearer <token>" }
└─ Response: { success, data: { user } }
```

---

## 📧 SMTP Providers Setup

### Gmail (Recommended for Testing)

1. Enable 2-Factor Authentication on Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy generated password
5. Use as `SMTP_PASS` in .env

### Other Providers

**Office 365/Outlook:**
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
```

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_sendgrid_api_key
```

---

## 🐛 Troubleshooting

### "SMTP Connection Error"
```
❌ Fix: Verify email/password in .env
❌ For Gmail: Use App Password, not regular password
```

### "MongoDB Connection Error"
```
❌ Fix: Make sure MongoDB is running
mongo --version  # Check if installed
```

### "Invalid OTP" Error
```
❌ Fix: OTP expires in 10 minutes
❌ Request new OTP by logging in again
```

### "Token Expired" - Logged Out
```
❌ Fix: Your session expired after 7 days
❌ Login again to get new token
```

---

## 📝 User Schema

```javascript
{
  name: String,              // User's full name
  email: String (unique),    // Email address
  password: String,          // Hashed with bcrypt
  isEmailVerified: Boolean,  // Email verification status
  otp: String,              // Hashed OTP (temporary)
  otpExpiresAt: Date,       // OTP expiration
  role: "student",          // Only "student" for now
  profileImage: String,     // URL to Cloudinary
  bio: String,              // User bio
  isActive: Boolean,        // Account status
  createdAt: Date,          // Account creation time
  updatedAt: Date           // Last update time
}
```

---

## 🎯 What's Next?

After testing the basic auth:

1. **Add profile update endpoint** - Allow users to update name, bio, image
2. **Add password reset** - "Forgot password" flow with OTP
3. **Add Google OAuth** - OAuth registration (optional)
4. **Add admin role** - Create admin users
5. **Add refresh tokens** - Keep users logged in longer
6. **Add rate limiting** - Prevent brute force attacks

---

## ✨ Features Implemented

✅ **Secure Authentication**
- Password hashing with bcryptjs (10 rounds)
- JWT tokens (7-day expiration)
- OTP verification (10-minute expiration)

✅ **Email Verification**
- Beautiful HTML email templates
- SMTP configuration ready
- OTP sent on register and login

✅ **Frontend Integration**
- React Context for global auth state
- Axios interceptors for token management
- Protected routes with automatic redirect
- Form validation with React Hook Form
- Toast notifications for feedback

✅ **Security Features**
- Secure token storage in localStorage
- Token auto-removal on 401 error
- Protected routes prevent unauthorized access
- Password confirmation validation
- Email format validation

✅ **Error Handling**
- Graceful error messages
- User-friendly feedback
- Proper HTTP status codes
- Console logging for debugging

---

## 📚 File Structure Reference

For quick reference of where everything is:

```
backend/
├── src/controllers/authController.js    ← All auth logic
├── src/routes/authRoutes.js            ← API endpoints
├── src/models/User.js                  ← User database schema
├── src/middleware/authMiddleware.js    ← JWT verification
├── src/utils/generateToken.js          ← Token creation
├── src/utils/generateOtp.js            ← OTP generation
├── src/utils/sendEmail.js              ← Email sending
├── src/config/smtp.js                  ← SMTP setup
├── server.js                            ← Server entry point
└── .env                                 ← Configuration

frontend/
├── src/context/AuthContext.jsx         ← Global auth state
├── src/services/authService.js         ← API calls
├── src/services/api.js                 ← Axios instance
├── src/utils/tokenStorage.js           ← LocalStorage
├── src/pages/Login.jsx                 ← Login form
├── src/pages/Register.jsx              ← Register form
├── src/pages/VerifyRegisterOtp.jsx     ← Email verification
├── src/pages/VerifyLoginOtp.jsx        ← Login OTP
├── src/pages/Dashboard.jsx             ← Protected page
├── src/routes/ProtectedRoute.jsx       ← Route protection
└── .env                                 ← API URL config
```

---

## 🎉 You're All Set!

The complete JWT + OTP authentication system is implemented and ready to test.

**Quick Commands to Run:**

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Then open: http://localhost:5173

**Happy coding!** 🚀

For detailed documentation, see [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)
