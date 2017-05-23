console.log('hello simmy!');
var velFactor = 0.1;
var time = 0;
var id = 0;
var onShape = false;
var hoveringOnShape = 0;
var selectedShape = false;
var throwArray = [];
var Scene = {
  backgroundColour: '#E0E0E0',
  shapes: []
};

function Shape(centre, vertices){
  var boundingRect = findBoundingRect(vertices);
  var mass = findMass(centre, vertices, boundingRect);
  var centreOfMass = mass.centreOfMass;
  console.log('mass:', mass);
  console.log('centreOfMass', centreOfMass);
  findMomentOfInertiaCM(centreOfMass, vertices, boundingRect);

  this.id;
  this.fillColour = '#6495ED';
  this.lineColour = 'black';
  this.linewidth = 0.7;
  this.centre = centre;
  this.vertices = vertices;
  this.colliding = false;
  this.physics = {
    density: 1,
    mass: mass.mass,
  	momentOfInertia: 1,
    velocity: {x:0, y:0},
  	angularVelocity: 0,
    acceleration: {x:0, y:0},
    forces: [],
    torque: 0,
    centroid: {x: 0, y: 0}
  };
  this.onShape = false;
	this.dragging = false;
	this.selected = false;
  this.touchPoint = [];
  this.display = [];
  this.boundingRect = boundingRect;
    var boundingRectCentre = {x: this.boundingRect.centre.x, y: this.boundingRect.centre.y};
    var radius = magnitude({x: boundingRectCentre.x - this.boundingRect.vertices[0].x, y: boundingRectCentre.y - this.boundingRect.vertices[0].y});
    this.boundingRect.radius = radius;
}

// function findBoundingRect(vertices){
//   var boundingRect = {};
//   var maxX = vertices[0].x;
//   var minX = vertices[0].x;
//   var maxY = vertices[0].y;
//   var minY = vertices[0].y;
//   var length = vertices.length;
//   for(var i = 0; i < length; i++){
//     if(maxX < vertices[i].x){
//       maxX = vertices[i].x
//     }
//     if(minX > vertices[i].x){
//       minX = vertices[i].x
//     }
//     if(maxY < vertices[i].y){
//       maxY = vertices[i].y
//     }
//     if(minY > vertices[i].y){
//       minY = vertices[i].y
//     }
//   }
//   boundingRect = {
//     minX: minX,
//     maxX: maxX,
//     minY: minY,
//     maxY: maxY,
//     centre: {
//       x: (minX + maxX)/2,
//       y: (minY + maxY)/2
//     },
//     vertices: [
//       {x: minX, y: minY},
//       {x: maxX, y: minY},
//       {x: maxX, y: maxY},
//       {x: minX, y: maxY}
//     ]
//   };
//   return boundingRect;
// };

