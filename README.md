# 🚀 Future Intern - Comprehensive Internship Management System

A modern, full-stack internship portal with animated UI, secure authentication, comprehensive task management, and automatic certificate generation.

## ✨ Features

### 🔐 Authentication & Security
- **Auto-generated strong passwords** (20-25 characters)
- **Email-based unique accounts**
- **Plain text password storage** (as per requirement)
- **JWT-based authentication**
- **Rate limiting & security headers**

### 📚 Internship Management
- **15 Domain-specific internships** with individual tracking
- **Domain-wise internship tracking** with progress visualization
- **Multiple domain registration** (one per domain per student)
- **Progress tracking with visual indicators**
- **Task submission with URL validation**
- **Automatic certificate generation** (3 tasks OR 15 days)

### 🏆 Certificate System
- **Dual Unlock Criteria**:
  - Complete 3 out of 5 tasks in any domain
  - Wait 15 days from registration date
- **Unique Certificate Numbers** - Auto-generated with domain and student codes
- **Downloadable Certificates** - PDF format with verification
- **Certificate Verification** - Public verification system
- **Certificate Dashboard** - View all earned certificates

### 📄 Offer Letter System
- **Automatic Offer Letter Generation** - Available after login
- **Professional Format** - Company details, terms, and conditions
- **Student Information Integration** - Pre-filled with registration data
- **Downloadable Format** - PDF generation capability

### 🎨 Modern UI/UX
- **Animated, interactive frontend** with Tailwind CSS
- **Responsive design** for all devices
- **Modern color scheme** with gradients
- **Smooth animations** and transitions
- **Professional dashboard** with progress tracking
- **Domain-specific registration** with pre-filled data

### 📊 Database Design
- **MongoDB with optimized indexes**
- **Secure data validation**
- **Real-time progress updates**
- **Certificate tracking system**
- **Task completion analytics**

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Express Validator** for input validation
- **Helmet** for security headers
- **Rate Limiting** for API protection

### Frontend
- **React.js** with React Router
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hook Form** for form handling
- **Axios** for API communication
- **React Hot Toast** for notifications
- **clsx & tailwind-merge** for conditional styling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install
```bash
git clone <repository-url>
cd future-intern
npm run install-all
```

### 2. Database Setup
```bash
# Start MongoDB (if local)
mongod

# Or use MongoDB Atlas (update config.env)
```

### 3. Environment Configuration
```bash
# Copy and configure environment file
cp server/config.env.example server/config.env

# Update with your settings:
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/future-intern
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:3000
BASE_URL=http://localhost:5000
```

### 4. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

## 📁 Project Structure

```
future-intern/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React contexts
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS files
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── config.env        # Environment variables
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - Student login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/check-email` - Check email availability

### Internships
- `GET /api/internships` - Get all internships
- `GET /api/internships/:id` - Get specific internship
- `POST /api/internships/register-domain` - Register for new domain
- `GET /api/internships/available-domains` - Get available domains
- `PATCH /api/internships/:id/status` - Update internship status
- `GET /api/internships/:id/progress` - Get progress details

### Tasks
- `GET /api/tasks/internship/:id` - Get internship tasks
- `POST /api/tasks/:id/submit` - Submit task
- `GET /api/tasks/:id` - Get task details
- `PATCH /api/tasks/:id` - Update task
- `GET /api/tasks/stats/:internshipId` - Get task statistics

### Certificates
- `GET /api/certificates` - Get all certificates for student
- `GET /api/certificates/:internshipId` - Get certificate details
- `POST /api/certificates/generate/:internshipId` - Generate certificate
- `GET /api/certificates/download/:certificateNumber` - Download certificate
- `GET /api/certificates/verify/:certificateNumber` - Verify certificate
- `GET /api/certificates/eligibility/:internshipId` - Check eligibility
- `GET /api/certificates/eligibility/check` - Check all internships eligibility

## 🎯 Complete User Flow

### 1. Registration & Login
```
Registration → Email Verification → Login → Dashboard
```

### 2. Domain Selection & Registration
```
Browse Domains → Select Domain → 
├─ Already Enrolled → View Tasks
└─ Not Enrolled → Domain-Specific Registration (pre-filled data)
```

### 3. Task Management
```
View Tasks → Submit Task → 
├─ Task 1-2: Continue with next task
└─ Task 3+: Certificate becomes available
```

### 4. Certificate Generation
```
Certificate Ready → Generate Certificate → Download PDF
```

### 5. Offer Letter Access
```
Login → Offer Letter Page → View/Download Offer Letter
```

## 🏆 Certificate System Details

### Eligibility Logic
```javascript
// Certificate unlocks when:
if (taskCompletedCount >= 3) {
  // Unlock by task completion
  certificateUnlockedReason = '3_tasks';
} else if (daysSinceStart >= 15) {
  // Unlock by time
  certificateUnlockedReason = '15_days';
}
```

### Certificate Number Format
```javascript
// Format: CERT-{DOMAIN}-{STUDENT}{TIMESTAMP}
// Example: CERT-PY-RC001234
```

### Certificate Features
- **Unique Identification** - Each certificate has a unique number
- **Verification System** - Public verification by certificate number
- **Downloadable PDF** - Professional certificate format
- **Progress Tracking** - Shows completion criteria met
- **Domain Specific** - Certificate reflects the specific domain

## 🎨 UI Components

### Landing Page
- Hero section with animated gradients
- Feature highlights with icons
- Call-to-action buttons
- Responsive design

### Registration Form
- Multi-step form with validation
- Password reveal-once functionality
- Domain selection dropdown
- Real-time email availability check
- Domain-specific registration with pre-filled data

### Dashboard
- Progress cards with animations
- Task completion tracking
- Certificate status indicators
- Quick action buttons
- Statistics overview

### Internship Page
- Domain grid with status indicators
- Locked/Unlocked/Enrolled states
- Progress visualization
- Task management interface
- Certificate generation triggers

### Certificates Page
- Certificate gallery view
- Download functionality
- Verification system
- Eligibility information
- Progress tracking

### Offer Letter Page
- Professional letter format
- Student information integration
- Company details
- Terms and conditions
- Download functionality

## 🔧 Development

### Adding New Features
1. Create model in `server/models/`
2. Add routes in `server/routes/`
3. Create service in `client/src/services/`
4. Add components in `client/src/components/`
5. Update navigation in `client/src/components/Navbar.js`

### Database Schema Updates
```javascript
// Internship Model (Certificate Fields)
{
  isEligibleForCertificate: Boolean,
  certificateUnlockedReason: String,
  certificateGeneratedAt: Date,
  certificateURL: String,
  certificateNumber: String,
  canDownload: Boolean
}
```

## 🚀 Deployment

### Backend Deployment
```bash
# Production build
npm run build
# Start production server
npm start
```

### Frontend Deployment
```bash
# Build for production
npm run build
# Deploy to hosting service
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team.

---

**Future Intern** - Empowering students with real-world experience through structured internships and recognized certificates. 