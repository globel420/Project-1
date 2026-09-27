# Project 1 animation exports

Silent 1080p animation prepared for your own spoken narration.

| Video | Length | Contents |
|---|---:|---|
| Project_1_LED_Animation.mp4 | 3:30 | Complete corrected animation |
| Binary_Counter_Animation.mp4 | 1:50 | LED values, 13, main functions, actual shift/mask operations, rollover |
| Logic_Operators_Animation.mp4 | 1:40 | Button states, NOT A, AND, OR, XOR, all combinations, repeat loop |

All three are H.264 MP4, 1920 × 1080, 24 frames per second, with no audio track.

The complete animation follows `../Animation_Spoken_Script.md` and `../Animation_Narration.srt`. The logic-only video starts at 1:50 in the full animation, so its local time begins 110 seconds earlier than the full-script timestamps.

Use the animation full frame for the explanation or place it beside your recorded hardware footage. The animation is an illustration of the sketch, not a live Arduino connection.

Mint means ON / 1. Gray means OFF / 0. Amber highlights the position or rule currently being explained; the highlight itself does not change the LED result.

## Corrected binary section

- The LED graphics run left to right as 1, 2, 4, 8, 16, following array indices 0 through 4 and pins D12 through D8.
- Written binary used in calculations retains its highest-value position on the left. It is labeled separately from the LED layout.
- The animation shows the actual Arduino bitRead operation: `(value >> bit) & 0x01`. It shifts right, masks all but the rightmost bit, then writes the 0 or 1 result to the pin.
- The comparison shows count 2 returning 1 for the 2s LED, while count 13 returns 0 for that same LED.
- The full and binary videos replace the prior explanation. The logic-only MP4 is preserved byte for byte.

QA: all scene layouts inspected; input, shifted, and masked binary values and pin mappings checked against the narration contract; all three final videos fully decoded without errors. QA_Stills includes frames extracted from the completed MP4, including the shift/mask comparison, the 2s bit, and XOR with both buttons pressed. Exact stream and duration checks are in render_validation.json.

Prior exports and superseded QA are preserved under `../render_work/archive_before_shift_mask_revision/`.
