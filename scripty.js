let cart = [];
const deliveryFee = 4.00; // Modifique a taxa de entrega aqui

function showCustomizationInput(itemId, itemName, itemPrice) {
    const quantity = prompt("Quantas unidades deseja?");
    if (quantity !== null && !isNaN(quantity) && quantity > 0) {
        const customizationRemove = prompt("DESEJA RETIRAR ALGO ");
        const addSomething = prompt("DESEJA ADICIONAR ALGO ? Digite a quantidade e o item que deseja (ex: 2 ovo, 1 bacon)");

        let additionalPrice = 0;
        let additionalItems = [];

        if (addSomething !== null && addSomething.trim() !== "") {
            const additionalItemNames = addSomething.split(",");
            for (let addItemRaw of additionalItemNames) {
                const addItem = addItemRaw.trim().split(" ");
                if (addItem.length >= 2) {
                    const addQuantity = addItem[0].trim();
                    const addName = addItem.slice(1).join(" ").trim().toLowerCase();
                    console.log("Adicional:", addName);
                    const price = getAdditionalItemPrice(addName);
                    console.log("Preço do adicional:", price);
                    if (price > 0 && !isNaN(addQuantity) && addQuantity > 0) {
                        additionalItems.push({
                            name: addName.charAt(0).toUpperCase() + addName.slice(1),
                            price: price,
                            quantity: parseInt(addQuantity)
                        });
                        additionalPrice += price * parseInt(addQuantity);
                    }
                }
            }
        }

        const customization = customizationRemove;
        addToCart(itemId, itemName, itemPrice, customization, quantity, additionalPrice, additionalItems);
    } else {
        alert("Por favor, insira uma quantidade válida.");
    }
}

function getAdditionalItemPrice(itemName) {
    const additionalItems = {
        "ovo": 2.00,
        "bife": 3.00,
        "bacon": 3.50,
        "frango": 3.50,
        "presunto": 3.50,
        "salsicha": 2.00,
        "calabreza": 3.50,
        "catupiry": 3.50,
        "mussarela": 3.50,
    };
    return additionalItems[itemName.toLowerCase().trim()] || 0;
}


function addToCart(itemId, itemName, itemPrice, customization, quantity, additionalPrice = 0, additionalItems = []) {
    cart.push({ 
        id: itemId, 
        name: itemName, 
        basePrice: itemPrice,
        price: (itemPrice * quantity) + additionalPrice, 
        customization: customization, 
        quantity: quantity,
        additionalPrice: additionalPrice,
        additionalItems: additionalItems
    });
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-content">
                <span>${item.name} x${item.quantity}</span>
                <p>Preço: R$${item.basePrice.toFixed(2)} x ${item.quantity} = R$${(item.basePrice * item.quantity).toFixed(2)}</p>
                <p>Personalização: ${item.customization || 'Nenhuma'}</p>
                ${item.additionalItems.length > 0 ? `
                    <p>Adicionais:</p>
                    <ul>
                        ${item.additionalItems.map(additionalItem => `
                            <li>
                                ${additionalItem.name} 
                                ${additionalItem.price > 0 
                                    ? `x${additionalItem.quantity} = R$${(additionalItem.price * additionalItem.quantity).toFixed(2)}`
                                    : '(sem custo)'}
                            </li>
                        `).join('')}
                    </ul>
                ` : ''}
                <p>Total do item: R$${item.price.toFixed(2)}</p>
            </div>
            <button onclick="removeFromCart('${item.id}')">Remover</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked');
    const isDelivery = deliveryMethod && deliveryMethod.value === 'delivery';

    const totalElement = document.getElementById('total');
    totalElement.innerText = 'Total: R$' + (total + (isDelivery ? deliveryFee : 0)).toFixed(2);

    const deliveryFeeElement = document.getElementById('delivery-fee');
    deliveryFeeElement.style.display = isDelivery ? 'block' : 'none';
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
}

function showModal() {
    document.getElementById('modal').style.display = 'block';
    updateCartDisplay();
}

function hideModal() {
    document.getElementById('modal').style.display = 'none';
}

function toggleTrocoField() {
    const paymentMethod = document.getElementById('payment-method').value;
    document.getElementById('troco-container').style.display = paymentMethod === 'cash' ? 'block' : 'none';
}

function toggleAddressFields() {
    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked').value;
    const addressContainer = document.getElementById('address-container');
    addressContainer.style.display = deliveryMethod === 'delivery' ? 'block' : 'none';
    updateCartDisplay();
}

function finalizeOrder() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const district = document.getElementById('district').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const troco = paymentMethod === 'cash' ? document.getElementById('troco').value : 'N/A';

    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked').value;
    const isDelivery = deliveryMethod === 'delivery';

    if ((name && address && district && isDelivery) || (name && !isDelivery)) {
        const total = (cart.reduce((sum, item) => sum + item.price, 0) + (isDelivery ? deliveryFee : 0)).toFixed(2);

        let orderDetails = `✅ *PEDIDO CONFIRMADO*\n`;
        orderDetails += `👤 Nome: ${name}\n`;
        if (isDelivery) {
            orderDetails += `📍 Endereço: ${address}\n🏘️ Bairro: ${district}\n`;
        }
        orderDetails += `💰 Pagamento: ${paymentMethod}\n💵 Troco: ${troco}\n`;
        orderDetails += `🧾 *Itens do Pedido:*\n`;

        cart.forEach(item => {
            orderDetails += `\n🍔 ${item.name} x${item.quantity} (R$${item.price.toFixed(2)})`;
            if (item.customization) {
                orderDetails += `\n   • Retirar: ${item.customization}`;
            }
            if (item.additionalItems.length > 0) {
                orderDetails += `\n   • Adicionais:`;
                item.additionalItems.forEach(add => {
                    if (add.price > 0) {
                        orderDetails += `\n     - ${add.name} x${add.quantity} = R$${(add.price * add.quantity).toFixed(2)}`;
                    } else {
                        orderDetails += `\n     - ${add.name} (sem custo)`;
                    }
                });
            }
        });

        if (isDelivery) {
            orderDetails += `\n📦 Taxa de entrega: R$${deliveryFee.toFixed(2)}`;
        }

        orderDetails += `\n💳 Total: R$${total}`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=5532984885431&text=${encodeURIComponent(orderDetails)}`;
        window.open(whatsappUrl, '_blank');

        alert('Pedido enviado para o WhatsApp!');

        // Limpar tudo
        document.getElementById('order-form').reset();
        cart = [];
        updateCartDisplay();
        hideModal();
    } else {
        alert("Por favor, preencha todos os campos obrigatórios.");
    }
}
