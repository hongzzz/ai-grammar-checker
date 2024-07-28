import { debounce } from './common';
import { logger } from './logger';

export const detectEditors = async () => {
  // Create an array to track observed elements
  const observedElements: HTMLElement[] = [];

  // Extended getEditorElements function to include child elements
  const getEditorElements = (root: ParentNode = document): Element[] => {
    const textAreas = Array.from(root.querySelectorAll('textarea'));
    const contentEditables = Array.from(
      root.querySelectorAll('[contenteditable="true"]')
    );
    return [...textAreas, ...contentEditables];
  };

  const inputListener = (event: Event) => {
    const target = event.target as HTMLElement;
    logger.log(
      'element change:',
      target.innerHTML || (target as HTMLTextAreaElement).value,
      'element client rect:',
      target.getBoundingClientRect()
    );
  };

  // Function to add event listener to an element
  const addEventListenerToElement = (element: HTMLElement) => {
    if (observedElements.indexOf(element) === -1) {
      element.addEventListener('input', inputListener);
      // Mark this element as observed
      observedElements.push(element);
    }
    logger.log(
      'addEventListenerToElement, all observedElements:',
      observedElements
    );
  };

  // Function to remove event listener from an element
  const removeEventListenerFromElement = (element: HTMLElement) => {
    const index = observedElements.indexOf(element);
    if (index !== -1) {
      element.removeEventListener('input', inputListener);
      observedElements.splice(index, 1); // Remove element from observedElements array
    }
    logger.log(
      'removeEventListenerFromElement, all observedElements:',
      observedElements
    );
  };

  const initializeEventListeners = () => {
    const editorElements = getEditorElements();
    editorElements.forEach((element) => {
      addEventListenerToElement(element as HTMLElement);
    });
  };

  // Function to handle mutations
  const handleMutations = debounce(() => {
    const currentEditorElements = getEditorElements();
    const currentEditorElementsSet = new Set(currentEditorElements);

    // Remove event listeners from elements that are no longer editors
    observedElements.forEach((element) => {
      if (!currentEditorElementsSet.has(element)) {
        removeEventListenerFromElement(element);
      }
    });

    // Add event listeners to new editor elements
    currentEditorElements.forEach((element) => {
      if (observedElements.indexOf(element as HTMLElement) === -1) {
        addEventListenerToElement(element as HTMLElement);
      }
    });
  }, 500); // Adjust the debounce wait time as needed

  // detect page elements when mutation
  const observer = new MutationObserver(() => {
    handleMutations();
  });

  // Start observing the document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initialize event listeners on existing elements
  initializeEventListeners();
};
