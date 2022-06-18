/*
How to use:
- Press the ` key to switch between console and canvas
    - Requires a keyboard to be connected to mobile device
- console.log() now logs things to the embedded console
- To log things to the normal, native console, use nativeLog()
- When the project is complete, follow directions in index.html
for publishing the project.
*/
function preload(){
  textImage = loadImage("text.png")
  originalImage = loadImage("originalImage.png")
  momentImages = [];
  for(var i = 0; i < 60; i ++){
    momentImages.push( loadImage("momentImages/momentImage_" + i + ".png") )
  }
}
function setup() {
  pixelDensity(1);
  pxSpacing = 20;
  createCanvas(1,1)
  setupCanvas();
  createCanvasEventListeners();
  logMouse = false;
  
  dispHeight = momentImages[0].height;
  dispWidth = momentImages[0].width
  momentImageCount = 60
  
  graphics_objects = [];
  
  for(var i = 0; i < momentImageCount; i ++){
    var new_graphic = momentImages[i]
    
    graphics_objects.push({
      graphic: new_graphic,
      x: 0,
      z: (i/momentImageCount),
      x_at_press: 0
    })
  }
  
  mousepos_array = [];
  for(var i = 0; i < 5; i ++)mousepos_array.push({x:0,y:0})
  
  display_offset = 0;
  display_offset_at_press = 0;
  lastFrameRate = 70;
  display_offset_speed = -1.3 * (width/553) * (70/lastFrameRate); //pixels per frame
  
  drag_zone_y = height * (1/4)
  drag_zone_y = 0; //Set to zero to disable ability to pan
  user_dragging = false;
  
  scrollSpeed = 0;
  
  mouse_movement_multiplier = 0.1;
  
  textImagePosition = width * 3.6;
  separation_distance = 0;
  p_separation_distance = 0;
  
}

function draw() {
  // background(170, 204, 255);
  background(255);
  displayGraphicsObjects();
  updateGraphicsObjects();
  
  mousepos_array.shift();
  mousepos_array.push( {x:mousepos.x, y:mousepos.y} )
  display_offset += display_offset_speed;
  
  stroke(255);
  line(0, drag_zone_y, width, drag_zone_y)
  noStroke();
  
  var w = width * 3.5;
  var h = textImage.height * (w/textImage.width)
  image(textImage, textImagePosition, height/2, w, h)
  textImagePosition += display_offset_speed * 1.3;
  
  if(frameCount%10 == 0)lastFrameRate = frameRate();
  display_offset_speed = -1.3 * (width/553) * (70/lastFrameRate); //pixels per frame
  
}

function updateGraphicsObjects(){
  if(!mousepos.pressed || user_dragging){
    separation_distance += scrollSpeed;
    var acc = 0.03 * (width/553) * (70/lastFrameRate) ;
    if(separation_distance > 0)scrollSpeed -= acc;
    if(separation_distance < 0)scrollSpeed += acc;
    if(p_separation_distance !== 0 && Math.sign(separation_distance) !== Math.sign(p_separation_distance) ){
      scrollSpeed = 0;
      separation_distance = 0;
    }
    for(var i = 0; i < graphics_objects.length; i ++){
      graphics_objects[i].x = separation_distance * graphics_objects[i].z
    }
    p_separation_distance = separation_distance;
  }
  if(mousepos.pressed && !user_dragging){
    
    for(var i = 0; i < graphics_objects.length; i ++){
      var dif = mousepos.x - mousepos_at_press.x
      dif *= mouse_movement_multiplier
      dif *= graphics_objects[i].z
      graphics_objects[i].x = graphics_objects[i].x_at_press + dif;
      // nativeLog(dif)
    }
    
  }
  
  if(mousepos.pressed && user_dragging){
    var dif = mousepos.x - mousepos_at_press.x
    dif *= mouse_movement_multiplier
    display_offset = display_offset_at_press + dif;
  }
  
  var h = height;
  var w = dispWidth * (h/dispHeight )
  
  if( abs(display_offset) > w){
    display_offset = width;
    textImagePosition = width * 4.6;
    nativeLog("Back to beginning " + lastFrameRate)
  }
}

function displayGraphicsObjects(){
  var h = height;
  var w = dispWidth * (h/dispHeight )
  var separating = (mousepos.pressed && abs(mousepos.x - mousepos_at_press.x) > 0 )
  if( separation_distance == 0 && !separating )
  image(originalImage, display_offset, 0, w, h)
  
  for(var i = 0; i < graphics_objects.length; i ++){
    image(graphics_objects[i].graphic, graphics_objects[i].x + display_offset, 0, w, h)
  }
}

function setGraphicsObjectsAtPress(){
  for(var i = 0; i < graphics_objects.length; i ++){
    graphics_objects[i].x_at_press = graphics_objects[i].x
  }
}
