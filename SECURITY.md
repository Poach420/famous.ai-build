# Security and Compliance for Self-Deployment

## Overview

This document outlines security practices and compliance considerations for self-deploying this solution without vendor dependencies.

## Security Advantages of Self-Deployment

### ✅ Full Control

When self-deploying, you have complete control over:

- **Data Location**: Keep sensitive data in your jurisdiction
- **Access Control**: Manage who can access your systems
- **Security Policies**: Implement your own security standards
- **Audit Trails**: Complete visibility into system access
- **Encryption**: Choose your encryption methods and key management

### ✅ No Third-Party Risk

Self-deployment eliminates:

- Third-party data breaches affecting you
- Vendor security policy changes
- Forced upgrades that introduce vulnerabilities
- Data sharing with vendors
- Unknown telemetry or tracking

## Security Checklist

### Infrastructure Security

- [ ] **Network Isolation**
  - Use private networks for internal services
  - Expose only necessary ports (80, 443)
  - Configure firewall rules

- [ ] **Access Control**
  - Use SSH keys (disable password auth)
  - Implement VPN for administrative access
  - Use bastion hosts for sensitive environments

- [ ] **Encryption**
  - Enable TLS/SSL for all external connections
  - Encrypt data at rest (database, file storage)
  - Use encrypted backups

### Application Security

- [ ] **Authentication**
  ```javascript
  // Use secure password hashing
  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash(password, 12);
  ```

- [ ] **Authorization**
  ```javascript
  // Implement role-based access control
  const roles = {
    admin: ['read', 'write', 'delete'],
    user: ['read', 'write'],
    viewer: ['read']
  };
  ```

- [ ] **Input Validation**
  ```javascript
  // Validate all user input
  const validator = require('validator');
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email');
  }
  ```

- [ ] **SQL Injection Prevention**
  ```javascript
  // Use parameterized queries
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await db.query(query, [userId]);
  ```

- [ ] **XSS Prevention**
  ```javascript
  // Sanitize output
  const escape = require('escape-html');
  const safeOutput = escape(userInput);
  ```

### Database Security

- [ ] **Connection Security**
  ```env
  # Use SSL/TLS for database connections
  DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
  ```

- [ ] **Access Control**
  ```sql
  -- Create limited privilege users
  CREATE USER app_user WITH PASSWORD 'strong_password';
  GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;
  ```

- [ ] **Encryption**
  ```sql
  -- Enable encryption at rest
  -- PostgreSQL: Configure with SSL
  -- Use encrypted volumes for database storage
  ```

### Secrets Management

- [ ] **Environment Variables**
  ```bash
  # Never commit .env files
  # Use strong secrets
  JWT_SECRET=$(openssl rand -base64 32)
  ```

- [ ] **Vault (Optional)**
  ```yaml
  # docker-compose.yml
  vault:
    image: vault:latest
    environment:
      VAULT_DEV_ROOT_TOKEN_ID: myroot
  ```

- [ ] **Secret Rotation**
  ```bash
  # Rotate secrets regularly
  # Document rotation procedures
  ```

## Compliance Considerations

### GDPR (EU)

✅ **Self-deployment advantages**:
- Data stays in your infrastructure (data residency)
- You control data processing
- Easier to implement right to erasure
- No third-party data processors (simpler compliance)

**Implementation**:
```javascript
// Data export (right to access)
async function exportUserData(userId) {
  const userData = await db.user.findById(userId);
  const userPosts = await db.posts.findByUserId(userId);
  return { user: userData, posts: userPosts };
}

// Data deletion (right to erasure)
async function deleteUserData(userId) {
  await db.posts.deleteByUserId(userId);
  await db.user.delete(userId);
  await auditLog.record('user_deleted', userId);
}
```

### HIPAA (Healthcare - US)

✅ **Self-deployment advantages**:
- Complete control over PHI
- No Business Associate Agreements needed
- Custom security controls

**Requirements**:
- Encryption at rest and in transit
- Access logging and monitoring
- Data backup and disaster recovery
- Physical security of servers

### SOC 2

