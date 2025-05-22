
#!/bin/bash

# Build for production
echo "Building for production..."
npm run build

# Create a zip file for easy upload
echo "Creating zip file for deployment..."
cd dist
zip -r ../lojaodafe-deploy.zip *
cd ..

echo "Deployment package created successfully: lojaodafe-deploy.zip"
echo ""
echo "==== HOSTGATOR DEPLOYMENT INSTRUCTIONS ===="
echo "1. Log in to your Hostgator cPanel"
echo "2. Navigate to File Manager"
echo "3. Go to the public_html directory (or subdirectory if using)"
echo "4. Upload and extract lojaodafe-deploy.zip"
echo "5. Make sure .htaccess file was uploaded correctly"
echo ""
echo "Done! Your website should now be accessible at your domain."
