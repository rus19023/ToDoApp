import { readFromLS, writeToLS } from "./ls.js";
import { qs, createLMNT, setFooter, onTouch } from "./utilities.js";

// // make some waves.
// var ocean = document.getElementById("ocean"),
//     waveWidth = 10,
//     waveCount = Math.floor(window.innerWidth/waveWidth),
//     docFrag = document.createDocumentFragment();

// for(var i = 0; i < waveCount; i++){
//   var wave = document.createElement("div");
//   wave.className += " wave";
//   docFrag.appendChild(wave);
//   wave.style.left = i * waveWidth + "px";
//   wave.style.AnimationDelay = (i/100) + "s";
// }
// ocean.appendChild(docFrag);

let todoList = [];
const listkey = 'items';
var customtasks = [
    "Push changes to github more often, whenever something is working, commit and push it. You never know when something might go wrong...it's better to be safe with a backup than sorry."
];

export default class Todolist {
    // a class needs a constructor
    constructor(parentId) {
        this.taskCount = 0;
        this.parentId = parentId;
        this.listname = listkey;
        this.todoList = [];
        this.todo_error = 'text set in constructor';
        this.sortval = 'time';
        this.filter = 'all';
        this.searchTerm = qs('#srchinput');
        this.srchbtn = qs('#srchbtn');
        this.allbtn = qs('#allbtn');
        this.pendbtn = qs('#pendbtn');
        this.donebtn = qs('#donebtn');
        this.addbtn = qs('#addbtn');
        this.srchbtn2 = qs('#srchbtn2');
        this.alphabtn = qs('#alpha');
        this.catbtn = qs('#cat');
        this.timebtn = qs('#time');
        //this.srchbtn = onTouch(this.srchbtn, () => this.listFiltered());
        this.srchbtn.addEventListener('click', () => { this.listFiltered(); }, false);
        this.srchbtn2.addEventListener('click', () => { this.listFiltered(); }, false);
        //this.addbtn.onTouch(), this.addTodo();
        this.addbtn.addEventListener('click', () => { this.addTodo(); }, false);
        this.allbtn.addEventListener('click', () => { this.listAll(); }, false);
        this.pendbtn.addEventListener('click', () => { this.listPending(); }, false);
        this.donebtn.addEventListener('click', () => { this.listDone(); }, false);
        this.alphabtn.addEventListener('click', () => { this.setSortTerm(); }, false);
        this.catbtn.addEventListener('click', () => { this.setSortTerm(); }, false);
        this.timebtn.addEventListener('click', () => { this.setSortTerm(); }, false);
    }

    // TODO:  add functionality to choose from listnames or just filter on category?
    async listAll() {
        this.filter = 'all';
        this.todolist = await this.getList(this.listname);
        this.renderTodoList(this.todoList, 'todos');
    }

    async getList(listname) {
        this.todoList = await getTodos(listname);
    }

    async listPending() {
        this.filter = 'pending';
        this.todolist = await this.getList(this.listname);
        this.todoList = this.todoList.filter(el => !el.done);
        this.renderTodoList(this.todoList, 'todos');
    }

    async listDone() {
        this.filter = 'done';
        this.todolist = await this.getList(this.listname);
        this.todoList = this.todoList.filter(el => el.done);
        this.renderTodoList(this.todoList, 'todos');
    }

    async listFiltered() {
        this.todolist = await this.getList(this.listname);
        this.searchTerm = qs("#srchinput").value;
        let newlist = [];
        this.todoList.forEach((field) => {
            if ((field.task.toLowerCase().includes(this.searchTerm.toLowerCase())) || (field.category.toLowerCase().includes(this.searchTerm.toLowerCase()))) {
                newlist.push(field);
            }
        });
        // Save filtered list to property
        this.todoList = newlist;
        // Display filtered and sorted list
        this.renderTodoList(this.todoList, 'todos');
        // Show item stats for filtered list
        this.itemsLeft(this.searchTerm);
    }

