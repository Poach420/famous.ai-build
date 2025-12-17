# Dependency Management for Self-Deployment

## Overview

This document outlines the strategy for managing dependencies to ensure the project remains fully self-deployable without vendor lock-ins.

## Dependency Principles

### ✅ Allowed Dependencies

1. **Open Source Licenses**
   - MIT
   - Apache 2.0
   - BSD (2-clause, 3-clause)
   - ISC
   - MPL 2.0

2. **Self-Hostable Services**
   - PostgreSQL (database)
   - Redis (cache)
   - MinIO (object storage)
   - Nginx (reverse proxy)
   - RabbitMQ (message queue)

3. **Portable Libraries**
   - Express, Fastify (web frameworks)
   - Sequelize, TypeORM (ORMs)
   - Passport (authentication)
   - Sharp, Jimp (image processing)

### ❌ Avoid These

1. **Proprietary Services**
   - Famous.ai-specific APIs
   - Closed-source SaaS platforms
   - Vendor-locked cloud services

2. **Problematic Licenses**
   - AGPL (if offering as SaaS)
   - Proprietary licenses
   - Copyleft licenses with restrictions

3. **Non-Self-Hostable**
   - Third-party analytics (Google Analytics)
   - Hosted auth services (Auth0, unless self-hosted)
   - Cloud-only databases (DynamoDB, Firestore)

## Dependency Verification Checklist

Before adding any dependency:

- [ ] Check the license (must be permissive)
- [ ] Verify it can run self-hosted
- [ ] Confirm no external API calls required
- [ ] Check for Famous.ai or vendor-specific code
- [ ] Ensure it's actively maintained
- [ ] Review security advisories

## Example Package.json (Future Reference)

```json
{
  "name": "famous.ai-build",
  "version": "1.0.0",
  "description": "Self-deployable solution with no vendor lock-ins",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",           // ✅ MIT - Web framework
    "pg": "^8.11.3",                // ✅ MIT - PostgreSQL client
    "redis": "^4.6.7",              // ✅ MIT - Redis client
    "jsonwebtoken": "^9.0.2",       // ✅ MIT - JWT auth
    "bcrypt": "^5.1.1",             // ✅ MIT - Password hashing
    "dotenv": "^16.3.1",            // ✅ BSD - Environment config
    "helmet": "^7.0.0",             // ✅ MIT - Security headers
    "cors": "^2.8.5",               // ✅ MIT - CORS handling
    "multer": "^1.4.5-lts.1"        // ✅ MIT - File uploads
  },
  "devDependencies": {
    "jest": "^29.6.2",              // ✅ MIT - Testing
    "eslint": "^8.45.0",            // ✅ MIT - Linting
    "prettier": "^3.0.0",           // ✅ MIT - Code formatting
    "nodemon": "^3.0.1"             // ✅ MIT - Development
  }
}
```

## Recommended Alternatives to Common Lock-in Services

### Authentication
- ❌ Auth0 (hosted) → ✅ Passport.js + local strategy
- ❌ Firebase Auth → ✅ JWT + bcrypt
- ❌ AWS Cognito → ✅ Self-hosted OAuth2 (like Keycloak)

### Database
- ❌ DynamoDB → ✅ PostgreSQL + JSON columns
- ❌ Firestore → ✅ MongoDB (self-hosted) or PostgreSQL
- ❌ FaunaDB → ✅ PostgreSQL with proper indexes

### File Storage
- ❌ S3 (locked to AWS) → ✅ MinIO (S3-compatible, self-hosted)
- ❌ Google Cloud Storage → ✅ MinIO or local filesystem
- ❌ Cloudinary → ✅ Sharp + local/MinIO storage

### Caching
- ❌ AWS ElastiCache → ✅ Redis (self-hosted)
- ❌ Memorystore → ✅ Memcached (self-hosted)