// function findMass(centre, vertices, boundingRect){
//   var resolution = {x: 1, y: 1};
//   var mass = 0;
//   var count = 0;
//   var centreOfMass = {x: 0, y: 0};
//   var massDistances = {x: 0, y: 0};
//   var momentOfInertia = 0;
//   var width = boundingRect.maxX - boundingRect.minX;
//   var height = boundingRect.maxY - boundingRect.minY;
//   var startPoint = {x: boundingRect.minX, y: boundingRect.minY};
//   var checkPoint = {};
//   for(var i = 0; i < width; i += resolution.x){
//     for(var j = 0; j < height; j += resolution.y){
//       checkPoint.x = startPoint.x + resolution.x * i;
//       checkPoint.y = startPoint.y + resolution.y * j;
//       var pointInShape = isPointInShape({x: 0, y: 0}, vertices, checkPoint);
//       if(pointInShape){
//         mass += resolution.x * resolution.y;
//         count += 1;
//         //momentOfInertia = (resolution.x * resolution.y) * Math.pow(magnitude(checkPoint), 2);
//         massDistances.x += checkPoint.x;
//         massDistances.y += checkPoint.y;
//       }
//     }
//   }
//   centreOfMass.x = (massDistances.x / count) + centre.x;
//   centreOfMass.y = (massDistances.y / count) + centre.y;
//   console.log('width:', width);
//   console.log('height:', height);
//   console.log('mass:', mass);
//   console.log('startPoint', startPoint);
//   console.log('centre', centre);
//   console.log('centreOfMass', {x: centreOfMass.x, y:centreOfMass.y});
//   return {mass: mass, centreOfMass: centreOfMass};
// }
//
// function updateVertices(vertices, center, centreOfMass){
//   var length = vertices.length;
//   var diff = {x: centreOfMass.x - center.x, y: centreOfMass.y - center.y};
//   for(var i = 0; i < length; i++){
//     vertices[i].x -= diff.x;
//     vertices[i].y -= diff.y;
//   }
//   return vertices;
// }
//
// function findMomentOfInertia(centreOfMass, vertices, boundingRect){
//   var resolution = {x: 1, y: 1};
//   //var mass = 0;
//   //var count = 0;
//   //var centreOfMass = {x: 0, y: 0};
//   //var massDistances = {x: 0, y: 0};
//   var momentOfInertia = 0;
//   var width = boundingRect.maxX - boundingRect.minX;
//   var height = boundingRect.maxY - boundingRect.minY;
//   var startPoint = {x: boundingRect.minX, y: boundingRect.minY};
//   var checkPoint = {};
//   for(var i = 0; i < width; i += resolution.x){
//     for(var j = 0; j < height; j += resolution.y){
//       checkPoint.x = startPoint.x + resolution.x * i;
//       checkPoint.y = startPoint.y + resolution.y * j;
//       var pointInShape = isPointInShape({x: 0, y: 0}, vertices, checkPoint);
//       if(pointInShape){
//         // mass += resolution.x * resolution.y;
//         // count += 1;
//         momentOfInertia += (resolution.x * resolution.y) * Math.pow(magnitude(checkPoint), 2);
//         // massDistances.x += checkPoint.x;
//         // massDistances.y += checkPoint.y;
//       }
//     }
//   }
//   // centreOfMass.x = massDistances.x / count;
//   // centreOfMass.y = massDistances.y / count;
//   // console.log('width:', width);
//   // console.log('height:', height);
//   // console.log('mass:', mass);
//   // console.log('startPoint', startPoint);
//   // console.log('centre', centre);
//   // console.log('centreOfMass', {x:centreOfMass.x + centre.x, y:centreOfMass.y + centre.y});
//   console.log('momentOfInertia', momentOfInertia);
// }

function createShape(centre, vertices){
  forEachShape(function(i){
      detectShape(i);
  }, true);
  if(hoveringOnShape <= 0){ // if not hovering on shape
    id++;
    var shape = new Shape(centre, vertices);
    shape.id = id;
    console.log('boundingRect.radius', shape.boundingRect.radius);
    Scene.shapes.push(shape);
  }
}

