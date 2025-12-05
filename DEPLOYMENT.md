# Deployment Guide

## Quick Access Options for Mobile

Since you're using Claude Code from your phone, here are the best ways to view this site:

### Option 1: GitHub Pages (Recommended for Mobile)

1. **Merge this PR** to your main branch
2. **Enable GitHub Pages**:
   - Go to your repo settings on GitHub
   - Navigate to "Pages" section
   - Under "Source", select your main branch
   - Set folder to "/ (root)"
   - Save and wait ~1 minute

3. **Access at**: `https://dwilliams27.github.io/morpheus/`

This gives you a permanent URL you can bookmark and access from anywhere!

### Option 2: Direct File Access (If Local)

If you can access the file system on your device:
- Just tap `index.html` to open it in your browser
- Works offline!

### Option 3: Quick Web Server (If You Have Terminal Access)

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve

# Then visit the URL shown
```

### Option 4: Online IDE with Preview

Services like:
- CodeSandbox
- StackBlitz
- Repl.it
- GitHub Codespaces

All can host this and give you a live preview URL.

### Option 5: Free Hosting Services

Deploy to any of these (all have free tiers):
- **Netlify**: Drag & drop the folder, instant URL
- **Vercel**: Connect GitHub repo, auto-deploy
- **Cloudflare Pages**: Similar to above
- **Surge.sh**: `npm install -g surge && surge`

## For GitHub Pages Specifically

After enabling GitHub Pages on your main branch, your site will be at:
```
https://[your-username].github.io/[repo-name]/
```

For this repo:
```
https://dwilliams27.github.io/morpheus/
```

The site will auto-update whenever you push to main!

## No Build Required

This site uses pure HTML/CSS/JS with no dependencies, so there's:
- ✅ No `npm install` needed
- ✅ No build step
- ✅ No configuration
- ✅ Works anywhere that can serve HTML

Just upload the files and go!
