import { readFromLS, writeToLS } from "./ls.js";
import { qs, createLMNT, setFooter, gd, se } from "./utilities.js";

// // make some waves.
 var ocean = document.getElementById("ocean"),
     waveWidth = 10,
     waveCount = Math.floor(window.innerWidth/waveWidth),
     docFrag = document.createDocumentFragment();

 for(var i = 0; i < waveCount; i++){
   var wave = document.createElement("div");
   wave.className += " wave";
   docFrag.appendChild(wave);
   wave.style.left = i * waveWidth + "px";
   wave.style.AnimationDelay = (i/100) + "s";
 }
 ocean.appendChild(docFrag);

let goalList = [];
const listkey = 'items';
var customtasks = [
    "Push changes to github more often, whenever something is working, commit and push it. You never know when something might go wrong...it's better to be safe with a backup than sorry."
];

export default class GoalList {
    // a class needs a constructor
    constructor(parentId) {
        this.taskCount = 0;
        this.parentId = parentId;
        this.listname = listkey;
        this.goalList = [];
        this.goal_error = '';
        this.sortval = 'time';
        this.filter = 'all';
        this.searchTerm = qs('#srchinput');
        this.srchbtn = qs('#srchbtn');
        this.allbtn = qs('#allbtn');
        this.pendbtn = qs('#pendbtn');
        this.donebtn = qs('#donebtn');
        this.addbtn = qs('#addbtn');
        //this.srchbtn2 = qs('#srchbtn2');
        this.alphabtn = qs('#alpha');
        this.catbtn = qs('#cat');
        this.timebtn = qs('#time');
        this.srchbtn.addEventListener('click', () => { this.listSearchFiltered(); }, false);
        //this.addbtn.onTouch(), this.addGoal();
        this.addbtn.addEventListener('click', () => { this.addGoal(); }, false);
        this.allbtn.addEventListener('click', () => { this.listAll(); }, false);
        this.pendbtn.addEventListener('click', () => { this.listPending(); }, false);
        this.donebtn.addEventListener('click', () => { this.listDone(); }, false);
        this.alphabtn.addEventListener('click', () => { this.setSortTerm(); }, false);
        this.catbtn.addEventListener('click', () => { this.setSortTerm(); }, false);
        this.timebtn.addEventListener('click', () => { this.setSortTerm(); }, false);
    }

    // TODO:  add functionality to choose from listnames or just filter on category?
    async listAll() {
        this.filter = 'All';
        this.goallist = await this.getList(this.listname);
        this.renderList(this.goalList, 'goals');
    }

    async getList(listname) {
        this.goalList = await getGoals(listname);
    }

    async listPending() {
        this.filter = 'Working on it';
        this.goallist = await this.getList(this.listname);
        this.goalList = this.goalList.filter(el => !el.done);
        this.renderList(this.goalList, 'goals');
    }

    async listDone() {
        this.filter = 'Achieved';
        this.goallist = await this.getList(this.listname);
        this.goalList = this.goalList.filter(el => el.done);
        this.renderList(this.goalList, 'goals');
    }

    async listSearchFiltered() {
        this.goallist = await this.getList(this.listname);
        this.searchTerm = qs("#srchinput").value;
        let newlist = [];
        // Check for missing search term entry
        while (this.searchTerm === "" || this.searchTerm.length < 3) {
            this.searchTerm = qs("#srchinput").value;
            let searchError = qs("#searcherror");
            se('Search term is too short, please enter more characters', searchError);
        }
        this.goalList.forEach((goal) => {
            if ((goal.task.toLowerCase().includes(this.searchTerm.toLowerCase())) || (goal.category.toLowerCase().includes(this.searchTerm.toLowerCase()))) {
                newlist.push(goal);
            }
        });
        // Save filtered list to property
        this.goalList = newlist;
        // Display filtered and sorted list
        this.renderList(this.goalList, 'goals');
        // Show item stats for filtered list
        this.itemsLeft(this.searchTerm);
    }

    // function to show how many items are in the current list
    itemsLeft(filter) {
        const itemcount = this.goalList.length;
        let t;
        if (itemcount === 1) {
          t = ' GOAL ';
        } else if ((itemcount > 1) || (itemcount === 0)) {
          t = ' GOALS ';
        }
        let goaltext = '';
        let done = this.goalList.filter(item => item.done === true).length;
        let pending = (itemcount - done);
        switch (filter) {
            case ('All'):
                goaltext = `${pending} ${t} TO WORK ON, ${done} ${t} ACHIEVED!`;
                this.allbtn.classList.add('goalbordered');
                this.srchbtn.classList.remove('goalbordered');
                this.pendbtn.classList.remove('goalbordered');
                this.donebtn.classList.remove('goalbordered');
                break;

            case ("Working on it"):
                goaltext = `${pending} ${t} TO WORK ON`;
                this.pendbtn.classList.add('goalbordered');
                this.allbtn.classList.remove('goalbordered');
                this.pendbtn.classList.remove('goalbordered');
                this.donebtn.classList.remove('goalbordered');
                break;

            case ('Achieved'):
                goaltext = `${done} ${t} ACHIEVED!`;
                this.donebtn.classList.add('goalbordered');
                this.allbtn.classList.remove('goalbordered');
                this.pendbtn.classList.remove('goalbordered');
                this.srchbtn.classList.remove('goalbordered');
                break;

            default:
                goaltext = `Search: ${itemcount} ${t} found for "${filter}"`;
                this.srchbtn.classList.add('goalbordered');
                this.allbtn.classList.remove('goalbordered');
                this.pendbtn.classList.remove('goalbordered');
                this.donebtn.classList.remove('goalbordered');
                break;
        }
        qs("#tasks").innerHTML = goaltext;
        setFooter();
    }

