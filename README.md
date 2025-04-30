# 📚 Library Management System

A Dockerized Node.js + Express + PostgreSQL application for managing library operations, including book inventory, borrowing, and returning. Swagger UI is integrated for API documentation and testing.

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Mohamed-Fathy-Salah/library.git
cd library
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with the following content:

```env
DB_HOST=db
DB_PORT=5432
DB_NAME=library
DB_USER=user
DB_PASSWORD=password
PORT=5000
TOKEN_EXPIRY_HOUR=24
SECRET=your_secret_key
```

*Note:* Ensure the `DB_HOST` matches the service name defined in your `docker-compose.yml` (in this case, `db`).

### 3. Start the Application with Docker Compose

```bash
docker-compose up --build
```

### 4. Run Sequelize Migrations

```bash
docker-compose exec app npx sequelize-cli db:migrate
```

## 📖 API Documentation

Access the Swagger UI:

[http://localhost:5000/api/docs](http://localhost:5000/api/docs)

## 🛠️ Available Scripts

- **Start app:** `npm start`
- **Dev mode:** `npm run dev`
- **Build:** `npm run build`

## 🐳 Docker Compose Overview

Services:

- `db`: PostgreSQL
- `app`: Node.js + Express

## 📂 Project Structure

```
.
├── migrations
│   ├── 20250428153727-users.js
│   ├── 20250428184828-books.js
│   └── 20250429104159-borrow.js
├── src
│   ├── config
│   │   ├── config.ts
│   │   ├── consts.ts
│   │   └── option.ts
│   ├── controllers
│   │   ├── auth.ts
│   │   ├── book.ts
│   │   ├── borrower.ts
│   │   ├── borrow.ts
│   │   ├── reports.ts
│   │   └── user.ts
│   ├── db
│   │   ├── config.js
│   │   └── connection.ts
│   ├── middleware
│   │   ├── deserializeUser.ts
│   │   ├── error.ts
│   │   ├── index.ts
│   │   ├── requiresUser.ts
│   │   └── validateRequest.ts
│   ├── models
│   │   ├── Book.ts
│   │   ├── Borrower.ts
│   │   ├── Borrow.ts
│   │   ├── Transaction.ts
│   │   └── User.ts
│   ├── routes
│   │   ├── authRoute.ts
│   │   ├── bookRoutes.ts
│   │   ├── borrowerRoutes.ts
│   │   ├── borrowRoutes.ts
│   │   ├── docsRoute.ts
│   │   ├── index.ts
│   │   ├── reportRoutes.ts
│   │   └── userRoutes.ts
│   ├── services
│   │   ├── bookService.ts
│   │   ├── borrowerService.ts
│   │   ├── borrowService.ts
│   │   └── userService.ts
│   ├── __tests__
│   │   └── unit
│   │       └── models
│   │           └── book.test.ts
│   ├── types
│   │   ├── customDefinition.ts
│   │   └── xss-clean.d.ts
│   ├── util
│   │   ├── ApiError.ts
│   │   ├── encrypt.ts
│   │   ├── handleError.ts
│   │   ├── jwt.ts
│   │   ├── logger.ts
│   │   └── whereFilter.ts
│   ├── validation
│   │   ├── book.ts
│   │   ├── borrower.ts
│   │   ├── borrow.ts
│   │   └── user.ts
│   ├── app.ts
│   └── server.ts
├── debug.log
├── docker-compose.yml
├── Dockerfile
├── .env
├── .eslintignore
├── .eslintrc
├── .gitignore
├── jest.config.ts
├── jest.setup.ts
├── package.json
├── package-lock.json
├── .prettierrc
├── README.md
├── .sequelizerc
└── tsconfig.json
```