    // function to show how many items are in the current todo list
    itemsLeft(filter) {
        const itemcount = this.todoList.length;
        let t;
        if (itemcount === 1) {
          t = ' list item ';
        } else if ((itemcount > 1) || (itemcount === 0)) {
          t = ' list items ';
        }
        let tasktext = '';
        let done = this.todoList.filter(item => item.done === true).length;
        let pending = (itemcount - done);
        switch (filter) {
            case ('all'):
                tasktext = 'Pending: ' + pending +  t + ', Done: ' + done + t;
                this.allbtn.classList.add('todobordered');
                this.srchbtn.classList.remove('todobordered');
                this.pendbtn.classList.remove('todobordered');
                this.donebtn.classList.remove('todobordered');
                break;

            case ('pending'):
                tasktext = `Pending: ${pending} ${t}`;
                this.pendbtn.classList.add('todobordered');
                this.allbtn.classList.remove('todobordered');
                this.pendbtn.classList.remove('todobordered');
                this.donebtn.classList.remove('todobordered');
                break;

            case ('done'):
                tasktext = `Done: ${done} ${t}`;
                this.donebtn.classList.add('todobordered');
                this.allbtn.classList.remove('todobordered');
                this.pendbtn.classList.remove('todobordered');
                this.srchbtn.classList.remove('todobordered');
                break;

            default:
                tasktext = `Search: ${itemcount} ${t} found for "${filter}"`;
                this.srchbtn.classList.add('todobordered');
                this.allbtn.classList.remove('todobordered');
                this.pendbtn.classList.remove('todobordered');
                this.donebtn.classList.remove('todobordered');
                break;
        }
        qs("#tasks").innerHTML = tasktext;
        setFooter();
    }

    addCustomTodos = () => {
        // function to add Custom todos to the todo list from an array of objects
        // TODO: get from JSON file or API or firebase/mongodb
        let runlist = false;
        let mytasks = getTodos(this.listname);
        if (mytasks.length == 0) { runlist = true; }
        if (runlist) {
            customtasks.forEach(citem => {
                // loop through list from variable and add to localStorage
                // be sure item is not null/blank, if so, give user a message to enter some text
                if (!citem.length > 0) {
                    let cat = 'From custom todos'
                    this.todo_error = 'Item cannot be blank, there is an error in the input file.';
                    qs("#todo-error").innerText = this.todo_error;
                } else {
                    // check if task is not already in the list
                    let match = customtasks.filter((citem) => (citem.task === citem));
                    // add new item if "citem" is not already in the storage "items"
                    if (match = [] || match == null) {
                        saveTodo(cat, citem, this.listname, this.sortval);
                        customtasks = customtasks.filter((citem) => (!citem.task === citem));
                    }
                    this.listAll();
                }
            })
            runlist = false;
        }
    }

    addTodo() {
        // Clear error message
        this.todo_error = '';
        // Get current error message
        qs("#todo-error").innerText = this.todo_error;
        // grab todo from input field
        const task = qs("#addinput");
        let category = qs("#catinput").value;
        console.log(`category: ${category}`);
        if (category.length == 0) {
            category = 'General';
        } else {
            this.taskCount++;
            if (this.taskCount < 9) {
                category;//  += '-0' + this.taskCount.toString();
            } else {
                category;//  += '-'+ this.taskCount.toString();          
            }
        }
        if (task.length == 0) { task.push('Custom to do list item'); }
        if (!task.value.length > 0) {
            this.todo_error = 'Item cannot be blank, please enter your todo.';
            qs("#todo-error").innerText = this.todo_error;
        } 
        else if (!task.value.length > 5) {
            this.todo_error = 'Item must be longer than 5 characters, please enter your todo.';
            qs("#todo-error").innerText = this.todo_error;
        } 
        else {
        console.log("inside addTodo, just before saveTodo");
        console.log(`category: ${category}`);
        console.log(`task.value: ${task.value}`);
            saveTodo(category, task.value); 
            qs("#addinput").value = '';
        }
        this.renderTodoList(this.todoList, 'todos');
    }

    renderTodoList(renderlist, parentElName) {
        this.sortList(renderlist);
        // build new display
        const parentEl = qs(`#${parentElName}`);
        parentEl.innerText = '';
        renderlist.forEach((field) => {
            // create new list item
            //                   createLMNT(LMNT, LMNTtype, LMNTid, LMNTtext, LMNTclass)
            let item = createLMNT('div', '', field.id, '', ' todobordered listitem nodots');            
            let itemtext = createLMNT("p", "", "", `${field.category}: ${field.task}`, "todo-text task ");
            //let markbox = createLMNT('label', `lbl${field.id}`, '', '', 'bordered markbtn');
            let markbtn = createLMNT("input", "checkbox", `mark${field.id}`, "", "itembtns markbtn chkbtn"); //  "✕"
            let delbtn = createLMNT("button", "button", `del${field.id}`, "✕", "btns itembtns delbtn chkbtn");
            let editbtn = createLMNT("button", "button", `edit${field.id}`, "Edit", "btns itembtns editbtn chkbtn");
            //let editicon = createLMNT("img", "", "", "", "editicon");
            //editicon.setAttribute('src', '../img/icons8-edit-30.png');

            // Done tasks show as "scratched out or lined out"
            if (field.done === true) {
                itemtext.classList.add("todo-scratch");
                markbtn.classList.add('markbtnX');
                markbtn.checked = true;
            } else {
                markbtn.checked = false;
                markbtn.classList.remove('markbtnX');
                itemtext.classList.remove("todo-scratch");
            }
            item.appendChild(markbtn);
            item.appendChild(itemtext);
            item.appendChild(delbtn);
            item.appendChild(editbtn);
            parentEl.appendChild(item);
        });        
        this.itemsLeft(this.filter);
        this.checkBtn();
    }