//function draw(){
let draw = () => {
  bufferCtx.fillStyle = Scene.backgroundColour;
  bufferCtx.fillRect(0, 0, canvas.width, canvas.height);
  forEachShape(function(i){
      var onShape = ShapesController.getProperty(i, 'onShape');
      //bufferCtx.save();
      if(onShape){
        var shadowColor = shadowColor = 'rgba( 9, 9, 9, 0.3)';
        var shadowOffsetX = shadowOffsetX = 10;
        var shadowOffsetY = shadowOffsetY = 10;
        var shadowBlur = shadowBlur = 10;
      }

      var fillColour = ShapesController.getProperty(i, 'fillColour');
      var lineWidth = ShapesController.getProperty(i, 'linewidth');
      var centre = ShapesController.getCentre(i);

      var vertices = ShapesController.getVertices(i);
      var config = {
        shadowColor: shadowColor,
        shadowOffsetX: shadowOffsetX,
        shadowOffsetY: shadowOffsetY,
        shadowBlur: shadowBlur,
        fillStyle: fillColour,
        lineWidth: lineWidth
      };
      if(ShapesController.getProperty(i, 'colliding')){
        config.lineWidth = 10;
      }
      var boundingRect = ShapesController.getProperty(i, 'boundingRect');
      var boundingRectCentre = {x: boundingRect.centre.x + centre.x, y: boundingRect.centre.y + centre.y};
      var rectVertices = boundingRect.vertices;

      var radius = boundingRect.radius;
      var idPos = {x: centre.x - 4, y: centre.y - 5};
      drawShape(rectVertices, centre, {lineWidth: 0.5, fillStyle: 'transparent'});
      drawShape(vertices, centre, config);
      drawDot(3, centre, 'black');
      drawDot(3, boundingRectCentre, 'red');
      screenWriter(ShapesController.getProperty(i, 'id'), idPos);
      bufferCtx.save();
      bufferCtx.beginPath();
      bufferCtx.arc(boundingRectCentre.x, boundingRectCentre.y, radius, 0, 2*Math.PI);
      bufferCtx.stroke();
      bufferCtx.restore();
  });
  if(shapeSelection[selectedShape] && hoveringOnShape <= 0){ // (hoveringOnShape <= 0) means not hovering on shape
    drawShape(shapeSelection[selectedShape], mousePos, {
      globalAlpha: 0.15,
      fillStyle: 'blue',
      lineWidth: 0.000001
    });
  }
  screenWriter('x:' + Math.round(mousePos.x) + ',  ' + 'y:' + Math.round(mousePos.y), {x:10, y:20});

  context.drawImage(bufferCanvas,0,0, canvas.width, canvas.height);
}

function screenWriter(text, position){
  bufferCtx.save();
  bufferCtx.fillStyle = 'black';
  bufferCtx.font = "15px Arial";
  bufferCtx.fillText(text,position.x, position.y);
  bufferCtx.restore();
}

function drawShape(vertices, centre, config){
  var num = vertices.length;
  var x0 = vertices[0].x + centre.x;
  var y0 = vertices[0].y + centre.y;

  bufferCtx.beginPath();
  bufferCtx.moveTo(x0, y0);
  for(var j = 1; j < num; j++){
    var x = vertices[j].x + centre.x;
    var y = vertices[j].y + centre.y;
    bufferCtx.lineTo(x, y);
  }
    bufferCtx.save();
    for(var prop in config){
      bufferCtx[prop] = config[prop];
    }
    bufferCtx.closePath();
    bufferCtx.stroke();
    bufferCtx.fill();
    bufferCtx.restore();
}

function drawDot(radius, centre, colour){
  bufferCtx.save();
  bufferCtx.fillStyle = colour;
  bufferCtx.beginPath();
  bufferCtx.arc(centre.x, centre.y, radius, 0, 2*Math.PI);
  bufferCtx.fill();
  //bufferCtx.stroke();
  bufferCtx.restore();
}


function flicker(){
  setInterval(draw, 17);
}

flicker();

window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

function animate(){
  var date = new Date()
  var currentTime = date.getTime();
  var tDelta = (currentTime - time);
  forEachShape(function(i){
    applyPhysics(i, tDelta);
  });
  collisionDetector();
	draw();
	requestAnimFrame(function() {
			animate();
	});
  time = currentTime;
}

  function mouseMove(){
  	canvas.addEventListener('mousemove', function(evt){
  	  mousePos = getMousePos(evt, canvas);
      hoveringOnShape = 0;
      if(selectedShape === 'play'){
        makeThrowArray();
      }
      forEachShape(function(i){
          detectShape(i);
      }, true);
      if(hoveringOnShape > 0){
        onShape = false;
      }
    });
  }

function mouseDown(){
  canvas.addEventListener('mousedown', function(evt){
    throwArray = [];
    forEachShape(function(i){
      prepareToMoveShape(i);
      if(selectedShape === '_delete'){
        deleteShape(i);
      }
    });
    if(selectedShape && selectedShape !== '_delete' && selectedShape !== 'play'){
      createShape(mousePos, shapeSelection[selectedShape]);
    }
  }, false);
}

