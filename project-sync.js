const fs = require('fs');
const path = require('path');
const { watch } = require('fs');

const PROJECTS_DIR = path.join(process.env.HOME, 'Downloads/projects');
const PORTFOLIO_DIR = path.join(process.env.HOME, 'Downloads/portfolio-site');
const IMAGES_DIR = path.join(PORTFOLIO_DIR, 'images');

// Map of processed projects to avoid duplicates
const processedProjects = new Set();

// Project configuration mapping
const projectConfig = {
  'mjflood': {
    slug: 'mjflood',
    title: 'MJ Flood',
    category: 'Brand & Digital',
    description: 'Complete digital transformation for Ireland\'s leading technology provider',
    tall: true,
    htmlFile: 'project-mjflood.html'
  },
  'engineers-ireland': {
    slug: 'engineers-ireland',
    title: 'Engineers Ireland',
    category: 'Web Design',
    description: 'Professional web presence for Ireland\'s leading engineering body',
    tall: false,
    htmlFile: 'project-engineers-ireland.html'
  }
};

// Normalize project folder name to slug
function folderToSlug(folderName) {
  return folderName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

// Get media files from a project folder
function getMediaFiles(projectPath) {
  const files = fs.readdirSync(projectPath);
  const images = [];
  const videos = [];

  files.forEach(file => {
    if (file.startsWith('.')) return; // Skip system files

    const filePath = path.join(projectPath, file);
    const stat = fs.statSync(filePath);

    if (!stat.isDirectory()) {
      if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
        images.push(file);
      } else if (/\.(mp4|webm|mov|avi)$/i.test(file)) {
        videos.push(file);
      }
    }
  });

  // Sort images naturally (asset 1, asset 2, etc.)
  images.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '999');
    const numB = parseInt(b.match(/\d+/)?.[0] || '999');
    return numA - numB;
  });

  return { images, videos };
}

// Copy project media to portfolio
function copyProjectMedia(projectName, projectPath) {
  const slug = folderToSlug(projectName);
  const destDir = path.join(IMAGES_DIR, slug);

  // Create destination directory
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`📁 Created directory: ${destDir}`);
  }

  const { images, videos } = getMediaFiles(projectPath);

  // Copy images
  images.forEach(img => {
    const src = path.join(projectPath, img);
    const dest = path.join(destDir, img);
    fs.copyFileSync(src, dest);
  });

  // Copy videos
  videos.forEach(vid => {
    const src = path.join(projectPath, vid);
    const dest = path.join(destDir, vid);
    fs.copyFileSync(src, dest);
  });

  return { images, videos, slug };
}

// Update work.html to reference real project image
function updateWorkGrid(projectName, slug, firstImage) {
  const workFile = path.join(PORTFOLIO_DIR, 'work.html');
  let content = fs.readFileSync(workFile, 'utf8');

  const config = projectConfig[slug];
  if (!config) {
    console.warn(`⚠️  No config for project: ${slug}`);
    return;
  }

  // Find and replace the project card in the grid
  const projectCardRegex = new RegExp(
    `<a href="${config.htmlFile}"[^>]*class="project-card[^"]*">\\s*<div class="project-thumb"><img src="[^"]*" alt="${config.title}"[^>]*><\\/div>`,
    'i'
  );

  const newImagePath = `images/${slug}/${firstImage}`;
  const replacement = `<a href="${config.htmlFile}" class="project-card reveal">
        <div class="project-thumb"><img src="${newImagePath}" alt="${config.title}" loading="lazy"></div>`;

  if (projectCardRegex.test(content)) {
    content = content.replace(projectCardRegex, replacement);
    fs.writeFileSync(workFile, content);
    console.log(`✅ Updated work.html for ${config.title}`);
  } else {
    console.warn(`⚠️  Could not find project card for ${config.title} in work.html`);
  }
}

