# NestJS Enterprise Starter Kit

A production-grade NestJS boilerplate focusing on essential Non-Functional Requirements (NFRs) for enterprise applications.

## 🏗️ Architecture

### Core Design Principles
- **Domain-Driven Design**: Business logic organized by domain
- **Layered Architecture**: Clear separation of concerns
- **Dependency Injection**: Loose coupling via NestJS DI container
- **Enterprise Patterns**: Guards, interceptors, caching, queues

### Project Structure
```
src/
├── common/           # Shared functionality
│   ├── guards/       # Authentication & authorization
│   ├── helpers/      # Utility services (cache, email, etc.)
│   ├── interceptors/ # Cross-cutting concerns
│   └── utils/        # Pure utility functions
├── domain/           # Business logic
│   ├── auth/         # Authentication domain
│   └── users/        # User management domain
├── queues/           # Background job processing
├── loaders/          # Infrastructure setup
└── config/           # Configuration management
```

## 🚀 Tech Stack

- **Backend:** NestJS with Fastify
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with bcrypt
- **Queues:** In-memory job processing (extensible to Redis/BullMQ)
- **Caching:** Redis via @nestjs/cache-manager
- **Validation:** Global ValidationPipe with class-validator
- **Documentation:** Swagger/OpenAPI
- **Testing:** Jest with comprehensive test coverage
- **Code Quality:** Husky, ESLint, Prettier

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- Docker and Docker Compose
- PostgreSQL
- Redis (optional, for caching)

### Installation
```bash
# Clone repository
git clone <repository-url>
cd nestjs-enterprise-starter-kit

# Install dependencies
npm install

# Start services
npm run docker:start

# Setup database
npm run prisma:migrate:dev
npm run prisma:seed
```

## 📚 API Endpoints

### Authentication
```bash
POST /auth/signup     # User registration
POST /auth/signin     # User login
```

### Health & Info
```bash
GET  /               # Health check
GET  /health         # Detailed health status
```

## 🧪 Testing

```bash
npm test              # Run unit tests
npm run test:watch    # Watch mode
npm run test:cov      # Coverage report
npm run test:e2e      # End-to-end tests
```

## 🔧 Development

```bash
npm run start:dev     # Development mode
npm run start:debug   # Debug mode
npm run lint          # Lint code
npm run format        # Format code
```

## 🏢 Enterprise Features

### ✅ Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Secure token management

### ✅ Database & ORM
- Prisma ORM with PostgreSQL
- Type-safe database queries
- Migration management
- Connection pooling

### ✅ Caching Strategy
- Redis integration
- Service-level caching
- Cache invalidation patterns
- Performance optimization

### ✅ Background Processing
- Queue management system
- Async job processing
- Error handling & retries
- Job monitoring

### ✅ Validation & Security
- Global validation pipes
- Input sanitization
- Error handling middleware
- Security headers

### ✅ Monitoring & Logging
- Structured logging with Winston
- Health check endpoints
- Performance monitoring
- Error tracking

### ✅ Code Quality
- Pre-commit hooks with Husky
- Automated testing
- Code formatting with Prettier
- Linting with ESLint

## 🔄 CI/CD Ready

The starter kit includes:
- Pre-commit hooks (test, lint, format)
- Docker configuration
- Environment management
- Production-ready builds

## 📖 Documentation

- **API Docs:** Available at `/docs` (Swagger UI)
- **Code Coverage:** Generated in `/coverage`
- **Architecture:** Domain-driven design patterns

## 🎯 Use Cases

Perfect for:
- Enterprise web applications
- Microservices architecture
- API-first development
- Scalable backend systems
- Team collaboration projects

## 🤝 Contributing

1. Follow the established architecture patterns
2. Write tests for new features
3. Use conventional commit messages
4. Ensure code passes all quality checks

---

**Built with ❤️ for enterprise-grade applications**