
#include <Arduino.h>
/*
 ▄▄       ▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄    ▄  ▄▄▄▄▄▄▄▄▄▄▄          ▄▄▄▄      ▄▄▄▄▄▄▄▄▄    ▄▄▄▄▄▄▄▄▄                                                                                           
▐░░▌     ▐░░▌▐░░░░░░░░░░░▌▐░▌  ▐░▌▐░░░░░░░░░░░▌       ▄█░░░░▌    ▐░░░░░░░░░▌  ▐░░░░░░░░░▌                                                                                          
▐░▌░▌   ▐░▐░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌ ▐░▌ ▐░█▀▀▀▀▀▀▀█░▌      ▐░░▌▐░░▌   ▐░█░█▀▀▀▀▀█░▌▐░█░█▀▀▀▀▀█░▌                                                                                         
▐░▌▐░▌ ▐░▌▐░▌▐░▌       ▐░▌▐░▌▐░▌  ▐░▌       ▐░▌       ▀▀ ▐░░▌   ▐░▌▐░▌    ▐░▌▐░▌▐░▌    ▐░▌                                                                                         
▐░▌ ▐░▐░▌ ▐░▌▐░█▄▄▄▄▄▄▄█░▌▐░▌░▌   ▐░█▄▄▄▄▄▄▄█░▌          ▐░░▌   ▐░▌ ▐░▌   ▐░▌▐░▌ ▐░▌   ▐░▌                                                                                         
▐░▌  ▐░▌  ▐░▌▐░░░░░░░░░░░▌▐░░▌    ▐░░░░░░░░░░░▌          ▐░░▌   ▐░▌  ▐░▌  ▐░▌▐░▌  ▐░▌  ▐░▌                                                                                         
▐░▌   ▀   ▐░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌░▌   ▐░█▀▀▀▀█░█▀▀           ▐░░▌   ▐░▌   ▐░▌ ▐░▌▐░▌   ▐░▌ ▐░▌                                                                                         
▐░▌       ▐░▌▐░▌       ▐░▌▐░▌▐░▌  ▐░▌     ▐░▌            ▐░░▌   ▐░▌    ▐░▌▐░▌▐░▌    ▐░▌▐░▌                                                                                         
▐░▌       ▐░▌▐░▌       ▐░▌▐░▌ ▐░▌ ▐░▌      ▐░▌       ▄▄▄▄█░░█▄▄▄▐░█▄▄▄▄▄█░█░▌▐░█▄▄▄▄▄█░█░▌                                                                                         
▐░▌       ▐░▌▐░▌       ▐░▌▐░▌  ▐░▌▐░▌       ▐░▌     ▐░░░░░░░░░░░▌▐░░░░░░░░░▌  ▐░░░░░░░░░▌                                                                                          
 ▀         ▀  ▀         ▀  ▀    ▀  ▀         ▀       ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀    ▀▀▀▀▀▀▀▀▀                                                                                           
                                                                                                                                                                                   
 ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄              ▄         ▄     ▄▄▄▄                                                       
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌            ▐░▌       ▐░▌  ▄█░░░░▌                                                      
▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌ ▀▀▀▀▀█░█▀▀▀ ▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀▀▀  ▀▀▀▀█░█▀▀▀▀            ▄█░█▄▄▄▄▄▄▄█░█▄▐░░▌▐░░▌                                                      
▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌      ▐░▌    ▐░▌          ▐░▌               ▐░▌               ▐░░░░░░░░░░░░░░░▌▀▀ ▐░░▌                                                      
▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░▌       ▐░▌      ▐░▌    ▐░█▄▄▄▄▄▄▄▄▄ ▐░▌               ▐░▌                ▀█░█▀▀▀▀▀▀▀█░█▀    ▐░░▌                                                      
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌       ▐░▌      ▐░▌    ▐░░░░░░░░░░░▌▐░▌               ▐░▌                 ▐░▌       ▐░▌     ▐░░▌                                                      
▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀█░█▀▀ ▐░▌       ▐░▌      ▐░▌    ▐░█▀▀▀▀▀▀▀▀▀ ▐░▌               ▐░▌                ▄█░█▄▄▄▄▄▄▄█░█▄    ▐░░▌                                                      
▐░▌          ▐░▌     ▐░▌  ▐░▌       ▐░▌      ▐░▌    ▐░▌          ▐░▌               ▐░▌               ▐░░░░░░░░░░░░░░░▌   ▐░░▌                                                      
▐░▌          ▐░▌      ▐░▌ ▐░█▄▄▄▄▄▄▄█░▌ ▄▄▄▄▄█░▌    ▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄      ▐░▌                ▀█░█▀▀▀▀▀▀▀█░█▀▄▄▄▄█░░█▄▄▄                                                   
▐░▌          ▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░▌    ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌     ▐░▌                 ▐░▌       ▐░▌▐░░░░░░░░░░░▌                                                  
 ▀            ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀      ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀       ▀                   ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀                                                   
                                                                                                                                                                                   
 ▄▄▄▄▄▄▄▄▄▄   ▄         ▄       ▄         ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄         ▄       ▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄ 
▐░░░░░░░░░░▌ ▐░▌       ▐░▌     ▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌       ▐░▌     ▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
▐░█▀▀▀▀▀▀▀█░▌▐░▌       ▐░▌     ▐░▌       ▐░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌       ▐░▌     ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌ ▀▀▀▀█░█▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀ 
▐░▌       ▐░▌▐░▌       ▐░▌     ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌     ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌     ▐░▌     ▐░▌       ▐░▌▐░▌          
▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌     ▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌     ▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌     ▐░▌     ▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄▄▄ 
▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌     ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌     ▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌     ▐░▌     ▐░▌       ▐░▌▐░░░░░░░░░░░▌
▐░█▀▀▀▀▀▀▀█░▌ ▀▀▀▀█░█▀▀▀▀      ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀█░█▀▀ ▐░█▀▀▀▀█░█▀▀  ▀▀▀▀█░█▀▀▀▀      ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀█░█▀▀      ▐░▌     ▐░▌       ▐░▌ ▀▀▀▀▀▀▀▀▀█░▌
▐░▌       ▐░▌     ▐░▌          ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌     ▐░▌  ▐░▌     ▐░▌       ▐░▌          ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌     ▐░▌       ▐░▌     ▐░▌       ▐░▌          ▐░▌
▐░█▄▄▄▄▄▄▄█░▌     ▐░▌          ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌      ▐░▌ ▐░▌      ▐░▌      ▐░▌          ▐░█▄▄▄▄▄▄▄█░▌▐░▌       ▐░▌▐░▌      ▐░▌      ▐░▌     ▐░█▄▄▄▄▄▄▄█░▌ ▄▄▄▄▄▄▄▄▄█░▌
▐░░░░░░░░░░▌      ▐░▌          ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌     ▐░▌          ▐░░░░░░░░░░▌ ▐░▌       ▐░▌▐░▌       ▐░▌     ▐░▌     ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
 ▀▀▀▀▀▀▀▀▀▀        ▀            ▀         ▀  ▀         ▀  ▀         ▀  ▀         ▀       ▀            ▀▀▀▀▀▀▀▀▀▀   ▀         ▀  ▀         ▀       ▀       ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀ 
                                                                                                                                                                                   
Two Projects On One Arduino

  Project A: Binary counter from 0 to 31 or 32 Bits
  Hold counter button for 5 seconds to switch
  Project B: Logical operators using Button A and Button B.
 
  Pin map (D for Digital Pins)               
  D2  = Counter / Mode 
  D3  = Button A 
  D4  = Button B
  D5  = Project A indicator LED
  D6  = Project B indicator LED
  D7-D12 = Shared Output LEDs


  In english we read left to right but Binary reads from right to left. So Its
  to note the LED numbering will be from the top down High to low However the 
  Logical Operator statements read like normal language, so Project B will  read left to right.


 I need to define all the pins as const global values becuase they wont be changing and most 
 will be used for 2 diffrent purposes. Other wise I would have labeled them one,two,four,eight,
 sixteen and A,B,notA,aAndB,aOrB,xOr (exclusive or) Also becuase their GLOBAL constansts they are 
 cIn ALL_CAPS_WITH_UNDERSCORES

*/


