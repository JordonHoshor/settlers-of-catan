(function () {

  var canvas = document.getElementById('hexmap');
  var ctx = canvas.getContext('2d');
  var canvas2 = document.getElementById('hexmap2');
  var ctx2 = canvas2.getContext('2d');
  var canvas3 = document.getElementById('hexmap3');
  var ctx3 = canvas3.getContext('2d');

  var board = null;
  var robberLocation = null;

  $('.ready').on('click', function(e) {
    e.preventDefault();
    $(this).css('display', 'none');
    $('.canvas-contain').css('display', 'block');
    var pathname = window.location.pathname.split('/');
    var boardID = pathname[2];
    $.ajax({
      url: `/play/${boardID}/join`,
      data: {id: boardID}
    }).done(function(boardInfo) {
      board = boardInfo;
      Object.keys(boardInfo).forEach(function(tile) {
        if (boardInfo[tile].type === 'desert') robberLocation = tile;
        if (tile !== 'id' && tile !== 'allVertices' && tile !== 'allEdges' && tile !== 'allEdgeEndPoints') drawBoard(board[tile]);
      });
    });
  });

  $(document).on('click', '#hexmap3', function(e) {
    // find where the mouse is on click
    var mouseX = e.offsetX;
    var mouseY = e.offsetY;
    var settleCoords = board.allVertices.filter(function(vertex) {
      var x = vertex[0];
      var y = vertex[1];
      return Math.sqrt((x - mouseX) * (x - mouseX) + (y - mouseY) * (y - mouseY)) < 11;
    });
    var roadIndex = null;
    board.allEdges.forEach(function(edge, index) {
      var x = edge[0];
      var y = edge[1];
      if (Math.sqrt((x - mouseX) * (x - mouseX) + (y - mouseY) * (y - mouseY)) < 11) {
        roadIndex = index;
      }
    });
    var [robberPlace] = Object.keys(board).filter(function(tile) {
      var x = board[tile].x + 50;
      var y = board[tile].y + 25;
      var result = false;
      if (tile !== 'id' && tile !== 'allVertices' && tile !== 'allEdges') {
        if (Math.sqrt((x - mouseX) * (x - mouseX) + (y - mouseY) * (y - mouseY)) < 20) result = [x, y];
      }
      return result;
    });

    var color = $('.player-info').data('player-color');
    var avatar = $('.player-info').data('player-avatar');

    if (settleCoords.length) {

      var newSettlement = new SettlementSquare(settleCoords[0][0] - 10, settleCoords[0][1] - 10, 20, 20, color);
      newSettlement.draw();
    } else if (roadIndex !== null) {
      drawRoad(board.allEdgeEndPoints[roadIndex][0][0], board.allEdgeEndPoints[roadIndex][0][1], board.allEdgeEndPoints[roadIndex][1][0], board.allEdgeEndPoints[roadIndex][1][1], color);
    } else if (robberPlace !== undefined) {
      var robber = new Image();
      robber.onload = function() {
        ctx2.drawImage(robber, board[robberPlace].x + 25, board[robberPlace].y, 50, 50);
        ctx2.clearRect(board[robberLocation].x + 25, board[robberLocation].y, 50, 50);
        robberLocation = robberPlace;
      };
      robber.src = `https://raw.githubusercontent.com/pittdogg/developers-of-galvanize/master/src/client/images/robber.jpg`;
    }
  });

  function drawBoard(tile) {
    var img = new Image();
    //draw the image when loaded
    img.onload = function() {
      ctx.save();

      //define the polygon
      ctx.beginPath();
      ctx.moveTo(tile.x, tile.y);
      for (var i = 1; i < tile.vertices.length; i++) {ctx.lineTo(tile.vertices[i][0], tile.vertices[i][1]);}
      ctx.lineTo(tile.x, tile.y);
      ctx.closePath();

      //draw the image
      ctx.clip();

      switch (tile.type) {
        case 'lumber':
          ctx.drawImage(img, tile.x, tile.y - 25, 100, 200);
          break;
        case 'brick':
          ctx.drawImage(img, tile.x, tile.y - 25, 175, 100);
          break;
        case 'desert':
          ctx.drawImage(img, tile.x, tile.y - 25, 150, 100);
          break;
        default:
          ctx.drawImage(img, tile.x, tile.y - 25, 100, 100);
      }

      //fill and stroke are still available for overlays and borders
      ctx.stroke();
      if (tile.roll !== null) {
        //draw circle inside hexagon;
        ctx.beginPath();
        ctx.fillStyle = 'burlywood';
        ctx.arc(tile.x + 50, tile.y + 25, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.font = '20px Helvetica';
        ctx.fillText(tile.roll, tile.x + 39, tile.y + 32);
        ctx.fill();
        ctx.closePath();
      } else {
        var robber = new Image();
        robber.onload = function() {
          ctx2.drawImage(robber, tile.x + 25, tile.y, 50, 50);
        };
        robber.src = `https://raw.githubusercontent.com/pittdogg/developers-of-galvanize/master/src/client/images/robber.jpg`;
      }
      ctx.restore();
    };
    img.src = `https://raw.githubusercontent.com/pittdogg/developers-of-galvanize/master/src/client/images/${tile.type}.jpg`;
  }

  function drawRoad(x1, y1, x2, y2, color) {
    ctx2.save();
    ctx2.beginPath();
    ctx2.lineWidth = 10;
    ctx2.strokeStyle = color;
    ctx2.moveTo(x1, y1);
    ctx2.lineTo(x2, y2);
    ctx2.closePath();
    ctx2.stroke();
    ctx2.restore();
  }

  class SettlementSquare {
    constructor(x, y, w, h, fill) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.fill = fill;
    }

    draw() {
      ctx3.strokeStyle = 'white';
      ctx3.fillStyle = this.fill;
      ctx3.lineWidth = 3;
      ctx3.fillRect(this.x, this.y, this.w, this.h);
      ctx3.strokeRect(this.x, this.y, this.w, this.h);
    }
  }
})();
