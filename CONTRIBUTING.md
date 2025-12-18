# Contributing to Famous.ai Builder

Thank you for your interest in contributing to Famous.ai Builder! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear, descriptive title
   - Detailed description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, browser)

### Suggesting Features

1. Check if the feature has been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**:
   - Follow the code style guidelines
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation as needed
4. **Test your changes**: Run linting and build
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

## Development Setup

```bash
# Clone the repository
git clone https://github.com/Poach420/famous.ai-build.git
cd famous.ai-build

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev

# Run linter
npm run lint

# Build project
npm run build
```

## Backend API Setup

```bash
cd api
npm install
cp .env .env.local
# Configure your MongoDB and API keys
npm run dev
```

## Code Style Guidelines

### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Use async/await for asynchronous operations

### React Components
- Use functional components with hooks
- Keep components focused and reusable
- Use TypeScript interfaces for props
- Follow the existing component structure

### File Organization
- Place components in `src/components/`
- Group related components in subdirectories
- Keep utilities in `src/lib/` or `src/utils/`
- Put types/interfaces in `src/types/`

## Commit Message Guidelines

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example: `feat: add AI code optimization feature`

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage

## Documentation

- Update README.md for significant changes
- Add JSDoc comments for functions/components
- Update API documentation if applicable

## Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged

## Questions?

Feel free to open an issue for questions or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Famous.ai Builder! 🚀