// ==================================================================================================================================
// ========================================================== Global Constant =======================================================
// ==================================================================================================================================

// -------------------- BUTTON PINS --------------------
// The buttons are wired to GND and use INPUT_PULLUP.
// Not pressed = HIGH. Pressed = LOW.
const int MODE_BUTTON_PIN = 2;
const int BUTTON_A_PIN = 3;
const int BUTTON_B_PIN = 4;
// -------------------- MODE INDICATOR LEDS --------------------
// D5 turns on for Project A.
// D6 turns on for Project B.
const int MODE_A_LED_PIN = 5;
const int MODE_B_LED_PIN = 6;
// -------------------- PROJECT A LED ORDER (using an Array) --------------------
// Binary uses right-to-left bit order.
// evean though they are global arrays becuase they are at the top 
// outside the function and are const I felt it makes sense more for the array not to be all capps
// DATA LED1 = D12 = 1s bit.
// DATA LED2 = D11 = 2s bit.
// DATA LED3 = D10 = 4s bit.
// DATA LED4 = D9  = 8s bit.
// DATA LED5 = D8  = 16s bit.
const int binaryLeds[] = {12, 11, 10, 9, 8};
const int BINARY_LED_COUNT = 5;
// -------------------- PROJECT B LED ORDER ARRAY--------------------
// Logic reads left-to-right on the breadboard.
// D7  = A indicator
// D8  = B indicator
// D9  = !A
// D10 = A && B
// D11 = A || B
// D12 = (A && !B) || (!A && B)
const int logicLeds[] = {7, 8, 9, 10, 11, 12};
const int LOGIC_LED_COUNT = 6;
// -------------------- ALL SHARED OUTPUT LEDS --------------------
// This list is used only to clear every shared LED before changing displays.
const int allDataLeds[] = {12, 11, 10, 9, 8, 7};
const int DATA_LED_COUNT = 6;
// -------------------- TIMING SETTINGS --------------------
// Hold the Mode button for 5 seconds to switch projects.
const unsigned long MODE_HOLD_TIME = 5000;

