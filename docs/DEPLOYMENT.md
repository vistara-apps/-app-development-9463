# SoulConnect Deployment Guide

This guide covers deploying SoulConnect to various platforms and environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Docker Deployment](#docker-deployment)
4. [Vercel Deployment](#vercel-deployment)
5. [Netlify Deployment](#netlify-deployment)
6. [AWS S3 + CloudFront](#aws-s3--cloudfront)
7. [Production Checklist](#production-checklist)
8. [Monitoring & Analytics](#monitoring--analytics)

## Prerequisites

- Node.js 18+
- npm or yarn
- Docker (for containerized deployment)
- OpenRouter API key
- Base-compatible wallet for testing

## Environment Configuration

### Required Environment Variables

Create a `.env` file with the following variables:

```env
# OpenAI API Key (via OpenRouter)
VITE_OPENAI_API_KEY=your_openrouter_api_key_here

# WalletConnect Project ID (optional)
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here

# Payment API Configuration
VITE_PAYMENT_API_URL=https://payments.vistara.dev

# App Configuration
VITE_APP_NAME=SoulConnect
VITE_APP_VERSION=1.0.0

# Production Configuration
VITE_DEV_MODE=false
VITE_DEBUG_PAYMENTS=false
```

### Environment-Specific Configurations

#### Development
```env
VITE_DEV_MODE=true
VITE_DEBUG_PAYMENTS=true
VITE_PAYMENT_API_URL=https://test-payments.vistara.dev
```

#### Staging
```env
VITE_DEV_MODE=false
VITE_DEBUG_PAYMENTS=true
VITE_PAYMENT_API_URL=https://staging-payments.vistara.dev
```

#### Production
```env
VITE_DEV_MODE=false
VITE_DEBUG_PAYMENTS=false
VITE_PAYMENT_API_URL=https://payments.vistara.dev
```

## Docker Deployment

### Build and Run Locally

```bash
# Build the Docker image
docker build -t soulconnect .

# Run the container
docker run -p 3000:3000 --env-file .env soulconnect
```

### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  soulconnect:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY}
      - VITE_WALLET_CONNECT_PROJECT_ID=${VITE_WALLET_CONNECT_PROJECT_ID}
      - VITE_PAYMENT_API_URL=${VITE_PAYMENT_API_URL}
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

### Production Docker Setup

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Vercel Deployment

### Automatic Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_OPENAI_API_KEY": "@openai-api-key",
    "VITE_WALLET_CONNECT_PROJECT_ID": "@wallet-connect-project-id",
    "VITE_PAYMENT_API_URL": "@payment-api-url"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## Netlify Deployment

### Automatic Deployment

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## AWS S3 + CloudFront

### S3 Setup

```bash
# Create S3 bucket
aws s3 mb s3://soulconnect-app

# Enable static website hosting
aws s3 website s3://soulconnect-app --index-document index.html --error-document index.html

# Upload build files
npm run build
aws s3 sync dist/ s3://soulconnect-app --delete
```

### CloudFront Distribution

```json
{
  "DistributionConfig": {
    "CallerReference": "soulconnect-2024",
    "Comment": "SoulConnect App Distribution",
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-soulconnect-app",
      "ViewerProtocolPolicy": "redirect-to-https",
      "Compress": true,
      "ForwardedValues": {
        "QueryString": false,
        "Cookies": {
          "Forward": "none"
        }
      }
    },
    "Origins": [
      {
        "Id": "S3-soulconnect-app",
        "DomainName": "soulconnect-app.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ],
    "Enabled": true,
    "PriceClass": "PriceClass_100"
  }
}
```

## Production Checklist

### Pre-Deployment

- [ ] Environment variables configured
- [ ] API keys secured and valid
- [ ] Build process tested locally
- [ ] Tests passing
- [ ] Security headers configured
- [ ] Error tracking set up
- [ ] Performance monitoring enabled

### Security

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] API keys not exposed in client code
- [ ] Content Security Policy implemented
- [ ] CORS properly configured

### Performance

- [ ] Assets minified and compressed
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] CDN configured
- [ ] Caching strategies in place

### Monitoring

- [ ] Error tracking (Sentry, Bugsnag)
- [ ] Analytics (Google Analytics, Mixpanel)
- [ ] Performance monitoring (Web Vitals)
- [ ] Uptime monitoring
- [ ] Log aggregation

## Monitoring & Analytics

### Error Tracking with Sentry

```bash
npm install @sentry/react @sentry/tracing
```

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

### Analytics Integration

```javascript
// Google Analytics 4
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: 'SoulConnect',
  page_location: window.location.href
});

// Track bio generations
gtag('event', 'bio_generated', {
  event_category: 'engagement',
  event_label: 'ai_generation'
});
```

### Performance Monitoring

```javascript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables Not Loading**
   - Ensure variables start with `VITE_`
   - Check `.env` file location
   - Verify deployment platform configuration

3. **Wallet Connection Issues**
   - Check WalletConnect project ID
   - Verify network configuration
   - Test with different wallets

4. **API Errors**
   - Validate API keys
   - Check rate limits
   - Verify endpoint URLs

### Debug Mode

Enable debug mode for troubleshooting:

```env
VITE_DEV_MODE=true
VITE_DEBUG_PAYMENTS=true
```

### Health Checks

Create a health check endpoint:

```javascript
// src/utils/healthCheck.js
export const healthCheck = async () => {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE,
    version: import.meta.env.VITE_APP_VERSION,
    apis: {
      openai: false,
      payments: false
    }
  };

  try {
    // Test OpenAI connection
    const response = await fetch('https://openrouter.ai/api/v1/models');
    checks.apis.openai = response.ok;
  } catch (error) {
    console.error('OpenAI health check failed:', error);
  }

  try {
    // Test payment API
    const response = await fetch(import.meta.env.VITE_PAYMENT_API_URL + '/health');
    checks.apis.payments = response.ok;
  } catch (error) {
    console.error('Payment API health check failed:', error);
  }

  return checks;
};
```

## Support

For deployment issues:
1. Check the troubleshooting section above
2. Review deployment logs
3. Test locally with production build
4. Contact the development team

## Updates and Maintenance

### Automated Updates

Set up GitHub Actions for automated deployments:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Maintenance Schedule

- **Weekly**: Dependency updates
- **Monthly**: Security patches
- **Quarterly**: Performance reviews
- **Annually**: Major version updates
