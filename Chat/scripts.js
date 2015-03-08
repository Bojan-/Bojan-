function run(){
    var history = document.getElementById('history');
	var appContainer = document.getElementsByClassName('chat')[0];

	appContainer.addEventListener('click', delegateEvent);
}

function delegateEvent(evtObj) {
	if(evtObj.type === 'click'){
        var temp = document.getElementById('send');
            if (evtObj.target == temp)
		        onSendMessage(evtObj);
        temp = document.getElementById('history');
            if (evtObj.target == temp)
		        onChangeMessage(evtObj);
        temp = document.getElementById('change');
            if (evtObj.target == temp)
		        onChangeMessage(evtObj);
        temp = document.getElementById('delete');
            if (evtObj.target == temp)
		        onDeleteMessage(evtObj);
	}
}

function onSendMessage(){
	var message = document.getElementById('message');

	sendMessage(message.value);
	message.value = '';
} 

function sendMessage(value) {
	if(!value){
		return;
	}

	var history = document.getElementById('history');
    var name = document.getElementById('name');
    if (name.value != '')
        history.value = history.value + name.value + ': ' +  value + '\n';
    else
        message.placeholder = "??????? ???!!!";
}