function mouseUp(){
  canvas.addEventListener('mouseup', function(evt){
    forEachShape(function(i){
      releaseShape(i);
    });
    throwArray = [];
  }, false);
}

function detectShape(i){
  ShapesController.setProperty(i, 'onShape', false);
  var centre = ShapesController.getCentre(i);
  var vertices = ShapesController.getVertices(i);
  var pointInShape = isPointInShape(centre, vertices, mousePos);
  if(pointInShape){
    hoveringOnShape++;
    if(!onShape){
      ShapesController.setProperty(i, 'onShape', true);
      onShape = true;
    }
    if(ShapesController.getProperty(i, 'onShape')){
      ShapesController.setProperty(i, 'onShape', true);
    } else {
      ShapesController.setProperty(i, 'onShape', false);
    }
  } else {
    ShapesController.setProperty(i, 'onShape', false);
  }

  if(ShapesController.getProperty(i, 'dragging')){
    dragShape(i);
  }
}

// function isPointInShape(centre, vertices, point){
//   var x0 = centre.x + vertices[0].x;
//   var y0 = centre.y + vertices[0].y;
//
//   bufferCtx.beginPath();
//   bufferCtx.moveTo(x0, y0);
//   for(var m = 1; m < vertices.length; m++){
//     var x = centre.x + vertices[m].x;
//     var y = centre.y + vertices[m].y;
//     bufferCtx.lineTo(x, y);
//   }
//
//   if(bufferCtx.isPointInPath(point.x, point.y)){
//       return true;
//   } else {
//       return false;
//   }
// }

function prepareToMoveShape(i){
  if(ShapesController.getProperty(i, 'onShape')){
    if(selectedShape === 'play'){
      ShapesController.setProperty(i, 'velocity', {x: 0, y: 0}, true);
    }
    var centre = ShapesController.getCentre(i);
    ShapesController.setProperty(i, 'dragging', true);
    var distanceX = mousePos.x - centre.x;
    var distanceY = mousePos.y - centre.y;
    ShapesController.setProperty(i, 'touchPoint', {x: distanceX, y: distanceY});
    var x = document.getElementsByClassName("dg");
    if(gui){
      gui.destroy();
    }
    addGui(i);
  }
}

function releaseShape(i){
    var velocity = throwVelocity();
    if(throwArray.length > 0 && ShapesController.getProperty(i, 'dragging')){
      ShapesController.setProperty(i, 'velocity', {x: velocity.x, y: velocity.y}, true);
    }
    ShapesController.setProperty(i, 'dragging', false);
    ShapesController.setProperty(i, 'selected', false);
}

function deleteShape(i){
  if(selectedShape === '_delete'){
    if(ShapesController.getProperty(i, 'onShape')){
      ShapesController.deleteShape(i);
    }
  }
}

function dragShape(i){
  var touchPoint = ShapesController.getTouchPoint(i);
  ShapesController.setProperty(i, 'centre', {
    x: mousePos.x - touchPoint.x,
    y: mousePos.y - touchPoint.y
   });
}

function init(){
  flicker();
  animate();
  mouseDown();
  mouseUp();
  mouseMove();
}

init();

function forEachShape(callback, bool){
  var shapes = Scene.shapes;
  var length = shapes.length;
  if(!bool){
    for(var i = 0; i < length; i++){
      var shape = shapes[i];
      if(shape){
        callback(i);
      }
    }
  } else if(bool) {
    for(var i = length-1; i >= 0; i--){
      var shape = shapes[i];
      if(shape){
        callback(i);
      }
    }
  }
}

function makeThrowArray(){
  var length = throwArray.length;
  var arraySize = 5
  if(length >= arraySize){
    throwArray = throwArray.splice(length - arraySize);
  }
  throwArray.push({x: mousePos.x, y: mousePos.y});
}

