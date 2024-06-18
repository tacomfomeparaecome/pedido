let cart = [];
const deliveryFee = 3.50; //Modifique taxa entrega aqui

function showCustomizationInput(itemId, itemName, itemPrice) {
    const customization = prompt("caso queira retiar ingredientes informe aqui! " + itemName + ":");
    if (customization !== null) {
        addToCart(itemId, itemName, itemPrice, customization);
    }
    
}

function addToCart(itemId, itemName, itemPrice, customization) {
    cart.push({ id: itemId, name: itemName, price: itemPrice, customization: customization });
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
                <span>${item.name}</span>
                <p>R$${item.price.toFixed(2)}</p>
                <p>Personalização: ${item.customization}</p>
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
    document.getElementById('troco-container').style.display = paymentMethod === 'dinheiro' ? 'block' : 'none';
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
    const troco = paymentMethod === 'Dinheiro' ? document.getElementById('troco').value : 'N/A';

    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked').value;
    const isDelivery = deliveryMethod === 'delivery';

    if ((name && address && district && isDelivery) || (name && !isDelivery)) {
        const total = (cart.reduce((sum, item) => sum + item.price, 0) + (isDelivery ? deliveryFee : 0)).toFixed(2);
        const orderDetails = `Pedido confirmado!\nNome: ${name}\nEndereço: ${address}\nBairro: ${district}\nMétodo de Pagamento: ${paymentMethod}\nTroco: ${troco}\nTotal: R$${total}\nItens:\n${cart.map(item => `- ${item.name} (R$${item.price.toFixed(2)}) Personalização: ${item.customization}`).join('\n')}`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=5532999392242&text=${encodeURIComponent(orderDetails)}`;
        window.open(whatsappUrl, '_blank');

        alert('Pedido enviado para o WhatsApp!');
        
        // Clear the form
        document.getElementById('order-form').reset();
        // Clear the cart
        cart = [];
        updateCartDisplay();
        hideModal();
    } else {
        alert("Por favor, preencha todos os campos obrigatórios.");
    }
}
