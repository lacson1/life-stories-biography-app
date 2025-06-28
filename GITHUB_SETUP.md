# 🚀 GitHub Setup Guide

## Step 1: Create Repository on GitHub

1. **Go to GitHub**
   - Open [github.com](https://github.com) in your browser
   - Sign in to your account (`lacson1`)

2. **Create New Repository**
   - Click the **"+"** button in the top right corner
   - Select **"New repository"**

3. **Repository Settings**
   - **Repository name**: `life-stories-biography-app`
   - **Description**: `A comprehensive, Firebase-powered React application for creating, managing, and sharing personal life stories and biographies.`
   - **Visibility**: Choose **Public** (recommended) or **Private**
   - **Initialize repository**: ⚠️ **DO NOT** check any boxes (no README, .gitignore, or license)
   - Click **"Create repository"**

## Step 2: Push Your Code

After creating the repository on GitHub, run these commands in your terminal:

```bash
# Push your code to GitHub
git push -u origin main
```

If you get authentication errors, you may need to:

### Option A: Use Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `repo` permissions
3. Use your username and the token as password when prompted

### Option B: Use SSH (Recommended)

1. Set up SSH key if you haven't already:

   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   ```

2. Add SSH key to GitHub account
3. Change remote to SSH:

   ```bash
   git remote set-url origin git@github.com:lacson1/life-stories-biography-app.git
   git push -u origin main
   ```

## Step 3: Verify Upload

1. **Check GitHub Repository**
   - Go to `https://github.com/lacson1/life-stories-biography-app`
   - Verify all files are uploaded
   - Check that README.md displays properly

2. **Repository Features**
   - The README should show all the features and documentation
   - License should be detected as MIT
   - Languages should show JavaScript/CSS/HTML

## Step 4: Enable GitHub Pages (Optional)

To host your app on GitHub Pages:

1. **Build the Project**

   ```bash
   npm run build
   ```

2. **Install gh-pages**

   ```bash
   npm install --save-dev gh-pages
   ```

3. **Update package.json**
   Add these lines to `package.json`:

   ```json
   {
     "homepage": "https://lacson1.github.io/life-stories-biography-app",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

4. **Deploy to GitHub Pages**

   ```bash
   npm run deploy
   ```

5. **Enable Pages in GitHub**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Your app will be available at: `https://lacson1.github.io/life-stories-biography-app`

## Step 5: Repository Management

### Adding Collaborators

1. Go to repository Settings → Manage access
2. Click "Invite a collaborator"
3. Enter GitHub username or email

### Setting Up Issues and Projects

1. Go to repository Settings → Features
2. Enable Issues and Projects
3. Create issue templates for bug reports and feature requests

### Branch Protection (Optional)

1. Go to repository Settings → Branches
2. Add rule for `main` branch
3. Enable "Require pull request reviews before merging"

## Troubleshooting

### Authentication Issues

- **HTTPS**: Use Personal Access Token instead of password
- **SSH**: Set up SSH keys in GitHub settings
- **2FA**: Use Personal Access Token with 2FA enabled

### Permission Denied

```bash
# Check remote URL
git remote -v

# Change to HTTPS if needed
git remote set-url origin https://github.com/lacson1/life-stories-biography-app.git
```

### Repository Not Found

- Verify repository name matches exactly
- Check if repository is private and you have access
- Ensure you're using the correct GitHub username

## Next Steps

After successful upload:

1. **Star your repository** ⭐ (optional but recommended)
2. **Add topics/tags** for better discoverability
3. **Create releases** for version management
4. **Set up GitHub Actions** for CI/CD (optional)
5. **Add issue templates** for better project management

## Repository URL

Once created, your repository will be available at:
`https://github.com/lacson1/life-stories-biography-app`

---

**Need help?** Check GitHub's [documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository) or create an issue in the repository.
