# Spoken script for the LED animation

Harry Bartos · MAKR 100 Project 1

**Length:** 3 minutes 30 seconds. The MP4 is silent so you can record this in your own voice. Read the paragraphs; headings and timecodes are cues, not spoken words. Each paragraph matches the animation at the listed time.

This covers the explanation portion of your video. Keep your overall sequence: show the fully assembled build, demonstrate both modes, open it to show the construction, then use this animation beside the relevant footage.

## 0:00–0:08 · How the LEDs know what to show

Here's how the Arduino decides which LEDs to turn on in each mode.

## 0:08–0:20 · Each position is worth twice as much

In counter mode, each LED has a value: one, two, four, eight, or sixteen. Moving one position to the left doubles the value.

## 0:20–0:33 · Displaying thirteen

To display thirteen, turn on the eight, four, and one positions. Eight plus four plus one equals thirteen. The other two stay off.

## 0:33–0:46 · The main functions

Each short press and release calls incrementCounter, which adds one. Then showBinary reads the five bits of that number and updates the lights.

## 0:46–0:59 · Reading one bit

The function bitRead reads one binary position. Here's the equivalent math: divide by that position's value, keep the whole-number part, then check whether it's odd or even.

## 0:59–1:07 · The ones bit

Thirteen divided by one gives thirteen. Thirteen is odd, so the ones bit is one, and that light is on.

## 1:07–1:15 · The twos bit

Thirteen divided by two gives six whole. Six is even, so the twos bit is zero, and that light is off.

## 1:15–1:23 · The fours bit

Thirteen divided by four gives three whole. Three is odd, so the fours bit is one, and that light is on.

## 1:23–1:31 · The eights bit

Thirteen divided by eight gives one whole. One is odd, so the eights bit is one, and that light is on.

## 1:31–1:39 · The sixteens bit

Thirteen divided by sixteen gives zero whole. Zero is even, so the sixteens bit is zero, and that light is off.

## 1:39–1:50 · Returning to zero

The five results are zero, one, one, zero, one. At thirty-one, all five LEDs are on. The next count resets them to zero.

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

The division-and-parity explanation is the arithmetic equivalent of reading a bit. Your sketch calls `bitRead()` directly. The source and the physical Arduino are unchanged.
