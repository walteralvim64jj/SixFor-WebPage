document.addEventListener('DOMContentLoaded', () => {
  const config = window.SIX_FOR_CONFIG || {};
  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
  const encodeImagePath = (source = '') => source.split('/').map(encodeURIComponent).join('/');

  const updateDynamicText = () => {
    const yearNode = document.querySelector('[data-current-year]');
    if (yearNode) {
      yearNode.textContent = new Date().getFullYear();
    }

    const logo = document.querySelectorAll('[data-logo]');
    if (logo.length && config.logoImage) {
      logo.forEach((image) => {
        image.src = config.logoImage;
        image.alt = config.companyName || 'Six For Jiu-Jitsu';
      });
    }

    const enrollmentLinks = document.querySelectorAll('[data-enrollment]');
    enrollmentLinks.forEach((link) => {
      link.href = `${config.whatsappUrl || 'https://wa.me/5532984238650'}?text=${encodeURIComponent(config.enrollmentMessage || config.contactMessages?.general || '')}`;
    });

    const mapLinks = document.querySelectorAll('[data-map-target]');
    mapLinks.forEach((link) => {
      const target = link.getAttribute('data-map-target');
      if (target && config.maps && config.maps[target]) {
        link.href = config.maps[target];
      }
    });

    const whatsappButtons = document.querySelectorAll('[data-whatsapp]');
    whatsappButtons.forEach((button) => {
      const message = button.getAttribute('data-whatsapp-message') || config.contactMessages?.general || '';
      const encoded = encodeURIComponent(message);
      button.href = `${config.whatsappUrl || 'https://wa.me/5532984238650'}?text=${encoded}`;
    });

    const phoneLinks = document.querySelectorAll('[data-phone-number]');
    phoneLinks.forEach((link) => {
      link.href = `tel:${config.phoneNumber || '5532984238650'}`;
      link.textContent = config.phoneDisplay || '(32) 9 8423-8650';
    });

    const emailLinks = document.querySelectorAll('[data-email]');
    emailLinks.forEach((link) => {
      link.href = `mailto:${config.email || 'sixforjiujitsu@gmail.com'}`;
      link.textContent = config.email || 'sixforjiujitsu@gmail.com';
    });

    const instagramLinks = document.querySelectorAll('[data-instagram]');
    instagramLinks.forEach((link) => {
      link.href = config.instagramUrl || 'https://www.instagram.com/64jiujitsu/';
      link.textContent = config.instagramHandle || '@64jiujitsu';
    });
  };

  const buildModalities = () => {
    const root = document.querySelector('[data-modalidades-root]');
    if (!root || !config.modalities) return;

    root.innerHTML = config.modalities
      .map(
        (item) => `
          <article class="modality-card">
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <a href="${config.whatsappUrl || 'https://wa.me/5532984238650'}?text=${encodeURIComponent(item.whatsappMessage)}" class="btn btn-primary" data-whatsapp data-whatsapp-message="${escapeHtml(item.whatsappMessage)}">FALAR SOBRE ESTA TURMA</a>
          </article>
        `
      )
      .join('');
  };

  const buildFAQ = () => {
    const root = document.querySelector('[data-faq-root]');
    if (!root || !config.faq) return;

    root.innerHTML = config.faq
      .map(
        (item, index) => `
          <details class="faq-item" ${index === 0 ? 'open' : ''}>
            <summary>${escapeHtml(item.question)}</summary>
            <p>${escapeHtml(item.answer)}</p>
          </details>
        `
      )
      .join('');
  };

  const buildSchedule = () => {
    const root = document.querySelector('[data-schedule-root]');
    if (!root || !config.schedule) return;

    const unitKeys = Object.keys(config.schedule);
    const typeLabels = { adult: 'ADULTO', kids: 'KIDS' };

    const render = (unitKey, type) => {
      const unit = config.schedule[unitKey];
      const days = unit[type];

      root.innerHTML = `
        <div class="schedule-controls">
          <div class="schedule-segment" data-unit-tabs>
            ${unitKeys
              .map(
                (key) => `
                  <button class="schedule-tab ${key === unitKey ? 'is-active' : ''}" data-unit-key="${key}" type="button">
                    ${config.schedule[key].label}
                  </button>
                `
              )
              .join('')}
          </div>
          <div class="schedule-segment" data-type-tabs>
            <button class="schedule-tab ${type === 'adult' ? 'is-active' : ''}" data-type="adult" type="button">${typeLabels.adult}</button>
            <button class="schedule-tab ${type === 'kids' ? 'is-active' : ''}" data-type="kids" type="button">${typeLabels.kids}</button>
          </div>
        </div>

        <div class="schedule-panel">
          <div class="schedule-unit-header">
            <div>
              <p class="eyebrow">UNIDADE</p>
              <h3>${unit.label}</h3>
            </div>
            <a href="${unit.maps}" class="btn btn-secondary" target="_blank" rel="noreferrer">COMO CHEGAR</a>
          </div>

          <div class="schedule-days-grid">
            ${days
              .map(
                (item) => `
                  <article class="schedule-day-card">
                    <h4>${item.day}</h4>
                    <ul>
                      ${item.times
                        .map((time) => `<li>${time}</li>`)
                        .join('')}
                    </ul>
                  </article>
                `
              )
              .join('')}
          </div>

          <div class="schedule-cta-row">
            <a href="${config.whatsappUrl || 'https://wa.me/5532984238650'}?text=${encodeURIComponent(unit.whatsappMessage)}" class="btn btn-primary" data-whatsapp data-whatsapp-message="${escapeHtml(unit.whatsappMessage)}">AGENDAR AULA</a>
          </div>
        </div>
      `;

      root.querySelectorAll('[data-unit-key]').forEach((button) => {
        button.addEventListener('click', () => render(button.dataset.unitKey, type));
      });

      root.querySelectorAll('[data-type]').forEach((button) => {
        button.addEventListener('click', () => render(unitKey, button.dataset.type));
      });
    };

    render(unitKeys[0], 'adult');
  };

  const loadImageManifest = async () => {
    try {
      const response = await fetch(config.imageManifest || 'images/image-manifest.json', { cache: 'no-cache' });
      if (!response.ok) return [];
      const manifest = await response.json();
      return Array.isArray(manifest.categories) ? manifest.categories : [];
    } catch {
      return [];
    }
  };

  const showImage = (image, source, alt, onFailure) => {
    if (!image || !source) return false;
    image.src = encodeImagePath(source);
    image.alt = alt;
    image.addEventListener('error', () => {
      const frame = image.closest('[data-image-frame]') || image.parentElement;
      if (frame) frame.hidden = true;
      image.closest('.trial-card')?.classList.add('has-no-image');
      image.closest('.who-we-are')?.classList.add('has-no-team');
      onFailure?.();
    }, { once: true });
    return true;
  };

  const buildImageGallery = (root, category) => {
    const items = category?.images || [];
    if (!root || !items.length) {
      root?.remove();
      return false;
    }

    let currentIndex = 0;
    const render = () => {
      const image = items[currentIndex];
      root.innerHTML = `
        <div class="gallery-header">
          <div><h3>${escapeHtml(category.title)}</h3><p>${items.length} ${items.length === 1 ? 'foto' : 'fotos'}</p></div>
          ${items.length > 1 ? `<div class="gallery-nav"><button type="button" class="gallery-arrow" data-direction="prev" aria-label="Foto anterior">‹</button><button type="button" class="gallery-arrow" data-direction="next" aria-label="Próxima foto">›</button></div>` : ''}
        </div>
        <figure class="gallery-viewport" data-image-frame>
          <img src="${encodeImagePath(image.src)}" alt="${escapeHtml(category.title)} — ${escapeHtml(image.name)}" loading="lazy" />
          <figcaption>${escapeHtml(image.name)}</figcaption>
        </figure>
        ${items.length > 1 ? `<div class="gallery-indicators" aria-label="Selecionar foto">${items.map((_, index) => `<button type="button" class="gallery-dot ${index === currentIndex ? 'is-active' : ''}" data-index="${index}" aria-label="Mostrar foto ${index + 1}"></button>`).join('')}</div>` : ''}
      `;

      root.querySelector('.gallery-viewport img')?.addEventListener('error', () => {
        const parent = root.closest('.who-we-are');
        root.remove();
        parent?.classList.add('has-no-team');
        const gallerySection = document.querySelector('.gallery-section');
        if (gallerySection && !gallerySection.querySelector('[data-gallery-category]')) gallerySection.hidden = true;
      }, { once: true });

      root.querySelector('[data-direction="prev"]')?.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        render();
      });
      root.querySelector('[data-direction="next"]')?.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        render();
      });
      root.querySelectorAll('[data-index]').forEach((dot) => dot.addEventListener('click', () => {
        currentIndex = Number(dot.dataset.index);
        render();
      }));
    };

    render();
    return true;
  };

  const applyImages = (categories) => {
    const byId = Object.fromEntries(categories.map((category) => [category.id, category]));
    const hero = document.querySelector('[data-hero-image]');
    const heroSource = byId.hero?.images?.[0]?.src || config.heroImage;
    const heroWrap = document.querySelector('.hero-image-wrap');
    if (!showImage(hero, heroSource, 'Treino de Jiu-Jitsu na Six For')) {
      if (heroWrap) heroWrap.hidden = true;
    }

    document.querySelectorAll('[data-photo-category]').forEach((frame) => {
      const category = byId[frame.dataset.photoCategory];
      const firstImage = category?.images?.[0];
      const image = frame.querySelector('img');
      if (!firstImage || !showImage(image, firstImage.src, frame.dataset.photoAlt || category.title)) {
        frame.hidden = true;
        frame.closest('.trial-card')?.classList.add('has-no-image');
      }
    });

    const publicGallery = document.querySelector('.gallery-section');
    document.querySelectorAll('[data-gallery-category]').forEach((gallery) => {
      buildImageGallery(gallery, byId[gallery.dataset.galleryCategory]);
    });
    const publicGalleryItemsAfter = publicGallery?.querySelectorAll('[data-gallery-category]').length || 0;
    if (!publicGalleryItemsAfter) publicGallery?.setAttribute('hidden', '');
    if (!byId.equipe?.images?.length) document.querySelector('.who-we-are')?.classList.add('has-no-team');
  };

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  updateDynamicText();
  buildModalities();
  buildFAQ();
  buildSchedule();
  updateDynamicText();
  loadImageManifest().then(applyImages);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
});
