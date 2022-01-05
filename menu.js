class Cursor {
  async init(x, y) {
    Cursor.POINTER = 0;
    Cursor.MOUSEDOWN = 1;
    this.ready = false;
    this.imgClick = 'https://www.freeiconspng.com/uploads/mouse-cursor-click-png-outline-2.png';
    this.imgCursor = 'https://i.pinimg.com/favicons/19638dc8bbdda1dc864a426073a6efb1d0fbc992e66c90dc527993e3.ico?a0d9215bcdb6521a918f0c76255eea7e';
    this.eleClick = await this.loadImage(this.imgClick, 32, 32);
    this.ele = await this.loadImage(this.imgCursor, 32, 32);
    this.ele.style.position = 'absolute';
    this.ele.style.display = '';
    this.ele.style.zIndex = 999;
    this.set(x, y);
    document.body.appendChild(this.ele);
    this.ready = true;
  }

  show() {
    this.ele.style.display = '';
  }

  hide() {
    this.ele.style.display = 'none';
  }

  type(n) {
    switch (n) {
      case 0:
        this.ele.src = this.imgCursor;
        break;
      case 1:
        this.ele.src = this.imgClick;
        break;
    }
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    this.ele.style.top = y + 'px';
    this.ele.style.left = x + 'px';
  }

  async click() {
    this.ele.src = this.imgClick;
    await new Promise(r => setTimeout(r, 1000 /*ms*/));
    this.ele.src = this.imgCursor;
  }

  async moveToElement(ele, biasX, biasY, speedSec) {
    while (!this.ready) {
      await new Promise(r => setTimeout(r, 100 /*ms*/));
    }
    var pos = ele.getBoundingClientRect();
    await this.move(pos.x + biasX, pos.y + biasY, speedSec);
  }

  async move(ex, ey, speedSec) {
    var chunk = speedSec * 100;
    var dx = (ex - this.x) / chunk;
    var dy = (ey - this.y) / chunk;
    console.log("dx:", dx, " dy:", dy, "chunk:", chunk);
    for (var i = 0; i < speedSec * 100; i++) {
      this.x += dx;
      this.y += dy;
      this.set(this.x, this.y);
      await new Promise(r => setTimeout(r, 1 /*ms*/));
    }
  }

  async loadImage(url, width, height) {
    return new Promise((resolve, reject) => {
      var img = new Image(width, height);
      document.body.appendChild(img);
      img.src = url;
      img.width = width;
      img.height = height;
      img.style.position = 'absolute';
      img.style.display = 'none';
      img.onload = async () => {
        //console.log("Image Loaded:", url);
        img.style.display = '';
        resolve(img);
      };
    });
  };
}

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
  async moveTo(ex, ey, connect, cursor, cx, cy) {
    var self = this;
    var rect = this.ele;
    function move(x, y) {
      return new MouseEvent('mousemove', {
        clientX: x,
        clientY: y,
        bubbles: true,
        cancelable: true
      });
    }
    var mx = rect.getBoundingClientRect().left;
    var my = rect.getBoundingClientRect().top;
    rect.dispatchEvent(self.getEvent('mousedown'));
    var chunk = Block.speedSec * 1000;
    var dx = (ex - mx) / chunk;
    var dy = (ey - my) / chunk;
    console.log("dx:", dx, " dy:", dy, "chunk:", chunk);
    for (var i = 0; i < Block.speedSec * 1000; i++) {
      console.log("mx:", mx, " my:", my, "chunk:", chunk);
      mx += dx;
      my += dy;
      rect.dispatchEvent(move(mx, my));
      var pos = this.ele.getBoundingClientRect();
      cursor.set(cx + mx, cy + my);
      await new Promise(r => setTimeout(r, 1 /*ms*/));
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
  select(str) {
    return this.data[str];
  }
}

class Mouse {
  constructor(x, y) {
    this.menu = new Menu();
    this.cursor = new Cursor();
    this.runButton = document.getElementById('runButton');
    this.biasX = 50;
    this.biasY = 8;
    var self = this;
    setTimeout(async function () {
      await self.cursor.init(x, y);
    }, 0);
  }

  async wait(sec) {
    await new Promise(r => setTimeout(r, sec * 1000));
    return this;
  }

  async clickItem(itemName) {
    this.item = this.menu.select(itemName);
    await this.cursor.moveToElement(this.item.ele, this.biasX, this.biasY, 2);
    this.cursor.type(Cursor.MOUSEDOWN);
    await new Promise(r => setTimeout(r, 1500));
    this.item.click();
    this.cursor.type(Cursor.POINTER);
    return this;
  }

  async moveBlockTo(idxBlock, moveToX, moveToY, attach) {
    var block = this.item.select(idxBlock);
    await new Promise(r => setTimeout(r, 500));
    await this.cursor.moveToElement(block.ele, this.biasX, this.biasY, 2);
    this.cursor.type(Cursor.MOUSEDOWN);
    await new Promise(r => setTimeout(r, 500));
    await block.mouseOver();
    await block.moveTo(moveToX, moveToY, attach, this.cursor, this.biasX, this.biasY);
    this.cursor.type(Cursor.POINTER);
    await new Promise(r => setTimeout(r, 500));
  }

  async clickRunButton() {
    await this.cursor.moveToElement(this.runButton, 25, 25, 5);
    this.runButton.click();
  }
}

var mouse = new Mouse(300, 300);

await mouse.clickItem('開發板');
await mouse.moveBlockTo(0, 300, 150, attach = false);

await mouse.clickItem('矩陣 LED');
await mouse.moveBlockTo(8, 340, 180, attach = true);

await mouse.clickItem('怪獸控制');
await mouse.moveBlockTo(0, 340, 210, attach = true);

await mouse.clickRunButton();