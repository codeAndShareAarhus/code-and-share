
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
      publishMessage(s, "2000");
    }

    // 2 digitale kanaler
    for (var i = 0; i < 2; i++){
      var msgList = [];
      digitalMessages.push(msgList);

      var number = i.toString();
      var s = "digital" + number;
      digitalList.push(s);
      client.subscribe(s);
      publishMessage(s, "-1");
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

  // DEBUG - send et 1 til en tilfædig analog kanal 1 gange i sekundet
  if (frameCount % 60 == 0) {
    var rnd = Math.floor(Math.random() * analogList.length);
    var topic = analogList[rnd];
    publishMessage(topic, "1");
  }

  // altid 33 - bare fordi!
  background(33);

  var width = windowWidth;
  var height = windowHeight;

  // divider vidde med 10 for at finde ud af, hvor bred en række må være
  var sclX = width / 10;
  var half = sclX * 0.5;
  var lineHeight = 30;

  for (var i = 0; i < 10; i++) {
    noStroke();
    fill(255 / 10 * i, 255 / 8 * (i % 8), 255, 180);
    rect(sclX * i, 0, sclX, height);
  }

  var cols = height / lineHeight;

  // transparente rektangler for læsbarheden
  for (var i = 0; i < cols; i++){
    if (i % 2 == 0) {
      noStroke();
      fill(0, 100);
      rect(0, 0 + i * lineHeight, width, lineHeight);
    }
  }

  // loop igennem alle analoge kanaler og hver enkelt besked i kanalens liste
  for (var i = 0; i < analogMessages.length; i++){
    stroke(255);
    fill(255);
    text("Analog " + i.toString(), sclX * i + half, 17);
    var list = analogMessages[i];
    // loop baglæns igennem listen af beskeder for at vise den nyeste øverst!
    for (var j = list.length-1; j >= 0; j--){
      var msg = list[j];
      // console.log("msg: ", msg);
      text(msg, sclX * i + half, 17 + (lineHeight * (j+1) ));
    }
  }

  // loop igennem alle analoge kanaler og hver enkelt besked i kanalens liste
  for (var i = 0; i < digitalMessages.length; i++){
    var list = digitalMessages[i];
    stroke(255);
    fill(255);
    text("Digital " + i.toString(), sclX * (i + analogMessages.length) + half, 17);
    for (var j = list.length-1; j >= 0; j--){
      var msg = list[j];
      // console.log("msg: ", msg);
      text(msg, sclX * (i + analogMessages.length) + half, 17 + (lineHeight * (j+1) ));
    }
  }

  // tegn linjer imellem rækker
  for (var i = 1; i < 10; i++){
    stroke(255);
    noFill();
    line(sclX * i, 0, sclX * i, height);
  }

  cleanMessageLists();

}

// Den her funktion sørger for at mængden af beskeder, som bliver vist aldrig overstiger X
function cleanMessageLists() {
  for (var i = 0; i < analogMessages.length; i++) {
    var len = analogMessages[i].length;
    if (len > 25) {
      analogMessages[i].splice(analogMessages[i].length-1, 1);
    }
  }

  for (var i = 0; i < digitalMessages.length; i++) {
    var len = digitalMessages[i].length;
    if (len > 25) {
      digitalMessages[i].splice(digitalMessages[i].length-1, 1);
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

  // find typen af topic ved at se på første karakter af et topic
  var typeOfTopic = topic.substring(0, 1);

  // hvis karakteren er et a, så er det analog kanal
  if (typeOfTopic == "a") {
    console.log("topic is analog");

    // find ud af hvilket topic der er tale om ved at se på sidste karakter
    // karakteren vil korrespondere med et index i listen over topics

    val = parseInt(message);
    // console.log("val: ", val);
    val = constrain(val, 0, 1023);
    // val = val * 0.000977;
    val = val / 1023;
    val = val.toFixed(2);

    // smid værdien i listen over beskeder for den pågældende kanal
    analogMessages[i].unshift(val);

  }

  if (typeOfTopic == "d") {
    console.log("topic is digital");

    var topicNum = parseInt(topic[topic.length -1]);

    val = parseInt(message);
    // console.log("val: ", val);
    val = constrain(val, 0, 1);

    digitalMessages[i].unshift(val);

  }

  console.log('topic: ', topic, 'message: ', message);
}
