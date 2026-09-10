## Pangolin Beyond

This module recreates the legacy `companion-module-pangolin-beyond` behavior as a modern Bitfocus Companion module.

Configure the target host and UDP port to match the OSC server settings in Pangolin Beyond.

### Actions

- Brightness
- Select clip
- Start clip
- Stop clip
- BPM
- Select FX slot
- Live Control parameter
- Live Control parameter (2 values)
- Custom OSC command
- BPM Tap
- Enable Output
- Disable Output
- Blackout
- One cue
- Multi cue
- Click select
- Toggle
- Restart
- Flash
- Solo flash

### Variables

- `target_host` Configured target host
- `target_port` Configured target port
- `last_action` Last action sent
- `last_sent_summary` Last OSC messages sent
- `last_sent_at` Last command timestamp
- `last_message_count` Number of OSC messages in the last action

### Notes

- This module sends the same OSC commands as the legacy module, including the `/beyond/...` and `/b/...` paths used there.
- `Start clip` can now optionally focus a specific page and cell first, then trigger `StartCell`.
- `Stop clip` stops the focused grid cell, or can focus a specific page and cell first and then trigger `StopCell`.
- `Select FX slot` targets `/beyond/master/livecontrol/fx1` through `fx4`. Effect layer accepts `1..4`, and effect slot accepts `-1..47` where `-1` stops the current effect.
- The Live Control actions target `/beyond/master/livecontrol/...` and cover the full practical master live control set for single-value parameters plus the 2-value `size/pos` variants.
- `Custom OSC command` lets you paste any OSC address and optional arguments. Argument parsing is variable-friendly: integers send as `i`, decimal numbers as `f`, and text as `s`. Quote strings that contain spaces.
- Pangolin Beyond uses OSC over UDP. Make sure the OSC server is enabled in Beyond and that the configured host and port match your network setup.