// Debounce keeps one physical button press from being read as many presses.
const unsigned long DEBOUNCE_DELAY = 50;

// -------------------- PROGRAM STATE --------------------
// false means Project A is active. true means Project B is active.
bool projectBActive = false;

// Project A counter value. It goes from 0 to 31, then resets to 0.
int counter = 0;

// -------------------- MODE BUTTON TRACKING --------------------
// These variables help tell the difference between a short press and a 5 second hold.
int lastModeReading = HIGH;
int stableModeState = HIGH;
unsigned long lastModeDebounceTime = 0;
unsigned long modePressStartTime = 0;
bool modeHoldHandled = false;

// -------------------- SERIAL MONITOR TRACKING --------------------
// These variables keep Project B from printing the same line over and over.
bool lastLogicA = false;
bool lastLogicB = false;
bool logicPrinted = false;

void setup() {
  // Start the Serial Monitor at 9600 baud.
  // This lets us display the counter number and the logic results.
  Serial.begin(9600);

  // INPUT_PULLUP is the reason pressed buttons read LOW instead  of HIGH.
  pinMode(MODE_BUTTON_PIN, INPUT_PULLUP);
  pinMode(BUTTON_A_PIN, INPUT_PULLUP);
  pinMode(BUTTON_B_PIN, INPUT_PULLUP);

  // Set the two mode LEDs as outputs.
  pinMode(MODE_A_LED_PIN, OUTPUT);
  pinMode(MODE_B_LED_PIN, OUTPUT);

  // We use a loop to configure all the shared LEDs at once. It starts at i = 0 and 
  // runs until it hits DATA_LED_COUNT, setting each pin in the array to OUTPUT and 
  // turning it off so we have a clean slate. (this is in the void setup loop still)
  for (int i = 0; i < DATA_LED_COUNT; i++) {
    pinMode(allDataLeds[i], OUTPUT);
    digitalWrite(allDataLeds[i], LOW);
  }

  // Start in Project A.
  // This turns on D5 and turns off D6.
  updateModeIndicators();

  // Show the starting project and starting value in the Serial Monitor.
  Serial.println("Project A: Binary Counter");
  Serial.println("Counter: 0");
}

