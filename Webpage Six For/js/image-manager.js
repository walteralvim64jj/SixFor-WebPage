document.addEventListener('DOMContentLoaded', async () => {
  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
  const encodeImagePath = (source = '') => source.split('/').map(encodeURIComponent).join('/');
  const root = document.querySelector('[data-image-manager-root]');
  const status = document.querySelector('[data-image-manager-status]');
  if (!root || !status) return;

  try {
    const response = await fetch('images/image-manifest.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const manifest = await response.json();
    const categories = manifest.categories || [];

    root.innerHTML = categories.map((category) => {
      const pictures = category.images || [];
      const previews = pictures.slice(0, 8).map((image) => `
        <figure class="image-manager-item">
          <img src="${encodeImagePath(image.src)}" alt="${escapeHtml(image.name)}" />
          <figcaption>${escapeHtml(image.name)}</figcaption>
        </figure>
      `).join('');

      return `
        <section class="image-manager-card">
          <div class="image-manager-card-heading">
            <div>
              <h2>${category.title}</h2>
              <code>/${category.folder}/</code>
            </div>
            <span class="image-manager-count">${pictures.length} ${pictures.length === 1 ? 'imagem' : 'imagens'} · opcional</span>
          </div>
          <p>${category.usage}</p>
          ${pictures.length
            ? `<div class="image-manager-previews">${previews}</div>${pictures.length > 8 ? `<p class="image-manager-more">e mais ${pictures.length - 8} imagens</p>` : ''}`
            : '<div class="image-manager-empty">Nenhuma imagem enviada nesta categoria. O site mantém o layout e usa a alternativa visual prevista.</div>'}
        </section>
      `;
    }).join('');

    root.querySelectorAll('.image-manager-item img').forEach((image) => {
      image.addEventListener('error', () => {
        const caption = image.parentElement?.querySelector('figcaption');
        image.remove();
        if (caption) caption.textContent += ' — arquivo indisponível';
      }, { once: true });
    });

    const total = categories.reduce((sum, category) => sum + category.images.length, 0);
    status.textContent = `${total} ${total === 1 ? 'imagem encontrada' : 'imagens encontradas'} em ${categories.length} categorias.`;
  } catch (error) {
    status.textContent = 'Não foi possível carregar o inventário. A publicação precisa incluir images/image-manifest.json; faça o deploy com o build configurado.';
    status.classList.add('is-error');
  }
});
