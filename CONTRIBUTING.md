# Contributing to Digital Ninja App Builder

Thank you for your interest in contributing to the Digital Ninja App Builder! This project is built on the principles of self-hosting and zero lock-in.

## Development Philosophy

1. **Zero Lock-In**: Never add external dependencies that create vendor lock-in
2. **Self-Hosted First**: Everything should run on the user's infrastructure
3. **Standard Technologies**: Use widely-adopted, open standards
4. **Clean Code**: Follow best practices and keep code maintainable
5. **Documentation**: Document all features and APIs

## Getting Started

1. Fork the repository
2. Clone your fork
3. Run `./setup.sh` to set up your development environment
4. Create a feature branch (`git checkout -b feature/amazing-feature`)
5. Make your changes
6. Test thoroughly
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to your branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## Development Setup

### Backend Development

```bash
cd backend
source venv/bin/activate
python main.py
```

The backend will reload automatically when you make changes (if DEBUG=true in .env).

### Frontend Development

```bash
npm run dev
```

Vite will hot-reload your changes.

## Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints
- Document functions with docstrings
- Keep functions small and focused

### TypeScript (Frontend)
- Use TypeScript strictly (no `any` unless absolutely necessary)
- Follow React best practices
- Use functional components and hooks
- Keep components small and reusable

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
npm test
```

## Pull Request Guidelines

1. **Describe your changes**: Explain what and why in the PR description
2. **Keep it focused**: One feature or fix per PR
3. **Update documentation**: Update README or docs if needed
4. **Test your changes**: Ensure all tests pass
5. **No external dependencies**: Don't add dependencies that create lock-in

## Areas for Contribution

- **Backend Features**: New API endpoints, database optimizations
- **Frontend Components**: New UI components, improved UX
- **AI Features**: Better prompts, more frameworks support
- **Deployment**: Additional deployment targets, CI/CD improvements
- **Documentation**: Tutorials, guides, API documentation
- **Testing**: More test coverage, E2E tests
- **Security**: Security audits, vulnerability fixes

## Questions?

Open an issue for discussion before starting work on major features.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
