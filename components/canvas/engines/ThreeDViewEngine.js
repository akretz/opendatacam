import { scalePoint } from '../../../utils/resolution';
import { VehicleState } from '3d-vehicles';

const AXES_COORDS = [
  [0, 0, 0],
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

const AXES_COLORS = [
  '#f00',
  '#0f0',
  '#00f'];

function scalePoints(points, canvasResolution, originalResolution) {
  return points.map((point) => {
    const p = scalePoint({ x: point[0], y: point[1] }, canvasResolution, originalResolution);
    return [p.x, p.y];
  });
}

function drawVehicle(context, canvasResolution, originalResolution, camera, vehicleState) {
  const corners = vehicleState.corners;
  let points = camera.project2ImagePlane(corners);
  points = scalePoints(points, canvasResolution, originalResolution);

  context.strokeStyle = '#00f';
  context.lineWidth = 2;

  context.beginPath();
  for (let i = 0; i < 3; i++) {
    context.moveTo(points[i][0], points[i][1]);
    context.lineTo(points[i + 1][0], points[i + 1][1]);
  }
  context.lineTo(points[0][0], points[0][1]);

  for (let i = 4; i < 7; i++) {
    context.moveTo(points[i][0], points[i][1]);
    context.lineTo(points[i + 1][0], points[i + 1][1]);
  }
  context.lineTo(points[4][0], points[4][1]);

  for (let i = 0; i < 4; i++) {
    context.moveTo(points[i][0], points[i][1]);
    context.lineTo(points[i + 4][0], points[i + 4][1]);
  }

  const midFront = [
    (points[0][0] + points[3][0]) / 2,
    (points[0][1] + points[3][1]) / 2,
  ];
  context.moveTo(points[1][0], points[1][1]);
  context.lineTo(midFront[0], midFront[1]);
  context.lineTo(points[2][0], points[2][1]);

  context.stroke();
  context.closePath();
}

class ThreeDViewEngine {
  drawAxes(
    context,
    objectTrackerData,
    canvasResolution,
    originalResolution,
  ) {
    let points = window.camera.project2ImagePlane(AXES_COORDS);
    points = scalePoints(points, canvasResolution, originalResolution);

    AXES_COLORS.forEach((color, index) => {
      context.strokeStyle = color;
      context.beginPath();
      context.moveTo(points[0][0], points[0][1]);
      context.lineTo(points[index + 1][0], points[index + 1][1]);
      context.stroke();
    });
  }

  drawVehicles(
    context,
    objectTrackerData,
    canvasResolution,
    originalResolution,
  ) {
    objectTrackerData
      .filter(data => data.hasOwnProperty('3d') && data['3d'] !== null)
      .forEach(data => {
        drawVehicle(context, canvasResolution, originalResolution, window.camera, new VehicleState(...data['3d'].state));
      });
  }
}

const ThreeDViewEngineInstance = new ThreeDViewEngine();

export default ThreeDViewEngineInstance;
