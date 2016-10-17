(function() {

  'use strict';

  var canvas = document.getElementById('hexmap');
  var context = canvas.getContext('2d');

  function upLeft(x, y, color) {
    context.save();
    context.beginPath();
    context.moveTo(x, y);
    context.lineWidth = 10;
    context.lineTo(x - 30, y - 20);
    context.closePath();
    context.strokeStyle = color;
    context.stroke();
    context.restore();
  }

  function upRight(x, y, color) {
    context.save();
    context.beginPath();
    context.moveTo(x, y);
    context.lineWidth = 10;
    context.lineTo(x + 30, y - 20);
    context.closePath();
    context.strokeStyle = color;
    context.stroke();
    context.restore();
  }

  function vertical(x, y, color) {
    context.save();
    context.beginPath();
    context.moveTo(x, y);
    context.lineWidth = 10;
    context.lineTo(x, y - 40);
    context.closePath();
    context.strokeStyle = color;
    context.stroke();
    context.restore();
  }

  function buildPortImage(x, y, radius, angle, math, url, startX, startY, sideX, sideY) {
    var image = new Image();
    image.src = url;
    image.onload = function() {
      context.save();
      context.beginPath();
      context.arc(x, y, radius, angle, math);
      context.closePath();
      context.fill();
      context.clip();
      context.drawImage(image, startX, startY, sideX, sideY);
      context.restore();
    };
  }

  function buildPortNumber(x, y, radius, angle, math) {
    context.save();
    context.beginPath();
    context.fillStyle = 'sandybrown';
    context.arc(x, y, radius, angle, math);
    context.closePath();
    context.fill();

    context.beginPath();
    context.fillStyle = 'black';
    context.font = '20px Helvetica';
    context.fillText('3:1', x - 12, y + 5);
    context.fill();
    context.restore();
  }

  //docks from A1
  upLeft(295, 105, 'saddlebrown');
  vertical(255, 130, 'saddlebrown');
  //docks from A2
  upRight(395, 110, 'saddlebrown');
  vertical(445, 130, 'saddlebrown');
  //dock from B4
  upRight(545, 180, 'saddlebrown');
  vertical(595, 205, 'saddlebrown');
  //dock from C5
  upLeft(670, 295, 'saddlebrown');
  upRight(640, 325, 'saddlebrown');
  //dock from D4
  vertical(595, 430, 'saddlebrown');
  upLeft(570, 435, 'saddlebrown');
  //dock from E2
  vertical(450, 500, 'saddlebrown');
  upLeft(425, 510, 'saddlebrown');
  //dock from E1
  vertical(255, 500, 'saddlebrown');
  upRight(275, 508, 'saddlebrown');
  //dock from D1
  upLeft(208, 398, 'saddlebrown');
  upRight(180, 365, 'saddlebrown');
  //dock from B1
  upLeft(208, 248, 'saddlebrown');
  upRight(180, 220, 'saddlebrown');

  //A1 Port
  buildPortNumber(260, 85, 18, 0, 2 * Math.PI);
  //A2 Port
  buildPortImage(440, 85, 18, 0, 2 * Math.PI, '/images/sheep.jpg', 420, 50, 72, 78);
  //B4 Port
  buildPortNumber(590, 160, 18, 0, 2 * Math.PI);
  //C5 Port
  buildPortNumber(680, 300, 18, 0, 2 * Math.PI);
  //D4 Port
  buildPortImage(585, 437, 18, 0, 2 * Math.PI, '/images/brick.jpg', 565, 418, 45, 38);
  //E2 Port
  buildPortImage(440, 511, 18, 0, 2 * Math.PI, '/images/lumber.jpg', 418, 486, 72, 144);
  //E1 Port
  buildPortNumber(263, 513, 18, 0, 2 * Math.PI);
  //D1 Port
  buildPortImage(170, 370, 18, 0, 2 * Math.PI, '/images/wheat.jpg', 150, 350, 44, 38);
  //B1 Port
  buildPortImage(170, 225, 18, 0, 2 * Math.PI, '/images/ore.jpg', 140, 169, 77, 108);

})();