void loop() {
  // The Mode button always needs to be checked first.
  // Notice this is our only loop. its super short becuase it has to catch buttin pushes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  // A short press counts in Project A.
  // A 5 second hold switches between Project A and Project B.
  handleModeButton();

  // Run the act ive project. sence the z
  if (projectBActive) {
    runProjectB();
  } else {
    showBinary(counter);
  }
}

void handleModeButton() {
  // Read the Mode button.
  // HIGH = not pressed. LOW = pressed.
  int reading = digitalRead(MODE_BUTTON_PIN);

  // If the reading changed, save the time.
  // The code waits briefly before trusting the change.
  if (reading != lastModeReading) {
    lastModeDebounceTime = millis();
    lastModeReading = reading;
  }

  // Debounce check:
  // Only accept the new button state after it has stayed stable long enough.
  if ((millis() - lastModeDebounceTime) > DEBOUNCE_DELAY) {
    if (reading != stableModeState) {
      stableModeState = reading;

      if (stableModeState == LOW) {
        // The Mode button was just pressed.
        // Start timing in case this becomes a 5 second hold.
        modePressStartTime = millis();
        modeHoldHandled = false;
      } else {
        // The Mode button was just released.
        // If the hold did not already switch modes, treat this as a short press.
        if (!modeHoldHandled && !projectBActive) {
          incrementCounter();
        }
      }
    }
  }

  // Long-hold check:
  // If the button is still held after 5 seconds, switch projects.
  if (stableModeState == LOW && !modeHoldHandled) {
    if ((millis() - modePressStartTime) >= MODE_HOLD_TIME) {
      toggleProjectMode();

      // This prevents the same hold from switching back and forth repeatedly.
      modeHoldHandled = true;
    }
  }
}

void toggleProjectMode() {
  // Flip the active project.
  // false becomes true, true becomes false.
  projectBActive = !projectBActive;

  // Clear old LEDs so Project A output does not stay on during Project B,
  // and Project B output does not stay on during Project A.
  turnOffDataLeds();

  // Update D5 and D6 mode indicator LEDs.
  updateModeIndicators();

  if (projectBActive) {
    // We just entered Project B.
    // Let Project B print its first line again.
    logicPrinted = false;

    // Print labels for the logic project.
    Serial.println("Project B: Logical Operators");
    Serial.println("Left to right: A, B, !A, A&&B, A||B, (A&&!B)||(!A&&B)");
  } else {
    // We just returned to Project A.
    Serial.println("Project A: Binary Counter");
    showBinary(counter);
  }
}

void updateModeIndicators() {
  // D5 and D6 show which project is active.
  // Project A: D5 on, D6 off.
  // Project B: D5 off, D6 on.
  digitalWrite(MODE_A_LED_PIN, projectBActive ? LOW : HIGH);
  digitalWrite(MODE_B_LED_PIN, projectBActive ? HIGH : LOW);
}
;;;;
void incrementCounter() {
  // Add 1 to the Project A counter.
  counter++;

  // Project A only counts from 0 to 31.
  // After 31, the next press resets it back to 0.
  if (counter > 31) {
    counter = 0;
  }

  // Update the binary LEDs to match the new number.
  showBinary(counter);

  // Also print the decimal number to the Serial Monitor.
  Serial.print("Counter: ");
  Serial.println(counter);
}

