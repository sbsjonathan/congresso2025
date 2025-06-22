document.addEventListener("DOMContentLoaded", () => {

    const clickableElements = document.querySelectorAll('.clickable');
    const textareas = document.querySelectorAll('textarea');

    clickableElements.forEach(element => {
        const textareaId = element.dataset.textarea;
        const textarea = document.getElementById(textareaId);

        element.addEventListener('click', () => {
            const isVisible = textarea.classList.contains('show');

            // Fecha todas as outras
            textareas.forEach(t => {
                t.classList.remove('show');
            });

            // Se não estava visível, mostra
            if (!isVisible) {
                textarea.classList.add('show');
                // ❌ Removido o foco automático
            }
        });
    });

    // Função global pra fechar todas (chamada pelo menu)
    window.closeAllTextareas = function () {
        textareas.forEach(t => {
            t.classList.remove('show');
        });
    };
});