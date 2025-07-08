# Commit Draw

## Overview
Commit Draw is a web application hosted at [gitsheet.xyz](https://gitsheet.xyz) that enables users to create custom designs on their GitHub contribution chart by drawing on a replica of the chart. Users authenticate via GitHub OAuth, draw their desired design, select a target repository, and the application automatically generates a pull request to apply the design to the user's GitHub contribution chart upon merging.

## Features
- **GitHub OAuth Authentication**: Securely log in using GitHub credentials.
- **Interactive Drawing Interface**: Draw custom designs on a replica of the GitHub contribution chart.
- **Automated Pull Request Creation**: Select a repository to generate a pull request that applies the drawn design to the contribution chart.
- **Seamless Integration**: Designs appear on the user's GitHub contribution chart after the pull request is merged.

## Architecture
### Backend
The backend is built using a microservice architecture with **NestJS**, consisting of two primary services:
1. **Server Service**: Handles static content serving and user authentication via GitHub OAuth.
2. **GitHub Bot Service**: Manages interactions with the GitHub API for repository selection and pull request creation.

- **Database**: Utilizes **MongoDB** for efficient data storage and management.
- **Framework**: NestJS for modular and scalable backend development.

### Frontend
The frontend is developed using **React**, providing a responsive and interactive user interface for drawing and repository selection.

## Installation and Setup
Commit Draw can be built and run using **Docker Compose** or manually via commands defined in the `package.json` scripts.

### Prerequisites
- **Node.js** (v22 or higher)
- **Docker** (if using Docker Compose)
- **MongoDB** instance
- GitHub OAuth application credentials

### Using Docker Compose
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/commit-draw.git
   cd commit-draw
   ```
2. Set up environment variables:
   - Create `.env` files in `apps/server/` and `apps/ghBot/` based on the provided `.env.example` files.
3. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

### Manual Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/commit-draw.git
   cd commit-draw
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create `.env` files in `apps/server/` and `apps/ghBot/` based on `.env.example` files.
4. Build the services:
   ```bash
   npm run build:server
   npm run build:ghBot
   ```
5. Start the services:
   ```bash
   npm run start:server
   npm run start:ghBot
   ```
   For development with live reloading:
   ```bash
   npm run start:server:watch
   npm run start:ghBot:watch
   ```

### Additional Scripts
- **Format code**:
  ```bash
  npm run format
  ```
- **Lint code**:
  ```bash
  npm run lint
  ```
- **Start in production**:
  ```bash
  npm run start:prod
  ```
## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
