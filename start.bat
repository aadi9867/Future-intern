@echo off
echo 🚀 Starting Future Intern Development Servers...
echo.

echo 📦 Installing dependencies...
call npm run install-all

echo.
echo 🔧 Starting MongoDB (make sure MongoDB is installed and running)...
echo 💡 If MongoDB is not running, please start it manually

echo.
echo 🌐 Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm run dev"

echo.
echo ⏳ Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo 🎨 Starting Frontend Server...
start "Frontend Server" cmd /k "cd client && npm start"

echo.
echo ✅ Development servers are starting...
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo.
echo Press any key to exit this window...
pause > nul 