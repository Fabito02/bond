#include "SoftwareSerial.h"

SoftwareSerial bluetooth(11, 10);

void setup() {
  Serial.begin(9600);
  Serial.println(F("Tentando configurar..."));

  bluetooth.begin(38400);
  delay(1000);

  bluetooth.print("AT+NAME=Bond\r\n");
  delay(1000);
  
  bluetooth.print("AT+NAME?\r\n");
}

void loop() {
  if (Serial.available()) {
    char r = Serial.read();
    bluetooth.print(r);
    Serial.print(r);
  }

  if (bluetooth.available()) {
    char r = bluetooth.read();
    Serial.print(r);
  }
}