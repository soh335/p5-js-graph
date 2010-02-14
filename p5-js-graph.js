var P5JsGraph  = function () {
  this.p;
  this.data;
  this.width;
  this.height;
  this.text_size = 10;
}

P5JsGraph.prototype = {

  canvas: function(t) {
    this.p = Processing(t);
  },

  set_data: function(obj) {
    this.data = obj;
  },

  set_size: function(width, height) {
    this.width = width;
    this.height = height;
  },

  linechart: function() {

    var self = this;
    var points = [];
    var left_margin = 30;
    var top_margin = 10;
    var right_margin = 10;
    var bottom_margin = 30;

    this.p.setup = function() {
      this.size(self.width , self.height);
      this.noStroke();
      self.setup_data();
    },

    this.p.draw = function() {
      this.background(100);

      self.setXaxisLine();
      self.setYaxisLine();

      for (var i = 0, _length = points.length; i < _length; i++) {
        for (var j = 0, length = points[i].length; j < length; j++) {
          points[i][j].draw();
          if ( j > 0 ) {
            points[i][j].connect(points[i][j-1]);
          }
        }
      }

      this.exit();

    },

    this.setXaxisLine = function() {
      self.p.line(left_margin, this.height - bottom_margin, this.width-right_margin , this.height - bottom_margin);
      for (var i = 0, length = self.data.x_axis.length; i < length; i++) {
        var x = (this.width-(left_margin+right_margin))/(length-1) * i + left_margin;
        var y = this.height - bottom_margin;
        self.p.fill(255, 0, 0, 100);
        self.p.ellipse(x, y, 10, 10);
        self.p.textAlign(self.p.CENTER);
        self.p.fill(0,0,0);
        self.p.text(String(self.data.x_axis[i]), x - String(self.data.x_axis[i]).length/3 * this.text_size, y + bottom_margin/1.5);
      }
    },

    this.setYaxisLine = function() {
      self.p.line(left_margin, this.height - bottom_margin, left_margin, top_margin);
      for (var i = 0, length = self.data.y_axis.length; i < length; i++) {
        var x = left_margin;
        var y = this.height - (this.height - (top_margin + bottom_margin)) * self.data.y_axis[i]/(self.data.y_axis[self.data.y_axis.length-1]-self.data.y_axis[0]) - bottom_margin;
        self.p.fill(0, 255, 0, 100);
        self.p.ellipse(x, y, 10, 10);
        self.p.fill(0,0,0);
        self.p.textAlign(self.p.LEFT);
        self.p.text(String(self.data.y_axis[i]), x - (String(self.data.y_axis[i]).length * this.text_size + this.text_size), y + this.text_size/3);
      }
    },

    this.p.mouseMoved = function() {
      //console.log(this.mouseX, this.mouseY);
      var flag = false;
      for (var i = 0, _length = points.length; i < _length; i++) {
        for (var j = 0, length = points[i].length; j < length; j++) {
          if (points[i][j].isMouseOver()) {
            points[i][j].is_stroke = true;
            this.redraw();
            points[i][j].showMessage();
            flag = true;
            break;
          } else {
            points[i][j].is_stroke = false;
          }
        }
      }
      if (flag == false) {
        this.redraw();
      }
    },

    this.setup_data = function() {
      for (var key in self.data.values) {
        var color = self.p.color(self.p.random(0,255), self.p.random(0,255), self.p.random(0,255));
        var _points = [];
        for (var i = 0, length = this.data.values[key].length; i < length; i++) {
          _points.push(new Point((this.width-(left_margin+right_margin))/(length-1) * i + left_margin, (this.height-(top_margin+bottom_margin)) * (self.data.y_axis[self.data.y_axis.length-1] - self.data.y_axis[0] - self.data.values[key][i]) / (self.data.y_axis[self.data.y_axis.length-1] - self.data.y_axis[0]) + top_margin, this.data.values[key][i], key, color));
        }
        points.push(_points);
      }
    },

    Point = function(x, y, value, name, color) {
      this.x = x;
      this.y = y;
      this.value = value;
      this.name = name;
      this.color = color;
      this.width = 10;
      this.height = 10;
      this.message_width = 100;
      this.message_height = 30;
      this.is_stroke = false;

      this.draw = function() {
        self.p.fill(this.color);
        if (this.is_stroke) {
          self.p.stroke(0,0,0);
        } else {
          self.p.noStroke();
        }
        self.p.ellipse(x, y, this.width, this.height);
      },

      this.isMouseOver = function() {
        if (this.x - this.width/2 < self.p.mouseX && self.p.mouseX  < this.x + this.width/2 && this.y - this.height/2 < self.p.mouseY && self.p.mouseY < this.y + this.height/2) {
          return true;
        }
        return false;
      },

      this.connect = function(point) {
        self.p.stroke(0,0,0,80);
        self.p.line(this.x, this.y, point.x, point.y);
      },

      this.showMessage = function() {
        var name = "name:" + this.name;
        var value = "value:" + this.value;
        var width = self.text_size/1.2 * (name.length > value.length ? name.length : value.length);
        var x = self.p.mouseX + this.message_width < self.width ? this.x : this.x - width;
        var y = self.p.mouseY + this.message_height < self.height ? this.y : this.y - this.message_height;
        self.p.fill(0,0,0);
        self.p.rect(x,y,width,this.message_height);
        self.p.fill(255,255,255);
        self.p.text("name: "+this.name, x + 5, y + 10);
        self.p.text("value: "+this.value, x + 5, y + 25);
      },

      this.clearMessage = function() {
        self.p.redraw();
      }
    }

    this.p.init();
  }
}

