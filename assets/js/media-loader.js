(() => {
  'use strict';

  const MANIFEST_URL = '/assets/data/media-manifest.json';
  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);

  const byPriority = (a, b) => (Number(b.priority) || 0) - (Number(a.priority) || 0);

  function matches(item, el) {
    const service = el.dataset.mediaGallery;
    const region = el.dataset.region;
    const caseSlug = el.dataset.caseSlug;
    return (!service || item.service === service) &&
      (!region || item.region === region) &&
      (!caseSlug || item.caseSlug === caseSlug);
  }

  function imageCard(item) {
    return `<figure class="media-card">
      <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy" decoding="async"${item.width ? ` width="${Number(item.width)}"` : ''}${item.height ? ` height="${Number(item.height)}"` : ''}>
      ${item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ''}
    </figure>`;
  }

  function videoCard(item) {
    const title = escapeHtml(item.title || '현장 작업 영상');
    const description = escapeHtml(item.description || '');
    if (item.youtubeUrl || item.naverTvUrl) {
      const url = escapeHtml(item.youtubeUrl || item.naverTvUrl);
      return `<article class="media-video-card"><a href="${url}" target="_blank" rel="noopener"><strong>${title}</strong><span>영상 보기 →</span></a>${description ? `<p>${description}</p>` : ''}</article>`;
    }
    return `<article class="media-video-card"><video controls preload="metadata" playsinline${item.poster ? ` poster="${escapeHtml(item.poster)}"` : ''}><source src="${escapeHtml(item.src)}" type="video/mp4">영상 재생을 지원하지 않는 브라우저입니다.</video><h3>${title}</h3>${description ? `<p>${description}</p>` : ''}</article>`;
  }

  function renderGallery(el, items) {
    const matched = items.filter((item) => matches(item, el)).sort(byPriority);
    if (!matched.length) return;
    const images = matched.filter((item) => item.type === 'image');
    const videos = matched.filter((item) => item.type === 'video');
    const heading = el.dataset.heading || '실제 현장 사진과 작업 영상';
    const intro = el.dataset.intro || '현장 조건과 배관 상태에 따라 작업 방법은 달라질 수 있습니다.';
    el.innerHTML = `<div class="wrap"><div class="pro-heading"><p>현장 기록</p><h2>${escapeHtml(heading)}</h2><span>${escapeHtml(intro)}</span></div>${images.length ? `<div class="media-grid">${images.map(imageCard).join('')}</div>` : ''}${videos.length ? `<div class="media-video-grid">${videos.map(videoCard).join('')}</div>` : ''}</div>`;
    el.hidden = false;
  }

  function addVideoSchemas(items) {
    const schemas = items.filter((item) => item.type === 'video' && item.title && (item.src || item.youtubeUrl || item.naverTvUrl)).map((item) => ({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: item.title,
      description: item.description || item.title,
      thumbnailUrl: item.poster ? [new URL(item.poster, location.origin).href] : undefined,
      uploadDate: item.uploadDate,
      duration: item.duration,
      contentUrl: item.src ? new URL(item.src, location.origin).href : undefined,
      embedUrl: item.youtubeUrl || item.naverTvUrl || undefined
    }));
    schemas.forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }

  async function init() {
    const galleries = [...document.querySelectorAll('[data-media-gallery]')];
    if (!galleries.length) return;
    try {
      const response = await fetch(MANIFEST_URL, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`manifest ${response.status}`);
      const data = await response.json();
      const items = Array.isArray(data.items) ? data.items : [];
      galleries.forEach((el) => renderGallery(el, items));
      addVideoSchemas(items.filter((item) => galleries.some((el) => matches(item, el))));
    } catch (error) {
      console.warn('[media-loader] 미디어 목록을 불러오지 못했습니다.', error);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
