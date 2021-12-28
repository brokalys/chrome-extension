const isExtension = !!chrome.tabs;
const listeners = {};

// Listen from messages from content-script
if (isExtension) {
  chrome.runtime.onMessage.addListener(function (
    { type, payload },
    sender,
    response,
  ) {
    console.log('App: got message', type, payload);

    if (listeners[type]) {
      listeners[type].forEach((callback) => callback(payload, response));
    }
  });
}

export async function sendMessage({ type, payload }) {
  // @todo: remove
  if (!isExtension) {
    return {
      source: 'city24.lv',
      category: 'apartment',
      type: 'sell',
      foreign_id: '8522229',
    };
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tab.id, { type, payload }, resolve);
  });
}

export function addMessageListener(type, callback) {
  if (!listeners[type]) {
    listeners[type] = new Set();
  }

  listeners[type].add(callback);
}

export function removeMessageListener(type, callback) {
  if (!listeners[type]) {
    return;
  }

  listeners[type].delete(callback);
}
