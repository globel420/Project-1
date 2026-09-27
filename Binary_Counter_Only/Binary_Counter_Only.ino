// Harry Bartos - MAKR 100 Project 1, Option A
// Press and release the button to count from 0 through 31, then back to 0.
// Button: D2 to GND. LEDs: D12=1, D11=2, D10=4, D9=8, D8=16.

#include <Arduino.h>

const int BUTTON_PIN = 2;
const int LED_PINS[] = {12, 11, 10, 9, 8};
const int LED_COUNT = 5;

int counter = 0;
int lastButtonState = HIGH;  // INPUT_PULLUP: released = HIGH, pressed = LOW.

void displayCount();

void setup() {
  Serial.begin(9600);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  for (int i = 0; i < LED_COUNT; i++) {
    pinMode(LED_PINS[i], OUTPUT);
  }

  displayCount();  // Start at zero with all five LEDs off.
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);

  if (buttonState != lastButtonState) {
    delay(50);  // Ignore a brief bounce in the button contacts.
    buttonState = digitalRead(BUTTON_PIN);

    if (buttonState != lastButtonState) {
      lastButtonState = buttonState;

      if (buttonState == HIGH) {  
        counter++;

        if (counter > 31) {
          counter = 0;
        }

        displayCount();
      }
    }
  }
}

void displayCount() {
  for (int i = 0; i < LED_COUNT; i++) {
    digitalWrite(LED_PINS[i], bitRead(counter, i));
  }

  Serial.print("Counter: ");
  Serial.println(counter);
}