    checkBtn() {
        let btnitems = Array.from(document.querySelectorAll('.chkbtn'));
        btnitems.forEach((item) => {
            item.addEventListener('click', function(e) {
                const btnid = e.target.getAttribute('id');
                // check if the event is a checkbox
                if (e.target.type === 'checkbox') {
                    // get id from button id value and toggle the state
                    markDone(btnid);
                    this.renderTodoList(this.todoList, 'todos');
                }
                // check if that is a delete-button
                if (e.target.classList.contains('delbtn')) {
                    // get id from button id value and delete it
                    let btnidsub = btnid.substring(3, btnid.length);
                    deleteTodo(btnidsub);
                    this.renderTodoList(this.todoList, 'todos');
                }
                if (e.target.classList.contains('editbtn')) {
                    // get id from button id value and use it to find the item to edit
                    let btnidsub = btnid.substring(4, btnid.length);
                    editTodo(btnidsub);
                    this.renderTodoList(this.todoList, 'todos');
                }
            });
        });
    }

    setSortTerm() {
        var ele = document.getElementsByName('sort');          
        for(let i = 0; i < ele.length; i++) {
            if(ele[i].checked) {
                this.sortval = ele[i].value; 
                console.log(`this.sortval: ${this.sortval}`);               
            }
        }
        this.renderTodoList(this.todoList, 'todos');
    }

    sortList(list) {      
        if (this.sortval === "alpha") {
            list.sort(function(a, b) {
                if (a.task < b.task) { return -1; }
                if (a.task > b.task) { return 1; }
                return 0;
            });
        } 
        else if (this.sortval === "time") {
            list.sort(function(a, b) {
                if (a.id < b.id) { return -1; }
                if (a.id > b.id) { return 1; }
                return 0;
            });
        } 
        else if (this.sortval === "cat") {
            list.sort(function(a, b) {
                console.log('a.category: ', a.category);
                if (a.category + a.task < b.category + b.task) { return -1; }
                if (a.category + a.task > b.category + b.task) { return 1; }
                return 0;
            });
        }
    }
}

/*  END OF CLASS  */

function getTodos(listkey) {
    return JSON.parse(readFromLS(listkey)) || [];
}

function saveTodo(cat, todo) {
    // read current todo list from local storage
    console.log(`listkey: ${listkey}`)
    let todoList = getTodos(listkey);
    // build todo object
    const newItem = { id: `${Date.now()}`, task: todo, done: false, category: cat };  // prequel for task: todo.length + " " +
    // add obj to todoList
    todoList.push(newItem);
    // save JSON.stringified list to ls
    writeToLS(listkey, JSON.stringify(todoList));
}

function editTodo(id) {
    let todoList = getTodos(listkey);
    let item = todoList.find(el => el.id === id);
    let newCat = prompt("Edit category", item.category);
    let newTask = prompt("Edit task", item.task);
    item.task = newTask;
    item.category = newCat;
    writeToLS(listkey, JSON.stringify(todoList));
    location.reload();
}

function markDone(id) {
    todoList = getTodos(listkey);
    todoList.forEach(function(item) {
        // use == (not ===) because here types are different. One is number and other is string
        if (`mark${item.id}` == id) {
          // toggle the value
          item.done = !item.done;
        }
    });
    // save modified JSON.stringified list to ls
    writeToLS(listkey, JSON.stringify(todoList));
    location.reload();
}

function deleteTodo(id) {
    // console.log(`id: ${id}`)
    // console.log(`listkey: ${listkey}`)
    todoList = getTodos(listkey);
    const filtered = todoList.filter(item => item.id != id);
    // save JSON.stringified list to ls
    writeToLS(listkey, JSON.stringify(filtered));
    location.reload();
}
