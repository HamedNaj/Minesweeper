import {saveScore} from './scoreboard.js'

let modal = document.getElementById("myModal");

// Get the button that opens the modal

let name = document.getElementById("name_input");
let record = document.getElementById("timer");
let level = document.getElementById("score__board_type");

// Get the <cancel> element that closes the modal
let cancel = document.getElementById("modal_cancel");
let confirm = document.getElementById("modal_confirm");

// When the user clicks on <cancel> (x), close the modal
cancel.onclick = function () {
  modal.style.display = "none";
}
confirm.onclick = function () {
  if (name.value) {
    saveScore({name: name.value, record: record.textContent.split(' ')[1].split('s')[0], level: level.textContent})
    modal.style.display = "none";
  }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
