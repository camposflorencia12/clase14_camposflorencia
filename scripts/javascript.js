let cart = [];
let total = 0;
const URLPOST   = "https://jsonplaceholder.typicode.com/posts"
const infoPost =  { nombre: "ANAHATA", mensaje: "Muchas gracias por elegir nuestros productos!", redireccion: "Serás redireccionado a nuestro chat de WhatsApp para concluir la compra ;)" }

$(function () {
    function addToCart(e) {
    const button = e.target;
    const item = button.closest(".card");
    const itemName = item.querySelector(".card-title").textContent;
    const itemPrice = item.querySelector(".price").textContent;
    const itemImg = item.querySelector(".card-img-top").src;
    const newItem = {
      name: itemName,
      price: itemPrice,
      img: itemImg,
      quantity: 1,
    };
    addItemToCart(newItem);
  }

  const tbody = document.querySelector(".tbody");
  function addItemToCart(newItem) {
    const inputElement = tbody.getElementsByClassName("input__element");
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].name.trim() === newItem.name.trim()) {
        cart[i].quantity++;
        const inputValue = inputElement[i];
        inputValue.value++;
        cartAmount();
        return null;
      }
    }
    cart.push(newItem);
    renderCart();
  }

  function renderCart() {
    tbody.innerHTML = "";
    cart.map((item) => {
     const tr = document.createElement("tr");
      tr.classList.add("cartItem");
      const content = `
        <th scope="row">o</th>
        <td class="table__productos">
          <img src=${item.img} width="50" height="50" alt="">
          <h6 class="title">${item.name}</h6>
        </td>
        <td class="table__precio"><p>${item.price}</p></td>
        <td class="table__cantidad">
          <input type="number" min="1" value=${item.quantity} class="input__element">
          <button class="delete btn btn-danger">x</button>
        </td>
        `;
      tr.innerHTML = content;
      tbody.appendChild(tr);
      tr.querySelector(".delete").addEventListener("click", removeCartItem);
      tr.querySelector(".input__element").addEventListener("change", quantitySum);
    });
    cartAmount();
  }

  function cartAmount() {
    total = 0;
    const totalCartItem = document.querySelector(".totalCartItem");
    cart.forEach((item) => {
      const price = Number(item.price.replace("$", ""));
      total = total + price * item.quantity;
    });
    totalCartItem.innerHTML = `Total $${total}`;
    addLocalStorage();
  }

  function removeCartItem(e) {
    const deleteButton = e.target;
    const tr = deleteButton.closest(".cartItem");
    const name = tr.querySelector(".title").textContent;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].name.trim() === name.trim()) {
        cart.splice(i, 1);
      }
    }
    const alert = document.querySelector(".remove");
    setTimeout(function () {
      alert.classList.add("remove");
    }, 2500);
    alert.classList.remove("remove");
    tr.remove();
    cartAmount();
  }

  function quantitySum(e) {
    const inputSum = e.target;
    const tr = inputSum.closest(".cartItem");
    const name = tr.querySelector(".title").textContent;
    cart.forEach((item) => {
      if (item.name.trim() === name) {
        inputSum.value < 1 ? (inputSum.val() = 1) : inputSum.value;
        item.quantity = inputSum.value;
        cartAmount();
      }
    });
  }

  function addLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(cart));
  }

  window.onload = function () {
    const storage = JSON.parse(localStorage.getItem("carrito"));
    if (storage) {
      cart = storage;
      renderCart();
    }
  };

  function buy() {
    $('#delivery').append(`
    <div>
      <div class="custom-control custom-checkbox">
          <input type="checkbox" class="checkBox1 custom-control-input" id="customCheck1">
          <label class="custom-control-label" for="customCheck1">Quiero el envío!</label>
      </div>
      <div class="custom-control custom-checkbox">
          <input type="checkbox" class="checkBox3 custom-control-input" id="customCheck3">
          <label class="custom-control-label" for="customCheck3">Tilda para visualizar el monto de tu compra ;)</label>
      </div>
    </div>
        `)

    $('.finalInfo').show();
    $('#delivery div').addClass("cartItem");

    const customCheck1 = document.getElementById('customCheck1');
    customCheck1.addEventListener("change", comprueba, false);
    function comprueba (){
      if(customCheck1.checked){
        addDeliveryCost();
      }else{
        notAddDeliveryCost();
      }
    }

    $('.checkBox3').change(cartAmounta);
    $('#btnBuy').prop('disabled', true);   
    $('#emptyCart').prop('disabled', true); 
  }

  function addDeliveryCost() {
    let deliveryCost = 250;
    total = total + deliveryCost;
    const buyAmount = document.querySelector(".buyAmount");
    buyAmount.innerHTML = `El total de tu compra es: $${total}`;
  }  

  function notAddDeliveryCost() {
    let deliveryCost = 250;
    total = total - deliveryCost;
    const buyAmount = document.querySelector(".buyAmount");
    buyAmount.innerHTML = `El total de tu compra es: $${total}`;
  } 

  function cartAmounta() {
    total = total;
    const buyAmount = document.querySelector(".buyAmount");
    buyAmount.innerHTML = `El total de tu compra es: $${total}`;
  }

  function emptyCart (){
    cart = [];
    renderCart();
    $('#btnBuy').prop('disabled', false);   
    cartAmounta();
  }
   
  $('.buttonAdd').click(addToCart);
  $('.btn').click( () => $('.carritoCompras').show());
  $('#btnBuy').click(buy);
  $('#btnBuy').click( () => $('.totalCartItem').hide());
  $('#btnBuy').click( () => $('.endRefresh').show());
  $('#emptyCart').click(emptyCart);
  $('.buttonAdd').on('click', () => 
    $('.hide').fadeIn("slow", () => $('.hide').fadeOut(2000)));
  $('.delete').on('click', () => 
    $('.remove').fadeIn("slow", () => $('.remove').fadeOut(2000)));
  $('#message').click(() => { 
    $.post(URLPOST, infoPost ,(respuesta, estado) => {
        if(estado === "success"){
          $('#endMessage').append(`
          <div>
            <div class="card-header">
                    ${respuesta.nombre}
            </div>
            <div class="card-body">
              <h5 class="card-title">${respuesta.mensaje}</h5>
              <p class="card-text">${respuesta.redireccion}</p>
            </div>
            <div class="card-footer text-muted">
              <a class="reload" href="https://www.whatsapp.com/" rel="noopener noreferrer" target="_blank">Aceptar</a>
            </div>
          </div>`);
          }  
      });
      $('#message').prop('disabled', true); 
  });
  
});


