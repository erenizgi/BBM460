#include <Arduino.h>
#include "DHT.h"

#define DHTPIN 4          // DHT22 DATA connected to GPIO4
#define DHTTYPE DHT22     // DHT 22 (AM2302)
#define LDRPIN 36         // LDR SIGNAL connected to GPIO36 (ADC1_CH0)

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  delay(2000); // Wait for the sensor to stabilize
  dht.begin();
  delay(2000); // Wait for the sensor to stabilize
  Serial.println("System initialized. Reading sensor values...");
}

void loop() {
  // Read temperature and humidity from DHT22
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Read light level from LDR
  int lightLevel = analogRead(LDRPIN);

  // Check if DHT22 reading was successful
  
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT22 sensor!");
  } else {
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print(" °C | Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");
  }

  Serial.print("Light Level (LDR): ");
  Serial.println(lightLevel);

  Serial.println("--------------------------");
  delay(2000); // Wait 2 seconds before next reading
  
  
}
