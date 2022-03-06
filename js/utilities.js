// 1. Create DOM manipulation helper functions in utilities.js
//Two here for starters should be good as well...may add more later
// do a querySelector lookup @param {string} selector The selector passed to querySelector

// @return {element} The matching element or null if not found /
const qs = selector => {
    return document.querySelector(selector);
}

/*
add a touchend event listener to an element for mobile with a click event fallback for desktops @param {string} elementSelector The selector for the element to attach the listener to
* @param {function} callback The callback function to run
// */

// const getEventType = $(this).on('touchend click', function(event) {
//     if (event.type == "touchend") {
//         $(this).off('click');
//         const eventType = 'touchend';
//         console.log("Only touch event is fired");
//     } else if (event.type == "click") {
//         $(this).off('touchend');
//         console.log("Only click event is fired");
//     }
//     return event.type;
// });

function onTouch(elSelector, callback) {
    const el = qs(elSelector);
    //const eventType = getEventType(el);
    if (el.addEventListener) {
        //this.allbtn.addEventListener("touchend", () => { this.listAll(); }, false);
        el.addEventListener(eventType, () => { callback; }, false);
        //el.addEventListener(event, callback, false);
    }
    else if (el.attachEvent) {
        el.attachEvent(eventType, () => { callback; })
    }
}

function createLMNT(LMNT, LMNTtype, LMNTid, LMNTtext, LMNTclass) {
    let lmnt = document.createElement(LMNT);
    lmnt.setAttribute('type', LMNTtype);
    lmnt.setAttribute('id', LMNTid);
    lmnt.innerText = LMNTtext;
    lmnt.setAttribute('class', LMNTclass);
    return lmnt;
}
export { qs, onTouch, createLMNT};