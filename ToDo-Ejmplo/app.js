const form = document.getElementById('formulario');
const input = document.getElementById('input');
const tasksList = document.getElementById('lista-tareas');
const template = document.getElementById('template').content;
const fragment = document.createDocumentFragment();
let tasks = {};

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('keyTasks')){
        tasks = JSON.parse(localStorage.getItem('keyTasks'));//De string a objeto
    };
    paintTask();
});

tasksList.addEventListener('click', (e) => {
    btnActions(e);
});

form.addEventListener('submit',e => {
    e.preventDefault();//Esto evita comportamiento por defecto de html (pasa rapido)
    // console.log(e.target[0].value);
    // console.log(e.target.querySelector('input').value);
    // console.log(input.value);
    setTask(e);
});

const setTask = (e) => {
    if(input.value.trim() === ''){
        alert('Estimado usuario, usted no ha digitado ninguna tarea 🤔');
        return;
    }

    const task = {
        id: Date.now(),
        task: input.value,
        status: false,
    };

    tasks[task.id] = {...task};//asi se crea el ID del objeto

    formulario.reset();//Luego de agregar, limpia el formulario.
    input.focus();
    paintTask();
};

const paintTask = () => {
    localStorage.setItem('keyTasks', JSON.stringify(tasks));//De objeto a string

    if(Object.keys(tasks).length === 0){
        tasksList.innerHTML = '<div class="alert alert-dark text-center ">No hay tareas pendientes 🤩</div>';
        return
    };
    tasksList.innerHTML = '';
    Object.values(tasks).forEach(element => {
        //console.log(element);
        const clone = template.cloneNode(true);
        clone.querySelector('p').textContent = `📌 ${element.task}`;
        if(element.status){
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary');
            clone.querySelectorAll('.fa-solid')[0].classList.replace('fa-circle-check', 'fa-rotate-left');
            clone.querySelector('p').textContent = `✔ ${element.task}`;
            clone.querySelector('p').style.textDecoration = 'line-through';
        };
        //Reservamos id para los onclick
        clone.querySelectorAll('.fa-solid')[0].dataset.id = element.id;
        clone.querySelectorAll('.fa-solid')[1].dataset.id = element.id;
        fragment.appendChild(clone);
    });
    tasksList.appendChild(fragment);
};

const btnActions = (e) => {
    if(e.target.classList.contains('text-success')){
        //console.log('Tachar tarea');
        tasks[e.target.dataset.id].status = true;
    }

    if(e.target.classList.contains('text-danger')){
       //console.log('Borrar tarea');
       delete tasks[e.target.dataset.id];
    }

    if(e.target.classList.contains('fa-rotate-left')){
        //console.log('Restautar tarea');
        tasks[e.target.dataset.id].status = false;
     }

    paintTask();
    e.stopPropagation();
};