void showBinary(int value) {
  // Turn off all shared LEDs first.
  // This makes sure old 1 bits turn off when they become 0 bits.
  turnOffDataLeds();

  // bitRead(value, i) pulls one binary digit out of the number.
  // i = 0 reads the 1s bit.
  // i = 1 reads the 2s bit.
  // i = 2 reads the 4s bit.
  // i = 3 reads the 8s bit.
  // i = 4 reads the 16s bit.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
  for (int i = 0; i < BINARY_LED_COUNT; i++) {
    digitalWrite(binaryLeds[i], bitRead(value, i));
  }
}

void runProjectB() {
  // Read Button A and Button B.
  // Since the buttons use INPUT_PULLUP, LOW means pressed.
  bool stateA = (digitalRead(BUTTON_A_PIN) == LOW);
  bool stateB = (digitalRead(BUTTON_B_PIN) == LOW);

  // !A means NOT A.
  // This is true when Button A is NOT pressed.
  bool notA = !stateA;

  // A && B means A AND B.
  // This is true only when both buttons are pressed at the same time.
  bool andResult = stateA && stateB;

  // A || B means A OR B.
  // This is true when A is pressed, B is pressed, or both are pressed.
  bool orResult = stateA || stateB;

  // (A && !B) || (!A && B) means only one button is pressed.
  // This is often called XOR, but the assignment asks for the full expression,
  // so the comments and Serial Monitor show the full expression.
  bool xorExpression = (stateA && !stateB) || (!stateA && stateB);

  // Project B LED order fix:
  // The logic LEDs use logicLeds[], not binaryLeds[].
  // This makes the lights match the written logic order from left to right.
  digitalWrite(logicLeds[0], stateA);         // D7  shows A.
  digitalWrite(logicLeds[1], stateB);         // D8  shows B.
  digitalWrite(logicLeds[2], notA);           // D9  shows !A.
  digitalWrite(logicLeds[3], andResult);      // D10 shows A && B.
  digitalWrite(logicLeds[4], orResult);       // D11 shows A || B.
  digitalWrite(logicLeds[5], xorExpression);  // D12 shows (A&&!B)||(!A&&B).

  // Only print when A or B changes.
  // Without this, the Serial Monitor would fill up nonstop.
  if (!logicPrinted || stateA != lastLogicA || stateB != lastLogicB) {
    printLogicStates(stateA, stateB, notA, andResult, orResult, xorExpression);

    // Save the last values so we can detect the next change.
    lastLogicA = stateA;
    lastLogicB = stateB;
    logicPrinted = true;
  }
}

void printLogicStates(bool stateA, bool stateB, bool notA, bool andResult, bool orResult, bool xorExpression) {
  // This function prints one clean Serial Monitor line for Project B.
  // Each value is printed as 1 for true/on and 0 for false/off.

  // Print the two button input values first.
  Serial.print("A=");
  Serial.print(stateA ? 1 : 0);

  Serial.print(" B=");
  Serial.print(stateB ? 1 : 0);

  // Print the required logic outputs in the same order as the LEDs.
  Serial.print(" | !A=");
  Serial.print(notA ? 1 : 0);

  Serial.print(" | A&&B=");
  Serial.print(andResult ? 1 : 0);

  Serial.print(" | A||B=");
  Serial.print(orResult ? 1 : 0);

  Serial.print(" | (A&&!B)||(!A&&B)=");
  Serial.println(xorExpression ? 1 : 0);
}

void turnOffDataLeds() {
  // Turn off every shared Project LED from D12 down to D7.
  // This is used before drawing binary and before changing modes.
  for (int i = 0; i < DATA_LED_COUNT; i++) {
    digitalWrite(allDataLeds[i], LOW);
  }
}
