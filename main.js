const adicionar_compra = document.getElementById("add_purchase")
const adicionar_carrinho_btn = document.querySelector(".add_to_cart")
const lista_compras = document.querySelector(".shopping_cart")
const comprar_btn = document.querySelector(".checkout_btn")

let valor_final_compra = document.querySelector(".final_purchase_value")

const lista_compras_itens = []
const lista_nome_produtos = []

const formatacao = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
})

adicionar_carrinho_btn.addEventListener("click", () => {
    const produto_novo = adicionar_compra.value

    if (!checkProductList(produto_novo)) {
        console.log("Produto Novo")
        add_to_cart(produto_novo)
    }

    else {
        console.log("Produto já na lista de compras")
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

    const nome_produto = capitalizarPrimeiraLetra(produto)

    const preco_produto = (Math.random() * 1000).toFixed(2)
    const desconto_produto = calculate_discount(preco_produto)

    const preco_final_produto = preco_produto - desconto_produto

    lista_compras_itens.push({
        nome: nome_produto,
        preco: preco_final_produto,
        desconto: desconto_produto,
        quantidade: 1
    })

    lista_nome_produtos.push(produto)

    console.log(lista_compras_itens)

    updateShoppingList(nome_produto, formatacao.format(preco_final_produto), formatacao.format(desconto_produto))
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
            product_index = index
        }
    })

    console.log(`controle de Qtd:`)
    console.log(lista_compras_itens)

    updateShoppingList(nome_produto, 0, 0, product_quantity, product_index)
}

function updateShoppingList(nome, preco = 0, desconto = 0, quantidade = 1, index = 0) {

    if (!checkProductList(nome)) {
        const item = document.createElement("li")
    
        item.textContent = `Produto: ${nome} | Preço: ${preco} | Desconto: ${desconto} | Qtd: ${quantidade}`
    
        lista_compras.appendChild(item)
    }

    else {

        const product_name = lista_compras.children[index].textContent.split("|")[0].trim()
        const product_price = lista_compras.children[index].textContent.split("|")[1].trim()
        const produtc_discount = lista_compras.children[index].textContent.split("|")[2].trim()

        lista_compras.children[index].textContent = `${product_name} | ${product_price} | ${produtc_discount} | Qtd: ${quantidade}`
    }

    calculateTotalPurchaseValue()
}

function calculateTotalPurchaseValue() {

    let valor_total_compra = 0

    lista_compras_itens.forEach(produto => {
        valor_total_compra += (produto.preco * produto.quantidade)
    })

    valor_final_compra.textContent = formatacao.format(valor_total_compra)
}

function checkout() {
    lista_compras_itens.length = 0
    lista_nome_produtos.length = 0

    adicionar_compra.value = ''
    valor_final_compra.textContent = "R$ 0,00"
    lista_compras.innerHTML = ''
}

function capitalizarPrimeiraLetra(str) {
    // Pega a primeira letra, coloca em maiúsculo, e concatena com o resto da string
    return str.charAt(0).toUpperCase() + str.slice(1);
  }