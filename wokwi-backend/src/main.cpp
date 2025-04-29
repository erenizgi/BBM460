#include <Arduino.h>
#include "DHT.h"

#define DHTPIN 4         
#define DHTTYPE DHT22     
#define LDRPIN 36         

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  delay(2000); 
  dht.begin();
  delay(2000);
  Serial.println("System initialized. Reading sensor values...");
}

void loop() {

  int randomNum = rand()%101;
  int randomDivider = rand()%101;
  float finalNumber = ((float)randomNum/(float)randomDivider);
  while (finalNumber > 2){
    finalNumber = finalNumber-2;
  }
  if (finalNumber < 0.5){
    finalNumber += 0.5;
  }

  float temperature = dht.readTemperature();
  temperature = temperature * finalNumber;

  float humidity = dht.readHumidity();
  humidity = humidity * finalNumber;

  int lightLevel = analogRead(LDRPIN);
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
