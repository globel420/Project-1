# Project 1 video script

Harry Bartos · MAKR 100 · Binary Counter and Logical Operators

## Recording order

Start with the project completely assembled and covered. Demonstrate that both modes work before opening anything. Then show the construction. Finish with a slowed explanation of the program, using the earlier button-press footage beside the animated flowchart and highlighted code.

The assignment requires a video showing the project requirements in action but does not specify its duration. The separate in-class presentation is 5–7 minutes. This version focuses on the working build and the two main ideas. Allow roughly 5–7 minutes, depending on the length of the demonstration and teardown.

The words below are narration. Bracketed directions are actions to film, not words to read aloud. The described LED results are the expected results of the saved sketch; match the narration to what the hardware actually shows.

## 1. The finished build

**Picture:** Full frame. Keep the enclosure completely assembled. Start with a steady close-up, then turn it slowly to show the top, controls, sides, and base. Leave the insides covered.

**Say:**

“This is my Project 1 for MAKR 100. I combined the binary counter and the logical operators into one Arduino build. They share the same output LEDs, and this button switches between the two modes.

“I designed and printed the enclosure, including the labeled top plate and the button parts. Before I open it up, I'll show it working.”

## 2. Demonstrate the enclosed binary counter

**Picture:** Close enough to read the labels and see your finger release the button. Keep the two mode indicators visible. Start or reset the Arduino on camera. Record the count continuously from 0 through 31 and back to 0. You can pause your narration while counting, but keep the demonstration legible.

**Say:**

“It starts in Project A at zero. The Project A indicator is on, but all five counting LEDs are off.

“Each short press and release adds one. Here's one, two, and three. The light represents a one, and an unlit position represents a zero.

“These five positions are worth one, two, four, eight, and sixteen. Together they represent thirty-two different values, from zero through thirty-one.”

**[Continue to 13 and hold the shot.]**

“At thirteen, the eight, four, and one positions are on. Eight plus four plus one gives us thirteen.”

**[Continue to 31. Pause with all five counting LEDs on. Press and release once more.]**

“At thirty-one, all five are on. One more press takes it back to zero.”

**[Advance to 13 again. Keep that count for the mode-switch demonstration.]**

## 3. Demonstrate enclosed logic mode

**Picture:** Keep the enclosure closed. Hold the Counter/Mode button continuously for five seconds. Show the indicator change. Then demonstrate each A/B combination long enough to see the result. Release both buttons between combinations.

**Say:**

“I'm leaving the count at thirteen. Holding this button for five seconds switches to Project B. The mode indicator changes, and the same LEDs now show the logical results.

“These two buttons are A and B. Their indicators show whether each button is pressed. The remaining lights show NOT A, AND, OR, and exclusive OR.”

**[Neither button pressed.]**

“With neither button pressed, only NOT A is on.”

**[Press A only.]**

“With A alone, A, OR, and exclusive OR are on.”

**[Release A, then press B only.]**

“With B alone, B, NOT A, OR, and exclusive OR are on.”

**[Press both.]**

“With both pressed, A, B, AND, and OR are on. Exclusive OR turns off because it requires exactly one input.”

**[Release both, then hold Mode for five seconds.]**

“Holding Mode again brings back Project A. It also brings back thirteen. Switching modes preserves the count.”

## 4. Open it and show the construction

**Picture:** Disconnect USB power before opening the enclosure. Show the removed cover and how the pieces fit. Get separate close-ups of the Arduino, top and underside of the soldered board, buttons, resistors, wiring, and printed parts. Do not try to hold every piece while narrating; voice-over works well here.

**Say:**

“Now that you've seen it working, here's what's inside.

“The Arduino Uno runs both modes. I used three momentary buttons, six shared output LEDs, and two mode indicators. Each LED has its own resistor.

“I started with the circuit in Tinkercad and on a breadboard. After having trouble with the breadboard connections, I moved it onto a soldered prototyping board. I could also route connections underneath to keep the top cleaner.

“I designed the printed parts in Tinkercad too. The enclosure and labels bring the two projects together, even though the same LEDs have different jobs in each mode.”

For the exported animation, use **[Animation_Spoken_Script.md](Animation_Spoken_Script.md)**. It contains the exact narration matched to the 3:30 movie. The paragraphs below remain a shorter alternative for your overall project video.

## 5. How the binary counter chooses its lights

**Picture:** Show the enclosed hardware at 13 alongside the simplified **Binary numbers** illustration. The 1s LED is at the far right. Across the screen, the positions are 16, 8, 4, 2, 1. The loop starts at the rightmost LED and moves left. Keep the Serial Monitor visible briefly so the decimal count can be compared with the lights. Use **Read the five bits slowly** to point at each position without changing the diagram.

