function toRadians (angle) {
  return angle * (Math.PI / 180);
}

var svgWidth = 800;
var svgHeight = 600;

var standSize = 30;

var standMargin = 150;

var seesawLength = 500;
var seesawAngle = 0;

var ballPosition = 0;
var ballSpeed = 0;
var ballAcceleration = 0;

var ballSize = 20;

var ballWeight = 10;

var deltaSimTime = 25;

var svg =
	d3.select("svg")	
	.attr("id", "screen")
	.attr("width", svgWidth)
	.attr("height", svgHeight);

var standBottom =
	svg.append("line")	
	.attr("x1", svgWidth / 2 - standSize / 2)
	.attr("x2", svgWidth / 2 + standSize / 2)
	.attr("y1", svgHeight - standMargin)
	.attr("y2", svgHeight - standMargin);
	
var standRight =
	svg.append("line")	
	.attr("x1", svgWidth / 2 + standSize / 2)
	.attr("x2", svgWidth / 2)
	.attr("y1", svgHeight - standMargin)
	.attr("y2", svgHeight - standMargin - standSize);
	
var standLeft =
	svg.append("line")	
	.attr("x1", svgWidth / 2 - standSize / 2)
	.attr("x2", svgWidth / 2)
	.attr("y1", svgHeight - standMargin)
	.attr("y2", svgHeight - standMargin - standSize);
	
var seesaw =
	svg.append("line")
	.attr("id", "seesaw")
	
	
var ball =
	svg.append("circle")
	.attr("id", "ball")
	.attr("r", ballSize / 2);	
	
/* var ballTouch =
	svg.append("circle")	
	.attr("cx", svgWidth / 2)
	.attr("cy", svgHeight - standMargin - standSize)
	.attr("stroke", "red")
	.attr("fill", "red")
	.attr("r", 2)
	
var ballTouch2 =
	svg.append("circle")	
	.attr("cx", svgWidth / 2)
	.attr("cy", svgHeight - standMargin - standSize)
	.attr("stroke", "red")
	.attr("fill", "red")
	.attr("r", 2) */
	
function paintSeesaw() {
	seesaw	
	.attr("x1", svgWidth / 2 - Math.cos(toRadians(seesawAngle)) * seesawLength / 2)
	.attr("x2", svgWidth / 2 + Math.cos(toRadians(seesawAngle)) * seesawLength / 2)
	.attr("y1", svgHeight - standMargin - standSize - Math.sin(toRadians(seesawAngle)) * seesawLength / 2)
	.attr("y2", svgHeight - standMargin - standSize + Math.sin(toRadians(seesawAngle)) * seesawLength / 2);
}

function paintBall() {
	var ballTouchOnSeesawX = svgWidth / 2 
		+ Math.cos(toRadians(seesawAngle)) * ballPosition;
		
	var ballTouchOnSeesawY = svgHeight - standMargin - standSize 
		+ Math.sin(toRadians(seesawAngle)) * ballPosition;
	
	var ballPosX = ballTouchOnSeesawX - (Math.cos(toRadians(90 - seesawAngle * -1)) * (ballSize / 2));
	var ballPosY = ballTouchOnSeesawY - (Math.sin(toRadians(90 - seesawAngle * -1)) * (ballSize / 2));
	
	ball	
	.attr("cx", ballPosX)
	.attr("cy", ballPosY);
	
	/* ballTouch
	.transition()
	.duration(deltaSimTime)
	.attr("cx", ballTouchOnSeesawX)
	.attr("cy", ballTouchOnSeesawY);
	
	ballTouch2
	.transition()
	.duration(deltaSimTime)
	.attr("cx", ballPosX)
	.attr("cy", ballPosY); */
}
	
$('#seesawAngle').change(function() {
	seesawAngle = $('#seesawAngle').val();	
	paintSeesaw();
	paintBall();
});

$('#ballPosition').change(function() {	
	/* ballPosition = $('#ballPosition').val() / 100 * seesawLength;	
	paintSeesaw();
	paintBall(); */
});

function calcBall() {

	var deltaTime = deltaSimTime / 200;
	
	ballPosition = ballPosition + ballSpeed * deltaTime + 0.5 * ballAcceleration * deltaTime * deltaTime;
	ballSpeed = ballSpeed + ballAcceleration * deltaTime;
	ballAcceleration = ballWeight * 9.81 * Math.sin(toRadians(seesawAngle));
	
	if (ballPosition < -seesawLength / 2) {	
		ballPosition = -seesawLength / 2;
		ballSpeed = 0;
		ballAcceleration = 0;
	}
		
	if (ballPosition > seesawLength / 2) {
		ballPosition = seesawLength / 2;
		ballSpeed = 0;
		ballAcceleration = 0;
	}
}

paintSeesaw();
paintBall();

var obj = {
	crisp_input: [150],
	variables_input: [
		{
			name: "Ball Position",
			setsName: ["Left", "Middle", "Right"],
			sets: [
				[0,0,0,250],
				[0,250,250,500],
				[250,500,500,500]
			]
		}		
	],
	variable_output: {
		name: "Seesaw Angle",
		setsName: ["Left", "Middle", "Right"],
		sets: [
			[0,0,0,45],
			[0,45,45,90],
			[45,90,90,90]
		]
	},
	inferences: [
		[0,1,2]
	]
};

var fl = new FuzzyLogic();

setInterval(function() {
	paintSeesaw();
	calcBall();
	paintBall();	
	
	obj.crisp_input = [ballPosition + 250];
	newSeesawAngle = fl.getResult(obj);
	console.log(obj.crisp_input + " > " + newSeesawAngle);
	seesawAngle = -(newSeesawAngle - 45);
}, deltaSimTime);