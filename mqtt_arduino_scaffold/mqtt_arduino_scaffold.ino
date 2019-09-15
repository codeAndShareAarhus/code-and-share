// This example uses an Adafruit Huzzah ESP8266
// to connect to shiftr.io.
//
// You can check on your device after a successful
// connection here: https://shiftr.io/try.
//
// by Joël Gähwiler
// https://github.com/256dpi/arduino-mqtt



//Inkluderer de anvendte libraries
#include <ESP8266WiFi.h>
#include <MQTTClient.h>

// indtast wifi navn
const char ssid[] = "";
// indtast wifi kode
const char pass[] = "";

// indtast 'key/username' fra shiftr
const char key[] = "";
// indtast secret/password fra shiftr
const char secret[] = "";
// Deklarere variabler til MQTT og Net (Vi bruger til at forbinde til internettet og bruge mqtt)


WiFiClient net;
MQTTClient client;




void connect();


void setup() {
  Serial.begin(115200);
  // Her starter vi WIFI og client
  WiFi.begin(ssid, pass);
  client.begin("broker.shiftr.io", net);
  // når clienten modtager en besked, skal den sende beskeden videre til funktionen 8messageReceived)
  client.onMessage(messageReceived);
 // Forbinder til wifi og broker
  connect();
}
// Tjekker Wifi-status (skriver '...' indtil ESP'en er forbundet)
void connect() {
  Serial.print("checking wifi...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  Serial.print("\nconnecting...");
  // når klienten er forbundet giver den klient navn+usr+token
  while (!client.connect("arduino", key, secret)){
    Serial.print(".");
    delay(1000);
  }
// Skriver serielt når der er forbundet til internettet og broker
  Serial.println("\nconnected!");
//Forbinder til den adresse som der skal læses beskeder fra
  client.subscribe("");


}

void loop() {
  client.loop();
  delay(10);

  if (!client.connected()) {
    connect();
  }

  // Skriver på adressen(topic)  og sender beskeden(message)
  publishMessage("", "");
  delay(500);
}
//Deklarere funktionen for at sende beskeden til (topic,message)
void publishMessage(String topic, String message){
  client.publish(topic, message);
}
// læser beskeder fra de subscribede topics (adresser)
void messageReceived(String &topic, String &payload) {
  Serial.println("incoming: " + topic + " - " + payload);
}
