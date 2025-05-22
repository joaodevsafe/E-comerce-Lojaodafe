
#!/bin/bash

# Exit on error
set -e

# Check if environment is set
ENV=${1:-production}
echo "Building for environment: $ENV"

# Create appropriate .env file for the build
if [ "$ENV" = "production" ]; then
  echo "Creating production .env file..."
  cat > .env <<EOL
VITE_SUPABASE_URL=https://pgrsngtophlchvdpbvge.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncnNuZ3RvcGhsY2h2ZHBidmdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODAxNTAsImV4cCI6MjA2MzI1NjE1MH0.myAhv3ihmo6OAe8oQmAwIaNlmCOuRcMS4i-ZfXDIjh4
VITE_API_URL=https://api.lojaodafe.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51PYBRxIVwDa5V4hOAKuMQR1eZmS0x7Qpli0HI59PdPqHl8TcLIYsFOj4whO3EMcgKIBmQARDy7ONzXezmE8gTyIp00uSg5FLHV
EOL
else
  echo "Creating development .env file..."
  cat > .env <<EOL
VITE_SUPABASE_URL=https://pgrsngtophlchvdpbvge.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncnNuZ3RvcGhsY2h2ZHBidmdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODAxNTAsImV4cCI6MjA2MzI1NjE1MH0.myAhv3ihmo6OAe8oQmAwIaNlmCOuRcMS4i-ZfXDIjh4
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51PYBRxIVwDa5V4hOAKuMQR1eZmS0x7Qpli0HI59PdPqHl8TcLIYsFOj4whO3EMcgKIBmQARDy7ONzXezmE8gTyIp00uSg5FLHV
EOL
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build for the specified environment
echo "Building for $ENV..."
if [ "$ENV" = "production" ]; then
  npm run build
else
  npm run build:dev
fi

# Create a zip file for easy upload
echo "Creating zip file for deployment..."
cd dist
zip -r ../lojaodafe-deploy.zip *
cd ..

echo "Deployment package created successfully: lojaodafe-deploy.zip"
echo ""
echo "==== HOSTING DEPLOYMENT INSTRUCTIONS ===="
echo "1. Log in to your hosting control panel"
echo "2. Navigate to File Manager"
echo "3. Go to the public_html directory (or subdirectory if using)"
echo "4. Upload and extract lojaodafe-deploy.zip"
echo "5. Make sure .htaccess file was uploaded correctly"
echo ""
echo "Done! Your website should now be accessible at your domain."

