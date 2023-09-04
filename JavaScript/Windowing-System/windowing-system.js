// @ts-check

/**
 * Implement the classes etc. that are needed to solve the
 * exercise in this file. Do not forget to export the entities
 * you defined so they are available for the tests.
 */
export function Size(width = 80, height = 60) {
  this.width = width;
  this.height = height;
}

Size.prototype.resize = function (newWidth, newHeight) {
  this.width = newWidth;
  this.height = newHeight;
};

export function Position(x = 0, y = 0) {
  this.x = x;
  this.y = y;
}

Position.prototype.move = function (newX, newY) {
  this.x = newX;
  this.y = newY;
};

export class ProgramWindow {
  constructor() {
    this.screenSize = new Size(800, 600);
    this.size = new Size();
    this.position = new Position();
  }

  resize(newSize) {
    let newWidth = newSize.width;
    if (newWidth < 1) newWidth = 1;
    else if (newWidth + this.position.x > this.screenSize.width) {
      newWidth = this.screenSize.width - this.position.x;
    }
    let newHeight = newSize.height;
    if (newHeight < 1) newHeight = 1;
    else if (newHeight + this.position.y > this.screenSize.height) {
      newHeight = this.screenSize.height - this.position.y;
    }
    this.size.resize(newWidth, newHeight);
  }

  move(newPosition) {
    let newX = newPosition.x;
    if (newX < 0) newX = 0;
    else if (newX + this.size.width > this.screenSize.width) {
      newX = this.screenSize.width - this.size.width;
    }
    let newY = newPosition.y;
    if (newY < 0) newY = 0;
    else if (newY + this.size.height > this.screenSize.height) {
      newY = this.screenSize.height - this.size.height;
    }
    this.position.move(newX, newY);
  }
}

export function changeWindow(programWindow) {
  programWindow.size = new Size(400, 300);
  programWindow.position = new Position(100, 150);
  return programWindow;
}
