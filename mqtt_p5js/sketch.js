var shiftrKey = '9a64095b'; // key / username
var shiftrSecret = 'caa39bf85fd65bdd'; // secret / password

var client;

var analogList = [];
var digitalList = [];

function setup() {

  // MQTT TING START
  // -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
  client = mqtt.connect('mqtt://' + shiftrKey + ':' + shiftrSecret + '@broker.shiftr.io', {
    clientId: 'p5js'
  });

  client.on('connect', function() {
    console.log('client has connected!');


    // HER SUBCRIBER VI TIL DE ADRESSER VI VIL LYTTE TIL
    // -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

    for (var i = 0; i < 8; i++){
      var number = i.toString();
      var s = "analog" + number;
      analogList.push(s);
      client.subscribe(s);
      publishMessage(s, "hej");
    }

    for (var i = 0; i < 2; i++){
      var number = i.toString();
      var s = "digital" + number;
      digitalList.push(s);
      client.subscribe(s);
      publishMessage(s, "hej");
    }

    client.subscribe("lightSensor");
    client.subscribe("flexSensor");

    console.log("analogList: ", analogList);
    console.log("digitalList: ", digitalList);

  });

  // HER FORTÆLLER VI AT VI VIL MODTAGE BESKEDERNE I VORES FUNKTION: messageReceived()
  // -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
  client.on('message', function(topic, message) {
    messageReceived(topic, message);
  });

  // -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
  // MQTT TING SLUT


  createCanvas(windowWidth, windowHeight);
}

function draw() {

}

// DEN HER FUNKTION KALDER VI NÅR VI VIL SENDE EN BESKED
function publishMessage(topic, message){
    client.publish(String(topic), String(message));
}

// DEN HER FUNKTION SKYDER HVER GANG VI MODTAGER EN BESKED
function messageReceived(t, m){
  var topic = t.toString();
  var message = m.toString();
  var val;
  var i = topic.substring(topic.length-1);
  var index = parseInt(i);

  var typeOfTopic = topic.substring(0, 1);

  if (typeOfTopic == "a") {
    console.log("topic is analog");
    val = val * 0.0009777;
  }

  if (typeOfTopic == "d") {
    console.log("topic is digital");
    val = constrain(message, 0, 1);
  }

  console.log('topic: ', topic, 'message: ', message);
}
