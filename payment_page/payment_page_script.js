// const total_amount_paid = document.getElementById("total_amount_paid")

// total_amount_paid.addEventListener("input", () => {
//     mascara(total_amount_paid.value)
// })

function mascara(valor) {
	var valorAlterado = valor.value;
	valorAlterado = valorAlterado.replace(/\D/g, ""); // Remove todos os não dígitos
	valorAlterado = valorAlterado.replace(/(\d+)(\d{2})$/, "$1,$2"); // Adiciona a parte de centavos
	valorAlterado = valorAlterado.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."); // Adiciona pontos a cada três dígitos
	valorAlterado = "R$" + valorAlterado;
	valor.value = valorAlterado;
}


// função para recaulcular o mapeamento da imagem conforme o seu tamanho na tela
window.onload = window.onresize = function() {
    const img = document.getElementById("mappedImage");
    const originalWidth = 482; // Defina a largura original da imagem (antes de ser redimensionada)
    const originalHeight = 973; // Defina a altura original da imagem
    const currentWidth = img.clientWidth;
    const currentHeight = img.clientHeight;
    const scaleX = currentWidth / originalWidth;
    const scaleY = currentHeight / originalHeight;

    document.querySelectorAll("area").forEach(area => {
        let coords = area.getAttribute("data-original-coords").split(",");
        let newCoords = coords.map((coord, index) => 
            index % 2 === 0 ? Math.round(coord * scaleX) : Math.round(coord * scaleY)
        );
        area.setAttribute("coords", newCoords.join(","));
    });
};

// função para adaptar o tamanho da fonte a div 
function ajustarTexto(container, texto, fontSize) {
	
	texto.style.fontSize = fontSize + 'px';
	
	// Reduz o tamanho da fonte até que o texto caiba dentro da div
	while (texto.scrollWidth > container.offsetWidth) {
		fontSize -= 1;
		texto.style.fontSize = fontSize + 'px';
	}
}

// Chama a função para ajustar o texto quando a página carregar ou quando a janela for redimensionada
const credit_card_machine_screen = document.querySelector('.credit_card_machine_screen');
const fontSize_total_value = 15
const fontSize_total_paid = 50

window.addEventListener('resize', () => {
	const total_value = document.querySelector('.total_value');
	const total_paid = document.querySelector('.total_paid');

	ajustarTexto(credit_card_machine_screen, total_value, fontSize_total_value)
	ajustarTexto(credit_card_machine_screen, total_paid, fontSize_total_paid)
});

window.addEventListener('load', () => {
	const total_value = document.querySelector('.total_value');
	const total_paid = document.querySelector('.total_paid');

	ajustarTexto(credit_card_machine_screen, total_value, fontSize_total_value)
	ajustarTexto(credit_card_machine_screen, total_paid, fontSize_total_paid)
});