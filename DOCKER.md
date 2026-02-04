# 🐳 Docker Setup for Library Management System

This guide will help you run the Library Management System using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed

## Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/AdityaMauryaa/Library.git
cd Library
```

2. **Build and run with Docker Compose:**
```bash
docker-compose up --build
```

3. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- MongoDB: localhost:27017

## Individual Services

### Build Backend Image
```bash
cd Backend
docker build -t library-backend .
```

### Build Frontend Image
```bash
cd Frontend
docker build -t library-frontend .
```

### Run Backend Container
```bash
docker run -p 3001:3001 --env-file .env library-backend
```

### Run Frontend Container
```bash
docker run -p 80:80 library-frontend
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=3001
MONGO_URI=mongodb://admin:password123@mongodb:27017/library?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### Frontend (.env.production)
```env
VITE_API_URL=http://localhost:3001/api
```

## Production Deployment

For production deployment, update the environment variables:

1. **Update MongoDB connection string** in docker-compose.yml
2. **Change JWT secret** to a secure value
3. **Update API URL** in Frontend environment
4. **Use proper SSL certificates** for HTTPS

## Docker Images

The setup creates:
- **Backend**: Node.js 18 Alpine with Express.js API
- **Frontend**: Multi-stage build with Nginx serving static files
- **Database**: MongoDB 6.0 with persistent storage

## Volumes

- `mongodb_data`: Persists MongoDB data
- Backend source code is mounted for development

## Networks

All services communicate through the `library-network` bridge network.

## Health Checks

The backend includes a health check endpoint that monitors service availability.

## Troubleshooting

1. **Port conflicts**: Change ports in docker-compose.yml if needed
2. **MongoDB connection**: Ensure MongoDB is running and accessible
3. **Environment variables**: Check all required variables are set
4. **Build failures**: Clear Docker cache with `docker system prune`

## Admin Setup

After starting the containers:
1. Create admin user: `POST http://localhost:3001/api/admin/create`
2. Login with: `admin@library.com` / `admin123`