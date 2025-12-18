# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within the Digital Ninja App Builder, please send an email to the repository maintainer. All security vulnerabilities will be promptly addressed.

**Please do not open public issues for security vulnerabilities.**

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Best Practices

### For Users

1. **Change default secrets**: Always change JWT_SECRET_KEY in production
2. **Use HTTPS**: Deploy behind HTTPS in production
3. **Environment variables**: Never commit .env files
4. **Update dependencies**: Keep all dependencies up to date
5. **Strong passwords**: Use strong passwords for user accounts
6. **API keys**: Keep your OpenAI API key secure

### For Developers

1. **Input validation**: Always validate user input (use Pydantic schemas)
2. **SQL injection**: Use parameterized queries (Motor handles this)
3. **XSS prevention**: Sanitize output (React handles this by default)
4. **CSRF protection**: Use proper CORS configuration
5. **Rate limiting**: Implement rate limiting on sensitive endpoints
6. **Password hashing**: Always use bcrypt for password hashing
7. **JWT tokens**: Use short expiration times for access tokens

## Known Security Considerations

### JWT Secret
The JWT secret key MUST be changed from the default value in production. Use a strong, random string.

### OpenAI API Key
Store your OpenAI API key securely in the .env file and never commit it to version control.

### Database Access
MongoDB should not be exposed to the internet. Use authentication and restrict access.

### CORS Configuration
Configure CORS_ORIGINS to only include your actual domain names in production.

## Security Updates

We will announce security updates through:
- GitHub Security Advisories
- Release notes
- README updates

## Responsible Disclosure

We appreciate responsible disclosure of security vulnerabilities. We will:
1. Acknowledge receipt of your report within 48 hours
2. Provide an initial assessment within 7 days
3. Work on a fix and release it as soon as possible
4. Credit you in the release notes (if desired)
