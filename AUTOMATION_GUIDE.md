# Portfolio Automation System — Complete Setup Guide

Your portfolio now has a fully automated system for managing project images and videos. Here's everything you need to know.

## Quick Start

### One-Time Sync
Run this command to process all projects in your `/Downloads/projects/` folder:

```bash
cd ~/Downloads/portfolio-site
node project-sync.js
```

Or use the shortcut script:
```bash
./sync.sh
```

### Watch Mode (Continuous)
Keep the sync running in the background, automatically processing new projects as you add them:

```bash
node project-sync.js
```

Press `Ctrl+C` to stop.

## How to Add a New Project

### Step 1: Create Project Folder
Add a folder to `/Downloads/projects/` with your project name:
```
/Downloads/projects/My New Project/
```

### Step 2: Add Media Files
Add images and videos to this folder:
```
/Downloads/projects/My New Project/
├── asset 1.webp
├── asset 2.webp
├── asset 3.webp
├── video.mp4
```

**Naming convention:**
- Images should be named: `asset 1.webp`, `asset 2.webp`, etc.
- Videos can have any name with format: `.mp4`, `.webm`, `.mov`, `.avi`
- Supported image formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

### Step 3: Create Project Page
Copy an existing project page as a template:
1. Copy `/portfolio-site/project-mjflood.html`
2. Rename to `project-[slug].html` (e.g., `project-my-new-project.html`)
3. Update the title, description, and content
4. Save in portfolio-site root

### Step 4: Run Sync
```bash
node project-sync.js
```

The system will:
- Copy all images to `images/[project-slug]/`
- Update work.html with the project thumbnail
- Populate gallery images in the project page
- Display status messages for each step

## What Happens Automatically

### Files Copied
Images and videos from `/Downloads/projects/[Project]/` are copied to:
```
/portfolio-site/images/[project-slug]/
```

### work.html Updated
- First image becomes the project thumbnail
- Project card links to the project detail page
- Replaces placeholder images with real media

### Project Page Updated
- **Hero image**: First image (asset 1) displays as cover
- **Gallery section 1**: Images 2-3 populate first gallery
- **Gallery section 2**: Images 4-5 populate second gallery (if exists)

## Project Configuration

Each project needs to be added to the configuration in `project-sync.js`:

```javascript
const projectConfig = {
  'my-project': {
    slug: 'my-project',           // Folder name (lowercase, hyphens)
    title: 'My Project',          // Display name
    category: 'Web Design',       // Category for work.html
    description: 'Description',   // Text under project name
    htmlFile: 'project-my-project.html'  // Detail page filename
  }
};
```

## Supported Media

### Images
- `.jpg` / `.jpeg`
- `.png`
- `.webp` (recommended - smaller file size)
- `.gif`

### Videos
- `.mp4` (H.264 codec recommended)
- `.webm`
- `.mov`
- `.avi`

**Note:** Videos are copied to the images folder but require manual embedding in the HTML using `<video>` tags.

## Status Messages Explained

| Symbol | Meaning |
|--------|---------|
| 📦 | Processing a new project |
| 📸 | Images/videos copied successfully |
| ✅ | File updated successfully |
| ⚠️ | Warning - check configuration |
| ℹ️ | Info - project page needs to be created manually |
| ✨ | Project sync complete |

## Examples

### Example 1: Adding "Acme Corp" Project

1. **Create folder:**
   ```
   /Downloads/projects/Acme Corp/
   ```

2. **Add files:**
   ```
   /Downloads/projects/Acme Corp/
   ├── asset 1.webp
   ├── asset 2.webp
   ├── asset 3.webp
   ├── asset 4.webp
   ├── project-video.mp4
   ```

3. **Create project page:**
   - Copy `project-mjflood.html`
   - Rename to `project-acme-corp.html`
   - Update content about Acme Corp

4. **Add configuration:**
   ```javascript
   'acme-corp': {
     slug: 'acme-corp',
     title: 'Acme Corp',
     category: 'Brand Identity',
     description: 'Brand identity redesign for global corporation',
     htmlFile: 'project-acme-corp.html'
   }
   ```

5. **Run sync:**
   ```bash
   node project-sync.js
   ```

Result:
- ✅ Images copied to `images/acme-corp/`
- ✅ work.html updated with Acme Corp thumbnail
- ✅ project-acme-corp.html galleries populated with images

### Example 2: Quick Update of Existing Project

If you want to replace images in an existing project:
1. Update the files in `/Downloads/projects/[Project]/`
2. Run `node project-sync.js` again
3. All references automatically update

## Troubleshooting

### "Could not find project card for X in work.html"
- The project needs to be added to work.html manually
- Copy an existing project card and update the href/image/text

### "Project page X doesn't exist yet"
- Create the project HTML file (copy from template)
- Save as `project-[slug].html`
- Run sync again

### Images not showing in gallery
- Make sure file paths are relative: `../images/[slug]/[file].webp`
- Check that image files exist in the folder
- Verify file extensions are correct

### Sync script not running
- Make sure Node.js is installed: `node --version`
- Navigate to portfolio-site folder: `cd ~/Downloads/portfolio-site`
- Try again: `node project-sync.js`

## Advanced: Manual Video Embedding

To add videos to your project page, add this to your HTML:

```html
<video width="100%" controls style="margin: 2rem 0; border-radius: 8px;">
  <source src="../images/[project-slug]/[video-name].mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

## Integration with Your Workflow

### Recommended Setup
1. **Keep watch mode running** while you work:
   ```bash
   node project-sync.js &
   ```
2. **Add project folder** to `/Downloads/projects/`
3. **Create/update project page** in editor
4. **Save** - sync runs automatically

### Daily Update
Before previewing your site, run:
```bash
./sync.sh
```

### Batch Import
Have multiple projects to add? Create all project folders at once in `/Downloads/projects/`, create their HTML pages, run sync once, and all projects are imported.

## Understanding the Process

When you run the sync:

1. **Scan** - Finds all project folders in `/Downloads/projects/`
2. **Copy** - Transfers media to `portfolio-site/images/[project]/`
3. **Update Grid** - Replaces first image in work.html
4. **Populate Gallery** - Fills project page image sections
5. **Report** - Shows what was updated

This entire process takes 1-2 seconds per project.

## Next Steps

1. Create a new project folder in `/Downloads/projects/`
2. Add your images/videos
3. Create a project HTML page
4. Add config entry
5. Run `node project-sync.js`
6. Check work.html and project page

Your portfolio is now fully automated for media management! 🎉
