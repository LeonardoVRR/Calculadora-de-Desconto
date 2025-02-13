// Chama a função para ajustar o texto quando a página carregar ou quando a janela for redimensionada
const fontSize_total_value = 15
const fontSize_total_paid = 50

window.addEventListener('resize', () => {
    const credit_card_machine_screen = document.querySelector('.credit_card_machine_screen');
    const total_value = document.querySelector('.total_value');
    const total_paid = document.querySelector('.total_paid');

    ajustarTexto(credit_card_machine_screen, total_value, fontSize_total_value)
    ajustarTexto(credit_card_machine_screen, total_paid, fontSize_total_paid)
});

window.addEventListener('load', () => {
    const credit_card_machine_screen = document.querySelector('.credit_card_machine_screen');
    const total_value = document.querySelector('.total_value');
    const total_paid = document.querySelector('.total_paid');

    ajustarTexto(credit_card_machine_screen, total_value, fontSize_total_value)
    ajustarTexto(credit_card_machine_screen, total_paid, fontSize_total_paid)
});

// função para adaptar o tamanho da fonte a div 
function ajustarTexto(container, texto, fontSize) {
    
    texto.style.fontSize = fontSize + 'px';
    
    // Reduz o tamanho da fonte até que o texto caiba dentro da div
    while (texto.scrollWidth > container.offsetWidth) {
        fontSize -= 1;
        texto.style.fontSize = fontSize + 'px';
    }
}