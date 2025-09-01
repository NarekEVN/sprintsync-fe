# SprintSync Frontend

Frontend for SprintSync, a project management application.

## 🚀 Tech Stack

- ⚡ [Vite](https://vitejs.dev/) - Frontend tooling
- ⚛️ [React 18](https://reactjs.org/) - UI library
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - Styling
- 🚀 [React Router](https://reactrouter.com/) - Routing
- 🔄 [React Query](https://tanstack.com/query) - Data fetching
- 🛠 [TypeScript](https://www.typescriptlang.org/) - Type checking

## 🛠 Setup

1. **Prerequisites**
    - Node.js v20.19.4
    - npm (comes with Node.js)

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
    - Copy `.env.example` to `.env`
    - Update the environment variables in `.env`

4. **Running the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   ```

## 🔧 Development

- **Linting**
  ```bash
  npm run lint
  ```

## 🐳 Docker Support

The application includes Docker support for both development and production environments.

### Development with Docker Compose

```bash

$ docker-compose up

# Stop the containers
$ docker-compose down

# View logs
$ docker-compose logs -f
```

## 🌐 Live URL

[Production URL](https://sprintsync-fe-production.up.railway.app)


## Credentials

### Admin
`johndoe@example.com`
`12345678`


### User
`johndoe1@example.com`
`12345678`
