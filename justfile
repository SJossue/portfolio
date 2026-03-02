# Justfile for portfolio project
# Install just: https://github.com/casey/just

set shell := ["bash", "-cu"]

# Default recipe (shows available commands)
default:
  @just --list

# Start development server
dev:
  npm run dev

# Run quick checks (lint, typecheck, unit tests)
check:
  npm run lint
  npm run typecheck
  npm run test

# Run full CI validation (includes build and e2e)
ci:
  npm run validate

# Run end-to-end tests
e2e:
  npm run e2e

# Run e2e tests in UI mode
e2e-ui:
  npm run e2e:ui

# Fix linting and formatting issues
fix:
  npm run lint:fix
  npm run format:write

# Run unit tests in watch mode
test-watch:
  npm run test:watch

# Run tests with coverage
test-coverage:
  npm run test:coverage

# Build production bundle
build:
  npm run build

# Start production server
start:
  npm run start

# Clean and reinstall dependencies
clean:
  rm -rf node_modules .next
  npm install

# Install Playwright browsers (run once after clone)
setup-e2e:
  npx playwright install --with-deps
