
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// utils/collision.js
export const checkCollision = (draggableBox, staticBoxRect) => {
    return (
      draggableBox.left < staticBoxRect.right &&
      draggableBox.right > staticBoxRect.left &&
      draggableBox.top < staticBoxRect.bottom &&
      draggableBox.bottom > staticBoxRect.top
    );
  };
  