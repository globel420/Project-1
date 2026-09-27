# Mode button diagnostic result

Observed live in Arduino IDE on the connected Uno, 2026-09-26.

## Findings
- The active Downloads/Program/Program.ino matched the user-pasted source byte for byte before diagnostics.
- Original logic passed host simulation with separate press/hold/release sequences.
- Physical short presses and releases worked in Project A.
- After a physical hold entered Project B, D2 remained LOW with the button released: raw=0, stable=0, handled=1, no raw edges, increasing hold age.
- Reconnecting USB restarted Project A and restored released readings. This was a USB reconnect, not a D2 wire disconnect.
- Diagnostic serial command B entered logic mode without requiring a physical button press; D2 went LOW. Five seconds later, the original hold logic returned to A and D2 went HIGH.
- The output-isolation probe inverted each LED output individually, sampled D2, and restored the output before testing the next pin.

## Output-isolation result
```text
DBG probe D5 out=1->0 D2=1->0->1
DBG probe D6 out=0->1 D2=1->1->1
DBG probe D7 out=0->1 D2=1->1->1
DBG probe D8 out=0->1 D2=1->1->1
DBG probe D9 out=0->1 D2=1->1->1
DBG probe D10 out=0->1 D2=1->1->1
DBG probe D11 out=0->1 D2=1->1->1
DBG probe D12 out=0->1 D2=1->1->1
```

## Conclusion and remaining boundary
Changing D5 (Project A indicator) changes D2 (mode input), even without changing the active project or pressing the button. Thus D5 LOW in Project B prevents a released reading and prevents a new long hold from being recognized. This isolates the interacting output/input pair, but not the exact physical connection or component fault. Inspect D2 mode-button and D5 indicator wiring, return paths, and solder joints before assigning a specific defective part. No physical wiring repair is established.

## Diagnostic firmware used
The separately saved Mode_Button_Debug/Mode_Button_Debug.ino V3 diagnostic was uploaded for testing. Original project sketches were not modified. The diagnostic retains original button/mode logic and adds telemetry plus serial commands a (force A), b (force B), t (briefly probe D5-D12 and restore outputs). It compiled for arduino:avr:uno: 4414 bytes flash, 643 bytes SRAM. Use the t probe only with buttons untouched. Restore original firmware after resolving the physical cause, then verify short counts and repeated A/B/A holds on hardware.

## Original firmware restored
The user reported fixing the physical issue and requested restoration. Uploaded unchanged Downloads/Program/Program.ino through Arduino IDE to the Uno on 2026-09-26. Source still matches the pasted original (SHA256 cf77b2b2ef980e6bf59ac4a591e3912b2ba5529535c00b0e9a12d54486fc80b0). IDE reported Done uploading; Serial Monitor showed Project A: Binary Counter and Counter: 0. Diagnostic window closed; original sketch and Serial Monitor remain open. Post-repair A-to-B-to-A physical test is pending; exact physical repair was not described.
