const lista_compras_itens = JSON.parse(localStorage.getItem("lista_compras")) || [];
const lista_nome_produtos = JSON.parse(localStorage.getItem("nome_produtos")) || [];
//const list_produto_vlr_total = JSON.parse(localStorage.getItem("produto_vlr_total")) || [];

const formatacao = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
})

window.addEventListener("load", ()=> {

    if (window.location.pathname.endsWith('index.html')) {

        console.log("Execuntando script do arquivo index.html")

        const add_purchase_form = document.querySelector(".add_purchase_container")
        const adicionar_compra = document.getElementById("add_purchase")
        const adicionar_carrinho_btn = document.querySelector(".add_to_cart")
        const lista_compras = document.querySelector(".shopping_cart")
        const comprar_btn = document.querySelector(".pay_btn")
        const selected_item_information = document.querySelector(".item_information_container")
        const estado_do_caixa = document.querySelector(".supermarket_cashier_message").children[0]

        let valor_final_compra = document.querySelector("#subtotal_item p")

        let item_selecionado_anterior = null

        if (lista_compras_itens.length == 0 || lista_compras_itens == null) {
            console.log("Lista nova")

            estado_do_caixa.textContent = "CAIXA LIVRE"
        }

        else {
            estado_do_caixa.textContent = "CAIXA OCUPADO"
            loadShoppingList(lista_compras)
            calculateTotalPurchaseValue("lista antiga")
        }

        add_purchase_form.addEventListener("submit", (event) => {

            event.preventDefault()

            console.log(lista_compras_itens)

            estado_do_caixa.textContent = "CAIXA OCUPADO"

            const som_registrar_produto = document.querySelector(".store-scanner-beep")
            som_registrar_produto.currentTime = 0
            som_registrar_produto.play()

            const produto_novo = adicionar_compra.value.toLowerCase()

            if (!checkProductList(produto_novo)) {
                //console.log("Produto Novo")
                add_to_cart(produto_novo)
            }

            else {
                //console.log("Produto já na lista de compras")
                controlProductQuantity(produto_novo)
            }

        })

        comprar_btn.addEventListener("click", () => {
            localStorage.setItem("lista_compras", JSON.stringify(lista_compras_itens));
            localStorage.setItem("nome_produtos", JSON.stringify(lista_nome_produtos));
            //localStorage.setItem("produto_vlr_total", JSON.stringify(list_produto_vlr_total));
        })

        function checkProductList(produto) {
            let productExists = false

            lista_nome_produtos.indexOf(produto) != -1 ? productExists = true : productExists = false

            return productExists
        }

        lista_compras.addEventListener("click", (event) => {

            const item_parent = event.target.parentNode.parentNode.tagName.toLowerCase()

            const item = event.target.parentNode

            item_parent != "thead" ? displaySelectedItemInformation(item) : alert("Item selecionado inválido")

        })

        function add_to_cart(produto) {

            const num_produto_novo = lista_nome_produtos.length + 1
            const codigo_produto_novo = Math.floor(Math.random() * (9999999999999 - 1000 + 1) ) + 1000; //13 digitos max
            const nome_produto = capitalizarPrimeiraLetra(produto)
        
            const preco_produto = (Math.random() * 1000).toFixed(2)
            const desconto_produto = calculate_discount(preco_produto)
        
            const preco_final_produto = preco_produto - desconto_produto
        
            lista_compras_itens.push({
                num_produto: num_produto_novo,
                codigo_produto: codigo_produto_novo,
                nome: nome_produto,
                quantidade: 1,
                vlr_unit: Number(preco_produto),
                valor_total: preco_final_produto,
                desconto: desconto_produto,
                desconto_fixo: desconto_produto        
            })
        
            lista_nome_produtos.push(produto)
            //list_produto_vlr_total.push(preco_final_produto)
        
            //console.log(lista_compras_itens)
        
            updateShoppingList(num_produto_novo, codigo_produto_novo, nome_produto, formatacao.format(preco_produto).replace("R$", "").trim(), formatacao.format(preco_final_produto).replace("R$", "").trim(), formatacao.format(desconto_produto).replace("R$", "").trim())
        }
        
        function calculate_discount(preco) {
        
            const discount = preco > 50 ? (0.1 * preco).toFixed(2) : 0
        
            return Number(discount)
        }
        
        function controlProductQuantity(nome_produto) {
        
            let product_quantity = 0
            let product_index = 0
        
            lista_compras_itens.forEach((produto, index) => {
                if (produto.nome.toLowerCase() === nome_produto.toLowerCase()) {
                    produto.quantidade += 1
        
                    product_quantity = produto.quantidade
        
                    produto.desconto = produto.desconto_fixo * product_quantity
        
                    produto.valor_total = (produto.vlr_unit * product_quantity) - produto.desconto
        
                    product_index = index
                }
            })
        
            // console.log(`controle de Qtd:`)
            // console.log(lista_compras_itens)
        
            updateShoppingList(0, 0, nome_produto, 0, 0, 0, product_quantity, product_index)
        }
        
        function updateShoppingList(num_produto = 1, codigo_produto = 0, nome, preco_unit = 0, preco_total = 0, desconto = 0, quantidade = 1, index = 0) {
        
            if (!checkProductList(nome)) {
                const new_line = document.createElement("tr")
        
                const item_number = document.createElement("td")
                item_number.textContent = num_produto
        
                const item_code = document.createElement("td")
                item_code.textContent = codigo_produto
        
                const item_name = document.createElement("td")
                item_name.textContent = nome
        
                const item_qtd = document.createElement("td")
                item_qtd.textContent = quantidade
        
                const item_vlr_unit = document.createElement("td")
                item_vlr_unit.textContent = preco_unit
        
                const item_discont = document.createElement("td")
                item_discont.textContent = desconto
        
                const item_total_value = document.createElement("td")
                item_total_value.textContent = preco_total
            
                new_line.append(item_number, item_code, item_name, item_qtd, item_vlr_unit, item_discont, item_total_value)
        
                lista_compras.children[1].appendChild(new_line)
            }
        
            else {
        
                const produtc_qtd = lista_compras.children[1].children[index].children[3]
                produtc_qtd.textContent = lista_compras_itens[index].quantidade
        
                const produtc_discount = lista_compras.children[1].children[index].children[5]
                produtc_discount.textContent = (lista_compras_itens[index].desconto).toFixed(2)
        
                const produtc_total_value = lista_compras.children[1].children[index].children[6]
                produtc_total_value.textContent = (lista_compras_itens[index].valor_total).toFixed(2)
        
            }

            console.log(lista_compras_itens)
        
            calculateTotalPurchaseValue()
        }
        
        function calculateTotalPurchaseValue(lista = "lista nova") {

            if (lista == "lista antiga") {

                let subtotal = 0

                let vlr_total_compras = Array.from(lista_compras.children[1].querySelectorAll("tr"))
                console.log(vlr_total_compras)
        
                vlr_total_compras.forEach(item_vlr_total => {
                    subtotal += convert_NumberBR_and_NumberUSA(item_vlr_total.children[6].textContent, "US")
    
                    console.log(subtotal)
                })

                valor_final_compra.textContent = convert_NumberBR_and_NumberUSA(subtotal, "BR")
            }

            else {
                let valor_total_compra = 0
        
                lista_compras_itens.forEach(produto => {
                    valor_total_compra += (produto.vlr_unit * produto.quantidade) - (produto.desconto_fixo * produto.quantidade)
                })
            
                valor_final_compra.textContent = convert_NumberBR_and_NumberUSA(valor_total_compra, "BR")
            }
        }
        

        
        function displaySelectedItemInformation(selected_item) {
            const item_barcode = selected_item_information.children[0].querySelector(".info").children[0]
            const unit_value_item = selected_item_information.children[1].querySelector(".info").children[0]
            const total_item_discount = selected_item_information.children[3].querySelector(".info").children[0]
            const total_item = selected_item_information.children[2].querySelector(".info").children[0]
        
            console.log()
        
            item_barcode.textContent = selected_item.children[1].textContent
            unit_value_item.textContent = formatacao.format(convert_NumberBR_and_NumberUSA(selected_item.children[4].textContent), "US")
            total_item_discount.textContent = formatacao.format(convert_NumberBR_and_NumberUSA(selected_item.children[5].textContent), "US")
            total_item.textContent = formatacao.format(convert_NumberBR_and_NumberUSA(selected_item.children[6].textContent), "US")
        
            styleSelectedItem(selected_item)
        }
        
        function styleSelectedItem(item) {
            let item_selecionado_atual = item
        
            // console.log(`item anterior:`)
            // console.log(item_selecionado_anterior)
            // console.log(`item atual:`)
            // console.log(item_selecionado_atual)
        
            if (item_selecionado_anterior == null) {
                item_selecionado_atual.classList.add("selected_item")
            }
        
            else if (item_selecionado_atual != item_selecionado_anterior) {
                item_selecionado_atual.classList.add("selected_item")
                item_selecionado_anterior.classList.remove("selected_item")
            }
        
            else if (item_selecionado_atual == item_selecionado_anterior) {
                item_selecionado_atual.classList.toggle("selected_item")
        
                //console.log(item_selecionado_atual.classList)
        
                !item_selecionado_atual.classList.contains("selected_item") ? selectedItemInformationReset() : ""
                
            }
        
            item_selecionado_anterior = item_selecionado_atual
        }
        
        function selectedItemInformationReset() {
            const item_barcode = selected_item_information.children[0].querySelector(".info").children[0]
            const unit_value_item = selected_item_information.children[1].querySelector(".info").children[0]
            const total_item_discount = selected_item_information.children[3].querySelector(".info").children[0]
            const total_item = selected_item_information.children[2].querySelector(".info").children[0]
        
            item_barcode.textContent = '0'
            unit_value_item.textContent = 'R$ 0,00'
            total_item_discount.textContent = 'R$ 0,00'
            total_item.textContent = 'R$ 0,00'
        }
        
        function payment() {
            
        }

    }

//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------

    else if (window.location.pathname.endsWith('payment.html')) {
        console.log("Execuntando script do arquivo payment.html")
        //console.log(lista_compras_itens)

        const mapImage = document.getElementById("credit_card_machine_keyboard")
        const lista_compras = document.querySelector(".shopping_cart")
        let valor_final_compra = document.querySelector("#subtotal_item p")
        const credit_card_machine = document.querySelector('.credit_card_machine');
        const credit_card_machine_screen_payment = document.querySelector('.credit_card_screen_payment');
        const total_value = document.querySelector('.total_value');
        const total_paid = document.querySelector('.total_paid');
        const total_paid_txt_maquininha = document.querySelector(".total_paid").children[0]

        const total_received = document.getElementById("total_received").children[1].children[0]
        const total_change_cash = document.getElementById("total_change_cash").children[1].children[0]

        const screen_operation_bg_color = document.getElementById("screen_operation_bg_color")
        const screen_operation = document.querySelectorAll("#screen_operation")

        let subtotal = 0

        loadShoppingList(lista_compras)

        const vlr_total_compras = Array.from(lista_compras.children[1].querySelectorAll("tr"))
        //console.log(vlr_total_compras)

        vlr_total_compras.forEach(item_vlr_total => {
            subtotal += convert_NumberBR_and_NumberUSA(item_vlr_total.children[6].textContent, "US")
        })

        valor_final_compra.textContent = convert_NumberBR_and_NumberUSA(subtotal, "BR")
        total_value.children[1].textContent = convert_NumberBR_and_NumberUSA(subtotal, "BR")

        let valor_digitado = ""

        mapImage.addEventListener("click", (event) => {

            const keySelected = event.target.getAttribute("data-keyNumber")

            if (keySelected == "cancelar") {
                console.log("cancelar")

                valor_digitado = ""

                total_paid_txt_maquininha.innerHTML = `<p><sup>R$</sup> 0,00</p>`
            }

            else if (keySelected == "deletar") {
                console.log("deletar digito")

                valor_digitado = valor_digitado.slice(0,-1)

                total_paid_txt_maquininha.innerHTML = `<p><sup>R$</sup> ${mascara(valor_digitado)}</p>`
            }

            else if (keySelected == "concluir") {

                credit_card_machine.style.pointerEvents = "none";

                console.log("concluir pagamento")

                const vlr_pago = mascara(valor_digitado)

                let result = convert_NumberBR_and_NumberUSA(vlr_pago, "US") < subtotal ? true : false

                //console.log(convert_NumberBR_and_NumberUSA(vlr_pago, "US"))

                //console.log(`Subtotal: ${subtotal}\nTotal Pago: ${convert_NumberBR_and_NumberUSA(vlr_pago, "US")}\nResultado: ${result}`)

                screen_operation[0].style.visibility = "hidden"
                screen_operation[1].style.visibility = "visible"

                setTimeout(() => {

                    screen_operation[1].style.visibility = "hidden"

                    if (result) {
                        screen_operation[3].style.visibility = "visible"
                        screen_operation_bg_color.style.backgroundColor = "#f05b58"

                        setTimeout(() => {
                            
                            screen_operation[3].style.visibility = "hidden"
                            screen_operation[0].style.visibility = "visible"

                            screen_operation_bg_color.style.backgroundColor = "#ffffff"

                            valor_digitado = ""

                            total_received.textContent = `R$ ${mascara(valor_digitado)}`

                            total_paid_txt_maquininha.innerHTML = `<p><sup>R$</sup> 0,00</p>`

                            credit_card_machine.style.pointerEvents = "auto";

                        }, 1000 * 4)
                    }
                    
                    else {
                        screen_operation[2].style.visibility = "visible"
                        screen_operation_bg_color.style.backgroundColor = "#0fa844"

                        checkout()

                        const operation_purchase_approved = document.querySelector(".credit_card_screen_purchase_approved")

                        const total_value = document.querySelector(".credit_card_screen_purchase_approved").children[2]

                        total_value.textContent = `Total R$ ${vlr_pago}`

                        ajustarTexto(operation_purchase_approved, total_value, 16)

                        const troco = convert_NumberBR_and_NumberUSA(vlr_pago, "US") - subtotal

                        total_change_cash.textContent = `R$ ${convert_NumberBR_and_NumberUSA(troco, "BR")}`
                    }

                }, 1000 * 2.5)
            }

            else {
                valor_digitado += keySelected

                let current_payment = mascara(valor_digitado)

                total_paid_txt_maquininha.innerHTML = `<p><sup>R$</sup> ${current_payment}</p>`
            }

            total_received.textContent = `R$ ${mascara(valor_digitado)}`
        })

        function mascara(valor) {
            // Remove todos os não dígitos
            var valorAlterado = valor.replace(/\D/g, "");
        
            // Garante que haja pelo menos 3 dígitos para formar os centavos
            while (valorAlterado.length <= 2) {
                valorAlterado = "0" + valorAlterado;
            }
        
            // Insere a vírgula para os centavos
            valorAlterado = valorAlterado.replace(/(\d+)(\d{2})$/, "$1,$2");
        
            // Adiciona pontos a cada três dígitos antes da vírgula
            valorAlterado = valorAlterado.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        
            return valorAlterado;
        }        

        ajustarTexto(credit_card_machine_screen_payment, total_value, 15)
        ajustarTexto(credit_card_machine_screen_payment, total_paid, 50)

        const observerFontSize = new MutationObserver(() => {
            //console.log("Texto aumenta")
            ajustarTexto(credit_card_machine_screen_payment, total_paid, 50)
        });     
        
        observerFontSize.observe(total_paid, {
            childList: true,  // Monitora se há mudanças nos filhos (texto, por exemplo)
            subtree: true,    // Monitora toda a árvore de elementos internos
        });
        
        //detecta alterações no tamanho de um elemento
        const credit_card_machine_resize = new ResizeObserver(() => {
            //console.log("Alteração no tamanho da maquininha")
            remapearImg()
        })

        credit_card_machine_resize.observe(credit_card_machine)

        function checkout() {
            localStorage.clear();
        
            const som_compra_finalizada = document.querySelector(".cash-register-purchase")
            som_compra_finalizada.currentTime = 0
            som_compra_finalizada.play()

            setTimeout(()=> {
                window.location.replace('../index.html');
            }, 1000 * 2.5)
        }

        remapearImg()

    }
})

