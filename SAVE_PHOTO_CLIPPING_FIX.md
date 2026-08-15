# Saved Photo Clipping Fix

The saved photo must use the same camera area saved by Admin as the live camera.

Required rendering order:
1. Draw the complete uploaded frame.
2. Save/scale the camera area using the Admin x/y/width/height values.
3. `ctx.save()`.
4. `ctx.beginPath()` and `ctx.rect(cameraX, cameraY, cameraWidth, cameraHeight)`.
5. `ctx.clip()`.
6. Draw the captured camera image using `object-fit: cover` math so it fills only that clipped rectangle.
7. `ctx.restore()`.

The camera image must never be drawn outside the camera rectangle, so frame content such as IT'S OUR ENGAGEMENT and ABANOUB & ENGY remains visible in the final saved image.

Live preview and saved output must use the same normalized camera-area coordinates relative to the complete frame dimensions.