function throwVelocity(){
  var velocityArray = [];
  var velocity = {x: 0, y: 0};
  var length = throwArray.length;
  for(var i = 1; i < length; i++){
    velocityArray.push({x: throwArray[i].x - throwArray[i-1].x, y: throwArray[i].y - throwArray[i-1].y});
  }
  var length2 = velocityArray.length;
  for(var j = 0; j < length2; j++){
    velocity.x += velocityArray[j].x;
    velocity.y += velocityArray[j].y;
  }
  if(length2 > 0){
    velocity.x /= length2;
    velocity.y /= length2;
  }
  return {x: velocity.x, y: velocity.y};
}

function applyPhysics(i, tDelta){
  if(selectedShape === 'play'){
    var acceleration = ShapesController.getProperty(i, 'acceleration', true);
    var velocity = ShapesController.getProperty(i, 'velocity', true);
    velocity.x += acceleration.x;
    velocity.y += acceleration.y;
    var centre = ShapesController.getCentre(i);
    centre.x += velocity.x * tDelta * velFactor;
    centre.y += velocity.y * tDelta * velFactor;
    ShapesController.setProperty(i, 'centre', {x: centre.x, y: centre.y});
  }
}

// function applyForces(i){
//
// }

function collisionDetector(){
  var shapes = Scene.shapes;
  var numShapes = shapes.length;
  forEachShape(function(i){
      ShapesController.setProperty(i, 'colliding', false);
  });
  forEachShape(function(i){
    var vertices = ShapesController.getVertices(i);
    var centre = ShapesController.getCentre(i);
    var length = vertices.length;
    for(var j = 0; j < length; j++){
        var checkPoint = {};
        checkPoint.x = vertices[j].x + centre.x;
        checkPoint.y = vertices[j].y + centre.y;
        for(var k = 0; k < numShapes; k++){
          if(i!== k){
          var shape = shapes[k];
          var shapeVertices = ShapesController.getProperty(k, 'vertices');
          var shapeCentre = ShapesController.getProperty(k, 'centre');
          var pointInShape = isPointInShape(shapeCentre, shapeVertices, checkPoint);
          if(pointInShape){
            ShapesController.setProperty(i, 'colliding', true);
            ShapesController.setProperty(k, 'colliding', true);
          }
        }
      }
    }
  });
}

var ShapesController = (function(){
  var shapes = Scene.shapes;

  function getCentre(shapeIndex){
    var centre = shapes[shapeIndex].centre;
    return {
        x: centre.x,
        y: centre.y
     };
  }


  function getTouchPoint(shapeIndex){
    var touchPoint = shapes[shapeIndex].touchPoint;
    return {
        x: touchPoint.x,
        y: touchPoint.y
     };
  }

  // function getShapeSize(shapeIndex){
  //   var shape = shapes[shapeIndex];
  //   var size = shape.vertices.length;
  //   return size;
  // }

  function getVertices(shapeIndex){
    var vertices = [];
    var shape = shapes[shapeIndex];
    var size = shape.vertices.length;
    for(var i = 0; i < size; i++){
      var point = {x: shape.vertices[i].x, y: shape.vertices[i].y};
      vertices.push(point);
    }
    return vertices;
  }

  function getProperty(shapeIndex, property, bool){
    var shape = shapes[shapeIndex];
    if (!bool) {
      var property = shape[property];
    } else {
      var property = shape['physics'][property];
    }
    return property;
  }

  function setProperty(shapeIndex, property, value, bool){
    if (!bool) {
      Scene.shapes[shapeIndex][property] = value;
    } else if(bool === true) { //physics property
      Scene.shapes[shapeIndex]['physics'][property] = value;
    }
  }

  function deleteShape(shapeIndex){
    Scene.shapes.splice(shapeIndex, 1);
  }

  return {
    getCentre: getCentre,
    getTouchPoint: getTouchPoint,
    //getShapeSize: getShapeSize,
    getVertices: getVertices,
    getProperty: getProperty,
    setProperty: setProperty,
    deleteShape: deleteShape
  };
})();

//createShape({x: 500, y: 250}, shapeSelection.square);
