function move(element, mx, my,dx,dy) {
  const mouseDownEvent = new MouseEvent('mousedown', {
    clientX: element.getBoundingClientRect().left,
    clientY: element.getBoundingClientRect().top,
    bubbles: true,
    cancelable: true
  });

  const mouseEnterEvent = new MouseEvent('mousenter', {
    clientX: element.getBoundingClientRect().left,
    clientY: element.getBoundingClientRect().top,
    bubbles: true,
    cancelable: true
  });

  const mouseClickEvent = new MouseEvent('mouseclick', {
    clientX: element.getBoundingClientRect().left,
    clientY: element.getBoundingClientRect().top,
    bubbles: true,
    cancelable: true
  });

  const mouseUpEvent = new MouseEvent('mouseup', {
    bubbles: true,
    cancelable: true
  });

  window.md = mouseDownEvent;
  window.mc = mouseClickEvent;
  window.me = mouseEnterEvent;
  window.mu = mouseUpEvent;


  element.dispatchEvent(mouseDownEvent);

  var count = 0;
  var cc = setInterval(function () {
    mx += dx;
    my += dy;
    element.dispatchEvent(new MouseEvent('mousemove', {
      clientX: element.getBoundingClientRect().left + mx,
      clientY: element.getBoundingClientRect().top + my,
      bubbles: true,
      cancelable: true
    }));
    if (++count == 100) {
      clearInterval(cc);
      window.qq = element;
      element.dispatchEvent(mouseDownEvent);
      setTimeout(function(){
      	console.log("mouse up");
      	element.dispatchEvent(mouseUpEvent);
      },500);
    }
  }, 5);
}

function move2(element, mx, my,dx,dy) {
  const mouseDownEvent = new MouseEvent('mousedown', {
    clientX: element.getBoundingClientRect().left,
    clientY: element.getBoundingClientRect().top,
    bubbles: true,
    cancelable: true
  });

  const mouseEnterEvent = new MouseEvent('mousenter', {
    clientX: element.getBoundingClientRect().left,
    clientY: element.getBoundingClientRect().top,
    bubbles: true,
    cancelable: true
  });

  const mouseClickEvent = new MouseEvent('mouseclick', {
    clientX: element.getBoundingClientRect().left,
    clientY: element.getBoundingClientRect().top,
    bubbles: true,
    cancelable: true
  });

  const mouseUpEvent = new MouseEvent('mouseup', {
    bubbles: true,
    cancelable: true
  });

  window.md = mouseDownEvent;
  window.mc = mouseClickEvent;
  window.me = mouseEnterEvent;
  window.mu = mouseUpEvent;

  element.dispatchEvent(mouseDownEvent);

  var count = 0;
  var cc = setInterval(function () {
    mx += dx;
    my += dy;
    element.dispatchEvent(new MouseEvent('mousemove', {
      clientX: element.getBoundingClientRect().left + mx,
      clientY: element.getBoundingClientRect().top + my,
      bubbles: true,
      cancelable: true
    }));
    if (++count == 100) {
      clearInterval(cc);
      window.qq = element;
      setTimeout(function(){
      	console.log("mouse up");
      	element.dispatchEvent(mouseUpEvent);
      },500);
    }
  }, 5);
}


function clickLogic() {
  var item = document.querySelectorAll('[role="treeitem"]')[2];
  item.dispatchEvent(new MouseEvent('mousedown', {
    clientX: item.getBoundingClientRect().left,
    clientY: item.getBoundingClientRect().top,
    bubbles: true,
    cancelable: true
  }));
  setTimeout(function () {
    var rect = document.getElementsByTagName('rect')[12];
    rect.dispatchEvent(new MouseEvent('mouseover', {
      clientX: rect.getBoundingClientRect().left,
      clientY: rect.getBoundingClientRect().top,
      bubbles: true,
      cancelable: true
    }));
    setTimeout(function () {
      move(rect, 160, 0,1,1);
    }, 1000);
  }, 1000);
}

function clickRepeat() {
  var item = document.querySelectorAll('[role="treeitem"]')[3];
  item.dispatchEvent(new MouseEvent('mousedown', {
    clientX: item.getBoundingClientRect().left,
    clientY: item.getBoundingClientRect().top,
    bubbles: true,
    cancelable: true
  }));
  setTimeout(function () {
    var rect = document.getElementsByTagName('rect')[18];
    rect.dispatchEvent(new MouseEvent('mouseover', {
      clientX: rect.getBoundingClientRect().left,
      clientY: rect.getBoundingClientRect().top,
      bubbles: true,
      cancelable: true
    }));
    setTimeout(function () {
      move2(rect,160,0,1.6,-0.23);
    }, 1000);
  }, 1000);
}

clickLogic();
setTimeout(function () {
  console.log('ok')
	clickRepeat();
}, 4000);