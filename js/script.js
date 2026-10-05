document.addEventListener('DOMContentLoaded', () => {
  const config = window.SIX_FOR_CONFIG || {};

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

    const heroImage = document.querySelector('[data-hero-image]');
    if (heroImage && config.heroImage) {
      heroImage.src = config.heroImage;
    }

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

  const buildPillars = () => {
    const root = document.querySelector('[data-pillars-root]');
    if (!root || !config.whyTrain) return;

    root.innerHTML = config.whyTrain
      .map(
        (item) => `
          <article class="pillar-card">
            <span>${item.title}</span>
            <p>${item.text}</p>
          </article>
        `
      )
      .join('');
  };

  const buildModalities = () => {
    const root = document.querySelector('[data-modalidades-root]');
    if (!root || !config.modalities) return;

    root.innerHTML = config.modalities
      .map(
        (item) => `
          <article class="modality-card">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <a href="#" class="btn btn-primary" data-whatsapp data-whatsapp-message="${item.whatsappMessage}">QUERO SABER MAIS</a>
          </article>
        `
      )
      .join('');
  };

  const buildIdentity = () => {
    const root = document.querySelector('[data-identity-root]');
    if (!root || !config.identityConcepts) return;

    root.innerHTML = config.identityConcepts
      .map(
        (item) => `
          <div class="identity-item">
            <span>${item}</span>
          </div>
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
            <summary>${item.question}</summary>
            <p>${item.answer}</p>
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
            <a href="#" class="btn btn-primary" data-whatsapp data-whatsapp-message="${unit.whatsappMessage}">AGENDAR AULA</a>
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

  const buildCarousels = () => {
    const groups = config.galleryGroups || {};
    const galleryRoots = document.querySelectorAll('[data-gallery]');

    galleryRoots.forEach((gallery) => {
      const key = gallery.dataset.gallery;
      const group = groups[key];
      if (!group || !group.items) return;

      let currentIndex = 0;
      const items = group.items;

      const render = () => {
        gallery.innerHTML = `
          <div class="gallery-header">
            <h3>${group.title}</h3>
            <div class="gallery-nav">
              <button type="button" class="gallery-arrow" data-direction="prev" aria-label="Imagem anterior">‹</button>
              <button type="button" class="gallery-arrow" data-direction="next" aria-label="Próxima imagem">›</button>
            </div>
          </div>
          <div class="gallery-viewport">
            <img src="${items[currentIndex]}" alt="${group.title} ${currentIndex + 1}" loading="lazy" />
          </div>
          <div class="gallery-indicators">
            ${items
              .map(
                (_, index) => `
                  <button type="button" class="gallery-dot ${index === currentIndex ? 'is-active' : ''}" data-index="${index}" aria-label="Ir para a imagem ${index + 1}"></button>
                `
              )
              .join('')}
          </div>
        `;

        gallery.querySelector('[data-direction="prev"]').addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + items.length) % items.length;
          render();
        });

        gallery.querySelector('[data-direction="next"]').addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % items.length;
          render();
        });

        gallery.querySelectorAll('.gallery-dot').forEach((dot) => {
          dot.addEventListener('click', () => {
            currentIndex = Number(dot.dataset.index);
            render();
          });
        });
      };

      render();

      gallery.addEventListener('mouseenter', () => {
        clearInterval(gallery.autoTimer);
      });

      gallery.addEventListener('mouseleave', () => {
        gallery.autoTimer = setInterval(() => {
          currentIndex = (currentIndex + 1) % items.length;
          render();
        }, 4000);
      });

      gallery.autoTimer = setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        render();
      }, 4000);
    });
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
  buildPillars();
  buildModalities();
  buildIdentity();
  buildFAQ();
  buildSchedule();
  buildCarousels();

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
