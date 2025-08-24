# 🚀 SaveWise Deployment Guide

This guide will help you deploy SaveWise to production environments.

## 📋 Prerequisites

### System Requirements
- **Node.js** 16.x or higher
- **MongoDB** 4.4 or higher
- **Git** for version control
- **Domain name** (optional but recommended)
- **SSL certificate** (for HTTPS)

### Cloud Services (Choose One)
- **Heroku** - Easy deployment
- **Vercel** - Great for frontend
- **DigitalOcean** - Full control
- **AWS** - Enterprise scale
- **Netlify** - Static hosting

## 🌐 Environment Setup

### Production Environment Variables

**Server (.env):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongoDB_url
JWT_SECRET=your_super_secure_jwt_secret_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=https://yourdomain.com
```

**Client (.env.production):**
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_ENV=production
```

### Security Considerations

1. **Strong JWT Secret** - Use a long, random string
2. **Database Security** - Enable authentication and use strong passwords
3. **CORS Configuration** - Only allow your domain
4. **Rate Limiting** - Prevent abuse
5. **HTTPS Only** - Never use HTTP in production

## 🔧 Deployment Options

### Option 1: Heroku (Recommended for Beginners)

#### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd server
   heroku create your-app-name-api
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push heroku main
   ```

#### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd client
   vercel --prod
   ```

3. **Set Environment Variables**
   - Go to Vercel dashboard
   - Add `REACT_APP_API_URL` with your Heroku API URL

### Option 2: DigitalOcean Droplet

#### Server Setup

1. **Create Droplet**
   - Choose Ubuntu 20.04 LTS
   - Select appropriate size (minimum 1GB RAM)
   - Add SSH key

2. **Connect to Server**
   ```bash
   ssh root@your_server_ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt-get install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   apt-get update
   apt-get install -y mongodb-org
   
   # Install PM2
   npm install -g pm2
   
   # Install Nginx
   apt install -y nginx
   ```

4. **Clone and Setup Application**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/savewise.git
   cd savewise
   
   # Setup server
   cd server
   npm install --production
   
   # Setup client
   cd ../client
   npm install
   npm run build
   ```

5. **Configure PM2**
   ```bash
   cd /var/www/savewise/server
   pm2 start server.js --name "savewise-api"
   pm2 startup
   pm2 save
   ```

6. **Configure Nginx**
   ```bash
   nano /etc/nginx/sites-available/savewise
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       # Frontend
       location / {
           root /var/www/savewise/client/build;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
       
       # API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Enable Site**
   ```bash
   ln -s /etc/nginx/sites-available/savewise /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

### Option 3: AWS (Advanced)

#### Using AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize Application**
   ```bash
   cd server
   eb init
   ```

3. **Create Environment**
   ```bash
   eb create production
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

## 🔒 SSL Certificate Setup

### Using Let's Encrypt (Free)

1. **Install Certbot**
   ```bash
   apt install certbot python3-certbot-nginx
   ```

2. **Get Certificate**
   ```bash
   certbot --nginx -d yourdomain.com
   ```

3. **Auto-renewal**
   ```bash
   crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## 📊 Monitoring and Maintenance

### Health Checks

1. **API Health Check**
   ```bash
   curl https://your-api-domain.com/api/health
   ```

2. **Frontend Check**
   ```bash
   curl https://yourdomain.com
   ```

### Log Monitoring

1. **PM2 Logs**
   ```bash
   pm2 logs savewise-api
   ```

2. **Nginx Logs**
   ```bash
   tail -f /var/log/nginx/access.log
   tail -f /var/log/nginx/error.log
   ```

### Database Backup

1. **MongoDB Backup**
   ```bash
   mongodump --uri="mongodb://localhost:27017/savewise" --out=/backup/$(date +%Y%m%d)
   ```

2. **Automated Backup Script**
   ```bash
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)
   mongodump --uri="$MONGODB_URI" --out="/backup/$DATE"
   # Keep only last 7 days
   find /backup -type d -mtime +7 -exec rm -rf {} +
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd server && npm install
        cd ../client && npm install
    
    - name: Run tests
      run: |
        cd server && npm test
        cd ../client && npm test
    
    - name: Build client
      run: cd client && npm run build
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.4
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/savewise
          git pull origin main
          cd server && npm install --production
          cd ../client && npm install && npm run build
          pm2 restart savewise-api
```

## 🚨 Troubleshooting Deployment

### Common Issues

1. **Port Already in Use**
   ```bash
   lsof -i :5000
   kill -9 PID
   ```

2. **Permission Denied**
   ```bash
   chown -R www-data:www-data /var/www/savewise
   chmod -R 755 /var/www/savewise
   ```

3. **MongoDB Connection Failed**
   - Check MongoDB service: `systemctl status mongod`
   - Verify connection string
   - Check firewall settings

4. **Nginx 502 Bad Gateway**
   - Check if API is running: `pm2 status`
   - Verify proxy configuration
   - Check Nginx error logs

### Performance Optimization

1. **Enable Gzip Compression**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **Set Cache Headers**
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **Database Indexing**
   ```javascript
   // Add indexes for better performance
   db.transactions.createIndex({ user: 1, date: -1 })
   db.users.createIndex({ email: 1 })
   ```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancers
- Multiple server instances
- Database clustering
- CDN for static assets

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching
- Use database connection pooling

---

Need help with deployment? Contact our technical team or check the [troubleshooting guide](TROUBLESHOOTING.md).
