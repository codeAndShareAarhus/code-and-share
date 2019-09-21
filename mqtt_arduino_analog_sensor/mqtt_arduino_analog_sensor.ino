// This example uses an Adafruit Huzzah ESP8266
// to connect to shiftr.io.
//
// You can check on your device after a successful
// connection here: https://shiftr.io/try.
//
// by Joël Gähwiler
// https://github.com/256dpi/arduino-mqtt
//
// Modified by Nikolaj Mikkelsen

// Includes wifi and mqtt libraries
#include <ESP8266WiFi.h>
#include <MQTTClient.h>

// Enter wifi credentials
const char ssid[] = "";
// indtast wifi kode
const char pass[] = "";

// Enter 'key/username' from shiftr
const char key[] = "";
// Enter secret/password fra shiftr
const char secret[] = "";
// Choose a client ID
const char clintID[] = "";


WiFiClient net;
MQTTClient client;

unsigned long lastMillis = 0;

void connect();

int sensorPin = A0;
int sensorValue;

void setup() {
  Serial.begin(115200);

  // Starting wifi and mqtt clients
  WiFi.begin(ssid, pass);
  client.begin("broker.shiftr.io", net);

  // Assign a function that will trigger when receiving messages
  client.onMessage(messageReceived);

 // Connects to wifi and mqtt broker
  connect();

  // Tells the arduino that we are using the pin as an input
  pinMode(sensorPin, INPUT);
}

// Connects to wifi and mqtt if not connected
// Writes "..." untill the device has connected
void connect() {
  // Connects to wifi
  Serial.print("checking wifi...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  Serial.print("\nconnecting...");

  // Connects to mqtt
  while (!client.connect(clientID, key, secret)){
    Serial.print(".");
    delay(1000);
  }

  Serial.println("\nconnected!");

// Uncomment next line to subcribe/listen to a topic
// client.subscribe("/aTopic");
}

void loop() {
  client.loop();
  delay(10);  // <- fixes some issues with WiFi stability

  // Reconnects if we have been disconnected
  if (!client.connected()) {
    connect();
  }

  // Chooses a topic to publish our value to
  String topic = "/analogSensorTestTopic";
  // Reads the value of our sensor
  sensorValue = analogRead(sensorPin);
  // Casts the value to a Starting
  String stringValue = String(sensorValue);
  // Publishes the value to our topic
  client.publish(topic, stringValue);

  Serial.print("Publishing: ");
  Serial.println(stringValue);
  Serial.print("To topic: ");
  Serial.println(topic);
  Serial.println();

  // Waits a second
  delay(1000);
}

// This function is only used if we subscribe to topics
void messageReceived(String &topic, String &payload) {
  Serial.print("Received value: ");
  Serial.println(payload);
  Serial.print("On topic: ");
  Serial.println(topic);
  Serial.println();
}
