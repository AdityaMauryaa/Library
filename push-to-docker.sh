#!/bin/bash
# Build and push script for Backend Docker image

# Set your Docker Hub username
DOCKER_USERNAME="adityaamauryaaa"

# Build backend image
echo "Building Backend image..."
cd Backend
docker build -t $DOCKER_USERNAME/library-backend:latest .
cd ..

# Login to Docker Hub (you'll need to enter credentials)
echo "Logging into Docker Hub..."
docker login

# Push backend image
echo "Pushing Backend image..."
docker push $DOCKER_USERNAME/library-backend:latest

echo "Done! Backend image pushed to Docker Hub"
echo "Image: $DOCKER_USERNAME/library-backend:latest"
echo ""
echo "To run the image:"
echo "docker run -p 3001:3001 -e MONGO_URI='your-mongodb-uri' $DOCKER_USERNAME/library-backend:latest"