"use strict";
import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";
// import { GUI } from "https://cdn.jsdelivr.net/npm/dat.gui@0.7.7/build/dat.gui.min.js";

// importing internal files
import {
  createCube,
  createDodecahedron,
  createOctahedron,
  createTetrahedron,
} from "./js/shapes.js";
import { createArm } from "./js/mech_arm.js";
// import { VRMLLoader } from "./js/VRMLloader.js";

const moveButton = document.getElementById("move-button");
const modalbutton1 = document.querySelector(".edit-button");
const modalbutton2 = document.querySelector(".add-button");
let lockVertices = document.getElementById("lock-vertices-cb");
let lockZoom = document.getElementById("lock-zoom-cb");
let lockRotate = document.getElementById("lock-rotate-cb");
let xyGrid = document.getElementById("xy-grid-cb");
let yzGrid = document.getElementById("yz-grid-cb");
let xzGrid = document.getElementById("xz-grid-cb");
let cam_pos = new THREE.Vector3(17, 15, 15);
let cam_target = new THREE.Vector3(0, 0, 0);
let modalAdd = document.getElementById("add-modal");
let modalEdit = document.getElementById("edit-modal");
let initial_pos = [3, 3, 3];
let container = document.getElementById("canvas-main");

// let loader = THREE.VRMLLoader();
// loader.load("./bunny.wrl", function (model) {

//     console.log(model);

//     model.traverse(function (child) {
//         if (child instanceof THREE.Mesh) {
//             console.log(child.geometry);
//         }
//     });

//     model.scale.set(10, 10, 10);

//     scene.add(model);

// });

// let frames = document.getElementById("frames").value;

// let Shoulder = document.getElementById("shoulder");
// Shoulder.addEventListener("input", Level1);

// let Elbow = document.getElementById("elbow");
// Elbow.addEventListener("input", Level2);

// let Wrist = document.getElementById("wrist");
// Wrist.addEventListener("input", Level3);

// document.getElementById("shoulder").max = frames;
// document.getElementById("shoulder").min = 0;
// shoulder.step = 1;

// document.getElementById("elbow").max = frames;
// document.getElementById("elbow").min = 0;
// elbow.step = 1;

// document.getElementById("wrist").max = frames;
// document.getElementById("wrist").min = 0;
// wrist.step = 1;

let spanEditModal = document.getElementsByClassName("close")[0];
let scene,
  PI = 3.141592653589793,
  camera,
  renderer,
  orbit,
  shapes = [],
  xygrid = [],
  yzgrid = [],
  xzgrid = [],
  dragX = [],
  dragY = [],
  dragz = [],
  shapeList = [],
  dir = [],
  arrowHelper = [];

let point = [];
let shapeVertex = [];
let dotList = [];
let noOfShapes = 0;

let shapeCount = [0, 0, 0, 0];

// Modal controls for Add Shape Button
let addModal = document.getElementById("add-modal");
let spanAddModal = document.getElementsByClassName("close")[1];

spanAddModal.onclick = function () {
  addModal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target === addModal) {
    addModal.style.display = "none";
  }
};

// Modal controls for Add Camera Button
let camModal = document.getElementById("cam-modal");
let camBtn = document.getElementById("new-cam-btn");

let span_new_cam = document.getElementsByClassName("close")[4];

window.onclick = function (event) {
  if (event.target === camModal) {
    camModal.style.display = "none";
  }
};

lockVertices.addEventListener("click", updateMouseButtons);
lockZoom.addEventListener("click", updateMouseButtons);
lockRotate.addEventListener("click", updateMouseButtons);