// função para recaulcular o mapeamento da imagem conforme o seu tamanho na tela
function remapearImg() {
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

function loadShoppingList(tabela_compras) {
    lista_compras_itens.forEach(item => {
        
        const new_line = document.createElement("tr")
        
        const item_number = document.createElement("td")
        item_number.textContent = item.num_produto

        const item_code = document.createElement("td")
        item_code.textContent = item.codigo_produto

        const item_name = document.createElement("td")
        item_name.textContent = item.nome

        const item_qtd = document.createElement("td")
        item_qtd.textContent = item.quantidade

        const item_vlr_unit = document.createElement("td")
        item_vlr_unit.textContent = convert_NumberBR_and_NumberUSA(item.vlr_unit, "BR")

        const item_discont = document.createElement("td")
        item_discont.textContent = convert_NumberBR_and_NumberUSA(item.desconto, "BR")

        const item_total_value = document.createElement("td")
        item_total_value.textContent = convert_NumberBR_and_NumberUSA(item.valor_total, "BR")
    
        new_line.append(item_number, item_code, item_name, item_qtd, item_vlr_unit, item_discont, item_total_value)

        //console.log(new_line)

        tabela_compras.children[1].appendChild(new_line)

    })
}

function convert_NumberBR_and_NumberUSA(number, convert) {

    return convert == "BR" ? formatacao.format(number).replace("R$", "").trim() : Number(number.replace(/\./g, '').replace("," , "."))  // Remove todos os pontos e substitui a "," pelo "."
}

function capitalizarPrimeiraLetra(str) {
    // Pega a primeira letra, coloca em maiúsculo, e concatena com o resto da string
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// função para adaptar o tamanho da fonte a div 
function ajustarTexto(container, texto, fontSize) {
    texto.style.fontSize = `${fontSize}px`;
    texto.style.whiteSpace = "nowrap"; // Evita que o texto quebre linha

    while (texto.scrollWidth > container.clientWidth && fontSize > 0) {
        fontSize--;
        texto.style.fontSize = `${fontSize}px`;
    }
}
