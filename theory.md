### Introduction to 3D Projection

3D projection refers to methods that map three-dimensional points onto a two-dimensional plane, like a screen. There are two main types of projections: Orthographic and Perspective.

### Camera Matrices in Computer Graphics

In computer graphics, several matrices work together to transform 3D objects into 2D images:

1. **Model Matrix**: Transforms objects from model space to world space
2. **View Matrix**: Defines the camera's position and orientation in world space
3. **Projection Matrix**: Projects 3D coordinates onto a 2D plane

The view matrix is particularly important as it:
- Positions the camera in the scene
- Determines the camera's orientation
- Creates the viewing direction
- Establishes the up vector for the camera

### Orthographic Projection

Orthographic projection is a type of parallel projection where all projection lines are perpendicular (orthogonal) to the projection plane. This results in every plane of the scene appearing without any perspective distortion on the viewing surface.

- **Orthographic Camera:** A camera that captures scenes using orthographic projection.
- **Clipping Planes:**
  - **Left, Right:** Define the horizontal boundaries of the viewing frustum, which is the 3D volume in space that the camera can capture. The left and right planes determine the width of the frustum.
  - **Bottom, Top:** Define the vertical boundaries of the viewing frustum. The bottom and top planes determine the height of the frustum.
  - **Near, Far:** Define the depth range or distance from the camera within which objects are rendered. The near plane is the closest distance from the camera where objects start to appear, and the far plane is the furthest distance where objects are still visible.

In matrix form, the orthographic projection matrix adjusts the current transformation matrix \( M \) with the following matrix:

<img src="images/ortho.png">  

### Perspective Projection

Perspective projection mimics how the human eye perceives depth. Distant objects appear smaller, creating a sense of depth and realism.

- **Perspective Camera:** A camera that uses perspective projection.
- **Field of View (FOV):** 
  - Determines how wide the view angle is
  - Controls the extent of the scene visible to the camera
  - Affects the perspective distortion (wider FOV = more distortion)
  - Measured in degrees, typically between 45° and 120°
- **Aspect Ratio:**
  - Defines the proportion of width to height in the rendered image
  - Ensures proper scaling and visual representation
  - Typically matches the display device's aspect ratio
- **Near Plane:** The closest distance from the camera where objects start to be rendered.
- **Far Plane:** The furthest distance where objects are still rendered.

The perspective projection requires greater definition. The camera's position, orientation and field of view. Assuming the eye is located at (0,0,0) and (left(l), bottom(b), -near(-n)) & (right(r), top(t), -near) specify the lower-left & upper-right points on the near clipping plane and -f specifying the location of far clipping plane, the perspective projection matrix is  

<img src="images/perspective.png">
<br>
<br>

### Depth Buffer and Clipping

The depth buffer (also called z-buffer) is crucial for realistic 3D rendering:

1. **Depth Buffer:**
   - Stores the depth value of each pixel
   - Helps determine which objects are visible and which are hidden
   - Enables proper rendering of overlapping objects
   - Simulates atmospheric perspective by assigning depth values

2. **Clipping:**
   - Removes objects outside the viewable region
   - Optimizes rendering efficiency
   - Prevents rendering of invisible objects
   - Uses the near and far planes to determine visibility

**Below are two images that clearly show the differences between them-**

<p style="text-align:left;"><strong>1. Orthographic vs Perspective Projection</strong></p>
<img src="images/projection_image1.png">
<br>
<br>
<br>
<p style="text-align:left;"><strong>2. Perspective vs Orthographic Projection</strong></p>
<img src="images/projection_image2.png" style="width:45vw; height:auto">  

<br>

 ## Conclusion
<div style="border: 2px solid black; padding: 10px; border-radius: 10px; width: fit-content;">

- **Perspective Camera:** Objects closer to the camera appear larger, while objects further away appear smaller. This effect mimics human perception of depth and distance, creating a sense of realism.
  
- **Orthographic Camera:** Objects of the same dimension appear similar in size regardless of their distance from the camera. There is no size variation based on depth, resulting in a more uniform representation of the scene.
</div>
