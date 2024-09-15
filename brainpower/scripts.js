document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.complete-checkbox');

    // Adiciona funcionalidade para salvar o status dos checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const li = checkbox.closest('li');
            const id = li.getAttribute('data-id');
            updateCompletionStatus(id, checkbox.checked);
        });
    });

    // Função para atualizar o status de conclusão no localStorage
    function updateCompletionStatus(id, completed) {
        let completedItems = JSON.parse(localStorage.getItem('completedItems')) || {};
        completedItems[id] = completed;
        localStorage.setItem('completedItems', JSON.stringify(completedItems));
    }

    // Função para carregar o status de conclusão do localStorage
    function loadCompletionStatus() {
        let completedItems = JSON.parse(localStorage.getItem('completedItems')) || {};
        document.querySelectorAll('li[data-id]').forEach(li => {
            const id = li.getAttribute('data-id');
            const checkbox = li.querySelector('.complete-checkbox');
            if (completedItems[id]) {
                checkbox.checked = completedItems[id];
            }
        });
    }

    loadCompletionStatus();

    // Adiciona funcionalidade para mostrar/ocultar conteúdo dos módulos
    document.querySelectorAll('.module-btn').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });
});
