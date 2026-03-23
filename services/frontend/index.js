function newBook(book) {
    const div = document.createElement('div');
    div.className = 'column is-4';
    div.innerHTML = `
        <div class="card is-shady">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img
                        src="${book.photo}"
                        alt="${book.name}"
                        class="modal-button"
                    />
                </figure>
            </div>
            <div class="card-content">
                <div class="content book" data-id="${book.id}">
                    <div class="book-meta">
                        <p class="is-size-4">R$${book.price.toFixed(2)}</p>
                        <p class="is-size-6">Disponível em estoque: ${book.quantity}</p>
                        <h4 class="is-size-3 title">${book.name}</h4>
                        <p class="subtitle">${book.author}</p>
                    </div>
                    <div class="field has-addons">
                        <div class="control">
                            <input class="input" type="text" placeholder="Digite o CEP" />
                        </div>
                        <div class="control">
                            <a class="button button-shipping is-info" data-id="${book.id}"> Calcular Frete </a>
                        </div>
                    </div>
                    <button class="button button-buy is-success is-fullwidth">Comprar</button>
                </div>
            </div>
        </div>`;
    return div;
}

function calculateShipping(id, cep) {
    fetch('http://localhost:3000/shipping/' + cep)
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            swal('Frete', `O frete é: R$${data.value.toFixed(2)}`, 'success');
        })
        .catch((err) => {
            swal('Erro', 'Erro ao consultar frete', 'error');
            console.error(err);
        });
}

function loadProducts(id = null) {
    const booksContainer = document.querySelector('.books');
    booksContainer.innerHTML = '';
    
    const url = id ? `http://localhost:3000/product/${id}` : 'http://localhost:3000/products';
    
    fetch(url)
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            if (data) {
                const products = Array.isArray(data) ? data : [data];
                if (products.length === 0 || (products.length === 1 && !products[0])) {
                    swal('Aviso', 'Nenhum produto encontrado', 'warning');
                    return;
                }
                
                products.forEach((book) => {
                    if (book) booksContainer.appendChild(newBook(book));
                });

                attachEvents();
            }
        })
        .catch((err) => {
            swal('Erro', 'Erro ao listar os produtos', 'error');
            console.error(err);
        });
}

function attachEvents() {
    document.querySelectorAll('.button-shipping').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const cep = document.querySelector(`.book[data-id="${id}"] input`).value;
            calculateShipping(id, cep);
        });
    });

    document.querySelectorAll('.button-buy').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            swal('Compra de livro', 'Sua compra foi realizada com sucesso', 'success');
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    loadProducts();

    document.getElementById('btn-search').addEventListener('click', () => {
        const id = document.getElementById('search-id').value;
        if (id) {
            loadProducts(id);
        } else {
            swal('Aviso', 'Por favor, insira um ID para pesquisar', 'info');
        }
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
        document.getElementById('search-id').value = '';
        loadProducts();
    });
});
