var clickY = -1;
var flag = 0;
var start = -1;
var finish = -1;

function run(){
    var history = document.getElementById('history');
	var appContainer = document.getElementsByClassName('chat')[0];

	appContainer.addEventListener('click', delegateEvent);
}

function delegateEvent(evtObj) {
	if(evtObj.type === 'click'){
        var temp = document.getElementById('send');
            if (evtObj.target == temp) {
		if (flag == 0)
		    SendMessage();
		else
		    SendChangedMessage();
	    }
        temp = document.getElementById('history');
            if (evtObj.target == temp)
		        clickY = SelectMessage(evtObj);
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
    if(!message.value){
		return;
	}

    var name = document.getElementById('name');
    if (name.value !== '')
        history.value = history.value + name.value + ': ' +  message.value + '\n';
    else
        message.placeholder = "??????? ???!!!";
	message.value = '';
}

function SelectMessage(evtObj) {
    var text = document.getElementById('history');
    var y = (evtObj.pageY - 90) / 25;
    var i = 0;
    var count = 0;
    var count1 = 0;
    var old = i;
    while (count1 < y && i < text.value.length) {
        if (text.value[i] === '\n') {
            count++;
	    count1++;
	}
	if (i - old === 70) {
	    count1++;
	    old = i;
	}
        i++;
    }
    if (i != text.value.length)
    	return count;
    else
	return -1;
}

function DeleteMessage() {
    if (clickY != -1) {
    	var text = document.getElementById('history');
    	var temp = "";
    	var i = 0;
    	var j = 1;
    	var count = 0;
    	while (count < clickY) {
            i++;
            if (text.value[i] === '\n')
            	count++;
    	}
	temp = text.value.substring(0, i);
    	while (text.value[i+j] != '\n')
            j++;
	if (i === 0)
    	    temp = temp.concat(text.value.substring(i+j+1, text.value.length));
	else
	    temp = temp.concat(text.value.substring(i+j, text.value.length));
    	text.value = temp;
    }
}

function ChangeMessage() {
    if (clickY != -1) {
	var text = document.getElementById('history');
    	var temp = "";
    	var i = 0;
    	var j = 0;
	var old = i;
    	var count = 0;
    	while (count < clickY) {
            i++;
            if (text.value[i] === '\n')
            	count++;
    	}
	while (text.value[i-2] != ':')
	    i++;
	while (text.value[i+j+1] != '\n')
            j++;
	temp = text.value.substring(i, i+j+1);
	var message = document.getElementById('message');
	message.value = temp;
	start = i+1;
	finish = j;
	flag = 1;
    }
}
function SendChangedMessage() {
    if (start != -1 && finish != -1) {
	var text = document.getElementById('history');
	var message = document.getElementById('message');
	if (start != 1)
    	    var temp = text.value.substring(0, start-1);
	else
	    var temp = "";
	temp = temp.concat(message.value);
	temp = temp.concat(text.value.substring(start+finish, text.value.length));
	text.value = temp;
	flag = 0;
	message.value = '';
    }
}