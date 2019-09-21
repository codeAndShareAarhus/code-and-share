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




void connect();


void setup() {
  Serial.begin(115200);

  // Starting wifi and mqtt clients
  WiFi.begin(ssid, pass);
  client.begin("broker.shiftr.io", net);

  // Assign a function that will trigger when receiving messages
  client.onMessage(messageReceived);

 // Connects to wifi and mqtt broker
  connect();
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
  delay(10);

  if (!client.connected()) {
    connect();
  }

  // Publish a message to a topic
  // The function must be given strings
  // Use the String() funcion to cast values of other types
  publishMessage("topic", "message");
  delay(500);
}

// The function that publishes the messages to the mqtt broker
void publishMessage(String topic, String message){
  client.publish(topic, message);
}

// The function that handles receiving messages
void messageReceived(String &topic, String &payload) {
  Serial.println("incoming: " + topic + " - " + payload);
}
