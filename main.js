const canvasElements = [
  document.getElementById('canvas1'),
  document.getElementById('canvas2'),
  document.getElementById('canvas3'),
];
const images = ['canva1.webp', 'canva2.webp', 'canva3.webp'];
let currentCanvasIndex = 0;

const ctx = canvasElements.map(canvas => canvas.getContext('2d'));

const textInputs = [
  [],
  [],
  [],
];

images.forEach((imageSrc, index) => {
  const img = new Image();
  img.src = imageSrc;
  img.onload = () => {
      ctx[index].drawImage(img, 0, 0, 270, 480);
  };
});

document.getElementById('addText').addEventListener('click', () => {
  const wrapper = document.querySelector('.canvas-wrapper');
  const input = createTextInput('New Text', 50, 50, currentCanvasIndex);
  wrapper.appendChild(input);
  textInputs[currentCanvasIndex].push(input);
});

function createTextInput(text, x, y, canvasIndex) {
  const input = document.createElement('div');
  input.className = 'text-input';
  input.setAttribute('contenteditable', 'true');
  input.innerHTML = text;
  input.style.left = `${x}px`;
  input.style.top = `${y}px`;
  input.style.fontSize = '16px';
  input.style.fontFamily = 'Arial';
  input.style.color = '#000000';
  makeDraggable(input, canvasIndex);
  input.addEventListener('input', () => adjustInputSize(input));
  input.addEventListener('mousedown', (e) => {
      currentSelectedInput = input;
      e.stopPropagation();
  });
  return input;
}

function adjustInputSize(input) {
  const span = document.createElement('span');
  span.style.font = `${input.style.fontSize} ${input.style.fontFamily}`;
  span.style.visibility = 'hidden';
  span.style.position = 'absolute';
  span.innerText = input.innerText || input.placeholder;
  document.body.appendChild(span);
  const newWidth = span.offsetWidth + 10;
  const newHeight = span.offsetHeight + 10;
  input.style.width = `${Math.min(newWidth, 270)}px`;
  input.style.height = `${Math.min(newHeight, 480)}px`;
  document.body.removeChild(span);
}

function makeDraggable(element, canvasIndex) {
  let isDragging = false;
  let offsetX, offsetY;
  const canvas = canvasElements[canvasIndex];
  const canvasRect = canvas.getBoundingClientRect();
  const wrapper = document.querySelector('.canvas-wrapper');
  const wrapperRect = wrapper.getBoundingClientRect();
  element.addEventListener('mousedown', (e) => {
      isDragging = true;
      const rect = element.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
  });
  document.addEventListener('mousemove', (e) => {
      if (isDragging) {
          let newX = e.clientX - wrapperRect.left - offsetX;
          let newY = e.clientY - wrapperRect.top - offsetY;
          newX = Math.max(0, Math.min(newX, wrapperRect.width - element.offsetWidth));
          newY = Math.max(0, Math.min(newY, canvasRect.height - element.offsetHeight));
          element.style.left = `${newX}px`;
          element.style.top = `${newY}px`;
      }
  });
  document.addEventListener('mouseup', () => {
      isDragging = false;
  });
}

document.getElementById('fontFamily').addEventListener('change', (e) => {
  if (currentSelectedInput) {
      currentSelectedInput.style.fontFamily = e.target.value;
  }
});

document.getElementById('fontSize').addEventListener('input', (e) => {
  if (currentSelectedInput) {
      currentSelectedInput.style.fontSize = `${e.target.value}px`;
  }
});

document.getElementById('fontColor').addEventListener('input', (e) => {
  if (currentSelectedInput) {
      currentSelectedInput.style.color = e.target.value;
  }
});

document.getElementById('prev').addEventListener('click', () => {
  switchCanvas(currentCanvasIndex - 1);
});

document.getElementById('next').addEventListener('click', () => {
  switchCanvas(currentCanvasIndex + 1);
});

function switchCanvas(newIndex) {
  canvasElements[currentCanvasIndex].style.display = 'none';
  textInputs[currentCanvasIndex].forEach(input => {
      input.style.display = 'none';
  });
  currentCanvasIndex = (newIndex + canvasElements.length) % canvasElements.length;
  canvasElements[currentCanvasIndex].style.display = 'block';
  textInputs[currentCanvasIndex].forEach(input => {
      input.style.display = 'block';
  });
}
