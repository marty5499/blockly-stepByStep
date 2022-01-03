class Block {
  constructor(ele) {
    this.ele = ele;
    Block.delaySec = 0.5;
    Block.speedSec = 0.1;
  }
  delay(sec) {
    Block.delaySec = sec;
    return this;  
  }
  speed(sec) {
    Block.speedSec = sec;
    return this;  
  }
  async mouseOver() {
    var rect = this.ele;
    await new Promise(r => setTimeout(r, Block.delaySec * 1000));
    this.ele.dispatchEvent(new MouseEvent('mouseover', {
      clientX: rect.getBoundingClientRect().left,
      clientY: rect.getBoundingClientRect().top,
      bubbles: true,
      cancelable: true
    }));
    await new Promise(r => setTimeout(r, Block.delaySec * 1000));
    return rect;
  }
  async moveTo(ex, ey, connect) {
    var self = this;
    var rect = this.ele;
    function move(x, y) {
      return new MouseEvent('mousemove', {
        clientX: rect.getBoundingClientRect().left + x,
        clientY: rect.getBoundingClientRect().top + y,
        bubbles: true,
        cancelable: true
      });
    }
    var mx = rect.getBoundingClientRect().left;
    var my = 0;
    rect.dispatchEvent(self.getEvent('mousedown'));
    var chunk = Block.speedSec * 1000;
    var dx = Math.abs(mx - ex) / chunk;
    var dy = ey / chunk;
    //console.log("dx:",dx," dy:",dy,"chunk:",chunk);
    for (var i = 0; i < Block.speedSec * 1000; i++) {
      mx += dx;
      my += dy;
      rect.dispatchEvent(move(mx, my));
      await new Promise(r => setTimeout(r, 1 /*ms*/ ));
    }
    //console.log("over..ex:", mx, ",ey:", my);
    if (!connect) {
      await new Promise(r => setTimeout(r, 500));
      rect.dispatchEvent(self.getEvent('mousedown'));
    }
    await new Promise(r => setTimeout(r, 500));
    rect.dispatchEvent(self.getEvent('mouseup'));
  }

  getEvent(evt) {
    var self = this;
    return new MouseEvent(evt, {
      clientX: self.ele.getBoundingClientRect().left,
      clientY: self.ele.getBoundingClientRect().top,
      bubbles: true,
      cancelable: true
    });
  }
}

class Item {
  constructor(ele) {
    this.ele = ele;
  }
  click() {
    this.ele.dispatchEvent(this.getEvent("mousedown"));
    return this;
  }

  select(idx) {
    var list = document.getElementsByClassName('blocklyBlockCanvas')[1].children;
    return new Block(list[idx * 2]);
  }
  getEvent(evt) {
    var self = this;
    return new MouseEvent(evt, {
      clientX: self.ele.getBoundingClientRect().left,
      clientY: self.ele.getBoundingClientRect().top,
      bubbles: true,
      cancelable: true
    });
  }
}

class Menu {
  constructor() {
    this.list = document.getElementsByClassName('blocklyTreeLabel');
    this.data = {}
    for (var i = 0; i < this.list.length; i++) {
      this.data[this.list[i].innerHTML] = new Item(this.list[i].parentElement);
    }
  }
  open(str) {
    return this.data[str];
  }
}
class AIMenu {
  constructor() {
    this.list = document.getElementsByClassName('blocklyTreeLabel');
    this.data = {}
    for (var i = 0; i < this.list.length; i++) {
      this.data[this.list[i].innerHTML] = new Item(this.list[i].parentElement.parentElement.parentElement);
    }
  }
  open(str) {
    return this.data[str];
  }
}

var menu = new AIMenu();
var item = menu.open('開發板');
//var block = menu.open('開發板').click().select(0);