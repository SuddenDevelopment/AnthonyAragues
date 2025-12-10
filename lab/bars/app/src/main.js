(function() {
    function initialize() {
        var type = "WebGL"
        if (!PIXI.utils.isWebGLSupported()) {
            type = "canvas"
        }

        PIXI.utils.sayHello(type)

        document.addEventListener("DOMContentLoaded", function(event) {
            drawCanvas();
        });
    }

    initialize();

    var _renderer, _stage;

    function drawCanvas() {
        _renderer = PIXI.autoDetectRenderer(1100, 256, { backgroundColor: 0x303030, antialias: true });
        document.body.appendChild(_renderer.view);
        _stage = new PIXI.Container();
        drawBarChart();
    }

    function drawBarChart() {
        drawHourBars();
        drawMinuteBars();
        drawSecondBars();
        _renderer.render(_stage);
    }

    function drawHourBars() {
      var fillColor = 0x7d1c04, lineColor = 0x000000;
      drawRect(20, 110,10, 110, fillColor, lineColor);
      drawRect(30, 60, 10, 160, fillColor, lineColor);
      drawRect(40, 150, 10, 70, fillColor, lineColor);
      drawRect(50, 20, 10, 200, fillColor, lineColor);
      drawRect(60, 110, 10, 110, fillColor, lineColor);
      drawRect(70, 60, 10, 160, fillColor, lineColor);
      drawRect(80, 150, 10, 70, fillColor, lineColor);
      drawRect(90, 20, 10, 200, fillColor, lineColor);
    }

    function drawMinuteBars() {
      var fillColor = 0xc42901, lineColor = 0x000000;
      drawRect(100, 110,15, 110, fillColor, lineColor);
      drawRect(115, 60, 15, 160, fillColor, lineColor);
      drawRect(130, 150, 15, 70, fillColor, lineColor);
      drawRect(145, 20, 15, 200, fillColor, lineColor);
      drawRect(160, 110, 15, 110, fillColor, lineColor);
      drawRect(175, 60, 15, 160, fillColor, lineColor);
      drawRect(190, 150, 15, 70, fillColor, lineColor);
      drawRect(205, 20, 15, 200, fillColor, lineColor);
    }

    function drawSecondBars() {
      var fillColor = 0xff3805, lineColor = 0x000000;
      drawRect(220, 110,20, 110, fillColor, lineColor);
      drawRect(240, 60, 20, 160, fillColor, lineColor);
      drawRect(260, 150, 20, 70, fillColor, lineColor);
      drawRect(280, 20, 20, 200, fillColor, lineColor);
      drawRect(300, 110, 20, 110, fillColor, lineColor);
      drawRect(320, 60, 20, 160, fillColor, lineColor);
      drawRect(340, 150, 20, 70, fillColor, lineColor);
      drawRect(360, 20, 20, 200, fillColor, lineColor);
    }

    function drawRect(x, y, width, height, fillColor, lineColor) {
      var rect = new PIXI.Graphics();
      rect.beginFill(fillColor);
      rect.lineStyle(1, lineColor);
      rect.drawRect(x, y, width, height);
      _stage.addChild(rect);
    }
}());
