@echo off
echo 🚀 Future Intern - Development Startup
echo ======================================
echo.

echo 📦 Installing dependencies...
call npm run install-all

echo.
echo 🔧 Starting MongoDB (ensure MongoDB is running)...
echo 💡 If MongoDB is not running, please start it manually

echo.
echo 🌐 Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd server && npm run dev"

echo.
echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo.
echo 🎨 Starting Frontend Server (Port 3000)...
start "Frontend Server" cmd /k "cd client && npm start"

echo.
echo ✅ Development servers are starting...
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo 📊 API Health: http://localhost:5000/api/health
echo.
echo 🎯 Next Steps:
echo 1. Wait for both servers to fully start
echo 2. Open http://localhost:3000 in your browser
echo 3. Test the beautiful landing page
echo 4. Try the registration flow
echo.
echo Press any key to close this window...
pause > nul 