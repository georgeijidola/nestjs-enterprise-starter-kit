# NestJS Enterprise Starter Kit

A production-grade NestJS boilerplate with essential enterprise features: authentication, API key management, audit logging, caching, and health monitoring.

## 🏗️ Architecture

### Core Design Principles
- **Domain-Driven Design**: Business logic organized by domain
- **Layered Architecture**: Clear separation of concerns
- **Dependency Injection**: Loose coupling via NestJS DI container
- **Enterprise Patterns**: Guards, interceptors, decorators, middleware

### Project Structure
```
src/
├── common/              # Shared functionality
│   ├── api/            # API utilities (middleware, response handlers)
│   ├── decorators/     # Custom decorators (CurrentUser, Roles)
│   ├── guards/         # Auth, API Key, and Role guards
│   ├── helpers/        # Services (audit, cache, email, file storage)
│   ├── interceptors/   # Response transformation
│   └── utils/          # Pure utility functions
├── config/             # Centralized configuration (AppConfiguration)
├── domain/             # Business logic
│   ├── api-key/       # API key management
│   ├── auth/          # Authentication (signup, signin)
│   └── users/         # User CRUD operations
├── health/             # Health checks (Redis, Database, Server)
├── loaders/            # Infrastructure (Prisma, Fastify)
├── queues/             # Background job processing
└── main.ts             # Application entry point
```

## 🚀 Tech Stack

- **Backend:** NestJS 11 with Fastify
- **Database:** PostgreSQL with Prisma ORM 6 (multi-schema support)
- **Authentication:** JWT with Argon2 password hashing
- **API Security:** API key management with whitelist support (IP, Domain, CIDR)
- **Caching:** Redis via @nestjs/cache-manager
- **File Storage:** Google Cloud Storage integration
- **Email:** Resend API integration
- **Validation:** class-validator with global ValidationPipe
- **Documentation:** Swagger/OpenAPI
- **Logging:** Winston for structured logging
- **Testing:** Jest with 31 passing tests
- **Code Quality:** Husky pre-commit hooks, ESLint, Prettier

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- Docker and Docker Compose
- PostgreSQL
- Redis

### Environment Variables
Create a `.env` file with the following:
```env
# Server
PORT=3000
SERVER_IP=0.0.0.0

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT
JWT_SECRET=your-secret-key-min-32-characters
JWT_SECRET_EXPIRE=3600

# Email
EMAIL_FROM=noreply@example.com
RESEND_API_KEY=your-resend-api-key

# Cache
CACHE_TTL=3600

# Google Cloud Storage
GCS_PROJECT_ID=your-project-id
GCS_BUCKET_NAME=your-bucket-name
GCS_KEY_FILE_PATH=
GCS_CREDENTIALS=
```

### Installation
```bash
# Clone repository
git clone <repository-url>
cd nestjs-enterprise-starter-kit

# Install dependencies
npm install

# Start services (PostgreSQL & Redis)
npm run docker:start

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate:dev

# Seed database
npm run prisma:seed
```

## 📚 API Endpoints

### Authentication
```bash
POST /auth/signup              # User registration
POST /auth/signin              # User login
```

### Users (Protected - Requires Auth)
```bash
GET    /users                  # List all users (Admin only)
GET    /users/:id              # Get user by ID
POST   /users                  # Create user (Admin only)
PATCH  /users/:id              # Update user
DELETE /users/:id              # Delete user (Admin only)
```

### API Keys (Protected - Requires Auth)
```bash
GET    /api-keys               # List all API keys
GET    /api-keys/:id           # Get API key details
POST   /api-keys               # Create new API key
PATCH  /api-keys/:id           # Update API key
DELETE /api-keys/:id           # Revoke API key
```

### Health & Monitoring
```bash
GET  /                         # Basic health check
GET  /health                   # Comprehensive health status
GET  /health/database          # Database health
GET  /health/redis             # Redis health
GET  /health/server            # Server health
```

### Documentation
```bash
GET  /docs                     # Swagger UI
```

## 🧪 Testing

```bash
npm test              # Run unit tests (31 tests)
npm run test:watch    # Watch mode
npm run test:cov      # Coverage report
npm run test:e2e      # End-to-end tests
```

## 🔧 Development

```bash
npm run start:dev     # Development mode with hot reload
npm run start:debug   # Debug mode
npm run lint          # Lint code
npm run format        # Format code with Prettier
npm run prisma:format # Format Prisma schema
```

## 🏢 Enterprise Features