**Say:**

“Each light represents a different value: one, two, four, eight, and sixteen. The value doubles at every position because binary is base two.

“To display a number, the lights that are on must add up to that number. Thirteen is eight plus four plus one. So those three lights turn on, while sixteen and two stay off. Written in the usual sixteen-to-one binary order, that's zero, one, one, zero, one.

“The count is already stored in the Arduino as binary. incrementCounter adds one to it. showBinary takes that number and goes through the five LED positions in a loop.

“At each position, bitRead gets either a zero or a one. digitalWrite uses that result to turn the matching light off or on. So the Arduino isn't guessing a pattern. It's displaying the five bits of the number.

“At thirty-one, all five positions are one. Add another count, and the program resets it to zero.”

**Close-up of the actual code:** Show `bitRead(counter, i)`, then its Arduino definition: `(counter >> i) & 1`.

“Arduino shifts the number right by the bit position, then uses bitwise AND with one. That keeps only the bit at the far right.

“For the twos LED, i is one. Thirteen is zero-one-one-zero-one in binary. Shift right once and the result ends in zero. AND with one gives zero, so that LED is off.

“Two is zero-zero-zero-one-zero. Shift right once and the result ends in one. AND with one gives one, so the same twos LED is on.”

## 6. How the logical operators choose their lights

**Picture:** Switch to **Logical operators**. Match the illustrated A and B buttons to the real buttons in each clip. Use **Explain the four results slowly** or **Next result**. Keep the same four rules visible throughout.

**Say:**

“Logic mode uses a different rule. Each button becomes a true-or-false value. A pressed button means true, and a released button means false.

“runProjectB reads A and B, then asks four questions.

“NOT A asks whether A is released. AND asks whether both buttons are pressed. OR asks whether at least one button is pressed. Exclusive OR asks whether exactly one button is pressed.

“Every true answer turns its output light on. Every false answer turns it off.

“With A alone, OR and exclusive OR are true, but NOT A and AND are false. With both buttons pressed, AND and OR are true, but exclusive OR is false because it needs exactly one.

“The two input indicators show A and B directly. The other four lights show the answers to those questions. The program checks again as the main loop repeats, so the lights respond when I change the buttons.”

## 7. Close on the assembled project

**Picture:** End with the working project fully assembled. Reuse the opening shot or film another after reassembly.

**Say:**

“That's how the two modes use the same LEDs. One displays the bits of a number. The other displays the results of four logical conditions.”

**End credit:** “Circuit and enclosure designed in Tinkercad. AI assistance with combining the program modes and preparing this explanation; details in the project report.”

## Editing and recording notes

You can record the physical build directly into QuickTime with your iPhone as a Continuity Camera: close iPhone Mirroring, aim and lock the phone, then choose **QuickTime Player → File → New Movie Recording** and select your iPhone camera from the recording-device menu. iPhone Mirroring itself does not provide camera access. [Apple: Continuity Camera](https://support.apple.com/en-us/102546) · [QuickTime recording](https://support.apple.com/en-mk/guide/quicktime-player/qtp356b55534/mac)

- Keep the original order: fully assembled build, working demonstration of both modes, then disconnect power and open the enclosure to show its construction.
- The main explanation now focuses on the binary values and the four logic rules. Startup, debounce, pin numbers, Serial formatting, and nested function calls do not need a separate walkthrough.
- Show hardware and the simple illustration beside one another. The diagram stays in place; only the current bit or logical result gets highlighted.
- The illustration is controlled separately from the board. Match its displayed number or A/B state to the actual footage when editing.
- In Arduino IDE, the Serial Monitor shows the decimal counter and logical results. Use **Tools → Serial Monitor** or **Command-Shift-M**, with **9600 baud**. It can appear briefly beside the physical LEDs as another way to show the result.
- Use **Next light** and **Next result** to match your narration, or use the slow-play buttons. The code example uses the actual right-shift and bitwise-AND operations.
- The detailed code page remains available as a reference; it is not needed for this simpler video explanation.

## Sources used

- `../Instructions.pdf`: required behavior, video submission instructions, presentation timing, and assistance-credit requirement.
- `../Program/Program.ino`: pin map, actual functions and line numbers, debounce, release counting, mode changes, output loops, logical expressions, and Serial output.
- `../Report/Project_1_Report_Example.docx`: construction account, Tinkercad work, printed enclosure, move from breadboard to soldered board, and underside wiring.

The animation includes a snapshot of the current sketch in `source.js`. If the sketch changes later, refresh that snapshot and the line references before using it for another recording.