// Create or update project case study page
function updateProjectPage(slug, images, videos) {
  const config = projectConfig[slug];
  if (!config || !config.htmlFile) {
    console.warn(`⚠️  No HTML file config for: ${slug}`);
    return;
  }

  const htmlPath = path.join(PORTFOLIO_DIR, config.htmlFile);

  // If project page doesn't exist, log a message (user would need to create manually)
  if (!fs.existsSync(htmlPath)) {
    console.log(`ℹ️  Project page ${config.htmlFile} doesn't exist yet. Images ready at images/${slug}/`);
    return;
  }

  let content = fs.readFileSync(htmlPath, 'utf8');
  let updated = false;

  // Update hero/cover image if it exists
  const heroImageRegex = /<div class="case-cover[^"]*reveal">\s*<img[^>]*src="[^"]*"[^>]*><\/div>/;
  if (images.length > 0 && heroImageRegex.test(content)) {
    const newHeroImg = `<div class="case-cover reveal"><img src="../images/${slug}/${images[0]}" alt="${config.title}" loading="lazy"></div>`;
    content = content.replace(heroImageRegex, newHeroImg);
    updated = true;
  }

  // Update multi-image gallery sections
  // Match: <div class="case-gallery reveal"> ... </div>
  const galleryDivRegex = /<div class="case-gallery[^"]*reveal">\s*<img[^>]*>([\s\S]*?)<\/div>/g;
  if (images.length > 1) {
    let galleryCount = 0;
    content = content.replace(galleryDivRegex, (match) => {
      const galleryImages = images.slice(1, 3).map((img, i) => {
        return `<img src="../images/${slug}/${img}" alt="${config.title} - Image ${i + 2}" loading="lazy">`;
      }).join('\n      ');
      galleryCount++;
      return `<div class="case-gallery reveal">
      ${galleryImages}
    </div>`;
    });
    if (galleryCount > 0) {
      updated = true;
      console.log(`✅ Updated ${galleryCount} gallery section(s) in ${config.htmlFile}`);
    }
  }

  // Update single-image gallery
  const gallerySingleRegex = /<div class="case-gallery[^"]*single[^"]*reveal">\s*<img[^>]*src="[^"]*"[^>]*><\/div>/;
  if (images.length > 3 && gallerySingleRegex.test(content)) {
    const newSingleGallery = `<div class="case-gallery single reveal">
      <img src="../images/${slug}/${images[3]}" alt="${config.title}" loading="lazy">
    </div>`;
    content = content.replace(gallerySingleRegex, newSingleGallery);
    updated = true;
  }

  if (updated || images.length > 0) {
    fs.writeFileSync(htmlPath, content);
  }
}

// Process a new project
function processProject(projectName) {
  const slug = folderToSlug(projectName);

  // Skip if already processed
  if (processedProjects.has(slug)) {
    return;
  }

  const projectPath = path.join(PROJECTS_DIR, projectName);
  const stat = fs.statSync(projectPath);

  if (!stat.isDirectory()) {
    return;
  }

  console.log(`\n📦 Processing project: ${projectName}`);

  try {
    const { images, videos } = copyProjectMedia(projectName, projectPath);

    if (images.length === 0 && videos.length === 0) {
      console.warn(`⚠️  No media files found in ${projectName}`);
      return;
    }

    console.log(`📸 Copied ${images.length} images, 🎬 ${videos.length} videos`);

    if (images.length > 0) {
      updateWorkGrid(projectName, slug, images[0]);
      updateProjectPage(slug, images, videos);
    }

    processedProjects.add(slug);
    console.log(`✨ ${projectName} is ready!`);
  } catch (error) {
    console.error(`❌ Error processing ${projectName}:`, error.message);
  }
}

// Initial scan
function initialScan() {
  console.log('🔍 Scanning for projects...\n');

  if (!fs.existsSync(PROJECTS_DIR)) {
    console.error(`❌ Projects directory not found: ${PROJECTS_DIR}`);
    return;
  }

  const entries = fs.readdirSync(PROJECTS_DIR);
  entries.forEach(entry => {
    if (entry === '.DS_Store') return;
    const fullPath = path.join(PROJECTS_DIR, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      processProject(entry);
    }
  });

  console.log('\n✅ Initial scan complete. Watching for new projects...\n');
}

// Watch for new projects
function watchProjects() {
  watch(PROJECTS_DIR, { persistent: true }, (eventType, filename) => {
    if (filename && filename !== '.DS_Store') {
      const projectPath = path.join(PROJECTS_DIR, filename);

      // Debounce rapid file writes
      setTimeout(() => {
        if (fs.existsSync(projectPath)) {
          const stat = fs.statSync(projectPath);
          if (stat.isDirectory()) {
            processProject(filename);
          }
        }
      }, 500);
    }
  });
}

// Main
console.log('\n🚀 Portfolio Project Sync v1.0\n');
console.log(`📂 Monitoring: ${PROJECTS_DIR}`);
console.log(`🎯 Destination: ${PORTFOLIO_DIR}\n`);

initialScan();
watchProjects();

console.log('Press Ctrl+C to stop watching...');

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping project sync...');
  process.exit(0);
});
