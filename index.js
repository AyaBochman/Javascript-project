//DOM elements
var DOM = function () {
    return {
        board: document.getElementById("board"), //board
        textInput: document.getElementById("text"), //text area input
        date: document.getElementById("date"), //date input
        time: document.getElementById("time"), //time input
        postBtn: document.getElementById("postBtn"), //pin button
        errorMSG: document.getElementById("error"), // error msg
        selection: document.getElementById("noteDisplay"),//select
        checkbox: document.getElementsByClassName("checkbox"),//checkbox
        stickyNote: document.getElementsByClassName("sticky")//created sticky note
    }

}()

var notes = {};
var id = 0;//id of the element


//note construtor
function Note(_text, _time, _date, _isDone = false, _id) {
    this.text = _text;
    this.time = _time;
    this.date = _date;
    this.isDone = _isDone;
    this.id = _id;
}

//form reset
function resetForm() {
    DOM.textInput.value = "";
    DOM.date.value = "";
    DOM.time.value = "";
}


//make note
function generateNote(newnote = true) {

    var currentId = `note${id}`;
    if (newnote == true) { //new note from dom
        if (noteValid() == true) {

            var note = new Note(DOM.textInput.value, DOM.time.value, DOM.date.value, false, id);
        }
        else {
            return;
        }

    }
    else { //old note from local storage
        var history = newnote;
        var note = new Note(history.text, history.time, history.date, history.isDone, id);
    }

    DOM.errorMSG.innerText = "";
    notes[currentId] = note; //assign value to key note0: {}
    var noteDIV = createNote(note); //actually creates the elements for each note values

    //transition effect
    setTimeout(function () {
        noteDIV.classList.add("opacity-final");
    }, 100);

    DOM.board.appendChild(noteDIV); //add created note to the DOM
    localStorage.setItem('savedNote', JSON.stringify(notes)); // saving to local storage
    id++;

}




//required
function noteValid() {
    DOM.errorMSG.classList.add("error");
    if (DOM.textInput.value.trim() == "") {
        DOM.errorMSG.innerHTML = "You didn't fill text";
        return false;
    }
    else if (date.value == "" || time.value == "") {
        DOM.errorMSG.innerHTML = "You didn't fill date/time";
        return false;
    }
    else if (date.max < date.value || date.min > date.value) {
        DOM.errorMSG.innerText = "Year is not valid";
        return false;
    }

    return true;
}


function createNote(currentNote) {
    //sticky div with image
    var div = document.createElement("div");
    div.classList.add("sticky");
    //text
    var divText = document.createElement("p");
    divText.innerText = `${currentNote.text}`;
    divText.classList.add("centered");
    //write time and date
    var dateNtime = document.createElement("span");
    dateNtime.innerText = `Time: ${currentNote.time} Date: ${currentNote.date}`;
    dateNtime.classList.add("date-time");
    //append all
    div.appendChild(divText);
    div.appendChild(dateNtime);
    div.id = currentNote.id;
    //transition effect
    div.classList.add("opacity-init");

    //add check box
    var checkBox = document.createElement("input");

    checkBox.setAttribute("type", "checkbox");
    checkBox.classList.add("checkbox");
    checkBox.addEventListener("click", function () {
        var e = this.parentElement;
        var eID = e.id;
        var thiskey = notes["note" + eID.toString()];
        if (this.checked == true) {
            thiskey.isDone = true;
            div.firstChild.classList.add("is-checked");
            localStorage.setItem("savedNote", JSON.stringify(notes));
            div.appendChild(delBtn);


        } else {
            thiskey.isDone = false;
            div.firstChild.classList.remove("is-checked");
            localStorage.setItem("savedNote", JSON.stringify(notes));
            div.removeChild(delBtn);

        }

    });


    //add del button
    var delBtn = document.createElement("button");
    delBtn.classList.add("delBtn");
    delBtn.innerHTML = "<i class='fa fa-trash-alt'></i>";

    //add remove event to the del button
    delBtn.addEventListener("click", delNote);


    //add button and checkbox to note
    div.appendChild(checkBox);
    resetForm();
    return div;

}


//delete function
function delNote() {
    var e = this.parentElement;
    var idx = e.id;
    delete notes["note" + idx.toString()];
    localStorage.setItem("savedNote", JSON.stringify(notes));

    //effect
    e.classList.toggle("opacity-final")
    setTimeout(function () {
        e.remove();
    }, 500)
}


//filter notes
function displayNotes() {
    var pick = DOM.selection.value;
    for (i = 0; i < DOM.stickyNote.length; i++) {
        switch (pick) {
            case "1":
                DOM.stickyNote[i].classList.remove("hide");
                break;
            case "2":
                if(DOM.checkbox[i].checked == true){
                   DOM.stickyNote[i].classList.add("hide");
                } else{
                    DOM.stickyNote[i].classList.remove("hide");
                }
                break;
            case "3":
                if(DOM.checkbox[i].checked == false){
                    DOM.stickyNote[i].classList.add("hide");
                 } else{
                    DOM.stickyNote[i].classList.remove("hide");
                 }
                break;
        }
    }

}


var noteObj;

function init() {
    if(localStorage.getItem("savedNote") !=null){

        var getNote = localStorage.getItem("savedNote");
        noteObj = JSON.parse(getNote);
        var num_keys = Object.keys(noteObj).length;
        var keys_list = Object.keys(noteObj);
        for (i = 0; i < num_keys; i++) {
            var savedNote = noteObj[keys_list[i]];
            generateNote(savedNote);
            if (savedNote.isDone == true) {
                DOM.checkbox[i].click();
            }
        }
    }
    


}
init();