### Message Queue
- ❌ AWS SQS → ✅ RabbitMQ (self-hosted)
- ❌ Google Pub/Sub → ✅ Redis Streams
- ❌ Azure Service Bus → ✅ Apache Kafka (self-hosted)

### Email
- ❌ SendGrid → ✅ Nodemailer + your SMTP
- ❌ Mailgun → ✅ Self-hosted mail server
- ❌ AWS SES → ✅ Postal (self-hosted email)

### Monitoring
- ❌ DataDog → ✅ Prometheus + Grafana
- ❌ New Relic → ✅ Elastic APM (self-hosted)
- ❌ Sentry (hosted) → ✅ Sentry (self-hosted)

### Search
- ❌ Algolia → ✅ Elasticsearch (self-hosted)
- ❌ AWS CloudSearch → ✅ MeiliSearch (self-hosted)

## Dependency Audit Process

### Regular Audits

```bash
# Check for security vulnerabilities
npm audit

# Check for outdated packages
npm outdated

# Check licenses
npx license-checker --summary

# Verify no Famous.ai dependencies
grep -r "famous.ai" package.json
grep -r "famous-ai" package.json
```

### Automated Checks

Add to CI/CD pipeline:

```yaml
# .github/workflows/dependency-check.yml
name: Dependency Check
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for vendor lock-ins
        run: |
          # Fail if Famous.ai dependencies detected
          ! grep -i "famous.ai" package.json
          ! grep -i "famousai" package.json
          
      - name: Verify licenses
        run: |
          npm install
          npx license-checker --failOn 'AGPL;GPL'
          
      - name: Security audit
        run: npm audit --production
```

## Migration Guide

If you find a locked-in dependency:

1. **Identify the dependency**
   ```bash
   grep -r "vendor-specific-package" .
   ```

2. **Find self-hosted alternative**
   - Check "Recommended Alternatives" section above
   - Search for "self-hosted alternative to X"

3. **Create abstraction layer**
   ```javascript
   // services/storage.js
   class StorageService {
     constructor(config) {
       if (config.type === 'minio') {
         this.client = new MinioClient(config);
       } else if (config.type === 'local') {
         this.client = new LocalStorage(config);
       }
     }
     
     async upload(file) {
       return this.client.upload(file);
     }
   }
   ```

4. **Update configuration**
   ```env
   # Change from
   STORAGE_PROVIDER=aws-s3
   
   # To
   STORAGE_PROVIDER=minio
   ```

5. **Test thoroughly**
   ```bash
   npm test
   ```

6. **Document the change**
   - Update this document
   - Update DEPLOYMENT.md
   - Add migration notes

## License Compliance

### Acceptable Licenses for Self-Deployment

| License | Self-Deploy | Commercial Use | Modify | Distribute |
|---------|-------------|----------------|--------|------------|
| MIT | ✅ | ✅ | ✅ | ✅ |
| Apache 2.0 | ✅ | ✅ | ✅ | ✅ |
| BSD-3 | ✅ | ✅ | ✅ | ✅ |
| ISC | ✅ | ✅ | ✅ | ✅ |
| MPL 2.0 | ✅ | ✅ | ✅ | ⚠️ File-level |

### Licenses to Avoid

| License | Issue |
|---------|-------|
| AGPL | Must share code if offered as service |
| Proprietary | Cannot self-host |
| Commercial | Requires payment/license |

## Conclusion

By following these dependency management practices, we ensure:

- ✅ Complete self-deployment capability
- ✅ No vendor lock-ins
- ✅ Legal compliance
- ✅ Long-term sustainability
- ✅ Freedom to migrate

## Resources

- [Choose a License](https://choosealicense.com/)
- [SPDX License List](https://spdx.org/licenses/)
- [npm license-checker](https://www.npmjs.com/package/license-checker)
- [Awesome Self-Hosted](https://github.com/awesome-selfhosted/awesome-selfhosted)

---

**Last Updated**: December 17, 2025  
**Status**: No dependencies yet - repository is clean
