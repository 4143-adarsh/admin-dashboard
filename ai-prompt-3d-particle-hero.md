/**
 * AI Modified Prompt:
 * 
 * Update the existing ParticleHero.tsx component to make "NighwanTech" text:
 * 1️⃣ Fully readable and crisp on screen
 * 2️⃣ Animated in three stages:
 *    - Stage 1 (0s–4s): Particles form "NighwanTech" text
 *    - Stage 2 (4s–8s): Particles scatter and float randomly
 *    - Stage 3 (8s–12s): Particles smoothly return to form "NighwanTech"
 * 
 * STEP-BY-STEP INSTRUCTIONS FOR AI:
 *
 * STEP A: TEXT SAMPLING
 * - Use high-resolution offscreen canvas (min 1024x256)
 * - Font: bold sans-serif (e.g., Arial, Poppins)
 * - Sample pixels with step 2–3 for smooth text
 * - Only alpha > 128 pixels generate particle positions
 * - Add slight Z-randomness for depth
 *
 * STEP B: PARTICLE GENERATION
 * - Use InstancedBufferGeometry or Points for GPU optimization
 * - Particle size: 0.2–0.3
 * - Gradient color palette: 6–7 colors
 * - Initial positions = text positions
 *
 * STEP C: ANIMATION LOGIC
 * - Stage 1: particles lerp from scattered positions to text positions (0–4s)
 * - Stage 2: particles scatter randomly in 3D space (4–8s)
 * - Stage 3: particles return to text positions (8–12s)
 * - Continuous slight floating (sin wave) throughout all stages
 *
 * STEP D: INTERACTIVITY
 * - On mouse hover / touch: particles repel and spring back
 * - Smooth lerp interpolation for all movements
 *
 * STEP E: CAMERA & CANVAS
 * - Camera distance to fit full text in viewport
 * - Canvas responsive, fills screen
 * - Optional gradient background or muted video
 *
 * STEP F: OVERLAY CONTENT
 * - Keep existing headline, subheadline, CTA buttons
 * - Fully responsive using TailwindCSS
 *
 * STEP G: FINAL CHECK
 * - Ensure "NighwanTech" is fully readable during Stage 1 & 3
 * - Particle animation smooth and GPU optimized
 * - Works on desktop and mobile
 *
 * USAGE:
 * - Keep existing imports & exports intact
 * - Only modify particle generation, sampling, animation, and interactivity
 */
