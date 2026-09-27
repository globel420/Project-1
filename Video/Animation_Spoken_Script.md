# Spoken script for the LED animation

Harry Bartos · MAKR 100 Project 1

**Length:** 3 minutes 30 seconds. The video is silent for your own narration. Read the paragraphs; headings and timecodes are cues.

The **1s LED is at the far right**. Across the screen from left to right, the values are **16, 8, 4, 2, 1**. The code visits the lights from right to left: bit 0 through bit 4.

The calculations follow the actual right-shift and bitwise-AND operations in Arduino’s `bitRead()` definition. Keep the overall recording order: assembled build, demonstration, construction/teardown, then explanation.

## 0:00–0:08 · How the LEDs know what to show

Here's how the Arduino decides which LEDs to turn on in each mode.

## 0:08–0:20 · Each position is worth twice as much

The ones LED is on the far right. Moving left, the values are two, four, eight, and sixteen. The code starts at the rightmost LED.

## 0:20–0:33 · Displaying thirteen

To display thirteen, the one, four, and eight lights are on. One plus four plus eight equals thirteen. The two and sixteen lights stay off.

## 0:33–0:46 · The main functions

Each short press and release calls incrementCounter, which adds one. Then showBinary reads the five bits of that number and updates the lights.

## 0:46–0:59 · The actual code inside bitRead

bitRead shifts the number right, then uses bitwise AND with one. The shift moves the chosen bit to the rightmost position. AND keeps only that bit.

## 0:59–1:07 · Bit 0: the rightmost ones LED

Shifting thirteen by zero leaves its bits unchanged. AND with one returns one, so pin twelve turns on.

## 1:07–1:15 · Bit 1: the twos LED

Thirteen shifted right once ends in zero. AND with one gives zero, so the twos LED is off.

## 1:15–1:23 · Bit 2: the fours LED

Shift thirteen right twice. The last bit is one. AND with one keeps it, turning on the fours LED.

## 1:23–1:31 · Bit 3: the eights LED

Shift thirteen right three times. The result is one. AND with one keeps it, turning on the eights LED.

## 1:31–1:39 · Bit 4: the leftmost sixteens LED

Shift thirteen right four times. The result is zero. AND with one keeps zero, so the sixteens LED stays off.

## 1:39–1:50 · Returning to zero

The one, four, and eight LEDs are on for thirteen. At thirty-one, all five are on. Another press resets the count to zero.

## 1:50–2:02 · Pressed = true     Released = false

Logical operators work with true-or-false answers. runProjectB reads the two buttons. A pressed button becomes true; a released button becomes false.

## 2:02–2:13 · Is A released?

NOT A asks, is A released? With A released, NOT A is true and its LED is on. Pressing A makes it false.

## 2:13–2:24 · Are both buttons pressed?

AND asks, are both buttons pressed? Its LED turns on only when A and B are both true.

## 2:24–2:35 · Is at least one button pressed?

OR asks, is at least one button pressed? A alone, B alone, or both together make OR true.

## 2:35–2:48 · Is exactly one button pressed?

Exclusive OR asks, is exactly one button pressed? A alone or B alone makes it true. Press both, and exclusive OR turns off.

## 2:48–2:55 · Neither button pressed

With neither button pressed, the only output light on is NOT A.

## 2:55–3:02 · A only

With A alone, the A indicator, OR, and exclusive OR are on.

## 3:02–3:09 · B only

With B alone, B, NOT A, OR, and exclusive OR are on.

## 3:09–3:18 · Both buttons pressed

With both pressed, A, B, AND, and OR are on. Exclusive OR is off.

## 3:18–3:30 · True → LED on     False → LED off

For every result, digitalWrite turns the matching LED on for true and off for false. The main loop repeats, so the display responds whenever the buttons change.

---

Verified source: Arduino AVR Boards 1.8.8, `cores/arduino/Arduino.h`, line 111:

```cpp
#define bitRead(value, bit) (((value) >> (bit)) & 0x01)
```

`>>` shifts right. `&` is bitwise AND. `0x01` is one written in hexadecimal. Binary operands show the lowest five bits because this counter ranges from 0 to 31.
