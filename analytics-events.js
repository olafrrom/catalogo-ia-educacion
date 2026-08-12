(() => {
  const track = (eventName, data = {}) => {
    if (window.umami && typeof window.umami.track === 'function') {
      window.umami.track(eventName, data);
    }
  };

  document.addEventListener('toggle', (event) => {
    const details = event.target;
    if (!(details instanceof HTMLDetailsElement) || !details.open) return;

    const card = details.closest('.card');
    if (card) {
      const tool = card.querySelector('h2')?.textContent?.trim() || 'Unknown';
      const category = card.querySelector('.tag')?.textContent?.trim() || 'Unknown';
      track('tool_open', { tool, category });
      return;
    }

    if (details.closest('#categoryMenu')) {
      const summary = details.querySelector(':scope > summary');
      const category = summary?.childNodes?.[0]?.textContent?.trim() || summary?.textContent?.trim() || 'Unknown';
      track('category_open', { category });
    }
  }, true);

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a.primary');
    if (!link) return;

    const card = link.closest('.card');
    if (!card) return;

    const tool = card.querySelector('h2')?.textContent?.trim() || 'Unknown';
    const category = card.querySelector('.tag')?.textContent?.trim() || 'Unknown';
    const destination = link.href;

    track('external_tool_click', { tool, category, destination });
  });
})();
