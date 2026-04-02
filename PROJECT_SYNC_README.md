# Portfolio Project Sync

Automated media synchronization system for your portfolio website. When you add new project folders to `/Downloads/projects/`, this tool automatically copies images and videos to your portfolio site and updates project pages.

## Setup

The automation is ready to use. Just add your projects to the folder structure and run the sync script.

### Folder Structure

```
/Downloads/projects/
├── Project Name 1/
│   ├── asset 1.webp
│   ├── asset 2.webp
│   ├── asset 3.webp
│   └── video.mp4
├── Project Name 2/
│   ├── asset 1.webp
│   ├── asset 2.webp
│   └── ...
```

### Running the Sync

**One-time sync (process all projects):**
```bash
cd ~/Downloads/portfolio-site
node project-sync.js
```

**Watch mode (automatic sync when new folders are added):**
```bash
cd ~/Downloads/portfolio-site
node project-sync.js &
```

Press `Ctrl+C` to stop watching.

## How It Works

1. **Detects new folders** in `/Downloads/projects/`
2. **Copies media files** to `portfolio-site/images/[project-slug]/`
3. **Updates work.html** with the first image as the project thumbnail
4. **Updates project pages** with gallery images and videos

## Project Configuration

Each project is mapped in the script. To add a new project, edit `project-sync.js` and add an entry to the `projectConfig` object:

```javascript
const projectConfig = {
  'my-project': {
    slug: 'my-project',
    title: 'My Project',
    category: 'Web Design',
    description: 'Project description here',
    htmlFile: 'project-my-project.html'
  }
};
```

## Creating Project Pages

Before adding a project folder, create its project page HTML file using the existing templates:
- Copy `project-mjflood.html` or `project-engineers-ireland.html`
- Update the title, description, and content
- Save as `project-[slug].html`

The sync script will automatically populate the images into the gallery.

## Naming Convention

- **Folder names**: "My Project" or "my-project" (spaces/hyphens handled automatically)
- **Image files**: asset 1.webp, asset 2.webp, etc. (will be sorted numerically)
- **Video files**: Any .mp4, .webm, .mov, or .avi format

## What Gets Updated

### work.html
- Project thumbnail (first image from project folder)
- Project title and description
- Link to project detail page

### Project Detail Pages
- Hero/cover image (first image)
- Gallery section with all images
- Video embeds (if applicable)

## Status Messages

✅ **Updated** - Project card successfully updated
📸 **Copied** - Images and videos successfully copied
⚠️ **Warning** - Missing file or configuration
ℹ️ **Info** - Project page doesn't exist yet (create it manually)
✨ **Ready** - Project sync complete

## Manual Updates

If you want to manually refresh a project without adding new folders, simply:
1. Update the files in the project folder in `/Downloads/projects/`
2. Run `node project-sync.js` again

The script will copy the latest files and update all references.

## Video Integration

Videos are copied to the project folder but require manual embedding in the HTML. Add videos to your project pages like:

```html
<video width="100%" controls>
  <source src="../images/[project-slug]/[video-name].mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

## Troubleshooting

**"No media files found"**
- Check that image files are in the project folder
- Verify file extensions (.webp, .jpg, .png, .mp4, etc.)

**"Could not find project card"**
- The project needs to be added to work.html manually
- Or add a project config entry and create a project page

**"Project page doesn't exist"**
- Create a new project page (copy from existing template)
- Save with correct filename matching the htmlFile in config

## Next Steps

1. Add your next project to `/Downloads/projects/[Project Name]/`
2. Create its project detail page using the template
3. Run `node project-sync.js`
4. Check work.html and the project page for updated images
