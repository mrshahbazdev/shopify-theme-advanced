document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('[data-predictive-search-input]');
  inputs.forEach(input => {
    const form = input.closest('form');
    const container = form?.parentElement?.querySelector('[data-predictive-search-results]');
    if (!container) return;
    let timeout;
    const baseUrl = ((window.theme && window.theme.routes && window.theme.routes.predictive_search_url) || '/search/suggest') + '.json';
    input.addEventListener('input', () => {
      clearTimeout(timeout);
      const q = input.value.trim();
      if (q.length < 2) { container.innerHTML = ''; return; }
      timeout = setTimeout(() => {
        const url = `${baseUrl}?q=${encodeURIComponent(q)}&resources[type]=product,collection,article,page&resources[limit]=6`;
        fetch(url, { headers: { 'Accept': 'application/json' } })
          .then(r => r.json())
          .then(data => render(container, data.resources.results, q))
          .catch(() => { container.innerHTML = '<p>Unable to load results.</p>'; });
      }, 300);
    });
  });

  function render(container, results, query) {
    let html = '';
    const sections = Object.keys(results || {});
    if (!sections.length) { container.innerHTML = '<p>No results</p>'; return; }
    sections.forEach(type => {
      const items = results[type];
      if (!items || !items.length) return;
      html += `<div class="predictive-search__group"><strong>${type}</strong>`;
      items.forEach(item => {
        const image = item.image ? `<img src="${item.image}" alt="">` : '';
        const url = item.url || (item.handle ? `/${type}/${item.handle}` : '#');
        html += `<a href="${url}" class="predictive-search__item">${image}<span>${item.title}</span></a>`;
      });
      html += '</div>';
    });
    html += `<a href="/search?q=${encodeURIComponent(query)}" class="button button--secondary" style="margin-top:.5rem;width:100%">View all</a>`;
    container.innerHTML = html;
  }
});
