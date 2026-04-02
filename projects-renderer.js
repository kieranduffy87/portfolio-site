(function() {
  'use strict';

  const grid = document.querySelector('.masonry-grid');
  if (!grid || !window.PROJECTS) return;

  const showMode = grid.dataset.show || 'all';
  const projects = showMode === 'featured'
    ? window.PROJECTS.filter(p => p.featured)
    : window.PROJECTS;

  // ─── BUILD GRID ───

  function renderCard(project) {
    const isText = project.cardSize === 'text';
    const sizeClass = project.cardSize === 'tall' ? 'masonry-card--tall'
      : project.cardSize === 'text' ? 'masonry-card--text'
      : 'masonry-card--standard';

    if (isText) {
      return `
        <div class="masonry-card ${sizeClass}" data-project-id="${project.id}" data-category="${project.category}">
          <div class="masonry-card__tag">${project.tag}</div>
          <h3 class="masonry-card__title">${project.title}</h3>
          <p class="masonry-card__desc">${project.shortDesc}</p>
        </div>`;
    }

    return `
      <button class="masonry-card ${sizeClass}" data-project-id="${project.id}" data-category="${project.category}" aria-label="View project: ${project.title}">
        <img src="${project.thumbnail}" alt="${project.title}" loading="lazy">
        <div class="masonry-card__overlay">
          <div class="masonry-card__tag">${project.tag}</div>
          <h3 class="masonry-card__title">${project.title}</h3>
          <p class="masonry-card__desc">${project.shortDesc}</p>
        </div>
      </button>`;
  }

  function renderGrid(projectList) {
    grid.innerHTML = projectList.map(renderCard).join('');
    // Trigger reveal animation with stagger
    requestAnimationFrame(() => {
      grid.querySelectorAll('.masonry-card').forEach((card, i) => {
        setTimeout(() => card.classList.add('masonry-card--visible'), i * 100);
      });
    });
    attachCardListeners();
  }

  renderGrid(projects);

  // ─── FILTER SYSTEM ───

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.textContent.trim();
      const baseList = showMode === 'featured'
        ? window.PROJECTS.filter(p => p.featured)
        : window.PROJECTS;

      const filtered = filter === 'All'
        ? baseList
        : baseList.filter(p => p.category === filter);

      // Fade out then re-render
      grid.querySelectorAll('.masonry-card').forEach(c => c.classList.remove('masonry-card--visible'));
      setTimeout(() => renderGrid(filtered), 300);
    });
  });

  // ─── MODAL SYSTEM (Ryadovoy-style full-page with horizontal gallery) ───

  const modal = document.createElement('div');
  modal.className = 'project-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.setAttribute('role', 'dialog');
  modal.innerHTML = `
    <div class="project-modal__backdrop"></div>
    <div class="project-modal__content">
      <button class="project-modal__close" aria-label="Close project">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div class="project-modal__scroll">
        <div class="project-modal__hero"></div>
        <div class="project-modal__header">
          <div class="project-modal__tag"></div>
          <h2 class="project-modal__title"></h2>
          <p class="project-modal__intro"></p>
        </div>
        <div class="project-modal__meta"></div>
        <div class="project-modal__stats"></div>
        <div class="project-modal__gallery"></div>
        <div class="project-modal__quote"></div>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('.project-modal__close');

  function openModal(projectId) {
    const project = window.PROJECTS.find(p => p.id === projectId);
    if (!project || project.cardSize === 'text') return;

    // Populate header
    modal.querySelector('.project-modal__tag').textContent = project.category;
    modal.querySelector('.project-modal__title').textContent = project.title;
    modal.querySelector('.project-modal__intro').textContent = project.fullDesc || project.shortDesc;

    // Populate meta
    const metaEl = modal.querySelector('.project-modal__meta');
    if (project.client) {
      metaEl.innerHTML = `
        <div class="project-modal__meta-item"><span class="meta-label">Client</span><span class="meta-value">${project.client}</span></div>
        <div class="project-modal__meta-item"><span class="meta-label">Services</span><span class="meta-value">${project.services || ''}</span></div>
        <div class="project-modal__meta-item"><span class="meta-label">Year</span><span class="meta-value">${project.year || ''}</span></div>
        <div class="project-modal__meta-item"><span class="meta-label">Location</span><span class="meta-value">${project.location || ''}</span></div>`;
      metaEl.style.display = '';
    } else {
      metaEl.style.display = 'none';
    }

    // Populate horizontal gallery — ALL images including first
    const galleryEl = modal.querySelector('.project-modal__gallery');
    const allMedia = project.gallery && project.gallery.length > 0
      ? project.gallery
      : [{ type: 'image', src: project.thumbnail }];

    galleryEl.innerHTML = allMedia.map(item => {
      if (item.type === 'video') {
        return `<video src="${item.src}" controls playsinline preload="metadata"></video>`;
      }
      return `<img src="${item.src}" alt="${project.title}" loading="lazy">`;
    }).join('');
    galleryEl.scrollLeft = 0;

    // Populate quote
    const quoteEl = modal.querySelector('.project-modal__quote');
    if (project.quote) {
      quoteEl.innerHTML = `
        <blockquote>"${project.quote.text}"</blockquote>
        <cite>— ${project.quote.author}</cite>`;
      quoteEl.style.display = '';
    } else {
      quoteEl.style.display = 'none';
    }

    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Init drag-to-scroll on gallery
    initGalleryDrag(galleryEl);
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Pause any playing videos
    modal.querySelectorAll('video').forEach(v => v.pause());
  }

  // Drag-to-scroll for the horizontal gallery
  function initGalleryDrag(galleryEl) {
    let isDown = false;
    let startX;
    let scrollLeft;

    // Remove old listeners by cloning
    const newGallery = galleryEl.cloneNode(true);
    galleryEl.parentNode.replaceChild(newGallery, galleryEl);

    newGallery.addEventListener('mousedown', (e) => {
      isDown = true;
      newGallery.classList.add('dragging');
      startX = e.pageX - newGallery.offsetLeft;
      scrollLeft = newGallery.scrollLeft;
    });

    newGallery.addEventListener('mouseleave', () => {
      isDown = false;
      newGallery.classList.remove('dragging');
    });

    newGallery.addEventListener('mouseup', () => {
      isDown = false;
      newGallery.classList.remove('dragging');
    });

    newGallery.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - newGallery.offsetLeft;
      const walk = (x - startX) * 1.5;
      newGallery.scrollLeft = scrollLeft - walk;
    });
  }

  closeBtn.addEventListener('click', closeModal);
  // Also close on clicking the background area (outside gallery images)
  modal.querySelector('.project-modal__content').addEventListener('click', (e) => {
    if (e.target === e.currentTarget || e.target.classList.contains('project-modal__scroll')) {
      closeModal();
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  function attachCardListeners() {
    grid.querySelectorAll('.masonry-card[data-project-id]').forEach(card => {
      if (card.classList.contains('masonry-card--text')) return;
      card.addEventListener('click', () => {
        openModal(card.dataset.projectId);
      });
    });
  }

  // ─── SCROLL REVEAL FOR CARDS ───

  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('masonry-card--visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, root: null });

  function observeCards() {
    grid.querySelectorAll('.masonry-card:not(.masonry-card--visible)').forEach(card => {
      cardObserver.observe(card);
    });
  }

  observeCards();
})();