    addCustomTodos = () => {
        // function to add Custom todos to the todo list from an array of objects
        // TODO: get from JSON file or API or firebase/mongodb
        let runlist = false;
        let mytasks = getGoals(this.listname);
        if (mytasks.length == 0) { runlist = true; }
        if (runlist) {
            customtasks.forEach(citem => {
                // loop through list from variable and add to localStorage
                // be sure item is not null/blank, if so, give user a message to enter some text
                if (!citem.length > 0) {
                    let cat = 'From custom todos'
                    this.goal_error = 'Item cannot be blank, there is an error in the input file.';
                    qs("#goal-error").innerText = this.goal_error;
                } else {
                    // check if task is not already in the list
                    let match = customtasks.filter((citem) => (citem.task === citem));
                    // add new item if "citem" is not already in the storage "items"
                    if (match = [] || match == null) {
                        saveGoal(cat, citem);
                        customtasks = customtasks.filter((citem) => (!citem.task === citem));
                    }
                    this.listAll();
                }
            })
            runlist = false;
        }
    }

    // // Gets input from the given element and checks for length of text entered (must be at least 3 characters)
    // chkLength = (input) => {
    //     //debugger;
    //     // grab input from form
    //     let getInput = qs(input);
    //     console.log("getInput: ", getInput);
    //     if (getInput.length > 0) { 
    //         getInput = getInput.value; 
    //         console.log("getInput: ", getInput);
    //     }
    //     //console.log("getInput: ", getInput);
    //     // get input name from params minus the '#' to display in error for user
    //     let inputName = input.substring(1, input.length);
    //     console.log("inputName: ", inputName);
    //     if (getInput.length < 3) {
    //         let errorEl = qs('#goal-error');
    //         errorEl.innerText = `${inputName} too short, please enter longer text for ${inputName}.`;
    //         return '';
    //     } else {
    //         return getInput;
    //     }
    // }

    getListHeading(sort, filter) {
        let title = `My Goals\n ${filter} sorted by ${sort}`;
        let titleEl = qs('#header1');
        titleEl.innerText = title;
    }

    addGoal() {
        // grab category input from add goal form
        const catText = qs('#catinput');
        // check if category input is blank
        if (catText.value.length === 0) {
            // if it's blank, set it to 'General'
            catText.value = 'General';
        } 
        // else 
        // {
        //     // not blank, add a goal number, my preference only
        //     this.goalCount++;
        //     if (this.goalCount < 9) {
        //         catText;//  += '-0' + this.goalCount.toString();
        //     } else {
        //         catText;//  += '-'+ this.goalCount.toString();          
        //     }
        // }
    
        // check for goal input not blank
        const goal = qs('#goalinput');
        //if (goal.length == 0) { goal.push('Custom goal'); }
            // goal is ok, add to list for storage with others
            saveGoal(catText.value.toUpperCase(), goal.value);
        // display the list on screen
        console.log(`this.goalList: ${this.goalList}`);
        this.renderList(this.goalList, 'goals');
    }

    renderList(renderlist, parentElName) {
        console.log('renderList() invoked');
        // sort list of tasks
        this.sortList(renderlist);
        // build new display
        const parentEl = qs(`#${parentElName}`);
        parentEl.innerText = '';
        renderlist.forEach((goal) => {
            // create new item line
            // createLMNT(LMNT, type, id, text, class)
            const item = createLMNT('div', '', goal.id, '', 'listitem nodots');
            // get date from goal.id
            const itemtext = createLMNT("p", "", "", `${gd(goal.id)}\n ${goal.category.toUpperCase()}: ${goal.task}`, "todo-text task");
            // const markbtn = createLMNT("input", "checkbox", `mark${goal.id}`, "", "itembtns markbtn chkbtn"); //  "✕"

            const markbtn = createLMNT("button", "button", `mark${goal.id}`, "Done", "itembtns markbtn chkbtn");
            const editbtn = createLMNT("button", "button", `edit${goal.id}`, "Edit", "itembtns editbtn chkbtn");
            const delbtn = createLMNT("button", "button", `del${goal.id}`, "✕", "itembtns delbtn chkbtn"); 
            //"✕"

            // Done tasks show as "scratched out or lined out"
            if (goal.done === true) {
                // Mark the goal text as scratched-out                
                itemtext.classList.add("todo-scratch");                
                // Change button text                
                markbtn.innerText = 'Undo';                
                // Change color of text and border                
                markbtn.classList.add('markbtnX');                
                markbtn.classList.remove('undone');                
                //markbtn.checked = true;                
            } else {                
                // Change button text                
                markbtn.innerText = 'Done';                
                // Remove scratched-out style                
                itemtext.classList.remove("todo-scratch");                
                // Change color of text and border                
                markbtn.classList.remove('markbtnX');                
                markbtn.classList.add('undone');                
                //markbtn.checked = false;                
            }
            item.appendChild(markbtn);
            item.appendChild(itemtext);
            item.appendChild(delbtn);
            item.appendChild(editbtn);
            parentEl.appendChild(item);
        });        
        this.itemsLeft(this.filter);
        this.getListHeading(this.sortval, this.filter);
        this.checkBtn();
        console.log('renderList() end');
    }

