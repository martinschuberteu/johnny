var raspi = require("raspi-io"),
  five = require("johnny-five"),
  board = new five.Board({
    io: new raspi()
  }),
  oled = require("oled-js"),
  font = require("oled-font-5x7"),
  sleep = require("sleep");

board.on("ready", function() {
  console.log("board ready.");

  var pwmExpander = new five.Expander({
    controller: "PCA9685"
  });

  var pwmBoard = new five.Board.Virtual({
    io: pwmExpander
  });

  // display
  var displayOpts = {
    width: 128,
    height: 64,
    address: 0x3C
  };
  var oledDisplay = new oled(board, five, displayOpts);

  // camera servos
  var servoX = new five.Servo({
    pin: 4,
    range: [ 0, 120 ],
    board: pwmBoard
  });
  var servoY = new five.Servo({
    pin: 5,
    range: [ 0, 120 ],
    board: pwmBoard
  });

  // motors
  var leftMotor = new five.Motor({
    pins: {
      dir: 8,
      pwm: 9
    },
    board: pwmBoard
  });
  var rightMotor = new five.Motor({
    pins: {
      dir: 12,
      pwm: 13
    },
    board: pwmBoard
  });

  // 
  // main
  //

  // display test
  oledDisplay.turnOnDisplay();
  oledDisplay.clearDisplay();
  oledDisplay.update();
  oledDisplay.setCursor(1, 1);
  oledDisplay.writeString(font, 1, "Cats and dogs are really cool animals, you know.", 1, true, 2);

  // motor test
  leftMotor.forward(128);
  sleep.sleep(2);
  leftMotor.stop();

  // servo test
  /*
  servoX.min();
  sleep.sleep(2)

  servoX.max();
  sleep.sleep(2)

  servoX.center();
  sleep.sleep(2)
  */

  // clean up
  this.on("exit", function() {
    console.log("cleaning up");
    // motors
    leftMotor.stop();
    // display
    oledDisplay.clearDisplay();
    oledDisplay.update();
   
    // sleep 
    sleep.sleep(1);
    oledDisplay.turnOffDisplay();
  });
});
