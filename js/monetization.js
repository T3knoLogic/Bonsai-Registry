/**
 * Bonsai Registry Monetization
 * Applies Featured section, Verified badges, Sponsored badges.
 * Data source: data/bonsai-registry-monetization.json
 */
(function() {
  function normalizeUrl(url) {
    try {
      const u = new URL(url, 'https://example.com');
      let path = u.pathname.replace(/\/$/, '') || '/';
      return (u.origin + path).toLowerCase();
    } catch (_) { return url.toLowerCase(); }
  }

  function isVerified(href, verifiedList) {
    const n = normalizeUrl(href);
    return verifiedList.some(v => normalizeUrl(v) === n);
  }

  function getSponsoredSection(href, sponsoredSections) {
    const n = normalizeUrl(href);
    for (const [section, urls] of Object.entries(sponsoredSections || {})) {
      if (Array.isArray(urls) && urls.some(u => normalizeUrl(u) === n)) return section;
    }
    return null;
  }

  async function loadMonetizationData() {
    try {
      const r = await fetch('data/bonsai-registry-monetization.json');
      if (r.ok) return await r.json();
    } catch (_) {}
    const el = document.getElementById('monetization-data');
    if (el && el.textContent) {
      try { return JSON.parse(el.textContent); } catch (_) {}
    }
    return { featured: [], verified: [], sponsoredSections: {} };
  }

  function injectFeaturedSection(featured) {
    if (!featured || featured.length === 0) return;
    const header = document.querySelector('header');
    if (!header) return;

    const section = document.createElement('section');
    section.id = 'bonsai-featured';
    section.className = 'mb-10';
    section.innerHTML = `
      <div class="category-group">
        <div class="category-subheader flex items-center justify-between">
          <span><i class="fas fa-star text-web3-primary mr-2"></i>Featured</span>
          <span class="text-xs text-gray-500">Sponsored placements</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="bonsai-featured-grid"></div>
      </div>
    `;

    header.insertAdjacentElement('afterend', section);

    const grid = document.getElementById('bonsai-featured-grid');
    const utm = 'utm_source=bonsai-registry&utm_medium=featured';
    featured.forEach(item => {
      const a = document.createElement('a');
      let url = (item.url || '').trim();
      if (url) url += (url.includes('?') ? '&' : '?') + utm;
      a.href = url || '#';
      a.target = '_blank';
      a.className = 'link-item block p-4 bg-web3-card rounded-lg transition duration-300 border-2 border-web3-primary/50 hover:border-web3-primary relative overflow-hidden';
      a.innerHTML = `
        <span class="bonsai-featured-badge absolute top-2 right-2 text-xs px-2 py-0.5 bg-web3-primary text-black rounded font-semibold">Featured</span>
        <h4 class="text-lg font-semibold text-white mb-1 pr-16">${escapeHtml(item.name || '')}</h4>
        <p class="text-xs text-gray-400">${escapeHtml(item.description || '')}</p>
      `;
      grid.appendChild(a);
    });
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function applyBadges(data) {
    const linkItems = document.querySelectorAll('.link-item:not(.bonsai-badges-applied)');
    linkItems.forEach(el => {
      const href = el.getAttribute('href') || el.href;
      if (!href) return;

      const verified = isVerified(href, data.verified || []);
      const sponsored = getSponsoredSection(href, data.sponsoredSections);

      const badgeContainer = document.createElement('span');
      badgeContainer.className = 'bonsai-badges ml-2';

      if (verified) {
        const v = document.createElement('span');
        v.className = 'bonsai-verified-badge inline-flex items-center text-xs px-2 py-0.5 rounded bg-web3-primary/20 text-web3-secondary border border-web3-primary/40';
        v.title = 'Bonsai Verified';
        v.innerHTML = '<i class="fas fa-check-circle mr-1"></i>Verified';
        badgeContainer.appendChild(v);
      }

      if (sponsored) {
        const s = document.createElement('span');
        s.className = 'bonsai-sponsored-badge inline-flex items-center text-xs px-2 py-0.5 rounded bg-gray-700/50 text-gray-400 border border-gray-600 ml-1';
        s.title = 'Sponsored';
        s.textContent = 'Sponsored';
        badgeContainer.appendChild(s);
      }

      if (badgeContainer.children.length) {
        const titleEl = el.querySelector('h4');
        if (titleEl) {
          titleEl.classList.add('flex', 'items-center', 'flex-wrap');
          titleEl.appendChild(badgeContainer);
        }
        el.classList.add('bonsai-badges-applied');
      }
    });
  }

  async function init() {
    const data = await loadMonetizationData();
    injectFeaturedSection(data.featured);
    applyBadges(data);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
