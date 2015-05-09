'use strict';

var flag = 0;
var i = 1;

var message = function(name, text) {
    return {		
	user: name.value,
	messageText: text.value,
	id: i.toString(),
    };
};

var id = -1;

var messagesList = [];

var appState = {
    mainUrl : 'http://localhost:1555/chat',
    taskList:[],
    token : 'TE11EN'
};

function run(){
	var appContainer = document.getElementsByClassName('chat')[0];
	appContainer.addEventListener('click', delegateEvent);
	restore();
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
        if (evtObj.target.id < i)
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
    var messageText = document.getElementById('message');
    if(!messageText.value) {
	return;
    }
    var name = document.getElementById('name');
    if (name.value !== '') {
        var newdiv = document.createElement("div");
        newdiv.style.fontSize = "x-large";
        newdiv.innerHTML = name.value + ": " + messageText.value;
        newdiv.value = messageText.value;
        newdiv.name = name.value;
        newdiv.id = i;
        history.appendChild(newdiv);
	addMessage (name, messageText);
	var block = document.getElementById('history');
        block.scrollTop = block.scrollHeight;
    }        	
    else
        messageText.placeholder = "Введите имя!!!";
    messageText.value = '';
}

function addMessage (name, messText) {
    var mess = message (name, messText);
    i++;
    messagesList.push (mess);
    post(appState.mainUrl, JSON.stringify(mess));
}

function createMessage (mess) {
    var newMess = document.createElement ("div");
    newMess.style.fontSize = "x-large";
    newMess.innerHTML = mess.user + ": " + mess.messageText;
    newMess.name = mess.user;
    newMess.value = mess.messageText;
    newMess.setAttribute ("id", mess.id);
    if (i <= mess.id)
    	i = parseInt(mess.id) + 1;
    newMess.setAttribute ("class", "mess");
    newMess.setAttribute ("onClick", "delegateEvent(this)");
    document.getElementById ('history').appendChild (newMess);
    messagesList[messagesList.length] = mess;

    var block = document.getElementById('history');
    block.scrollTop = block.scrollHeight;
}

function SelectMessage(evtObj) {
    if (id != -1)
    {
	var mes = document.getElementById(parseInt(evtObj.target.id));
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
    document.getElementById('delete').hidden = true;
    document.getElementById('change').hidden = true;
    var j;
    for (j = 0; j<messagesList.length; j++)
	if(messagesList[j].id == id)
	    if(messagesList[j].user != document.getElementById ('name').value) {
		var mes = document.getElementById(id);
		mes.innerHTML = mes.name + ": " + mes.value;
		return;
	    }
	    else
		break;
    document.getElementById('history').removeChild(document.getElementById(id));
    del(appState.mainUrl, JSON.stringify(messagesList[j]));
    messagesList.splice (j, 1);
    id = -1;
}

function ChangeMessage() {
    document.getElementById('delete').hidden = true;
    document.getElementById('change').hidden = true;
    var j;
    for (j = 0; j < messagesList.length; j++)
	if(messagesList[j].id == id)
	    if(messagesList[j].user != document.getElementById ('name').value) {
		var mes = document.getElementById(id);
		mes.innerHTML = mes.name + ": " + mes.value;
		return;
	    }
	    else
		break;
    var mes = document.getElementById(id);
    var message = document.getElementById('message');
    message.value = mes.value;
    flag = 1;
}

function SendChangedMessage() {
    var message = document.getElementById('message');
    var mes = document.getElementById(id);
    if(!message.value) {
	    mes.innerHTML = mes.name + ": " + mes.value;
    }
    else {
	var j;
    	for (j = 0; j < messagesList.length; j++)
	if(messagesList[j].id == id) {
    	    messagesList[j].messageText = message.value;
    	    put(appState.mainUrl, JSON.stringify(messagesList[j]));
	    break;
	}
    	mes.innerHTML = mes.name + ": " + message.value;
	flag = 0;
    	message.value = '';
    }
    id = -1;
}

function createAllMessages(allMessages) {
    for(var i = 0; i < allMessages.length; i++)
	createMessage(allMessages[i]);
}

function restore(continueWith) {
    var url = appState.mainUrl + '?token=' + appState.token;
    get(url, function(responseText) {
    console.assert(responseText != null);
    var response = JSON.parse(responseText);
    appState.token = response.token;
    if (response.messages)
	createAllMessages(response.messages);
    continueWith && continueWith();
    });
}

function get(url, continueWith, continueWithError) {
    ajax('GET', url, null, continueWith, continueWithError);
}

function post(url, data, continueWith, continueWithError) {
    ajax('POST', url, data, continueWith, continueWithError);	
}

function put(url, data, continueWith, continueWithError) {
    ajax('PUT', url, data, continueWith, continueWithError);	
}

function del(url, data, continueWith, continueWithError) {
    ajax('DELETE', url, data, continueWith, continueWithError);	
}

function isError(text) {
    if(text == "")
	return false;
	
    try {
	var obj = JSON.parse(text);
    } catch(ex) {
	return true;
    }

    return !!obj.error;
}

function defaultErrorHandler(mess) {
    console.error(mess);
}

function ajax(method, url, data, continueWith, continueWithError) {
    var xhr = new XMLHttpRequest();

    continueWithError = continueWithError || defaultErrorHandler;
    xhr.open(method || 'GET', url, true);

    xhr.onload = function () {
	if (xhr.readyState !== 4)
	    return;
	if(xhr.status != 200) {
	    continueWithError('Error on the server side, response ' + xhr.status);
	    return;
	}

	if(isError(xhr.responseText)) {
	    continueWithError('Error on the server side, response ' + xhr.responseText);
	    return;
	}
	if(xhr.responseText) {
	    continueWith(xhr.responseText);
	}
    };

    xhr.onimeout = function () {
        continueWithError('Server timed out !');
    }

    xhr.onerror = function (e) {
	var errMsg = 'Server connection error !\n'+
	'\n' +
	'Check if \n' +
	'- server is active\n'+
	'- server sends header "Access-Control-Allow-Origin:*"';

	continueWithError(errMsg);
    };

    xhr.send(data);
}