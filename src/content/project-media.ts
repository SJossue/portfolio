// Intrinsic pixel dimensions [width, height] for project gallery images.
// Measured from the source files so <Image> reserves correct space (no layout
// shift) and renders each shot at its true aspect ratio (no cropping).
// Regenerate when adding gallery images.
export const imageDimensions: Record<string, [number, number]> = {
  '/projects/reunion/hackathon-cover.jpg': [1200, 900],
  '/projects/reunion/pipeline.jpg': [1800, 1013],
  '/projects/reunion/terminal.jpg': [1700, 1228],
  '/projects/recall/floorplan.jpg': [1600, 900],
  '/projects/recall/ambient.jpg': [1100, 1583],
  '/projects/data-cool/complete-optimization.jpeg': [1914, 944],
  '/projects/data-cool/during-optimization.jpeg': [1351, 715],
  '/projects/data-cool/thermal-visualizer.jpeg': [1443, 697],
  '/projects/data-cool/team-brainstorming.jpeg': [4032, 3024],
  '/projects/data-cool/winners-photo.jpeg': [5712, 4284],
  '/projects/shpe-app/app-landing-page.jpeg': [600, 1298],
  '/projects/shpe-app/app-events-page.jpeg': [600, 1298],
  '/projects/shpe-app/app-user-rank.jpeg': [600, 1298],
  '/projects/shpe-web/gala-itinerary-design.jpg': [1104, 1656],
  '/projects/shpe-web/eboard-design.jpg': [1110, 1672],
  '/projects/shpe-web/shpetinas.png': [1032, 1662],
  '/projects/shpe-web/convention.png': [1242, 1674],
  '/projects/stress-analysis/chassis-left-side.jpeg': [1818, 1295],
  '/projects/stress-analysis/chassis-left-bare.jpeg': [2634, 1545],
  '/projects/stress-analysis/baja-website.jpeg': [2852, 1449],
  '/projects/prosthetic/exploded-cad-view.jpeg': [1458, 1253],
  '/projects/prosthetic/exploded-sketch.jpeg': [1840, 944],
  '/projects/prosthetic/descriptive-sketch.jpeg': [1872, 795],
  '/projects/forge/ai1.jpeg': [471, 1024],
  '/projects/forge/code1.jpeg': [471, 1024],
  '/projects/forge/config1.jpeg': [471, 1024],
};
