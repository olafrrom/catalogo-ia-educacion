(() => {
  const track = (eventName, data = {}) => {
    if (window.umami && typeof window.umami.track === 'function') {
      window.umami.track(eventName, data);
    }
  };

  const injectCopyStyles = () => {
    if (document.getElementById('prompt-copy-styles')) return;
    const style = document.createElement('style');
    style.id = 'prompt-copy-styles';
    style.textContent = `
      .prompt-wrap{position:relative;margin-top:7px}
      .prompt-wrap .prompt{padding-right:46px}
      .copy-prompt-btn{position:absolute;top:8px;right:8px;width:32px;height:32px;border:1px solid var(--line,#d7e7f2);border-radius:10px;background:rgba(255,255,255,.94);color:#2563eb;display:grid;place-items:center;cursor:pointer;font-size:15px;line-height:1;transition:transform .15s ease,background .15s ease,border-color .15s ease;box-shadow:0 4px 12px rgba(37,99,235,.08)}
      .copy-prompt-btn:hover{transform:translateY(-1px);border-color:#2563eb;background:#f8fbff}
      .copy-prompt-btn.copied{background:#ecfdf5;color:#0f766e;border-color:#99f6e4}
      .copy-prompt-btn:focus-visible{outline:2px solid #2563eb;outline-offset:2px}
    `;
    document.head.appendChild(style);
  };

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  };

  const addPromptCopyButtons = () => {
    injectCopyStyles();
    document.querySelectorAll('.case').forEach((caseEl) => {
      if (caseEl.querySelector('.copy-prompt-btn')) return;
      const promptEl = caseEl.querySelector('.prompt');
      if (!promptEl) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'prompt-wrap';
      promptEl.parentNode.insertBefore(wrapper, promptEl);
      wrapper.appendChild(promptEl);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-prompt-btn';
      button.setAttribute('aria-label', 'Copiar prompt');
      button.setAttribute('title', 'Copiar prompt');
      button.textContent = '⧉';
      wrapper.appendChild(button);
      button.addEventListener('click', async () => {
        const prompt = promptEl.textContent.trim();
        const card = caseEl.closest('.card');
        const tool = card?.querySelector('h2')?.textContent?.trim() || 'Unknown';
        const category = card?.querySelector('.tag')?.textContent?.trim() || 'Unknown';
        const useCase = caseEl.querySelector('b')?.textContent?.trim() || 'Unknown';
        try {
          await copyText(prompt);
          button.textContent = '✓';
          button.classList.add('copied');
          button.setAttribute('aria-label', 'Prompt copiado');
          track('prompt_copy', { tool, category, use_case: useCase });
          setTimeout(() => {
            button.textContent = '⧉';
            button.classList.remove('copied');
            button.setAttribute('aria-label', 'Copiar prompt');
          }, 1200);
        } catch (error) {
          console.error('No se pudo copiar el prompt', error);
        }
      });
    });
  };

  document.addEventListener('toggle', (event) => {
    const details = event.target;
    if (!(details instanceof HTMLDetailsElement) || !details.open) return;
    const card = details.closest('.card');
    if (!card) return;
    const tool = card.querySelector('h2')?.textContent?.trim() || 'Unknown';
    const category = card.querySelector('.tag')?.textContent?.trim() || 'Unknown';
    track('tool_open', { tool, category });
  }, true);

  document.addEventListener('click', (event) => {
    const categorySummary = event.target.closest('#categoryMenu details > summary');
    if (categorySummary) {
      const details = categorySummary.parentElement;
      if (details && !details.open) {
        const category = categorySummary.childNodes[0]?.textContent?.trim() || categorySummary.textContent?.trim() || 'Unknown';
        track('category_open', { category });
      }
      return;
    }

    const link = event.target.closest('a.primary');
    if (!link) return;
    const card = link.closest('.card');
    if (!card) return;
    const tool = card.querySelector('h2')?.textContent?.trim() || 'Unknown';
    const category = card.querySelector('.tag')?.textContent?.trim() || 'Unknown';
    track('external_tool_click', { tool, category, destination: link.href });
  });

  const loadCatalogEnhancements = () => {
    if (document.querySelector('script[data-catalog-i18n]')) return;
    const script = document.createElement('script');
    script.src = './catalog-i18n.js?v=1';
    script.defer = true;
    script.dataset.catalogI18n = 'true';
    document.body.appendChild(script);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      addPromptCopyButtons();
      loadCatalogEnhancements();
    });
  } else {
    addPromptCopyButtons();
    loadCatalogEnhancements();
  }
})();
