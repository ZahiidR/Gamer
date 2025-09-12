
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchCatalogo');
  const clearBtn = document.getElementById('clearSearch');

  // Normalizar texto (para quitar tildes y pasar a minúscula)
  const normalize = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  function filtrar() {
    const q = normalize(input.value.trim());
    let visibles = 0;

    // Activamos siempre la pestaña "Todos"
    const todosTabBtn = document.querySelector('[data-bs-target="#todos"]');
    const todosTabPane = document.getElementById('todos');
    if (todosTabBtn && todosTabPane) {
      new bootstrap.Tab(todosTabBtn).show();
    }

    // Tomamos TODOS los productos del catálogo
    const cards = document.querySelectorAll('#catalogo .card');

    cards.forEach(card => {
      const title = card.querySelector('.card-title')?.textContent || '';
      const price = card.querySelector('.card-text')?.textContent || '';
      const alt   = card.querySelector('img')?.alt || '';
      const combined = normalize(title + ' ' + price + ' ' + alt);

      const match = q === '' || combined.includes(q);

      const col = card.closest('[class*="col-"]');
      if (col) col.style.display = match ? '' : 'none';
      if (match) visibles++;
    });

    // Mensaje si no hay resultados
    let noResultDiv = document.getElementById('noResultsMsg');
    if (!visibles && q !== "") {
      if (!noResultDiv) {
        noResultDiv = document.createElement('div');
        noResultDiv.id = 'noResultsMsg';
        noResultDiv.className = 'text-center mt-4 text-danger';
        noResultDiv.innerText = 'No se encontraron resultados.';
        document.querySelector('#todos .row')?.appendChild(noResultDiv);
      }
    } else if (noResultDiv) {
      noResultDiv.remove();
    }
  }

  // Eventos
  input.addEventListener('input', filtrar);

  if (clearBtn) {
    clearBtn.addEventListener('click', e => {
      e.preventDefault();
      input.value = '';
      filtrar();
      input.focus();
    });
  }

  // Filtrar al inicio
  filtrar();
});
