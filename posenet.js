let video;
let poseNet;
let poses = [];


function setup() {
  const canvas = createCanvas(640, 480);
  canvas.parent('videoContainer');

  video = createCapture(VIDEO);
  video.size(width, height);
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
}  
function modelReady(){
  select('#status').html('model Loaded')
} 
function drawKeypoints()  {
  side = 0; 
  jump = 0;
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.2) {
        //command
        if(keypoint.part == "rightWrist" || keypoint.part == "leftWrist")  {
          console.log('poses',keypoint)
            console.log(keypoint.position)
            if(keypoint.position.x > 350){
              side = 1
            } 
            if(keypoint.position.x < 350){
              side = 2
            }     
            if(keypoint.position.y < 100){
              jump = 1
            }                               
        }
           

        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}
function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

function draw() {
  image(video, 0, 0, width, height);
  drawKeypoints();
  //drawSkeleton();
}