(function() {
  'use strict';

  const grid = document.querySelector('.projects-grid');
  if (!grid || !window.PROJECTS) return;

  const showMode = grid.dataset.show || 'all';
  const projects = showMode === 'featured'
    ? window.PROJECTS.filter(p => p.featured)
    : window.PROJECTS;

  // ─── HELPERS ───

  function isVideo(src) {
    return src && src.match(/\.(mp4|webm|mov)(\?|$)/i);
  }

  // ─── BUILD GRID ───

  function renderCard(project) {
    const isText = project.cardSize === 'text';

    if (isText) {
      return `
        <div class="project-card project-card--text" data-project-id="${project.id}" data-category="${project.category}">
          <div class="project-card__tag">${project.tag}</div>
          <h3 class="project-card__title">${project.title}</h3>
          <p class="project-card__desc">${project.shortDesc}</p>
        </div>`;
    }

    const sizeClass = project.cardSize === 'tall' ? 'project-card--tall' : '';

    // Use <video> for video thumbnails, <img> for images
    const mediaSrc = project.thumbnail;
    const mediaEl = isVideo(mediaSrc)
      ? `<video src="${mediaSrc}" autoplay loop muted playsinline preload="metadata" style="object-fit: cover;"></video>`
      : `<img src="${mediaSrc}" alt="${project.title}" loading="lazy">`;

    return `
      <button class="project-card ${sizeClass}" data-project-id="${project.id}" data-category="${project.category}" aria-label="View project: ${project.title}">
        ${mediaEl}
        <div class="project-card__tags">
          ${project.services ? project.services.split(',').slice(0, 3).map(service =>
            `<span class="project-card__tag">${service.trim()}</span>`
          ).join('') : `<span class="project-card__tag">${project.category}</span>`}
        </div>
        <div class="project-card__name">
          <span>${project.title}</span>
          <div class="project-card__arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      </button>`;
  }

  function renderGrid(projectList) {
    // Filter out text cards (Brand Strategy, Digital Craft)
    const filteredList = projectList.filter(p => p.cardSize !== 'text');
    grid.innerHTML = filteredList.map(renderCard).join('');
    requestAnimationFrame(() => {
      grid.querySelectorAll('.project-card').forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 100);
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

      grid.querySelectorAll('.project-card').forEach(c => c.classList.remove('visible'));
      setTimeout(() => renderGrid(filtered), 300);
    });
  });

  // ─── MODAL SYSTEM (Leo Leo split layout: text left, gallery right) ───

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
      <div class="project-modal__layout">
        <div class="project-modal__sidebar">
          <div class="project-modal__tag"></div>
          <h2 class="project-modal__title"></h2>
          <p class="project-modal__intro"></p>
          <div class="project-modal__meta"></div>
        </div>
        <div class="project-modal__gallery-container">
          <div class="project-modal__gallery"></div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('.project-modal__close');

  function openModal(projectId) {
    const project = window.PROJECTS.find(p => p.id === projectId);
    if (!project || project.cardSize === 'text') return;

    // Populate info side
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

    // Populate gallery — ALL media including first
    const galleryEl = modal.querySelector('.project-modal__gallery');
    const allMedia = project.gallery && project.gallery.length > 0
      ? project.gallery
      : [{ type: 'image', src: project.thumbnail }];

    galleryEl.innerHTML = allMedia.map(item => {
      if (item.type === 'video') {
        return `<video src="${item.src}" autoplay loop muted playsinline preload="metadata"></video>`;
      }
      return `<img src="${item.src}" alt="${project.title}" loading="lazy">`;
    }).join('');

    // Autoplay videos as they scroll into view inside gallery
    const galleryVideos = galleryEl.querySelectorAll('video');
    const videoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const vid = entry.target;
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      });
    }, { root: galleryEl, threshold: 0.4 });
    galleryVideos.forEach(v => videoObserver.observe(v));

    // Wheel scroll → horizontal gallery scroll on desktop
    galleryEl.addEventListener('wheel', e => {
      e.preventDefault();
      galleryEl.scrollLeft += e.deltaY !== 0 ? e.deltaY : e.deltaX;
    }, { passive: false });

    // Mouse drag to scroll
    let isDragging = false, dragStartX = 0, dragScrollLeft = 0;
    galleryEl.addEventListener('mousedown', e => {
      isDragging = true;
      dragStartX = e.pageX - galleryEl.offsetLeft;
      dragScrollLeft = galleryEl.scrollLeft;
      galleryEl.classList.add('dragging');
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
      galleryEl.classList.remove('dragging');
    });
    galleryEl.addEventListener('mousemove', e => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - galleryEl.offsetLeft;
      galleryEl.scrollLeft = dragScrollLeft - (x - dragStartX);
    });

    // Reset scroll positions
    const galleryContainer = modal.querySelector('.project-modal__gallery-container');
    galleryContainer.scrollTop = 0;
    const content = modal.querySelector('.project-modal__content');
    content.scrollTop = 0;

    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Pause any playing videos
    modal.querySelectorAll('video').forEach(v => v.pause());
  }

  closeBtn.addEventListener('click', closeModal);
  modal.querySelector('.project-modal__backdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // ─── TOUCH SWIPE DOWN TO CLOSE (mobile) ───
  let touchStartY = 0;
  let touchStartScrollTop = 0;
  const modalContent = modal.querySelector('.project-modal__content');

  modalContent.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
    touchStartScrollTop = modalContent.scrollTop;
  }, { passive: true });

  modalContent.addEventListener('touchend', e => {
    const touchEndY = e.changedTouches[0].clientY;
    const swipedDown = touchEndY - touchStartY;
    // Only close if swiped down > 80px AND user is at top of scroll
    if (swipedDown > 80 && touchStartScrollTop <= 0) {
      closeModal();
    }
  }, { passive: true });

  function attachCardListeners() {
    grid.querySelectorAll('.project-card[data-project-id]').forEach(card => {
      if (card.classList.contains('project-card--text')) return;
      card.addEventListener('click', () => {
        openModal(card.dataset.projectId);
      });
    });
  }

  // ─── SCROLL REVEAL FOR CARDS ───

  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, root: null });

  function observeCards() {
    grid.querySelectorAll('.project-card:not(.visible)').forEach(card => {
      cardObserver.observe(card);
    });
  }

  observeCards();
})();