✅ **Self-deployment advantages**:
- Direct control over security controls
- Easier audit trail
- Custom policies

**Implementation**:
```javascript
// Audit logging
async function auditLog(action, userId, details) {
  await db.auditLog.create({
    timestamp: new Date(),
    action,
    userId,
    details,
    ipAddress: req.ip
  });
}
```

### PCI DSS (Payment Card)

⚠️ **Considerations**:
- Don't store credit card data yourself
- Use tokenization (Stripe, PayPal)
- Keep cardholder data out of your infrastructure

**Implementation**:
```javascript
// Use payment processor tokens, not card data
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paymentIntent = await stripe.paymentIntents.create({
  amount: 1000,
  currency: 'usd',
});
```

## Security Best Practices

### 1. Regular Updates

```bash
# Automated security updates
# Add to cron
0 2 * * * apt-get update && apt-get upgrade -y

# Docker image updates
docker-compose pull
docker-compose up -d
```

### 2. Monitoring

```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  const dbHealth = await checkDatabase();
  const redisHealth = await checkRedis();
  
  res.json({
    status: dbHealth && redisHealth ? 'healthy' : 'unhealthy',
    timestamp: new Date(),
    services: {
      database: dbHealth,
      redis: redisHealth
    }
  });
});
```

### 3. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. Security Headers

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
}));
```

### 5. Backup and Disaster Recovery

```bash
#!/bin/bash
# backup.sh

# Database backup
docker-compose exec -T db pg_dump -U postgres famousai | \
  gzip > /backups/db-$(date +%Y%m%d-%H%M%S).sql.gz

# Encrypt backup
gpg --encrypt --recipient your-email@example.com \
  /backups/db-$(date +%Y%m%d-%H%M%S).sql.gz

# Upload to offsite location (your own S3/MinIO)
mc cp /backups/db-*.gpg myminio/backups/

# Cleanup old backups (keep 30 days)
find /backups -name "db-*.gpg" -mtime +30 -delete
```

## Incident Response Plan

### 1. Detection

```javascript
// Automated alerts
const alerting = {
  onHighCPU: () => sendAlert('CPU usage > 80%'),
  onFailedLogins: (count) => {
    if (count > 10) sendAlert('Multiple failed login attempts');
  },
  onDatabaseError: () => sendAlert('Database connection failed')
};
```

### 2. Response

```markdown
1. Isolate affected systems
2. Review logs: `docker-compose logs -f`
3. Check recent changes: `git log -10`
4. Rollback if needed: `git checkout <previous-commit>`
5. Investigate root cause
6. Document incident
7. Implement fixes
8. Update security procedures
```

### 3. Recovery

```bash
# Restore from backup
docker-compose down
docker volume rm famousai_postgres-data
docker-compose up -d db
docker-compose exec -T db psql -U postgres < backup.sql
docker-compose up -d
```

## Security Scanning

### Dependency Scanning

```bash
# Check for vulnerable dependencies
npm audit
npm audit fix

# Use Snyk (optional)
npx snyk test
```

### Container Scanning

```bash
# Scan Docker images
docker scan famousai:latest

# Use Trivy
trivy image famousai:latest
```

### Code Scanning

```bash
# Static analysis
npm install -g eslint
eslint . --ext .js

# Security linting
npm install -g eslint-plugin-security
```

## Penetration Testing

Self-deployment allows you to:

- Run your own penetration tests
- Use tools like OWASP ZAP, Burp Suite
- Test without vendor restrictions
- Fix issues immediately

```bash
# OWASP ZAP baseline scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000
```

## Conclusion

Self-deployment provides:

- ✅ **Complete Security Control**: Implement your own policies
- ✅ **Compliance Flexibility**: Meet your specific requirements
- ✅ **No Third-Party Risk**: Eliminate vendor data breaches
- ✅ **Audit Capability**: Full visibility into your systems
- ✅ **Custom Security**: Tailor to your threat model

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)

---

**Last Updated**: December 17, 2025  
**Security Status**: ✅ No vendor dependencies or external attack vectors
