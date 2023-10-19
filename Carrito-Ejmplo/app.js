const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content; //El .content es para acceder a los elementos del Template
const templateCarrito = document.getElementById('template-carrito').content; 
const templateFooter = document.getElementById('template-footer').content;
const fragment = document.createDocumentFragment();//Se utiliza para evitar en Reflow en la pagina
let dataCarrito = {};

//Espera carga completa del HTML
document.addEventListener('DOMContentLoaded', (e) => {
    fetchData();
    if(localStorage.getItem('carrito')){
        dataCarrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
});

//Delegacion de eventos
cards.addEventListener('click', (e) => {
    addCarrito(e);
});

items.addEventListener('click', (e) => {
    btnActions(e);//Acciones + -
});

const fetchData = async () => {
    try{
        const res = await fetch('api.json');//Espera a que se lea la info de api.json y luego carguemosla.
        const data = await res.json(); //Espera, que la respuesta viene en fotmato JSON
        pintarCards(data);
    }catch(err){
        console.log(err);
    }
}

const pintarCards = (data) => {
    //console.log(data);
    data.forEach(element => {//El forEach se usa para arrays
        templateCard.querySelector('h5').textContent = element.title;
        templateCard.querySelector('p').textContent = element.precio;
        templateCard.querySelector('img').setAttribute('src', element.thumbnailUrl);
        templateCard.querySelector('.btn-dark').dataset.id = element.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);//Ahora si se pinta el fragment
};

const addCarrito = (e) => {
    //console.log(e.target);
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation();
};

const setCarrito = (obj) => {
    //console.log(obj);
    const producto = {
        id: obj.querySelector('.btn-dark').dataset.id,
        title: obj.querySelector('h5').textContent,
        precio: obj.querySelector('p').textContent,
        cantidad: 1
    };

    if(dataCarrito.hasOwnProperty(producto.id)){
        producto.cantidad = dataCarrito[producto.id].cantidad + 1;
    }

    dataCarrito[producto.id] = {...producto};
    //console.log(dataCarrito);
    pintarCarrito();
};

const pintarCarrito = () => {
    //console.log(dataCarrito);
    items.innerHTML = '';//Hago esto para que se limpie el HTML, cuando escoja productos no se repetira el anterior.
    Object.values(dataCarrito).forEach(element => {
        templateCarrito.querySelector('th').textContent = element.id;
        templateCarrito.querySelectorAll('td')[0].textContent = element.title;
        templateCarrito.querySelectorAll('td')[1].textContent = element.cantidad;
        templateCarrito.querySelector('.btn-info').dataset.id = element.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = element.id;
        templateCarrito.querySelector('span').textContent = element.cantidad * element.precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);
    pintarFooter();

    //Guardamos en el storage para no perder la info si actualizamos la pagina.
    localStorage.setItem('carrito', JSON.stringify(dataCarrito));
};

const pintarFooter = () => {
    footer.innerHTML = '';
    if(Object.keys(dataCarrito).length === 0){
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
    }else{
        const totalCantidad = Object.values(dataCarrito).reduce((acum, {cantidad}) => acum + cantidad,0);
        const totalPrecio = Object.values(dataCarrito).reduce((acum, {cantidad,precio}) => acum + cantidad * precio,0);

        templateFooter.querySelectorAll('td')[0].textContent = totalCantidad;
        templateFooter.querySelector('span').textContent = totalPrecio;


        const clone = templateFooter.cloneNode(true);
        fragment.appendChild(clone);
        footer.appendChild(fragment);

        const btnVaciarCarrito = document.getElementById('vaciar-carrito');
        btnVaciarCarrito.addEventListener('click', (e) => {
            dataCarrito = {};
            pintarCarrito();
            e.stopPropagation();
        });
    };
    //console.log(`Items: ${totalCantidad} Costo: ${totalPrecio}`);
};

const btnActions = (e) => {
    const product = dataCarrito[e.target.dataset.id];
    if(e.target.classList.contains('btn-info')){
        product.cantidad++; //product.cantidad = dataCarrito[e.target.dataset.id].cantidad + 1;
        dataCarrito[e.target.dataset.id] = {...product};
        pintarCarrito();
    };
    if(e.target.classList.contains('btn-danger')){
        product.cantidad--; 
        if(product.cantidad === 0){
            delete dataCarrito[e.target.dataset.id];
        }else{dataCarrito[e.target.dataset.id] = {...product}};
        pintarCarrito();
    };
    e.stopPropagation();
};