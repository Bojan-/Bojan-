var flag = 0;
var next_id = 0;
var id = -1;
var read = 1;

function run(){
	var appContainer = document.getElementsByClassName('chat')[0];
	appContainer.addEventListener('click', delegateEvent);
	var history = JSON.parse(localStorage.getItem("History"));
	restore(history);
}

function restore(string) {
	if (string != null)
	for (var i = 0; i < string.length; i++)
	{
		switch (string[i]) {
          case "S":
			i += 2;
			var n = "";
			while (string[i] != ":")
			{
				n += string[i];
				i++;
			}
			i += 2;
			var m = "";
			while (string[i] != "\n")
			{
				m += string[i];
				i++;
			}
			var name = document.getElementById('name');
			var message = document.getElementById('message');
			name.value = n;
			message.value = m;
			SendMessage();
			break;
          case "C":
            i += 2;
            var _id = "";
            while (string[i] != " ")
			{
				_id += string[i];
				i++;
			}
            id = _id;
            i++;
			var me = "";
			while (string[i] != "\n")
			{
				me += string[i];
				i++;
			}
			var _message = document.getElementById('message');
			_message.value = me;
			SendChangedMessage();
			break;
          case "D":
            i += 2;
            var iD = "";
            while (string[i] != "\n")
			{
				iD += string[i];
				i++;
			}
            id = iD;
            DeleteMessage();
			break;
          default:
			i++;
		}
	}
	read = 0;
}

function delegateEvent(evtObj) {
	if(evtObj.type === 'click'){
        var temp = document.getElementById('send');
        if (evtObj.target == temp) {
		if (flag === 0)
		    	SendMessage();
		else
		    	SendChangedMessage();
	}
        if (evtObj.target.id < next_id)
		SelectMessage(evtObj);
        temp = document.getElementById('change');
        if (evtObj.target == temp)
		ChangeMessage();
        temp = document.getElementById('delete');
        if (evtObj.target == temp)
		DeleteMessage();
	}
}

function SendMessage(){
 	var history = document.getElementById('history');
	var message = document.getElementById('message');
    if(!message.value) {
		return;
	}
    var name = document.getElementById('name');
    if (name.value !== '') {
        var newdiv = document.createElement("div");
        newdiv.style.fontSize = "x-large";
        newdiv.innerHTML = name.value + ": " + message.value;
        newdiv.value = message.value;
        newdiv.name = name.value;
        newdiv.id = next_id;
        next_id++;
        history.appendChild(newdiv);
	if (read === 0)
		localStorage.setItem("History", JSON.stringify(JSON.parse(localStorage.getItem("History")) + "S " + newdiv.innerHTML + "\n"));
    }        	
    else
        message.placeholder = "Введите имя!!!";
	message.value = '';
}

function SelectMessage(evtObj) {
    if (id != -1)
    {
	var mes = document.getElementById(id);
	mes.innerHTML = mes.name + ": " + mes.value;
    }
    var text = document.getElementById('history');
	var mes = document.getElementById(evtObj.target.id);
	mes.innerHTML = "<b>" + mes.innerHTML + "</b>";
    id = mes.id;
    document.getElementById('delete').hidden = false;
    document.getElementById('change').hidden = false;
}

function DeleteMessage() {
    document.getElementById('history').removeChild(document.getElementById(id));
    document.getElementById('delete').hidden = true;
    document.getElementById('change').hidden = true;
    id = -1;
    if (read === 0)
    	localStorage.setItem("History", JSON.stringify(JSON.parse(localStorage.getItem("History")) + "D " + id + "\n"));
}

function ChangeMessage() {
    var mes = document.getElementById(id);
    var message = document.getElementById('message');
    message.value = mes.value;
    flag = 1;
    document.getElementById('delete').hidden = true;
    document.getElementById('change').hidden = true;
}

function SendChangedMessage() {
    var message = document.getElementById('message');
    var mes = document.getElementById(id);
    if(!message.value) {
	    mes.innerHTML = mes.name + ": " + mes.value;
    }
    else {
    	mes.innerHTML = mes.name + ": " + message.value;
	if (read === 0)
        	localStorage.setItem("History", JSON.stringify(JSON.parse(localStorage.getItem("History")) + "C " + id + " " + message.value + "\n"));
    	flag = 0;
    	message.value = '';
    }
    id = -1;
}