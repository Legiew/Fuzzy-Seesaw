function toRadians(angle) {
    return angle * (Math.PI / 180);
}

var svgWidth = 800;
var svgHeight = 400;

var standSize = 30;

var standMargin = 150;

var seesawLength = 500;
var seesawAngle = 0;

var ballPosition = 0;
var ballSpeed = 0;
var ballAcceleration = 0;

var ballSize = 20;

var deltaSimTime = 25;

var dontChangeSeesawAngleCounter = 0;

var seesawAngleMaxDelta = 0.2;

var desiredBallPosition = 0;

var calcTicker = 0;

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

var desiredBallPositionLine =
    svg.append("line")
    .attr("x1", svgWidth / 2)
	.attr("x2", svgWidth / 2)
	.attr("y1", svgHeight - standMargin)
	.attr("y2", svgHeight - standMargin + 15);

function paintSeesaw() {

    var x1 = svgWidth / 2 - Math.cos(toRadians(seesawAngle)) * seesawLength / 2;
    var x2 = svgWidth / 2 + Math.cos(toRadians(seesawAngle)) * seesawLength / 2;
    var y1 = svgHeight - standMargin - standSize - Math.sin(toRadians(seesawAngle)) * seesawLength / 2;
    var y2 = svgHeight - standMargin - standSize + Math.sin(toRadians(seesawAngle)) * seesawLength / 2;

    seesaw
	.attr("x1", x1)
	.attr("x2", x2)
	.attr("y1", y1)
	.attr("y2", y2);
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
}

$('#seesawAngle').change(function () {
    seesawAngle = parseInt($('#seesawAngle').val());
    dontChangeSeesawAngleCounter = 25;
});

$('#desiredBallPosition').change(function () {
    desiredBallPosition = -$('#desiredBallPosition').val();
    console.log(desiredBallPosition);
    console.log(svgWidth / 2);
    desiredBallPositionLine
        .attr("x1", svgWidth / 2 - desiredBallPosition)
        .attr("x2", svgWidth / 2 - desiredBallPosition);
    console.log("dbp", "x1", desiredBallPosition - svgWidth / 2, svgWidth / 2);
});

function calcBall() {

    var deltaTime = deltaSimTime / 150;   

    ballPosition = ballPosition + ballSpeed * deltaTime + 0.5 * ballAcceleration * deltaTime * deltaTime;
    ballSpeed = ballSpeed + ballAcceleration * deltaTime;
    ballAcceleration = 9.81 * Math.sin(toRadians(seesawAngle));    

    if (ballPosition < -seesawLength / 2) {
        ballPosition = -seesawLength / 2;
        //TODO: Add correct value
        ballSpeed = -ballSpeed * .5;
        ballAcceleration = -ballAcceleration;
    }

    if (ballPosition > seesawLength / 2) {
        ballPosition = seesawLength / 2;
        //TODO: Add correct value
        ballSpeed = -ballSpeed * .5;
        ballAcceleration = -ballAcceleration;
    }
}

paintSeesaw();
paintBall();

var obj = {
    crisp_input: [0, 0, 0],
    variables_input: [
		{
		    name: "Ball Position",
		    setsName: ["Left", "Middle", "Right"],
		    sets: [
				[-250, -250, -250, 0],
				[-250, 0, 0, 250],
				[0, 250, 250, 250]
		    ]
		},
		{
		    name: "Ball Speed",
		    setsName: ["Negativ", "Zero", "Positiv"],
		    sets: [
				[-40, -40, -20, 0],
				[-20, 0, 0, 20],
				[0, 20, 40, 40]
		    ]
		},
		{
		    name: "Ball Acceleration",
		    setsName: ["Negativ", "Zero", "Positiv"],
		    sets: [
				[-7, -7, -7, 0],
				[-7, 0, 0, 7],
				[0, 7, 7, 7]
		    ]
		}
    ],
    variable_output: {
        name: "Seesaw Angle",
        setsName: ["Left", "Middle", "Right"],
        sets: [
			[0, 0, 0, 45],
			[0, 45, 45, 90],
			[45, 90, 90, 90]
        ]
    },
    inferences: [
		[0, 1, 2],
		[0, 1, 2],
		[0, 1, 2]
    ]
};

var fl = new FuzzyLogic();

setInterval(function () {
 
    calcBall();
    
    paintSeesaw();
    paintBall();

    obj.variables_input[0].sets = [
				[-250 - desiredBallPosition, -250 - desiredBallPosition, -250 - desiredBallPosition, 0 - desiredBallPosition],
				[-250 - desiredBallPosition, 0 - desiredBallPosition, 0 - desiredBallPosition, 250 - desiredBallPosition],
				[0 - desiredBallPosition, 250 - desiredBallPosition, 250 - desiredBallPosition, 250 - desiredBallPosition]
    ];
    
    obj.crisp_input = [ballPosition, ballSpeed, ballAcceleration];
    newSeesawAngle = fl.getResult(obj);

    if (dontChangeSeesawAngleCounter == 0) {

        newSeesawAngle = -(newSeesawAngle - 45);       

        if (Math.abs(newSeesawAngle - seesawAngle) > seesawAngleMaxDelta) {

            if (newSeesawAngle > seesawAngle)
                newSeesawAngle = seesawAngle + seesawAngleMaxDelta;

            if (newSeesawAngle < seesawAngle)
                newSeesawAngle = seesawAngle - seesawAngleMaxDelta;
        }

        seesawAngle = newSeesawAngle;
    }
    else
        dontChangeSeesawAngleCounter--;

}, deltaSimTime);

setInterval(function () {
    $('#position').text(ballPosition.toFixed(2));
    $('#speed').text(ballSpeed.toFixed(2));
    $('#acceleration').text(ballAcceleration.toFixed(2));
    $('#angle').text(seesawAngle.toFixed(2));
    $('#seesawAngle').val(Math.round(seesawAngle));
    $('#desiredBallPositionDisplay').text(-desiredBallPosition);
}, 250);