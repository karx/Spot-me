document.addEventListener('DOMContentLoaded', function(){ 
    // pushThePlayButton();
    // setTimeout(pushThePlayButton, 2600);  
    showConnectionDiv();
}, false)

function showConnectionDiv() {
    document.getElementById('connect-div').style.display='block';
    setTimeout(onConnectionDone, 2000);
}


function onConnectionDone() {
    document.getElementById('connect-div').style.display='none';
    document.getElementById('stream-div').style.display='block';
    document.getElementById('stream-vid').play();
}


function onInterupt() {
    document.getElementById('connect-div').style.display='none';
    document.getElementById('stream-div').style.display='none';
    document.getElementById('overlay-div').style.display='block';
    document.getElementById('steam-vid').mute();
}