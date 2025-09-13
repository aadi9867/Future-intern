# 🔗 MongoDB Connection Guide

## 🎯 Quick Setup Options

### Option 1: MongoDB Atlas (Cloud) - **RECOMMENDED**

1. **Create Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create a new cluster

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Update Configuration**
   ```bash
   # Edit server/config.env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/future-intern?retryWrites=true&w=majority
   ```

4. **Test Connection**
   ```bash
   node test-mongodb-connection.js
   ```

### Option 2: Local MongoDB

1. **Install MongoDB**
   ```bash
   # Windows (using Chocolatey)
   choco install mongodb
   
   # Or download from https://www.mongodb.com/try/download/community
   ```

2. **Start MongoDB Service**
   ```bash
   # Windows
   net start MongoDB
   
   # Or run directly
   mongod
   ```

3. **Test Connection**
   ```bash
   node test-mongodb-connection.js
   ```

### Option 3: MongoDB with Authentication

1. **Enable Authentication**
   ```bash
   # Start MongoDB with auth
   mongod --auth
   ```

2. **Create User**
   ```javascript
   use future-intern
   db.createUser({
     user: "your-username",
     pwd: "your-password",
     roles: ["readWrite"]
   })
   ```

3. **Update Configuration**
   ```bash
   MONGODB_URI=mongodb://username:password@localhost:27017/future-intern
   ```

## 🧪 Testing Your Connection

### Test Script
```bash
# Run the test script
node test-mongodb-connection.js
```

### Expected Output
```
🔍 Testing MongoDB Connection...
📡 Connection String: mongodb://localhost:27017/future-intern
✅ Successfully connected to MongoDB!
📊 Database: future-intern
🌐 Host: localhost
🔌 Port: 27017
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
# Windows
net start MongoDB
# or
mongod
```

#### 2. Authentication Failed
```
Error: Authentication failed
```
**Solution**: Check username/password in connection string

#### 3. Network Access Denied (Atlas)
```
Error: IP not whitelisted
```
**Solution**: Add your IP to Atlas network access list

#### 4. Database Not Found
```
Error: Database does not exist
```
**Solution**: Database will be created automatically on first use

## 🚀 Next Steps

1. **Test Connection**: Run `node test-mongodb-connection.js`
2. **Start Project**: Run `start-dev.bat`
3. **Verify**: Check http://localhost:5000/api/health

## 📝 Connection String Examples

### Local MongoDB
```
mongodb://localhost:27017/future-intern
```

### MongoDB Atlas
```
mongodb+srv://username:password@cluster.mongodb.net/future-intern?retryWrites=true&w=majority
```

### MongoDB with Auth
```
mongodb://username:password@localhost:27017/future-intern
```

### MongoDB with Custom Port
```
mongodb://localhost:27018/future-intern
```

---

**Need Help?** Check the console output for specific error messages and refer to the troubleshooting section above.
