import { logger } from "./utils/logger";

logger.log("Content Script Loaded");

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.color) {
    console.log("Receive color = " + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse("Change color to " + msg.color);
  } else {
    sendResponse("Color message is none.");
  }
});

// Create a WeakMap to track observed elements
const observedElements = new WeakMap<HTMLElement, boolean>();

// Function to add event listener to an element
const addEventListenerToElement = (element: HTMLElement) => {
  if (!observedElements.has(element)) {
    element.addEventListener('input', (event) => {
      const target = event.target as HTMLElement;
      console.log('element change:', target.innerHTML || (target as HTMLTextAreaElement).value);
    });
    // Mark this element as observed
    observedElements.set(element, true);
  }
};

// detect page elements when mutation
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          if (element.tagName === 'TEXTAREA' || element.isContentEditable) {
            addEventListenerToElement(element);
          } else {
            // Check if there are any textareas or contenteditable elements within the added node
            const textAreas = element.querySelectorAll('textarea');
            textAreas.forEach((textarea) => {
              addEventListenerToElement(textarea);
            });
            const contentEditables = element.querySelectorAll('[contenteditable="true"]');
            contentEditables.forEach((editable) => {
              addEventListenerToElement(editable as HTMLElement);
            });
          }
        }
      });
    }
  });
});

// Start observing the document for changes
observer.observe(document.body, { childList: true, subtree: true });