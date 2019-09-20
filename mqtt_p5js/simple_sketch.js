
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
      var msgList = [];
      analogMessages.push(msgList);

      var number = i.toString();
      var s = "analog" + number;
      analogList.push(s);
      client.subscribe(s);
      publishMessage(s, "hej");
    }

    // 2 digitale kanaler
    for (var i = 0; i < 2; i++){
      var msgList = [];
      digitalMessages.push(msgList);

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

    console.log("analogMessages: ", analogMessages);
    console.log("digitalMessages: ", digitalMessages);

  });

  // HER FORTÆLLER VI AT VI VIL MODTAGE BESKEDERNE I VORES FUNKTION: messageReceived()
  // -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
  client.on('message', function(topic, message) {
    messageReceived(topic, message);
  });

  // -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
  // MQTT TING SLUT


  createCanvas(windowWidth, windowHeight);

  textSize(20);
  textAlign(CENTER, CENTER);

}

function draw() {

  // altid 33 - bare fordi
  background(33);

  var width = windowWidth;
  var height = windowHeight;

  // width divided by 10 so we know how wide each box in the sketch can be
  var sclX = width / 10;
  var half = sclX * 0.5;

  // draw lines to separate channels
  for (var i = 1; i < 10; i++){
    stroke(255);
    noFill();
    line(sclX * i, 0, sclX * i, height);
  }

  // ved brug af modulo, opdateres hver "kasse" kun hvert 2. sekund
  //if (frameCount % 120 == 0){

    // loop igennem alle analoge kanaler og hver enkelt besked i kanalens liste
    for (var i = 0; i < analogMessages.length; i++){

      stroke(255);
      fill(255);
      text("Analog " + i.toString(), sclX * i + half, 20);

      var list = analogMessages[i];

      for (var j = 0; j < list.length; j++){
        
        var msg = list[j];
        console.log("msg: ", msg);
      
      }

    }

    // loop igennem alle analoge kanaler og hver enkelt besked i kanalens liste
    for (var i = 0; i < digitalMessages.length; i++){
      var list = digitalMessages[i];
      // drawing a transparent white square to highlight digital channels a bit
      noStroke();
      fill(255, 20);
      rect(sclX * (i + analogMessages.length), 0, sclX, height);

      stroke(255);
      fill(255);
      text("Digital " + i.toString(), sclX * (i + analogMessages.length) + half, 20);

      for (var j = 0; j < list.length; j++){

        var msg = list[j];
        console.log("msg: ", msg);

      }

    }

  //}

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
