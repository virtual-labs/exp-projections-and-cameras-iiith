### Experiment Overview

This experiment demonstrates orthographic and perspective projections using interactive 3D cameras. The simulation provides a split view showing both the view frustum visualization and the final rendered output, allowing you to understand how camera parameters affect the projection.

### Getting Started

1. The simulation interface is divided into three main sections:

   - Left panel: Display settings and shape controls
   - Center: Split view showing view frustum and final rendering
   - Right panel: Camera parameter controls

2. Basic Controls:
   - Left Click + Drag: Translate (shift) the view
   - Right Click + Drag: Rotate the view
   - Scroll Wheel: Zoom in/out
   - Mobile users can use touch gestures for the same controls

### Experiment Steps

#### 1. Understanding the View

- Observe the split view:
  - Left canvas shows the view frustum visualization
  - Right canvas shows the final rendered output
- The view frustum helps visualize how the camera "sees" the scene
- The final rendering shows what would be displayed on screen

#### 2. Camera Type Selection

1. In the right panel, locate the "Camera Type" dropdown
2. Choose between:
   - Orthographic Camera: Maintains parallel lines, no perspective distortion
   - Perspective Camera: Shows depth through perspective distortion

#### 3. Camera Parameter Adjustment

For Perspective Camera:

1. Near/Far Coordinates:

   - Adjust to control the visible depth range
   - Objects outside this range won't be rendered
   - Observe how the view frustum changes shape

2. Camera Position (X, Y, Z):

   - Modify to change the camera's location
   - Watch how the view frustum moves in the left canvas
   - Notice the corresponding changes in the final rendering

3. Target Position (X, Y, Z):

   - Set where the camera is looking
   - Observe how the view frustum rotates
   - See how the scene orientation changes

4. Field of View and Aspect Ratio:
   - Field of View: Controls the angle of view (wider = more visible)
   - Aspect Ratio: Maintains proper proportions

For Orthographic Camera:

1. Left/Right/Top/Bottom Coordinates:
   - Define the viewing volume boundaries
   - Adjust to control the visible area
   - Notice how the view frustum becomes a rectangular box

#### 4. Interactive Observation

1. Add shapes using the left panel:

   - Click "Add" to create new shapes
   - Position them in 3D space
   - Observe how they appear in both views

2. Experiment with different camera settings:
   - Try extreme values to understand limits
   - Compare orthographic vs. perspective views
   - Notice how objects appear differently in each projection

#### 5. Grid and Display Options

1. Use the checkboxes in the left panel to:
   - Toggle XY, YZ, and XZ grids
   - Lock graph movement
   - Lock zoom and rotation
   - These help in understanding 3D space orientation

### Expected Observations

1. Perspective Camera:

   - Objects appear smaller as they get further away
   - Parallel lines converge at a vanishing point
   - View frustum is pyramid-shaped

2. Orthographic Camera:
   - Objects maintain their size regardless of distance
   - Parallel lines remain parallel
   - View frustum is rectangular

### Tips for Better Understanding

1. Start with simple shapes to observe projection changes
2. Use the grids to understand spatial relationships
3. Compare the view frustum visualization with the final rendering
4. Try different camera positions to see how they affect the view
5. Use the "Reset All" button to return to default settings

### Mobile Usage Note

While the simulation works on mobile devices, for the best experience:

- Use landscape orientation for better visibility
- Be patient with touch controls
- Consider using a larger screen for detailed parameter adjustments
