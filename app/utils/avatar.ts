export function generateAvatar(seed: string): string {
  // Simple seeded random number generator (Mulberry32)
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }

  let state = h
  const rand = () => {
    state += 0x6d2b79f5
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]
  const chance = (prob: number) => rand() < prob

  // Palettes
  const skinTones = [
    "#fsc3a1",
    "#f0c7a3",
    "#eec7a7",
    "#dea684",
    "#d39a76",
    "#b88265",
    "#8d5524",
    "#c68642",
    "#e0ac69",
    "#f1c27d",
    "#ffdbac",
  ]

  const hairColors = [
    "#1a1a1a",
    "#2c1f18",
    "#4a3225",
    "#5c3a2a", // Dark/Brown
    "#8d5228",
    "#a46330", // Light Brown
    "#e2c388",
    "#d9b878", // Blonde
    "#9e2424",
    "#b53e3e", // Red
    "#888888",
    "#cccccc", // Grey/White
  ]

  const eyeColors = [
    "#2e5c91", // Blue
    "#3f8538", // Green
    "#593617", // Brown
    "#222222", // Black
  ]

  // Initialize 8x8 grid
  const grid: string[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(""))

  // Selections
  const baseSkin = pick(skinTones)
  const hairColor = pick(hairColors)
  const eyeColor = pick(eyeColors)
  const hasBeard = chance(0.2)
  const hasGlasses = chance(0.1)

  // Helper to darken/lighten color slightly for texture
  const varyColor = (hex: string, intensity: number = 20) => {
    // Parse hex
    let r = parseInt(hex.slice(1, 3), 16)
    let g = parseInt(hex.slice(3, 5), 16)
    let b = parseInt(hex.slice(5, 7), 16)

    // Vary
    const variation = (rand() * 2 - 1) * intensity
    r = Math.max(0, Math.min(255, r + variation))
    g = Math.max(0, Math.min(255, g + variation))
    b = Math.max(0, Math.min(255, b + variation))

    return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g)
      .toString(16)
      .padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`
  }

  // 1. Fill Skin
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      grid[y][x] = varyColor(baseSkin, 10)
    }
  }

  // 2. Add Hair
  // Top header
  const hairDepth = Math.floor(rand() * 2) + 2 // 2 or 3 pixels deep
  for (let y = 0; y < hairDepth; y++) {
    for (let x = 0; x < 8; x++) {
      grid[y][x] = varyColor(hairColor, 15)
    }
  }
  // Sideburns / Long hair
  const sideLength = Math.floor(rand() * 5)
  for (let y = hairDepth; y < hairDepth + sideLength && y < 8; y++) {
    grid[y][0] = varyColor(hairColor, 15)
    grid[y][7] = varyColor(hairColor, 15)
  }

  // 3. Add Eyes
  // Usually at y=4 or y=3 (0-indexed)
  const eyeY = 4
  // White of eye
  grid[eyeY][1] = "#ffffff"
  grid[eyeY][2] = varyColor(eyeColor, 5) // Pupil/Iris
  grid[eyeY][5] = varyColor(eyeColor, 5) // Pupil/Iris
  grid[eyeY][6] = "#ffffff"

  // 4. Mouth / Beard
  // Mouth usually at y=6
  if (hasBeard) {
    for (let x = 2; x <= 5; x++) {
      grid[6][x] = varyColor(hairColor, 15)
      grid[7][x] = varyColor(hairColor, 15)
    }
    // Connect to sideburns maybe
    grid[6][1] = varyColor(hairColor, 15)
    grid[6][6] = varyColor(hairColor, 15)
  } else {
    // Simple mouth
    const mouthColor = "#8f563b" // Darker skin tone ish
    grid[6][3] = mouthColor
    grid[6][4] = mouthColor
  }

  // 5. Glasses (Optional)
  if (hasGlasses) {
    for (let x = 1; x <= 6; x++) {
      if (x !== 3 && x !== 4) {
        // Don't cover nose bridge entirely or do?
        // Rim
        grid[eyeY - 1][x] = "#333333"
        grid[eyeY + 1][x] = "#333333"
      }
    }
    grid[eyeY][0] = "#333333" // Sides
    grid[eyeY][7] = "#333333"
    // Lenses (semi transparent black effectively)
    // Simplified: just darker pupils or borders
  }

  // Generate SVG
  let rects = ""
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      rects += `<rect x="${x * 8}" y="${y * 8}" width="8" height="8" fill="${
        grid[y][x]
      }" />`
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" shape-rendering="crispEdges">${rects}</svg>`
}
