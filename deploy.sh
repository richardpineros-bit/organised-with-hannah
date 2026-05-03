#!/bin/bash
# Organised With Hannah - One-Click Deployment Script
# Run this on your Hetzner VPS after SSH login
# IP: 46.225.171.57

set -e  # Exit on any error

echo "=========================================="
echo "  Organised With Hannah - Deployment"
echo "  Server: 46.225.171.57"
echo "=========================================="
echo ""

# 1. Update system
echo "[1/12] Updating system packages..."
apt-get update -y
apt-get upgrade -y

# 2. Install essential packages
echo "[2/12] Installing essential packages..."
apt-get install -y curl git nginx certbot python3-certbot-nginx ufw fail2ban

# 3. Install Node.js 20
echo "[3/12] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify
node -v
npm -v

# 4. Install PM2 globally
echo "[4/12] Installing PM2 process manager..."
npm install -g pm2

# 5. Configure firewall
echo "[5/12] Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw allow 3001/tcp  # API port
ufw --force enable

# 6. Clone the repository
echo "[6/12] Cloning repository..."
cd /root
if [ -d "organised-with-hannah" ]; then
    echo "Repository already exists, pulling latest changes..."
    cd organised-with-hannah
    git pull origin main
else
    git clone https://github.com/richardpineros-bit/organised-with-hannah.git
    cd organised-with-hannah
fi

# 7. Setup Backend
echo "[7/12] Setting up backend..."
cd backend
npm install

# Create production .env
cat > .env << 'ENVFILE'
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://organisedwithhannah.com.au

# Database
DATABASE_URL=./database.sqlite

# JWT - CHANGE THIS TO A RANDOM STRING!
JWT_SECRET=CHANGE_THIS_TO_A_RANDOM_32_CHARACTER_STRING
JWT_EXPIRES_IN=7d

# Email (Gmail SMTP - create app password at https://myaccount.google.com/apppasswords)
EMAIL_FROM=hannah@organisedwithhannah.com
EMAIL_PASSWORD=your-gmail-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Stripe (add these when ready)
# STRIPE_SECRET_KEY=sk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# STRIPE_PUBLISHABLE_KEY=pk_live_...

# Admin credentials
ADMIN_EMAIL=admin@organisedwithhannah.com
ADMIN_PASSWORD=changeThisPassword123
ENVFILE

echo ""
echo "⚠️  IMPORTANT: Edit /root/organised-with-hannah/backend/.env"
echo "   - Change JWT_SECRET to a random string"
echo "   - Add your Gmail app password for email"
echo "   - Change the admin password"
echo ""

# Build backend
npm run build

# Initialize database
npx ts-node src/database/seed.ts

# Start backend with PM2
pm2 start dist/server.js --name "owh-api"

cd ..

# 8. Setup Frontend
echo "[8/12] Setting up frontend..."
npm install

# Create production .env for frontend
cat > .env.production << 'FRONTENDENV'
VITE_API_URL=https://organisedwithhannah.com.au/api
FRONTEND_ENV=production
FRONTEND_ENV

# Build frontend
npm run build

# 9. Configure Nginx
echo "[9/12] Configuring Nginx..."
cat > /etc/nginx/sites-available/organisedwithhannah << 'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name organisedwithhannah.com.au www.organisedwithhannah.com.au;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Frontend static files
    location / {
        root /root/organised-with-hannah/dist;
        try_files $uri $uri/ /index.html;
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }

    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Uploaded images
    location /uploads/ {
        alias /root/organised-with-hannah/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
NGINX

# Enable site
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/organisedwithhannah /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 10. Setup SSL with Let's Encrypt
echo "[10/12] Setting up SSL..."
# Note: You'll need to point your domain to this server first!
# certbot --nginx -d organisedwithhannah.com.au -d www.organisedwithhannah.com.au --non-interactive --agree-tos --email admin@organisedwithhannah.com.au

echo ""
echo "⚠️  SSL setup skipped - point your domain to 46.225.171.57 first"
echo "   Then run: certbot --nginx -d organisedwithhannah.com.au -d www.organisedwithhannah.com.au"
echo ""

# 11. Save PM2 config
echo "[11/12] Saving PM2 configuration..."
pm2 save
pm2 startup systemd -u root --hp /root

# 12. Setup automatic updates
echo "[12/12] Setting up automatic security updates..."
apt-get install -y unattended-upgrades
systemctl enable unattended-upgrades
systemctl start unattended-upgrades

# Create update script
cat > /root/update-owh.sh << 'UPDATE'
#!/bin/bash
cd /root/organised-with-hannah
git pull origin main

cd backend
npm install
npm run build
pm2 restart owh-api

cd ..
npm install
npm run build
UPDATE

chmod +x /root/update-owh.sh

echo ""
echo "=========================================="
echo "  DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "Server is running at:"
echo "  HTTP:  http://46.225.171.57"
echo ""
echo "Next steps:"
echo "  1. Edit backend .env: nano /root/organised-with-hannah/backend/.env"
echo "  2. Point your domain to: 46.225.171.57"
echo "  3. Run SSL: certbot --nginx -d organisedwithhannah.com.au"
echo ""
echo "Admin panel: http://46.225.171.57/admin/login"
echo "  Default: admin@organisedwithhannah.com.au / admin123"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check server status"
echo "  pm2 logs owh-api        - View API logs"
echo "  pm2 restart owh-api     - Restart API"
echo "  /root/update-owh.sh     - Update from GitHub"
echo ""
echo "=========================================="
