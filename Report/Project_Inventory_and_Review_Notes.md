# Project inventory and report review notes

Prepared September 25, 2026. These are preparation notes for Harry, separate from the example report.

## What the assignment asks for

Instructions.pdf requires a report with your name, a bill of materials, a description detailed enough to reproduce the project, and challenges or takeaways. There is no word limit. All sources of help, including AI, must be credited.

The submission also needs the Tinkercad circuit image, a video demonstration, and the Arduino sketch. The ZIP naming pattern is YourLastName_Project_1.zip, so yours would be Bartos_Project_1.zip. The listed deadline and in-class presentation are September 29, 2026, at 5:00 PM. The presentation should take about 5-7 minutes. The report is longer than a presentation script; use selected points for the talk.

## Source inventory

The project contained 25 non-hidden source files before the Report folder was added. Hidden metadata and Git internals are excluded.

| Location | Files | How they informed the report |
| --- | --- | --- |
| Project root | Instructions.pdf | Required report contents, citations, submission items, and presentation expectations |
| Project root | List Of Materials.xlsx | Arduino and component counts, wire quantity, filament amounts |
| Project root | flowcharts.html | Supporting explanation of program decisions and pin assignments |
| Program | Program.ino | Primary source for current pin map, debounce, mode switching, binary display, logical expressions, and serial output |
| Flowcharts | Program_Flowcharts.pdf; Program_Main_Flowchart.png; Program_Mode_Button.png; Program_Binary_Counter.png; Program_Logic_Operators.png | Four-page program documentation matching the current sketch |
| Images | tinkercad circuit.png; Wire Diagram.pdf | Circuit layout, connections, resistor values, and button wiring |
| Images | Flowcharts.pdf; All_Flowcharts_Overview.png; Flowchart_1_Master_Loop.png; Flowchart_2_Mode_Button.png; Flowchart_3_Project_A_Binary.png; Flowchart_4_Project_B_Logic.png | Additional versions of the flowchart documentation |
| print files | MAKR 100 - Project 1.3mf | Saved Bambu Studio project and five plate previews, including the base labeled Harry Bartos |
| print files/STL Files | Body shell.stl.stl; Top Plate.stl.stl; Bottom Base.stl.stl; Arduriono Cover.stl.stl; button.stl_1.stl; button.stl_2.stl; button.stl_3.stl | Enclosure and button components |

The report follows the current Program/Program.ino in this folder. No Arduino source files were changed or compiled during report preparation. The saved files establish the design and documented behavior; the printing, soldering, housing support, and AI setup are based on your account. Your follow-up confirms that you used Tinkercad for the circuit simulation and designed the 3D parts there, spent the most time on the 3D design, and had to stop on September 19 to pack the printer while it was still hot.

## Items to check before using the example as your final report

1. **Demonstration and test results.** No video file was found among the 25 source files. The report describes expected behavior and proposed demonstration steps without inventing a record of completed hardware tests. Add the actual results of your checks, including counting through 31 back to 0, all four A/B states, and switching modes while preserving the count. Include the video in the submission ZIP, or put its public YouTube link in the report as the assignment allows.
2. **Your name in the sketch.** Your name appears on the saved printed-base preview and is included in the report. I did not find Harry, Bartos, or an author/name credit in Program/Program.ino. The instructions also require your name in the sketch.
3. **Five bits and 32 values.** The code's opening comment says "0 to 31 or 32 Bits," and the top-plate preview says "32-BIT BINARY MODE." The implemented display is five bits with 32 possible values. The example report uses the correct description. A clearer label would be "5-BIT BINARY COUNTER" or "BINARY COUNTER 0-31." The source and print files were not edited.
4. **Board name and LED colors.** Your message calls the board ProtoSlim; the materials spreadsheet calls it ProtoSim Protoboard. The report uses your wording in the story and a generic solderable prototyping board in the materials table. The spreadsheet lists six white data LEDs, while the wiring PDF labels one of them blue. Check the final hardware and make the submission consistent.
5. **Help and design credits.** The example credits your AI workflow and Codex assistance with this report. Add any other people or sources that helped. The report now explicitly credits your 3D design work in Tinkercad. Keep the AI model names aligned with what you actually used.

## Files created for this request

- Project_1_Report_Example.docx: editable report with materials, pin map, truth table, and the saved circuit image.
- Project_1_Report_Example.md: the same report in editable plain text with Markdown formatting.
- Project_Inventory_and_Review_Notes.md: this inventory and the remaining factual checks.

Original source files were left unchanged. Nothing was submitted or published.
