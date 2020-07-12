var pref = `home`;
var number = 1111;

var adMatrix = {
    "home" : [
        {
            src: "https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4",
            length: 31
        },
        {
            src: "http://techslides.com/demos/sample-videos/small.webm",
            length: 6
        }
    ],
    "insurace": [
        {
            src: "./small.mp4",
            length: 6
        }
    ],
    "food" : [
        {
            src: "./dolbycanyon.mp4",
            length: 25
        }
    ]
};

document.addEventListener('DOMContentLoaded', function(){ 
    // pushThePlayButton();
    // setTimeout(pushThePlayButton, 2600);  
    showConnectionDiv();
}, false)

function showConnectionDiv() {
    document.getElementById('connect-div').style.display='block';
    // setTimeout(onConnectionDone, 2000);
}


function onConnectionDone() {
    document.getElementById('connect-div').style.display='none';
    document.getElementById('stream-div').style.display='block';
    document.getElementById('stream-vid').play();
}


function onInterupt() {
    vidsrc_to_show = fetchAdsBasedOnPreference(pref);
    document.getElementById('overlay-vid').src = vidsrc_to_show;
    document.getElementById('overlay-vid').play();
    document.getElementById('connect-div').style.display='none';
    document.getElementById('stream-div').style.display='none';
    document.getElementById('overlay-div').style.display='block';
    document.getElementById('stream-vid').pause();


}

function startFromTheTop() {
    document.getElementById('connect-div').style.display='none';
    document.getElementById('stream-div').style.display='block';
    document.getElementById('overlay-div').style.display='none';
    document.getElementById('overlay-vid').pause();
    document.getElementById('overlay-vid').currentTime = 0;
    document.getElementById('stream-vid').currentTime = 0;
    document.getElementById('stream-vid').play();
}

function resumePlayback() {
    document.getElementById('connect-div').style.display='none';
    document.getElementById('stream-div').style.display='block';
    document.getElementById('overlay-div').style.display='none';
    document.getElementById('overlay-vid').pause();
    document.getElementById('overlay-vid').currentTime = 0;
    document.getElementById('stream-vid').play();

}

function fetchAdsBasedOnPreference(preference) {
    var vid_to_play = adMatrix[preference][0];
    setTimeout(resumePlayback, vid_to_play.length * 1000);
    return vid_to_play.src;
}

var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return (
        "_" +
        Math.random()
            .toString(36)
            .substr(2, 9)
    );
};
var client = new Paho.Client("wss://api.akriya.co.in:8084/mqtt",
    `clientId-adEngine-onPrem-${ID()}`
);

// var client = new Paho.Client(
//     "api.akriya.co.in",
//     8083,
//     `clientId-91springboard_${ID}`
//   );

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({ onSuccess: onConnect });

// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    
    let message = new Paho.Message("Hello");
    message.destinationName = `adEngine/on-prem/dev1/presence`;
    client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

// called when a message arrives
function onMessageArrived(message) {
    if (message.topic === `adEngine/${number}/controls`) {
        // we do based on Controls
        if(message.payloadString === `play-ad`) {
            onInterupt();
        }
    } else if (message.topic === `adEngine/${number}/connected`) {
        // onConnectionDone();
    } else if (message.topic === `adEngine/${number}/profile`) {
        pref = message.payloadString;
        console.log('setting new profile');
        showNewProfile();
    } else if (message.topic === 'adEngine/all/controls') {
        if(message.payloadString === `play-ad`) {
            onInterupt();
        } else if (message.payloadString === 'start-start') {
            startFromTheTop();
        }
    }
    console.log("onMessageArrived:" + message.payloadString);
}


function sendConformationToMobile(message_in) {
    let message = new Paho.Message('Connected to Device ID');
    message.destinationName = `adEngine/${message_in}/connected`;
    client.send(message);
    subToRequiredTopics(message_in);
    onConnectionDone();
}
function subToRequiredTopics(number) {
    client.subscribe(`adEngine/${number}/connected`);
    client.subscribe(`adEngine/${number}/controls`);
    client.subscribe(`adEngine/${number}/profile`);
    client.subscribe(`adEngine/all/controls`);
}

let dev_id = '1111';
document.getElementById('btn-click').onclick =  () => {
    console.log('Clicked');
    dev_id = document.getElementById('connection_code').value;
    number = dev_id;
    sendConformationToMobile(dev_id);
    console.log(`Device Id set to ${dev_id}`);
};


function showNewProfile() {
    document.getElementById('notify').innerHTML =`Profile Set to ${pref}`;
    document.getElementById('notify').style.display = 'block';
    
    setTimeout(hideNotify, 1000);
}

function hideNotify() {
    document.getElementById('notify').style.display = 'none';

}
        