    checkBtn() {
        let btnitems = Array.from(document.querySelectorAll('.chkbtn'));
        btnitems.forEach((item) => {
            item.addEventListener('click', function(e) {
                const btnid = e.target.getAttribute('id');
                // check if the event is a checkbox
                if (e.target.classList.contains('markbtn')) {
                    // get id from button id value and delete it
                    console.log(btnid);
                    let markbtnID = btnid.substring(4);
                    markDone(markbtnID);
                }
                // check if that is a delete-button
                if (e.target.classList.contains('delbtn')) {
                    // get id from button id value and delete it
                    let delbtnID = btnid.substring(3);
                    deleteGoal(delbtnID);
                }
                if (e.target.classList.contains('editbtn')) {
                    // get id from button id value and use it to find the item to edit
                    let editbtnID = btnid.substring(4);
                    editGoal(editbtnID);
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
        this.renderList(this.goalList, 'goals');
    }

    sortList(list) {      
        if (this.sortval === "Goal") {               
            console.log('sortval === alpha invoked');
            list.sort(function(a, b) {
                if (a.task < b.task) { return -1; }
                if (a.task > b.task) { return 1; }
                return 0;
            });
        } 
        else if (this.sortval === "Date") {               
            console.log('sortval === time invoked');
            list.sort(function(a, b) {
                if (a.id < b.id) { return -1; }
                if (a.id > b.id) { return 1; }
                return 0;
            });
        } 
        else if (this.sortval === "Category") {
            list.sort(function(a, b) {                
                console.log('sortval === cat invoked');
                console.log('a.category: ', a.category);
                if (a.category + a.task < b.category + b.task) { return -1; }
                if (a.category + a.task > b.category + b.task) { return 1; }
                return 0;
            });
        }
    }
}

/*  END OF CLASS  */

function getGoals(listkey) {
    return JSON.parse(readFromLS(listkey)) || [];
}

function saveGoal(cat, goal) {

    console.log('saveGoal() invoked');
    // read current goal list from local storage
    console.log(`listkey: ${listkey}`);
    let goalList = getGoals(listkey);
    console.log(`goalList: ${goalList}`);
    // build goal object
    const newItem = { 
        id: `${Date.now()}`, 
        task: goal, 
        done: false, 
        category: cat
    };  // prequel for task: goal.length + " " +
    // add obj to goalList
    console.log(`newItem: ${newItem}`);
    let goalListLen = goalList.length;
    console.log(`goalListLen: ${goalListLen}`);
    goalList.push(newItem);
    goalListLen = goalList.length;
    console.log(`goalListLen: ${goalListLen}`);
    console.log(`goalList: ${goalList}`);
    // save JSON.stringified list to ls
    writeToLS(listkey, JSON.stringify(goalList));
    //location.reload();
}

function editGoal(id) {
    let goalList = getGoals(listkey);
    let item = goalList.find(el => el.id === id);
    let newCat = prompt("Edit category", item.category);
    let newTask = prompt("Edit task", item.task);
    item.task = newTask;
    item.category = newCat;
    writeToLS(listkey, JSON.stringify(goalList));
    location.reload();
}

function markDone(id) {
    console.log('markDone() invoked');
    console.log('id: ', id);
    let goalList = getGoals(listkey);
    goalList.forEach(function(item) {
        // use == (not ===) because here types are different. One is number and other is string
        if (`${item.id}` == id) {
          // toggle the value
          item.done = !item.done;
        }
    });
    // save modified JSON.stringified list to ls
    writeToLS(listkey, JSON.stringify(goalList));
    location.reload();
}

function deleteGoal(id) {
    // console.log(`id: ${id}`)
    // console.log(`listkey: ${listkey}`)
    let goalList = getGoals(listkey);
    const filtered = goalList.filter(item => item.id != id);
    // save JSON.stringified list to ls
    writeToLS(listkey, JSON.stringify(filtered));
    location.reload();
}