function updateMouseButtons() {
  let leftMouse = MOUSE.PAN; // Default behavior (panning with left mouse)
  let middleMouse = MOUSE.PAN; // Set middle mouse to MOUSE.PAN but it will do nothing
  let rightMouse = MOUSE.ROTATE; // Default behavior (rotation with right mouse)

  // If lockVertices is checked, disable LEFT (no panning)
  if (lockVertices.checked) {
    leftMouse = null; // Disable left mouse button (no panning)
  }

  // If lockZoom is checked, prevent MIDDLE (no zooming)
  if (lockZoom.checked) {
    middleMouse = null; // Disable middle mouse button (no zooming)
    orbit.enableZoom = false; // Disable zoom functionality
  } else {
    orbit.enableZoom = true; // Enable zoom if lockZoom is unchecked
  }

  // If lockRotate is checked, disable RIGHT (no rotating)
  if (lockRotate.checked) {
    rightMouse = null; // Disable right mouse button (no rotating)
  }

  // Update the mouse buttons based on the checkbox states
  orbit.mouseButtons = {
    LEFT: leftMouse,
    MIDDLE: middleMouse,
    RIGHT: rightMouse,
  };

  // Ensure smooth damping and set target
  orbit.target.set(0, 0, 0);
  orbit.dampingFactor = 0.05;
  orbit.enableDamping = true;

  // Force an update on the controls
  orbit.update();
}

xyGrid.addEventListener("click", () => {
  if (xyGrid.checked) {
    let grid = new THREE.GridHelper(size, divisions);
    let vector3 = new THREE.Vector3(0, 1, 0);
    grid.lookAt(vector3);
    xygrid.push(grid);
    scene.add(xygrid[0]);
  } else {
    scene.remove(xygrid[0]);
    xygrid.pop();
  }
});
xzGrid.addEventListener("click", () => {
  if (xzGrid.checked) {
    let grid = new THREE.GridHelper(size, divisions);
    let vector3 = new THREE.Vector3(0, 0, 1);
    grid.lookAt(vector3);
    xzgrid.push(grid);
    scene.add(xzgrid[0]);
  } else {
    scene.remove(xzgrid[0]);
    xzgrid.pop();
  }
});
yzGrid.addEventListener("click", () => {
  if (yzGrid.checked) {
    let grid = new THREE.GridHelper(size, divisions);
    grid.geometry.rotateZ(PI / 2);
    // grid.lookAt(vector3);
    yzgrid.push(grid);
    scene.add(yzgrid[0]);
  } else {
    scene.remove(yzgrid[0]);
    yzgrid.pop();
  }
});

