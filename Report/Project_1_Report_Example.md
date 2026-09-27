# Project 1 Report

## Binary Counter and Logical Operators

Harry Bartos  
MAKR 100 Introduction to Microcontrollers and Physical Computing  
Instructor Nicole Shuman  
Fall 2026

### What I completed

For Project 1, I completed both Option A, the binary counter, and Option B, the logical operators project. I combined them into one Arduino build with a shared set of LEDs and a button that switches between the two modes. I also 3D printed a shell for the project and moved the circuit from the breadboard onto a soldered prototyping board.

I decided to do both because I have a passion for making things, and I had the opportunity. That was a big part of it. I know I probably won't have as many chances to do extra work like this later in the semester, so I wanted to take advantage of the time and equipment I had available. Combining the two options gave me a little more to figure out, especially because the same LEDs have different jobs depending on which project is running.

### Materials I used

My materials list records the following parts and printing material.

| Component or material | Quantity | Use |
| --- | --- | --- |
| Arduino Uno R3 | 1 | Runs both project modes |
| Push buttons | 3 | Counter/Mode button and inputs A and B |
| Data LEDs | 6 | Shared binary and logical output display |
| Yellow mode indicator LEDs | 2 | Show which project is active |
| 220 ohm resistors | 8 | One in series with each LED |
| Solderable prototyping board | 1 | Holds the soldered circuit |
| 22 gauge stranded copper wire | 40 inches | Circuit connections |
| Black PLA | 151 grams | Printed project parts |
| Green glow PLA | 34 grams | Printed project parts |
| White PLA | 4 grams | Printed project parts |

I also used a solderless breadboard during the earlier part of the build. Reproducing the project requires a suitable USB cable and a computer with the Arduino IDE to upload the sketch. The enclosure parts are saved as STL files, and the Bambu Studio project is included as a 3MF file.

### Designing in Tinkercad and printing the shell

I did the design work in Tinkercad. I used the circuit simulator to work on the electronics, and I also designed the 3D parts there. The 3D design probably took me the most time out of the whole project.

I was able to print the project's shell early on, and there is a personal reason that part of the project meant a lot to me. Falcons Care at Folsom Lake College helped me with temporary housing during the first part of the month. I was staying at Extended Stay, which gave me the chance to bring my 3D printer out of storage for the first time in about two years.

I had a great time finally being able to print again. Having the printer available meant I could make an enclosure for this assignment while I had the chance. I had missed being able to take something I was working on and turn it into a physical part.

I would have spent more time on the 3D parts if I'd had the chance, but I had to call it on September 19. It was time to pack my printer back up, and it was still hot when I packed it.

The saved print files include a body shell, top plate, bottom base, and an Arduino cover. There are also separate button parts. The top plate gives the LEDs labels for both projects, and the base includes my name and the class information. Since the LEDs change jobs between modes, those labels help explain what the display is showing.

### Building the circuit and changing plans

I used Tinkercad's simulator to work on the circuit and a breadboard for the physical build. Later in the project, I was breaking pins off in the breadboard to try to make sure the connections made contact. That turned out to be a bad plan. I was trying to get the circuit to stay connected, and the way I was doing it was creating another problem.

When I was putting things back into storage, I came across a stash of ProtoSlim prototyping boards. I decided to use one and solder the project onto it. That decision came pretty late in the project, but I was happy to finally have a use for one of those boards. And I still have four more.

The soldered version uses the same electrical connections as the breadboard design. All of the buttons connect their assigned input pin to ground when pressed. The sketch uses INPUT_PULLUP, so an unpressed button reads HIGH and a pressed button reads LOW. That means the buttons do not need separate external pull-up resistors in this design.

Each LED has its own 220 ohm resistor in series. The LED circuits return to the Arduino's ground, and the code turns an LED on by setting its output pin HIGH. To reproduce the wiring, connect each output through its resistor and LED to ground, with the LED's anode toward the output and cathode toward ground. For each push button, use contacts that become connected when the button is pressed.

### Pin connections

The following pin map matches the Program.ino file in my project folder. The six data LEDs use D7 through D12. Five of them display the counter, while all six are used in the logical operators mode.

| Arduino pin | Project A binary counter | Project B logical operators |
| --- | --- | --- |
| D2 | Counter/Mode button to ground | Mode button to ground |
| D3 | Button A, unused in this mode | Button A input to ground |
| D4 | Button B, unused in this mode | Button B input to ground |
| D5 | Project A indicator on | Project A indicator off |
| D6 | Project B indicator off | Project B indicator on |
| D7 | Data LED off | A indicator |
| D8 | 16s bit | B indicator |
| D9 | 8s bit | NOT A, !A |
| D10 | 4s bit | AND, A && B |
| D11 | 2s bit | OR, A \|\| B |
| D12 | 1s bit | Exclusive OR, (A && !B) \|\| (!A && B) |

![Tinkercad circuit layout](../Images/tinkercad%20circuit.png)

*Figure 1. My saved Tinkercad circuit layout shows the shared LED display and three buttons. It documents the circuit connections before the move to the soldered board.*

### How the binary counter works

The program starts in Project A with the counter at zero. All five binary LEDs are off, and the separate Project A indicator is on. Each short press and release of the Counter/Mode button increases the count by one. In this version of the code, the increment happens when the button is released. That lets the same button handle counting and a longer hold for changing modes.

The binary display uses five bits, which gives it 32 possible values, from 0 through 31. From D8 through D12, the LED values are 16, 8, 4, 2, and 1. For example, 13 is 8 + 4 + 1, so the LEDs on D9, D10, and D12 turn on. Read from the 16s position to the 1s position, that is 01101.

