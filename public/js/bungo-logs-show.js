window.onload = function() {
    populateDropdown("writers");
    count();
    document.getElementById("search").onclick = query;
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

var qs = "";
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
                    break;
                }
            default:
                if(o.value == "") {
                    break;
                } else {
                    qs += o.name + "=" + o.value + "&";
                }
        }
    }
    qs = qs.substring(0, qs.length-1);
}

var xhr = new XMLHttpRequest();
function createRows(xhrText) {
    document.getElementsByTagName("tbody")[0].innerHTML = "";
    for(var row of JSON.parse(xhrText)) {
        tr = document.createElement("tr");
        key = ["result", "ink", "bookmark", "assistant", "delver"]
        for(var col of key) {
            td = document.createElement("td");
            td.innerHTML = row[col];
            tr.appendChild(td);
        }
        document.getElementsByTagName("tbody")[0].appendChild(tr);
    }
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
