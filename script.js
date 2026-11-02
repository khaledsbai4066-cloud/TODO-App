
//DOM ELEMENTS
const dateElement = document.getElementById("date");
const taskInput = document.getElementById("todo-input");
const addTaskBtn = document.getElementById("add-BTN");
const filters = document.querySelectorAll(".filter");
const todosList = document.querySelector(".todolist");
const emptyState = document.querySelector(".no-list");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");

let todos=[]
let currentfilter="All"

addTaskBtn.addEventListener("click",() => addtodo(taskInput.value))
document.addEventListener("keydown" ,(e)=>{
    if(e.key === "Enter") addtodo(taskInput.value)
})

function  setDate(){
    const positions={weekday:"long",month:"short",day:"numeric"}
    const today=new Date()
    dateElement.textContent=today.toLocaleDateString("en-US",positions)
}


filters.forEach((filter) =>{
    filter.addEventListener("click",() =>setactivefilter(filter.getAttribute("data-filter")))

})


function setactivefilter(filter){
    currentfilter=filter
    filters.forEach((item) =>{
        if(item.getAttribute("data-filter") === filter){
            item.classList.add("active")
        }
        else{
            item.classList.remove("active")
        }
    })
   
    rendertodos()
}


clearCompletedBtn.addEventListener("click",deleteCOMPLETEDTodos)

function addtodo(text){
    if(text.trim() === ""){ 
        alert("please enter a task")
        return
    }
    const todo={
        id:Date.now(),
        text,
        completed:false
    }
    todos.push(todo)
    
    savetodos()
    rendertodos()
    taskInput.value=""
}
function savetodos(){
    localStorage.setItem("todos",JSON.stringify(todos))
    checktodocount()
    checkstate()
}


function checktodocount(){
    const uncompletedtodos=todos.filter((todo) => !todo.completed)
    itemsLeft.textContent=`${uncompletedtodos.length} item${
        uncompletedtodos.length !== 1 ? "s":""
    } left`
}



function filteredtodos(currentfilter){
    switch(currentfilter){
        case "Active":
            return todos.filter((todo) => !todo.completed)

        case "Completed":
            return todos.filter((todo) => todo.completed)
        default:
            return todos
    }
}


function  checkstate(){
    const filteredtodods=filteredtodos(currentfilter)
    if(filteredtodods.length === 0) emptyState.classList.remove("hidden")
    else{
     emptyState.classList.add("hidden")
    }
}
function rendertodos(){

    const todos=filteredtodos(currentfilter)
    todosList.innerHTML=""
    todos.forEach((todo) =>{
        const li=document.createElement("li")
        li.classList.add("todo-item")

        const label=document.createElement("label")
        label.classList.add("checkbox-container")

        const input=document.createElement("input")
        input.type="checkbox"
        input.classList.add("todo-checkbox")
        if(todo.completed) input.classList.add("checked")
        input.addEventListener("change",() =>Toggle(todo.id))

        const span=document.createElement("span")
        span.classList.add("checkmark")

        label.appendChild(input)
        label.appendChild(span)

        const text=document.createElement("span")
        text.textContent=todo.text
        text.classList.add("todo")
        if(todo.completed)  text.classList.add("checked")
        
        const button=document.createElement("button")
        button.classList.add("delete-btn")
        button.innerHTML=`<i class="fas fa-times"></i>`
        button.addEventListener("click",() =>deletetodo(todo.id))


        li.appendChild(label)
        li.appendChild(text)
        li.appendChild(button)

        todosList.appendChild(li)
    }) 
}


function deleteCOMPLETEDTodos(){
    todos=todos.filter((todo) => {return !todo.completed})
    savetodos()
    rendertodos()

}

function deletetodo(id){

     todos=todos.filter((todo) => todo.id !== id)
    savetodos()
    rendertodos()
}


function Toggle(id){
    todos=todos.map((todo) =>{
        if(todo.id === id){
            return {...todo,completed:!todo.completed}
        }
        return todo
    })
    savetodos()
    rendertodos()
}
function reload(){
    const savedtodos=localStorage.getItem("todos")
    if(savedtodos) todos=JSON.parse(savedtodos)
}

document.addEventListener("DOMContentLoaded",() =>{
    reload()
    setDate()
    checktodocount()
    
    

})

