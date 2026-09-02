import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--remote-debugging-port=9333',
  `--user-data-dir=${process.env.TEMP}\\ahmed-qa-cdp`,
  'about:blank',
]);

let tabs;
for (let attempt = 0; attempt < 30; attempt += 1) {
  try {
    tabs = await fetch('http://127.0.0.1:9333/json').then((response) => response.json());
    break;
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

const tab = tabs?.find((candidate) => candidate.type === 'page');
if (!tab) {
  chrome.kill();
  throw new Error('Chrome DevTools page was not available.');
}

const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let requestId = 0;
const pending = new Map();
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  const resolver = pending.get(message.id);
  if (resolver) {
    pending.delete(message.id);
    resolver(message.result);
  }
});

function send(method, params = {}) {
  requestId += 1;
  socket.send(JSON.stringify({ id: requestId, method, params }));
  return new Promise((resolve) => pending.set(requestId, resolve));
}

for (const viewport of [
  { width: 375, height: 812, mobile: true },
  { width: 768, height: 1024, mobile: false },
  { width: 1280, height: 900, mobile: false },
]) {
  await send('Emulation.setDeviceMetricsOverride', {
    ...viewport,
    deviceScaleFactor: 1,
  });
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/' });
  await new Promise((resolve) => setTimeout(resolve, 800));
  const screenshot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  await writeFile(new URL(`./home-${viewport.width}-final.png`, import.meta.url), screenshot.data, 'base64');
}

socket.close();
chrome.kill();