function updateShapeList(shapeList) {
  const shapeListDiv = document.getElementById("shape-list");
  shapeListDiv.innerHTML = ""; // Clear previous list

  const ul = document.createElement("ul");

  shapeList.forEach((shape) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="shape-info">
        <span class="shape-id">${shape.id}</span>
        <span class="coordinates">(${shape.x}, ${shape.y}, ${shape.z})</span>
      </div>
      <div class="button-group">
        <button class="select-btn" 
                data-name="${shape.id}" 
                data-coordinates="${shape.x},${shape.y},${shape.z}">
          Select
        </button>
        
      </div>
    `;
    ul.appendChild(li);
  });

  shapeListDiv.appendChild(ul);

  // Attach event listeners for Select, Edit, and Delete buttons
  document.querySelectorAll(".select-btn").forEach((button) => {
    button.addEventListener("click", handleSelect, false);
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", handleEdit, false);
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", handleDelete, false);
  });
}

function handleSelect(event) {
  const shapeName = event.target.getAttribute("data-name");
  const shapeCoordinates = event.target.getAttribute("data-coordinates");

  // Validate the selected shape data
  if (!shapeName || !shapeCoordinates) {
    console.error("Missing shape name or coordinates");
    return;
  }

  console.log(`Shape Selected: ${shapeName}`);
  console.log(`Coordinates: ${shapeCoordinates}`);

  // Safely parse coordinates
  let coordsArray;
  try {
    coordsArray = shapeCoordinates
      .replace(/[()]/g, "")
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    if (coordsArray.length !== 3 || coordsArray.some(isNaN)) {
      throw new Error("Invalid coordinate format");
    }
  } catch (error) {
    console.error("Error parsing coordinates:", error);
    return;
  }

  const shapePosition = new THREE.Vector3(
    coordsArray[0],
    coordsArray[1],
    coordsArray[2]
  );

  // Find the shape in the shapeList based on its coordinates
  const shape = shapes.find(
    (s) =>
      s.position.x == coordsArray[0] &&
      s.position.y == coordsArray[1] &&
      s.position.z == coordsArray[2]
  );

  if (!shape) {
    console.log("Shape not found in shapes.");
    return;
  }

  // Handle selection and deselection of shapes
  const existingLine = scene.getObjectByName("selection-line");

  if (existingLine && existingLine.position.equals(shapePosition)) {
    scene.remove(existingLine);
    console.log("Deselected the shape.");
    return;
  }

  // Remove existing selection line
  if (existingLine) {
    scene.remove(existingLine);
  }

  // Create a new selection line
  const geometry = new THREE.SphereGeometry(1, 32, 16);
  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  line.position.set(shapePosition.x, shapePosition.y, shapePosition.z);
  line.name = "selection-line"; // Add a name for easy identification
  scene.add(line);
  console.log("Selection line created at shape's position.");

  // Get delete and edit buttons
  const deleteButton = document.getElementById("delete-shape-btn");
  const editButton = document.getElementById("edit-shape-btn");

  // Clear previous event listeners before setting them again
  deleteButton.onclick = () => handleDelete(shape, line, coordsArray);
  editButton.onclick = () => handleEdit(shape, line, coordsArray);
}

function handleDelete(shape, line, coordsArray) {
  // Remove the selected shape and line from the scene
  shapeList = shapeList.filter(
    (s) =>
      !(s.x == coordsArray[0] && s.y == coordsArray[1] && s.z == coordsArray[2])
  );

  shapes = shapes.filter(
    (s) =>
      !(
        s.position.x == coordsArray[0] &&
        s.position.y == coordsArray[1] &&
        s.position.z == coordsArray[2]
      )
  );
  scene.remove(line);
  scene.remove(shape);

  // Remove the shape from the shapeList based on coordinates

  updateShapeList(shapeList);
  console.log(`Shape deleted.`);
}

function handleEdit(shape, line, coordsArray) {
  const editModal = document.getElementById("edit-modal");
  editModal.style.display = "block";

  // Fill the modal fields with the current values of the shape
  const shapeTypeSelect = document.querySelector("select");
  document.getElementById("x").value = shape.position.x;
  document.getElementById("y").value = shape.position.y;
  document.getElementById("z").value = shape.position.z;
  shapeTypeSelect.value = shape.name; // Assuming shape.name holds the current shape type

  // Use a single event listener to handle edit confirmation
  const modalEditButton = document.querySelector(".edit-button");

  // Remove any previous listener to avoid duplication
  modalEditButton.removeEventListener("click", handleEditConfirmation);

  // Add the event listener
  modalEditButton.addEventListener("click", handleEditConfirmation);

  function handleEditConfirmation() {
    // Get new coordinates from the modal inputs
    const xcoord = parseFloat(document.getElementById("x").value);
    const ycoord = parseFloat(document.getElementById("y").value);
    const zcoord = parseFloat(document.getElementById("z").value);
    const shapeType = shapeTypeSelect.value;

    // Validate the new coordinates
    if (isNaN(xcoord) || isNaN(ycoord) || isNaN(zcoord)) {
      console.error("Invalid coordinate input");
      return;
    }

    // Remove the current shape and selection line from the scene
    scene.remove(line); // Remove selection line
    scene.remove(shape); // Remove the shape from the scene

    // Remove the current shape from shapeList
    shapeList = shapeList.filter(
      (s) =>
        !(
          s.x == coordsArray[0] &&
          s.y == coordsArray[1] &&
          s.z == coordsArray[2]
        )
    );

    shapes = shapes.filter(
      (s) =>
        !(
          s.position.x == coordsArray[0] &&
          s.position.y == coordsArray[1] &&
          s.position.z == coordsArray[2]
        )
    );

    // Create a new shape based on the selected type
    const createShape = {
      Cube: createCube,
      Tetrahedron: createTetrahedron,
      Octahedron: createOctahedron,
      Dodecahedron: createDodecahedron,
    }[shapeType];

    if (createShape) {
      createShape(
        xcoord,
        ycoord,
        zcoord,
        shapes,
        shapeList,
        shapeCount,
        scene,
        point,
        shapeVertex,
        dragX,
        dragY,
        dragz
      );
    } else {
      console.error("Invalid shape type");
      return;
    }

    // Update shapeList and the UI
    noOfShapes++;
    updateShapeList(shapeList);

    // Close the modal after saving the shape
    editModal.style.display = "none";

    // After edit confirmation, remove the event listener to avoid duplication on next clicks
    modalEditButton.removeEventListener("click", handleEditConfirmation);
  }
}

let buttons = document.getElementsByTagName("button");
const size = 50;
const divisions = 25;

document.getElementById("add-shape-btn").onclick = function () {
  addModal.style.display = "block";

  // First, remove any existing event listener before adding a new one
  modalbutton2.removeEventListener("click", handleShapeAddition);

  // Add the event listener for the modal button
  modalbutton2.addEventListener("click", handleShapeAddition);
};

// Function to handle shape addition
function handleShapeAddition() {
  let xcoord = document.getElementById("x1").value;
  let ycoord = document.getElementById("y1").value;
  let zcoord = document.getElementById("z1").value;
  noOfShapes++;

  const shapeType = document.getElementById("shape-add-dropdown").value;

  if (shapeType === "Cube") {
    createCube(
      xcoord,
      ycoord,
      zcoord,
      shapes,
      shapeList,
      shapeCount,
      scene,
      point,
      shapeVertex,
      dragX,
      dragY,
      dragz
    );
  } else if (shapeType === "Tetrahedron") {
    createTetrahedron(
      xcoord,
      ycoord,
      zcoord,
      shapes,
      shapeList,
      shapeCount,
      scene,
      point,
      shapeVertex,
      dragX,
      dragY,
      dragz
    );
  } else if (shapeType === "Octahedron") {
    createOctahedron(
      xcoord,
      ycoord,
      zcoord,
      shapes,
      shapeList,
      shapeCount,
      scene,
      point,
      shapeVertex,
      dragX,
      dragY,
      dragz
    );
  } else if (shapeType === "Dodecahedron") {
    createDodecahedron(
      xcoord,
      ycoord,
      zcoord,
      shapes,
      shapeList,
      shapeCount,
      scene,
      point,
      shapeVertex,
      dragX,
      dragY,
      dragz
    );
  }
  updateShapeList(shapeList); // Update the UI
  addModal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("cam-modal");
  const closeButton = document.querySelector(".close");
  const submitButton = document.getElementById("new-cam"); // The button with id="new-cam"

  function closeModal() {
    modal.style.display = "none";
  }

  closeButton.addEventListener("click", closeModal);

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  const gui = new dat.GUI();

  // Default camera parameters
  const cameraParams = {
    camType: "Orthographic", // Either 'Perspective' or 'Orthographic'
    nearCoord: 0.1,
    farCoord: 1000,
    camX: 5,
    camY: 5,
    camZ: 5,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    upX: 0,
    upY: 1,
    upZ: 0,
    // Perspective-specific
    fieldOfView: 75,
    aspectRatio: window.innerWidth / window.innerHeight,
    // Orthographic-specific
    leftCoord: -15,
    rightCoord: 15,
    topCoord: 15,
    bottomCoord: -15,
  };
  createCamera(); // Immediately update the camera

  // Remove GUI elements for a clean update
  function clearGui(gui) {
    const controllers = gui.__controllers;
    for (let i = controllers.length - 1; i >= 0; i--) {
      gui.remove(controllers[i]);
    }
  }

  // Recreate GUI based on the camera type
  function updateGui() {
    clearGui(gui);

    gui
      .add(cameraParams, "camType", ["Orthographic", "Perspective"])
      .name("Camera Type")
      .onChange(() => {
        updateGui(); // Recreate the GUI for the selected camera type
        createCamera(); // Immediately update the camera
      });

    gui
      .add(cameraParams, "nearCoord", 0.01, 1)
      .name("Near Coordinate")
      .onChange(createCamera);

    gui
      .add(cameraParams, "farCoord", 500, 2000)
      .name("Far Coordinate")
      .onChange(createCamera);

    gui
      .add(cameraParams, "camX", -25, 25)
      .name("Camera X")
      .onChange(createCamera);
    gui
      .add(cameraParams, "camY", -25, 25)
      .name("Camera Y")
      .onChange(createCamera);
    gui
      .add(cameraParams, "camZ", -25, 25)
      .name("Camera Z")
      .onChange(createCamera);

    gui
      .add(cameraParams, "targetX", -25, 25)
      .name("Target X")
      .onChange(createCamera);
    gui
      .add(cameraParams, "targetY", -25, 25)
      .name("Target Y")
      .onChange(createCamera);
    gui
      .add(cameraParams, "targetZ", -25, 25)
      .name("Target Z")
      .onChange(createCamera);

    if (cameraParams.camType === "Perspective") {
      gui
        .add(cameraParams, "fieldOfView", 1, 180)
        .name("Field of View")
        .onChange(createCamera);
      gui
        .add(cameraParams, "aspectRatio", 0.1, 4)
        .name("Aspect Ratio")
        .onChange(createCamera);
    } else if (cameraParams.camType === "Orthographic") {
      gui
        .add(cameraParams, "leftCoord", -100, 100)
        .name("Left Coordinate")
        .onChange(createCamera);
      gui
        .add(cameraParams, "rightCoord", -100, 100)
        .name("Right Coordinate")
        .onChange(createCamera);
      gui
        .add(cameraParams, "topCoord", -100, 100)
        .name("Top Coordinate")
        .onChange(createCamera);
      gui
        .add(cameraParams, "bottomCoord", -100, 100)
        .name("Bottom Coordinate")
        .onChange(createCamera);
    }
  }

  // Function to create the camera based on GUI values
  function createCamera() {
    // let camera;
    if (cameraParams.camType === "Orthographic") {
      // Orthographic Camera
      camera = new THREE.OrthographicCamera(
        cameraParams.leftCoord, // left
        cameraParams.rightCoord, // right
        cameraParams.topCoord, // top
        cameraParams.bottomCoord, // bottom
        cameraParams.nearCoord, // near
        cameraParams.farCoord // far
      );
    } else {
      // Perspective Camera
      camera = new THREE.PerspectiveCamera(
        cameraParams.fieldOfView, // Field of view
        cameraParams.aspectRatio, // Aspect ratio
        cameraParams.nearCoord, // near
        cameraParams.farCoord // far
      );
    }

    // Set camera position
    camera.position.set(
      cameraParams.camX,
      cameraParams.camY,
      cameraParams.camZ
    );

    // Set camera target
    camera.lookAt(
      new THREE.Vector3(
        cameraParams.targetX,
        cameraParams.targetY,
        cameraParams.targetZ
      )
    );

    // Set the up vector
    // camera.up.set(cameraParams.upX, cameraParams.upY, cameraParams.upZ);

    console.log("Created Camera:", camera);
  }

  // Get the #gui-container and append the GUI controls
  const guiContainer = document.getElementById("gui-container");
  guiContainer.appendChild(gui.domElement);

  // Initialize the GUI with default parameters
  updateGui();

  // Optionally close the modal after submission
  submitButton.addEventListener("click", closeModal);
});

const toggleInstructions = document.getElementById("toggle-instructions");
const procedureMessage = document.getElementById("procedure-message");

// Function to show the instructions overlay
const showInstructions = () => {
  procedureMessage.style.display = "block";
};

// Function to hide the instructions overlay
const hideInstructions = (event) => {
  // Close if click is outside the overlay or if it's the toggle button again
  if (
    !procedureMessage.contains(event.target) &&
    event.target !== toggleInstructions
  ) {
    procedureMessage.style.display = "none";
  }
};

// Attach event listeners
toggleInstructions.addEventListener("click", (event) => {
  // Toggle the visibility of the overlay
  if (procedureMessage.style.display === "block") {
    procedureMessage.style.display = "none";
  } else {
    showInstructions();
  }
  event.stopPropagation(); // Prevent immediate closure after clicking the button
});

document.addEventListener("click", hideInstructions);

// Prevent closing the overlay when clicking inside it
procedureMessage.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent the click inside from closing the overlay
});

// // Function to reset slider to 0 and shape to original size
// function resetSliderAndShape() {
//   const slider = document.getElementById("slider"); // Get the slider element
//   slider.value = 0; // Reset slider to 0

//   // Reset shape scale to original size
//   shapes.forEach(shape => {
//     shape.scale.set(1, 1, 1);  // Reset shape scale to original (1,1,1)
//   });
// }

// // Add event listeners to X, Y, and Z scaling inputs
// document.getElementById("scale-x").addEventListener("input", resetSliderAndShape);
// document.getElementById("scale-y").addEventListener("input", resetSliderAndShape);
// document.getElementById("scale-z").addEventListener("input", resetSliderAndShape);

function createLabel(text, direction, length) {
  const fontLoader = new THREE.FontLoader();
  let labelMesh;

  fontLoader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const geometry = new THREE.TextGeometry(text, {
        font: font,
        size: 0.6,
        height: 0.1,
      });
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      labelMesh = new THREE.Mesh(geometry, material);

      // Position the label at the end of the arrow (tip of the arrow)
      const labelPosition = direction.clone().multiplyScalar(length);
      labelMesh.position.copy(labelPosition);
      scene.add(labelMesh);
    }
  );

  return labelMesh;
}

scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);
camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
let init = function () {
  camera.position.set(30, 15, 30); // Set camera position behind and above the origin

  camera.lookAt(10, -20, 15);
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);
  const gridHelper = new THREE.GridHelper(size, divisions);
  const count = 1;

  const arrowHelper = [];
  const dir = [
    new THREE.Vector3(1, 0, 0), // +X
    new THREE.Vector3(0, 1, 0), // +Y
    new THREE.Vector3(0, 0, 1), // +Z
    new THREE.Vector3(-1, 0, 0), // -X
    new THREE.Vector3(0, -1, 0), // -Y
    new THREE.Vector3(0, 0, -1), // -Z
  ];

  const labels = ["+X", "+Y", "+Z", "-X", "-Y", "-Z"]; // Labels for each axis
  const origin = new THREE.Vector3(0, 0, 0);
  const length = 10;

  // Loop through the axes
  for (let i = 0; i < 6; i++) {
    // Determine color based on the direction
    let color;
    if (i === 0 || i === 3) {
      color = "red"; // +X and -X axes
    } else if (i === 1 || i === 4) {
      color = "yellow"; // +Y and -Y axes
    } else {
      color = "blue"; // +Z and -Z axes
    }

    // Create the arrow helper for the current direction and color
    arrowHelper[i] = new THREE.ArrowHelper(dir[i], origin, length, color);
    scene.add(arrowHelper[i]);

    // Create label for each axis and position it at the tip of the arrow
    const label = createLabel(labels[i], dir[i], length);
    scene.add(label);
  }

  createCube(
    7,
    0,
    0,
    shapes,
    shapeList,
    shapeCount,
    scene,
    point,
    shapeVertex,
    dragX,
    dragY,
    dragz
  );

  createCube(
    0,
    -5,
    0,
    shapes,
    shapeList,
    shapeCount,
    scene,
    point,
    shapeVertex,
    dragX,
    dragY,
    dragz
  );

  createCube(
    0,
    0,
    7,
    shapes,
    shapeList,
    shapeCount,
    scene,
    point,
    shapeVertex,
    dragX,
    dragY,
    dragz
  );

  updateShapeList(shapeList); // Update the UI

  // let tri_geo = Triangle(vertexA, vertexB, vertexC, scene, dotList);
  renderer = new THREE.WebGLRenderer();
  let w = container.offsetWidth;
  let h = container.offsetHeight;
  renderer.setSize(w, 0.85 * h);
  container.appendChild(renderer.domElement);
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.mouseButtons = {
    LEFT: MOUSE.PAN,
    MIDDLE: MOUSE.DOLLY,
    RIGHT: MOUSE.ROTATE,
  };
  orbit.target.set(0, 0, 0);
  orbit.enableDamping = true;
};
let mainLoop = function () {
  orbit.update(); // Important for damping
  camera.updateMatrixWorld();
  renderer.render(scene, camera);
  requestAnimationFrame(mainLoop);
};
init();
mainLoop();
