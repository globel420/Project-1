# Project 1 animation exports

Silent 1080p animation prepared for your own spoken narration.

| Video | Length | Contents |
|---|---:|---|
| Project_1_LED_Animation.mp4 | 3:30 | Complete animation |
| Binary_Counter_Animation.mp4 | 1:50 | Place values, 13, main functions, bit math, rollover |
| Logic_Operators_Animation.mp4 | 1:40 | Button states, NOT A, AND, OR, XOR, all combinations, repeat loop |

All three are H.264 MP4, 1920 × 1080, 24 frames per second, with no audio track.

The complete animation follows `../Animation_Spoken_Script.md` and `../Animation_Narration.srt`. The logic-only video starts at 1:50 in the full animation, so its local time begins 110 seconds earlier than the full-script timestamps.

Use the animation full frame for the explanation or place it beside your recorded hardware footage. The animation is an illustration of the sketch, not a live Arduino connection.

Mint means ON / 1. Gray means OFF / 0. Amber highlights the position or rule currently being explained; the highlight itself does not change the LED result.

QA: all 21 scene layouts inspected; arithmetic and logic states checked against Program/Program.ino and the narration contract; all three final videos fully decoded without errors. QA_Stills includes images extracted from the completed MP4, including binary math and XOR with both buttons pressed. The exact stream and duration checks are in render_validation.json.
