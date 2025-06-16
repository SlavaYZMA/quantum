import { addCursorPosition } from './audio.js';

let ws;
let otherCursors = {};

export function initWebSocket() {
  ws = new WebSocket('wss://echo.websocket.org'); // Замените на ваш WebSocket-сервер
  ws.onopen = () => console.log('WebSocket подключен');
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'cursor') {
      updateOtherCursor(data.id, data.x, data.y);
    }
  };
  ws.onclose = () => {
    console.log('WebSocket отключен');
    setTimeout(initWebSocket, 5000);
  };
}

export function updateOtherCursor(id, x, y) {
  if (!otherCursors[id]) {
    const cursor = document.createElement('div');
    cursor.className = 'other-cursor';
    cursor.id = `cursor-${id}`;
    document.body.appendChild(cursor);
    otherCursors[id] = { element: cursor, x, y, lastUpdate: Date.now() };
  } else {
    otherCursors[id].x = x;
    otherCursors[id].y = y;
    otherCursors[id].lastUpdate = Date.now();
    otherCursors[id].element.classList.remove('hidden');
  }
  const cursorIds = Object.keys(otherCursors);
  if (cursorIds.length > 2) {
    const oldestId = cursorIds.sort((a, b) => otherCursors[a].lastUpdate - otherCursors[b].lastUpdate)[0];
    otherCursors[oldestId].element.remove();
    delete otherCursors[oldestId];
  }
}

export function updateCursors() {
  const now = Date.now();
  for (const id in otherCursors) {
    const cursor = otherCursors[id];
    if (now - cursor.lastUpdate > 3000) {
      cursor.element.classList.add('hidden');
    } else {
      cursor.element.style.left = `${cursor.x}px`;
      cursor.element.style.top = `${cursor.y}px`;
    }
  }
}

export const debouncedUpdateCursor = debounce((x, y) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'cursor', id: Math.random().toString(36).substr(2, 9), x, y }));
  }
  addCursorPosition(x, y);
}, 50);

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}