At 31, all five binary LEDs are on. The next short press and release resets the count to zero. D7 stays off throughout counter mode because this part of the project only needs five data LEDs. The code also prints the decimal count to the Serial Monitor at 9600 baud, which gives another way to compare the number with the LED pattern.

### Switching between the two projects

Holding the Counter/Mode button for five seconds switches to the other project. The two mode indicator LEDs show which one is active. The program remembers that it has already handled a long hold, so continuing to hold the button does not keep switching back and forth. Releasing that hold also does not add an extra count.

The Mode button uses a 50 millisecond debounce interval. The program waits for a stable reading before accepting a change, which helps prevent one physical press from being counted several times. It measures the hold with millis(), allowing the main loop to keep running while it checks the elapsed time.

The counter value is preserved when changing modes. If the count is 13 when I switch to Project B, returning to Project A brings back 13. Turning the Arduino off or resetting it starts the program over at zero.

### How the logical operators work

In Project B, the two input buttons represent A and B. Their indicator LEDs show whether each button is pressed. The other four LEDs show !A, A && B, A || B, and (A && !B) || (!A && B).

The last expression is exclusive OR, often called XOR. It is true when exactly one button is pressed. I kept the full expression in the program because that is the expression requested in the assignment.

These are the expected results for every combination. Here, 1 means pressed or on, and 0 means released or off. The A and B columns also describe their indicator LEDs.

| A | B | !A | A AND B | A OR B | XOR |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | 1 | 0 | 0 | 0 |
| 1 | 0 | 0 | 0 | 1 | 1 |
| 0 | 1 | 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 | 0 |

When neither button is pressed, the !A LED is on. When both are pressed, the A and B indicators are on along with AND and OR. XOR is off because both inputs are true. That difference between OR and XOR is easy to see on the LEDs.

Project B updates the LEDs as the program runs. It prints a line to the Serial Monitor when entering this mode and whenever either input changes, so the monitor does not fill up with the same information over and over.

### Organizing the program

Combining the two projects meant keeping track of the LED order carefully. I used separate arrays for the binary display and the logical operators. The binary array starts with D12 as the 1s bit, while the logic array starts with D7 as the A indicator. This lets both projects use the same physical LEDs without forcing both displays into the same order.

The main loop checks the Mode button first, then runs whichever project is active. Functions handle the counter and draw its binary value. Other functions change modes or calculate the logical outputs. Keeping those jobs separate makes the sketch easier to follow. The program also clears the shared LEDs before changing displays so a light from the previous mode does not stay on with the wrong meaning.

My project folder includes flowcharts for the main loop and Mode button handling. The counter and logical operators have their own flowcharts as well. These give another way to follow the decisions in the code.

### Reproducing and demonstrating the build

Someone reproducing this project can use the following order with the pin map and circuit image above:

1. Build the button and LED circuits on a breadboard. Use a common ground and one 220 ohm resistor per LED. Wire the buttons to D2, D3, and D4 as shown.
2. Open Program/Program.ino in the Arduino IDE. Select the Uno board and the correct connected port, verify the sketch, and upload it.
3. Open the Serial Monitor at 9600 baud. Check that the program starts in Project A at zero and compare the LED pattern with the decimal count.
4. Check the full count through 31 and the next press back to zero. Hold the Mode button for five seconds, then check all four A/B input combinations against the table.
5. Switch back to Project A and check that its saved count returns. Also check that one long hold changes modes only once and that releasing it does not add a count.
6. Print the enclosure parts from the supplied STL or 3MF files. Check their fit around the actual components. After transferring the circuit to a solderable board and fitting the enclosure, repeat the same electrical checks.

My demonstration will show the counter and its reset, then the mode change and all four input combinations in Project B. The mode indicators make it clear which project is running while I explain the shared LEDs.

### Connections to my other classes

This project follows along with a lot of what I am doing in CISP 300. The program uses variables and conditions to decide what happens next, and the Boolean expressions are directly connected to the logical operators in Option B. Loops and functions also have a clear job here. I can see the result of a condition right in front of me when an LED turns on.

The move to a soldered board also connects with ET 308, Technical Soldering Practices and Techniques. I had a reason to use the soldering work from that class on something I was building for another class. The breadboard problems made that connection pretty clear. A program can describe the right behavior and still depend on the physical connections being made properly.

### AI assistance and other help

I was able to do both projects, but combining them into one build is where I relied on some AI guidance. Most of that help came through my OpenClaw server on a free Oracle Cloud Infrastructure instance. My main agents run through Hermes, with custom routing that decides which model handles a task.

For coding sessions at my Mac, my setup uses Qwen 2.5-Coder 14B running locally. My broader setup also uses NVIDIA Nemotron models through OpenRouter's free options, and I sometimes use OpenAI's API.

AI helped guide the coding needed to combine the two options. I also used OpenAI Codex to review my project files and help organize and edit this report from my own account of the build. The printing and hands-on assembly were my work, and the personal experiences described here are mine.

The assignment requirements came from Nicole Shuman's MAKR 100 Project 1 instructions for Fall 2026. I used Tinkercad to design and simulate the circuit, and I also designed the 3D parts there. The saved 3MF file contains the Bambu Studio print project. The report's pin assignments and program behavior come from Program/Program.ino, and the quantities come from List Of Materials.xlsx. Falcons Care at Folsom Lake College provided the housing support that made it possible for me to get my printer out and use it during this project.

### What I would do differently

If I built this again, I would plan the soldered board layout earlier. Finding those boards late changed how I finished the circuit, and I would rather make that decision before spending time trying to keep unreliable breadboard connections working. I would also decide the shared LED positions and enclosure labels early, since the two modes use the display differently.

I am glad I did both options while I had the chance. I got to use some of what I am working on in my other classes, and I got my printer out of storage after about two years. I had missed making things with it.
