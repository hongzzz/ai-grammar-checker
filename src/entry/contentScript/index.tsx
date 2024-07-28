import { detectEditors } from '@/utils/detectEditor';
import { logger } from '../../utils/logger';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { Popup } from './popup';
import style from './style.css';

logger.log('Content Script Loaded');

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.color) {
    console.log('Receive color = ' + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse('Change color to ' + msg.color);
  } else {
    sendResponse('Color message is none.');
  }
});

detectEditors();

const popupContainer = document.createElement('div');
popupContainer.id = 'ai-grammar-checker-container';
document.documentElement.appendChild(popupContainer);

// createPopup using shadowRoot
const shadowRoot = popupContainer.attachShadow({ mode: 'open' });

const styleTag = document.createElement('style');
styleTag.innerHTML = style;
shadowRoot.appendChild(styleTag);

const root = createRoot(shadowRoot);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
