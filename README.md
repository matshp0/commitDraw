Commit Draw 🎨
Welcome to Commit Draw! A fun and creative way to draw on your GitHub commit chart using automated commits. Hosted live at gitsheet.xyz. 🚀
What is Commit Draw? ✨
Commit Draw lets you transform your GitHub commit chart into a canvas! Here's how it works:

Log in with GitHub OAuth.
Draw your design on a replica of the GitHub commit chart.
Choose a repository to apply your commits.
A pull request is automatically created in the target repository.
Once merged, your masterpiece appears on your GitHub commit chart! 🖌️

Tech Stack 🛠️
Backend

Microservice Architecture built with NestJS.
Services:
Server: Handles static file serving and authentication.
GitHub Bot: Manages all interactions with the GitHub API.


Database: MongoDB for storing user data and commit information.

Frontend

Built with React for a smooth and interactive UI. ⚛️

Getting Started 🚧
You can run Commit Draw locally using Docker Compose or directly with commands from package.json.
Prerequisites

Node.js (v18 or higher)
Docker (if using Docker Compose)
MongoDB instance
GitHub OAuth app credentials

Installation

Clone the repository:
git clone https://github.com/your-org/commit-draw.git
cd commit-draw


Install dependencies:
npm install


Set up environment variables:

Create .env files in apps/server/ and apps/ghBot/ based on .env.example.



Running with Docker Compose
docker-compose up --build

Running with npm Scripts
# Build the server and GitHub bot
npm run build:server
npm run build:ghBot

# Start in production mode
npm run start:prod

# Start in development mode with watch
npm run start:server:watch
npm run start:ghBot:watch

Available Scripts
{
  "build:server": "nest build server",
  "build:ghBot": "nest build ghBot",
  "format": "prettier --write \"apps/**/*.ts\" \"libs/**/*.ts\"",
  "start:server": "nest start server --env-file ./apps/server/.env",
  "start:ghBot": "nest start ghBot --env-file ./apps/ghBot/.env",
  "start:server:watch": "nest start server --env-file ./apps/server/.env.development.local --watch",
  "start:ghBot:watch": "nest start ghBot --env-file ./apps/ghBot/.env.development.local --watch",
  "start:debug": "nest start --debug --watch",
  "start:prod": "node dist/apps/git-sheet/main",
  "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
}

Contributing 🤝
We'd love your contributions! Please check out our contributing guidelines and submit a pull request. Let's make GitHub commit charts more colorful together! 🌈
License 📜
This project is licensed under the MIT License. See the LICENSE file for details.

Happy drawing! 🎉