### ✅ Authentication & Authorization
- JWT-based authentication with configurable expiry
- Role-based access control (USER, ADMIN)
- Password hashing with Argon2 (more secure than bcrypt)
- Auth guard for protected routes
- Roles guard for role-based permissions
- CurrentUser decorator for easy user access in controllers

### ✅ API Key Management
- Secure API key generation with crypto
- API key hashing with Argon2
- Whitelist support (IP addresses, domains, CIDR ranges)
- API key status management (ACTIVE, REVOKED, EXPIRED)
- Last used tracking
- Expiration date support
- API key guard for public API access

### ✅ Audit Logging
- Comprehensive audit trail for all actions
- User action tracking (signin, password reset, API key operations)
- Structured audit logs with JSON details
- Pagination support for audit log retrieval
- Filtering by user, action, and email
- Automatic error handling

### ✅ Database & ORM
- Prisma ORM 6 with PostgreSQL
- Multi-schema support (user.prisma, api-key.prisma, audit.prisma)
- Type-safe database queries
- Migration management
- Seeding support
- Connection pooling

### ✅ Caching Strategy
- Redis integration via cache-manager
- Service-level caching (users list, individual users)
- Configurable TTL (default 300s)
- Cache invalidation on updates/deletes
- Performance optimization for read-heavy operations

### ✅ File Storage
- Google Cloud Storage integration
- Configurable bucket and credentials
- Support for key file or JSON credentials
- File upload/download support
- Secure file management

### ✅ Email Service
- Resend API integration
- Configurable sender email
- HTML and text email support
- Error handling and logging
- Template support

### ✅ Health Monitoring
- Multiple health check endpoints
- Database connectivity check (Prisma)
- Redis connectivity check
- Server health indicators
- Memory and disk monitoring
- Custom health indicators

### ✅ Validation & Security
- Global validation pipes with class-validator
- Input sanitization
- Structured error responses (ErrorResponse, SuccessResponse)
- Security headers
- CORS configuration
- API key authentication for public endpoints

### ✅ Configuration Management
- Centralized AppConfiguration service
- Environment variable validation at startup
- Type-safe configuration access
- Fallback values for optional configs
- Runtime validation with class-validator
- Comprehensive error messages

### ✅ Code Quality
- Pre-commit hooks (test, lint, format, prisma format)
- 31 passing unit tests
- ESLint with TypeScript support
- Prettier code formatting
- Husky for git hooks
- Comprehensive test coverage

## 🔄 CI/CD Ready

The starter kit includes:
- Pre-commit hooks (test, lint, format)
- Docker configuration (docker-compose.yml)
- Environment management (.env.example)
- Production-ready builds
- Health check endpoints for monitoring

## 📖 Documentation

- **API Docs:** Available at `/docs` (Swagger UI)
- **Code Coverage:** Generated in `/coverage`
- **Architecture:** Domain-driven design with clear separation
- **Prisma Schema:** Multi-file schema in `prisma/schema/`

## 🎯 Use Cases

Perfect for:
- Enterprise web applications
- SaaS platforms with multi-tenancy
- API-first development
- Microservices architecture
- Scalable backend systems
- Applications requiring audit trails
- Systems with API key authentication

## 🔐 Security Features

- Argon2 password hashing (OWASP recommended)
- JWT token authentication
- API key authentication with hashing
- IP/Domain/CIDR whitelisting
- Role-based access control
- Audit logging for compliance
- Input validation and sanitization
- Secure configuration management

## 🤝 Contributing

1. Follow the established architecture patterns
2. Write tests for new features
3. Use conventional commit messages
4. Ensure code passes all quality checks (lint, test, format)
5. Update documentation for new features

## 📝 Scripts Reference

```bash
# Development
npm run start:dev              # Start with hot reload
npm run start:debug            # Start with debugger
npm run start:repl             # Start REPL mode

# Database
npm run prisma:generate        # Generate Prisma client
npm run prisma:migrate:dev     # Run migrations (dev)
npm run prisma:migrate:prod    # Deploy migrations (prod)
npm run prisma:seed            # Seed database
npm run prisma:format          # Format schema files
npm run prisma:validate        # Validate schema

# Docker
npm run docker:start           # Start containers
npm run docker:down            # Stop containers
npm run docker:sh              # Shell into container

# Testing & Quality
npm test                       # Run tests
npm run test:watch             # Watch mode
npm run test:cov               # Coverage report
npm run test:e2e               # E2E tests
npm run lint                   # Lint code
npm run format                 # Format code
```

---

**Built with ❤️ for enterprise-grade applications**
