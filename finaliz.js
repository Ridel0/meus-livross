document.addEventListener('DOMContentLoaded', function() {
    var cartIcon = document.getElementById('cart-icon');
    var modal = document.getElementById('cart-modal');
    var closeBtn = document.getElementsByClassName('close-btn')[0];
    var cartItemsContainer = document.getElementById('cart-items');
    var cartTotalContainer = document.getElementById('cart-total');
    var cartItems = [];
    var totalAmount = 0;
    var cartBadge = document.getElementById('cart-badge');

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            cartBadge.textContent = '0'; // Atualiza o número no badge
        } else {
            cartItems.forEach(function(item, index) {
                var cartItemDiv = document.createElement('div');
                cartItemDiv.className = 'cart-item';
                cartItemDiv.innerHTML = `
                    <img src="As 48 leis do poder.jpg" alt="${item.name}">
                    <p>${item.name} - R$ ${item.price}</p>
                    <button class="remove-btn" data-index="${index}">Remover</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });

            cartBadge.textContent = cartItems.length; // Atualiza o número no badge
        }

        // Atualizar o total do carrinho
        totalAmount = cartItems.reduce(function(sum, item) {
            return sum + parseFloat(item.price);
        }, 0);

        cartTotalContainer.innerHTML = `<p>Total: R$ ${totalAmount.toFixed(2)}</p>`;
    }

    // Função para animação de adicionar ao carrinho
    function animateAddToCart(productImage) {
        var animationContainer = document.getElementById('animation-container');
        var clone = productImage.cloneNode(true);
        clone.classList.add('animation-image');
        animationContainer.appendChild(clone);

        var cartRect = cartIcon.getBoundingClientRect();
        var imageRect = productImage.getBoundingClientRect();
        var deltaX = cartRect.left - imageRect.left;
        var deltaY = cartRect.top - imageRect.top;

        clone.style.position = 'absolute';
        clone.style.left = imageRect.left + 'px';
        clone.style.top = imageRect.top + 'px';
        clone.style.transition = 'transform 0.5s ease-out';
        clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.3)`;
        
        clone.addEventListener('transitionend', function() {
            clone.remove();
        });
    }

    // Abrir o modal quando o carrinho é clicado
    cartIcon.onclick = function() {
        modal.style.display = 'block';
    }

    // Fechar o modal quando o botão de fechar é clicado
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    // Fechar o modal quando clicar fora do conteúdo do modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Adicionar produtos ao carrinho
    var addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            var productName = this.getAttribute('data-product');
            var productPrice = this.getAttribute('data-price');
            var productImage = this.closest('.product-details').querySelector('.product-image');

            // Verifica se o item já está no carrinho
            var existingItem = cartItems.find(item => item.name === productName);
            if (!existingItem) {
                // Adicionar item ao carrinho
                cartItems.push({ name: productName, price: productPrice });
                updateCart();
                
                // Iniciar animação
                animateAddToCart(productImage);
            } else {
                alert('Este item já está no carrinho.');
            }
        });
    });

    // Remover produtos do carrinho
    cartItemsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-btn')) {
            var index = event.target.getAttribute('data-index');
            cartItems.splice(index, 1); // Remove o item do carrinho
            updateCart(); // Atualiza o carrinho
        }
    });

    // Finalizar compra (Envia mensagem via WhatsApp)
    document.getElementById('checkout-button').addEventListener('click', function() {
        if (cartItems.length > 0) {
            var message = cartItems.map(item => `${item.name} - R$ ${item.price}`).join('\n');
            var total = `Total: R$ ${totalAmount.toFixed(2)}`;
            var whatsappMessage = encodeURIComponent(`Olá, gostaria de comprar:\n${message}\n${total}`);
            var whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;
            window.open(whatsappUrl, '_blank');
        } else {
            alert('Seu carrinho está vazio.');
        }
    });
});
