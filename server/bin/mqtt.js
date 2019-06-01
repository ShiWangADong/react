var http     = require('http')
    , httpServ = http.createServer()
    , mosca    = require('mosca');

var moscaSettings = {
    http: {
        port: 3000,
        bundle: true
    }
}

var server = new mosca.Server(moscaSettings);


var connectedClientArray=[];
var disPubMessageArray={};


server.attachHttpServer(httpServ);
server.on('ready', setup);

server.on('clientConnected', function(client) {
    var clientID=client.id;
    var disMessage=disPubMessageArray[clientID];
    if(!disMessage){
        disPubMessageArray[clientID]=[];
    }else{
        setTimeout(function () {
            while(disMessage.length>0){
                var message=disMessage.shift();
                server.publish(message.packet,message.client);
            }
        },5000)
    }
    console.log('client connected', clientID);
    if(findValueIndexArray(connectedClientArray,clientID)===-1){
        connectedClientArray.push(clientID);
    }
});

server.on('clientDisconnected', function(client) {
    console.log('client disconnected', client.id);
    connectedClientArray.splice(findValueIndexArray(connectedClientArray,client.id),1);
});

// fired when a message is received
server.on('published', function(packet, client) {
    if(client){
        var clientID=packet.topic;
        if(findValueIndexArray(connectedClientArray,clientID)===-1){
            var disMessage=disPubMessageArray[clientID];
            if(!disMessage){
                disPubMessageArray[clientID]=[];
                disPubMessageArray[clientID].push({packet:packet,client:client});
            }else{
                disMessage.push({packet:packet,client:client});
            }
        }else{
            console.log('Published', packet.topic, packet.payload);
        }
    }
});

// fired when the mqtt server is ready
function setup() {
    console.log('Mosca server is up and running')
}


function findValueIndexArray(arr,value) {
    return arr.findIndex(n=>n===value);
}

httpServ.listen(300);