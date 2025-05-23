#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#define DHTPIN 4         
#define DHTTYPE DHT22     
#define LDRPIN 36         

DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);

const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* mqtt_server = "broker.hivemq.com";

void setup() {
  Serial.begin(115200);
  delay(2000); 
  dht.begin();
  Serial.print("Connecting to WiFi");
  WiFi.begin("Wokwi-GUEST", "", 6);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi bağlandı");
  
  delay(2000);
  client.setServer(mqtt_server, 1883);
  Serial.println("System initialized. Reading sensor values...");
}

void loop() {
  if (!client.connected()) {
    while (!client.connect("esp32-client")) {
      Serial.print(".");
      delay(1000);
    }
    Serial.println("MQTT broker'a bağlanıldı.");
  }
  client.loop();



  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int lightLevel = analogRead(LDRPIN);

  String payload = "Sıcaklık: " + String(temperature) + "°C, Nem: " + String(humidity) + "%" + "Light: " + String(lightLevel);
  client.publish("wokwi/test", payload.c_str());

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT22 sensor!");
  } else {
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" °C");

    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.println("%");
  }

  Serial.print("Light Level (LDR): ");
  Serial.println(lightLevel);
  Serial.print("\n");

  delay(2000);
  
  
}
