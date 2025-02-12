const add_purchase_form = document.querySelector(".add_purchase_container")
const adicionar_compra = document.getElementById("add_purchase")
const adicionar_carrinho_btn = document.querySelector(".add_to_cart")
const lista_compras = document.querySelector(".shopping_cart")
const comprar_btn = document.querySelector(".checkout_btn")
const selected_item_information = document.querySelector(".item_information_container")
const estado_do_caixa = document.querySelector(".supermarket_cashier_message").children[0]

let valor_final_compra = document.querySelector("#subtotal_item p")
let item_selecionado_anterior = null

const lista_compras_itens = []
const lista_nome_produtos = []

const formatacao = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
})

add_purchase_form.addEventListener("submit", (event) => {

    estado_do_caixa.textContent = "CAIXA OCUPADO"

    const som_registrar_produto = document.querySelector(".store-scanner-beep")
    som_registrar_produto.currentTime = 0
    som_registrar_produto.play()

    event.preventDefault()

    const produto_novo = adicionar_compra.value

    if (!checkProductList(produto_novo)) {
        //console.log("Produto Novo")
        add_to_cart(produto_novo)
    }

    else {
        //console.log("Produto já na lista de compras")
        controlProductQuantity(produto_novo)
    }

})

comprar_btn.addEventListener("click", checkout)

function checkProductList(produto) {
    let productExists = false

    lista_nome_produtos.indexOf(produto) != -1 ? productExists = true : productExists = false

    return productExists
}

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

    calculateTotalPurchaseValue()
}

function calculateTotalPurchaseValue() {

    let valor_total_compra = 0

    lista_compras_itens.forEach(produto => {
        valor_total_compra += (produto.vlr_unit * produto.quantidade)
    })

    valor_final_compra.textContent = formatacao.format(valor_total_compra)
}

function checkout() {
    lista_compras_itens.length = 0
    lista_nome_produtos.length = 0

    adicionar_compra.value = ''
    valor_final_compra.textContent = "0,00"
    lista_compras.children[1].innerHTML = ''
    selectedItemInformationReset()

    estado_do_caixa.textContent = "CAIXA LIVRE"
    const som_compra_finalizada = document.querySelector(".cash-register-purchase")
    som_compra_finalizada.currentTime = 0
    som_compra_finalizada.play()
}

lista_compras.addEventListener("click", (event) => {

    const item_parent = event.target.parentNode.parentNode.tagName.toLowerCase()

    const item = event.target.parentNode

    item_parent != "thead" ? displaySelectedItemInformation(item) : alert("Item selecionado inválido")

})

function displaySelectedItemInformation(selected_item) {
    const item_barcode = selected_item_information.children[0].querySelector(".info").children[0]
    const unit_value_item = selected_item_information.children[1].querySelector(".info").children[0]
    const total_item_discount = selected_item_information.children[3].querySelector(".info").children[0]
    const total_item = selected_item_information.children[2].querySelector(".info").children[0]

    console.log()

    item_barcode.textContent = selected_item.children[1].textContent
    unit_value_item.textContent = formatacao.format(convert_NumberBR_to_NumberUSA(selected_item.children[4].textContent))
    total_item_discount.textContent = formatacao.format(convert_NumberBR_to_NumberUSA(selected_item.children[5].textContent))
    total_item.textContent = formatacao.format(convert_NumberBR_to_NumberUSA(selected_item.children[6].textContent))

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

        console.log(item_selecionado_atual.classList)

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

function convert_NumberBR_to_NumberUSA(number) {
    return Number(number.replace(/\./g, '').replace("," , "."))  // Remove todos os pontos e substitui a "," pelo "."
}

function capitalizarPrimeiraLetra(str) {
    // Pega a primeira letra, coloca em maiúsculo, e concatena com o resto da string
    return str.charAt(0).toUpperCase() + str.slice(1);
  }