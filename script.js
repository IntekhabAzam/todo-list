// grab all elements 
const nameInput = document.querySelector("#name")
const todoForm = document.querySelector(".todo-form")
const todoList = document.querySelector("#todo-list")
const doneCheckbox = document.querySelector("todo-item label input")

let todoArr = getItems();

// local storage
function getItems(){
    let storage = JSON.parse(localStorage.getItem("todo")) || [];
    return storage
}

function setItems(todoArr){
    localStorage.setItem("todo", JSON.stringify(todoArr));
}

function displayUsername() {
    const username = localStorage.getItem('username') || '';
    nameInput.value = username;
}

// display the todo in the DOM;
function displayData(){

    let displayData = todoArr.map((item) => {
        return `
        <div class="todo-item ${item.done ? "done" : ""}">
            <label>
                <input type="checkbox" ${item.done ? "checked" : ""}>
                <span class="bubble ${item.category} checkbox" data-check=${item.id}></span>
            </label>
            <div class="todo-content">
                <input type="text" value="${item.content}" readonly data-content=${item.id} />
            </div>
            <div class="actions">
                <i class="fa-regular fa-pen-to-square edit" data-edit = ${item.id}></i>
                <i class="fa-regular fa-trash-can delete" data-delete = ${item.id}></i>
            </div>
        </div>`
    });
    todoList.innerHTML = displayData.join(""); 
}

function doneTodo(id) {
    todoArr = todoArr.map(item => (
        {
            ...item,
            done: item.id == id ? !item.done : item.done
        }
    ))
    setItems(todoArr)
    displayData()
}

function editTodo(editId) {
    const editInput = document.querySelector(`[data-content="${editId}"]`);
    editInput.removeAttribute('readonly')
    editInput.focus();

    editInput.addEventListener('blur', (e) => {
        editInput.setAttribute('readonly', true);
        todoArr = todoArr.map(item => (
            {
                ...item,
                content: item.id == editId ? e.target.value : item.content
            }
        ))
        setItems(todoArr)
        displayData()
    })
}

function removeArrayTodo(id){
    todoArr = todoArr.filter((item) => item.id !== +id);
    setItems(todoArr);
}

function todoOperations(){
    todoList.addEventListener("click", (e) => {

        const classList = e.target.classList;
        const dataset = e.target.dataset;

        if(classList.contains("checkbox")){
            doneTodo(dataset.check)
        }

        if(classList.contains("delete")){
            e.target.parentElement.parentElement.remove();
            removeArrayTodo(dataset.delete);
        }

        if(classList.contains("edit")) {
            editTodo(dataset.edit)
        }
    });
}

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const todo = {
        content: e.target.elements.content.value,
        category: e.target.elements.category.value,
        done: false,
        id: new Date().getTime()
    };
    todoArr = [...todoArr, todo];
    e.target.reset();
    displayData();
    // //add to storage
    setItems(todoArr);
});

nameInput.addEventListener("change", e => localStorage.setItem('username', e.target.value))

window.addEventListener("DOMContentLoaded", () => {
    
    displayUsername();
    displayData();
    // //remove from the dom
    todoOperations();
});