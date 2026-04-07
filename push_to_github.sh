:: Run these commands in Git Bash (Right-click in the folder → "Git Bash Here")
:: OR in PowerShell if Git is installed. This script pushes your portal to GitHub.

cd "c:/AI JOB VACANCY PORTAL"

# Step 1: Initialize Git (if not already)
git init

# Step 2: Create a .gitignore to exclude node_modules and .env
echo "node_modules/
.env
.next/
*.log" > .gitignore

# Step 3: Add all files
git add .

# Step 4: Commit
git commit -m "feat: Complete AI Job Vacancy Portal with role-based dashboards, verified jobs, and admin controls"

# Step 5: Connect to your GitHub repo
git remote add origin https://github.com/chandra02-09/JOB-VACANCY-PORTAL.git

# Step 6: Push to main branch
git branch -M main
git push -u origin main
