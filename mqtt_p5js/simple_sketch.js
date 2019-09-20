
var shiftrKey = '9a64095b'; // key / username
var shiftrSecret = 'caa39bf85fd65bdd'; // secret / password

var client;

// lister af analoge og digitale topics til subsciptions
var analogList = [];
var digitalList = [];

// lister af beskeder modtaget på forskellige topics
var analogMessages = [];
var digitalMessages = [];

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

    // 8 analoge kanaler
    for (var i = 0; i < 8; i++){
      var number = i.toString();
      var s = "analog" + number;
      analogList.push(s);
      client.subscribe(s);
      publishMessage(s, "hej");
    }

    // 2 digitale kanaler
    for (var i = 0; i < 2; i++){
      var number = i.toString();
      var s = "digital" + number;
      digitalList.push(s);
      client.subscribe(s);
      publishMessage(s, "hej");
    }

    // testkanaler
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

  background(33);

  var width = windowWidth;
  var height = windowHeight;

  var sclX = width / 5;
  var sclY = height / 2;

  // LOOP I GENNEM DE FØSTE 5 ANALOGE ARRAYS
  for (var i = 0; i < 5; i++){
    var numMsgs = analogMessages[i].length;

    for (var j = 0; j < numMsgs; j++){
      var msg = analogMessages[i][j];
      console.log("msg: ", msg);
    }

  }

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
    val = constrain(val, 0, 1023);
    val = val * 0.0009777;
  }

  if (typeOfTopic == "d") {
    console.log("topic is digital");
    val = constrain(message, 0, 1);
  }

  console.log('topic: ', topic, 'message: ', message);
}
