window.onload = function() {
    populateDropdown("writers");
    document.getElementById("submit").onclick = sendData;
}

function populateDropdown(id) {
    var result = document.getElementsByClassName("writers");
    for(var x of result) {
        for(var i in writers) {
            var option = document.createElement("option");
            option.setAttribute("value", writers[i]);
            option.innerHTML = writers[i];
            x.appendChild(option);
        }
    }
}

var js = {};
function getInput() {
    for(var o of document.forms[0]) {
        switch(o.type) {
            case "button":
            case "reset":
                break;
            case "checkbox":
            case "radio":
                if(!o.checked) {
                    break;
                } else {
                    js[o.name] = o.value;
                }
            default:
                if(o.value == "") {
                    break;
                } else {
                    js[o.name] = o.value;
                }
        }
    }
}

function showAlert(text) {
    document.getElementById("alert").setAttribute("style","display:block;");
    document.getElementById("alert").innerHTML = text;
    setTimeout(function() {
        document.getElementById("alert").setAttribute("style","display:none;");
    },2500);
}

function checkInput() {
    getInput();
    var complete = true;
    var key = ["result", "ink", "bookmark", "assistant", "delver"]
    for(var item of key) {
        if(js[item] == "" || js[item] == undefined) {
            complete = false;
        }
    }
    if(!complete) {
        showAlert("Please fill in all fields.")
        return(false);
    } else {
        return(true);
    }
}

function sendData() {
    if(!checkInput()) { return; }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            showAlert("Successfully added to logs.");
        }
    }
    xhr.open('POST', '/submit', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(js));
}
