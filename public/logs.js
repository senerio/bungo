var xhr = new XMLHttpRequest();
var qs = "", js = {};

function populateDropdown(id) {
    for(var dropdown of document.getElementsByClassName("writers")) {
        for(var i in writers) {
            var option = document.createElement("option");
            option.setAttribute("value", writers[i]);
            option.innerHTML = writers[i];
            dropdown.appendChild(option);
        }
    }
}

function createRows(dbRows) {
    document.getElementsByTagName("tbody")[0].innerHTML = "";
    for(var row of JSON.parse(dbRows)) {
        var tr = document.createElement("tr");
        var key = ["result", "ink", "bookmark", "assistant", "delver"]
        for(var col of key) {
            td = document.createElement("td");
            td.innerHTML = row[col];
            tr.appendChild(td);
        }
        document.getElementsByTagName("tbody")[0].appendChild(tr);
    }
}

function showAlert(text) {
    document.getElementById("alert").setAttribute("style","display:block;");
    document.getElementById("alert").innerHTML = text;
    setTimeout(function() {
        document.getElementById("alert").setAttribute("style","display:none;");
    },2500);
}

function count() {
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            document.getElementById("count").innerHTML = xhr.responseText;
        }
    }
    xhr.open('GET', '/count', true);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.send();
}

function send() {
	getInput();
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

function query() {
    getInput();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            createRows(xhr.responseText);
        }
    }
    xhr.open('GET', '/data?' + qs, true);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.send();
}

function getInput() {
    qs = "";
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
                    qs += o.name + "=" + o.value + "&";
                    js[o.name] = o.value;
                    break;
                }
            default:
                if(o.value == "") {
                    break;
                } else {
                    qs += o.name + "=" + o.value + "&";
                    js[o.name] = o.value;
                }
        }
    }
    qs = qs.substring(0, qs.length-1);
}

function checkInput() {
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

window.onload = function() {
    populateDropdown("writers");
    if(document.getElementById("count")) {
    	count();
    }
    if(document.getElementById("search")) {
    	document.getElementById("search").onclick = query;
    }
    if (document.getElementById("submit")) {
    	document.getElementById("submit").onclick = send;
    }
}