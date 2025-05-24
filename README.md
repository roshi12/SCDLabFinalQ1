# Microservices Blog Platform

A scalable blog platform built with microservices architecture using Node.js, Express, MongoDB, Docker, and GitHub Actions.

## Architecture

The platform consists of five microservices:

1. **Auth Service** (Port 3001)
   - Handles user authentication (registration and login)
   - JWT-based authentication
   - MongoDB for user data

2. **Blog Service** (Port 3002)
   - Manages blog posts and view counts
   - CRUD operations for blog posts
   - View count tracking

3. **Comment Service** (Port 3003)
   - Manages comments on blog posts
   - Create and retrieve comments
   - Links comments to blog posts

4. **Profile Service** (Port 3004)
   - Manages user profiles
   - Bio, avatar, and social links
   - User profile customization

5. **API Gateway** (Port 3000)
   - Single entry point for all services
   - Request routing
   - Load balancing

## Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- MongoDB
- GitHub account
- Docker Hub account

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Set up Environment Variables**
   Create `.env` files in each service directory with the following variables:
   ```env
   PORT=service_port
   MONGO_URI=mongodb://mongodb:27017/service_name
   JWT_SECRET=your_jwt_secret
   ```

3. **Install Dependencies**
   ```bash
   # Install dependencies for each service
   cd auth-service && npm install
   cd ../blog-service && npm install
   cd ../comment-service && npm install
   cd ../profile-service && npm install
   cd ../api-gateway && npm install
   ```

## Running with Docker

1. **Build and Run Services**
   ```bash
   # Build and start all services
   docker-compose up --build

   # Run in detached mode
   docker-compose up -d --build
   ```

2. **Stop Services**
   ```bash
   docker-compose down
   ```

## Running Tests

Each service has its own test suite using Jest:

```bash
# Run tests for each service
cd auth-service && npm test
cd ../blog-service && npm test
cd ../comment-service && npm test
cd ../profile-service && npm test
cd ../api-gateway && npm test
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

1. **Workflow Triggers**
   - On push to main branch
   - On pull requests to main branch

2. **Pipeline Steps**
   ```yaml
   - uses: actions/checkout@v2

   - name: Setup Node.js
     uses: actions/setup-node@v2
     with:
       node-version: '18'
       cache: 'npm'

   - name: Login to Docker Hub
     uses: docker/login-action@v2
     with:
       username: abdullah656
       password: ${{ secrets.DOCKER_PAT }}

   - name: Set up Docker Buildx
     uses: docker/setup-buildx-action@v2

   - name: Build and Test Auth Service
     working-directory: ./auth-service
     run: |
       npm ci
       npm test
       docker build -t abdullah656/auth-service:latest .
       docker push abdullah656/auth-service:latest
   ```

3. **GitHub Secrets Required**
   - `DOCKER_PAT`: Docker Hub Personal Access Token
   - `DOCKER_USERNAME`: Docker Hub username

## Docker Images

All services are containerized and available on Docker Hub:

```bash
# Pull images
docker pull abdullah656/auth-service:latest
docker pull abdullah656/blog-service:latest
docker pull abdullah656/comment-service:latest
docker pull abdullah656/profile-service:latest
docker pull abdullah656/api-gateway:latest
```

## API Endpoints

### Auth Service
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login

### Blog Service
- POST `/api/blogs` - Create blog post
- GET `/api/blogs` - Get all blogs
- POST `/api/blogs/:blogId/views` - Increment blog views

### Comment Service
- POST `/api/comments` - Create comment
- GET `/api/comments/blog/:blogId` - Get blog comments

### Profile Service
- GET `/api/profile/:userId` - Get user profile
- PUT `/api/profile` - Update profile

### Health Checks
Each service has a health check endpoint:
- GET `/health` - Returns service health status

## Monitoring

Each service includes:
- Health check endpoints
- Docker health checks
- Container monitoring

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
