import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { logger } from '../../utils/logger';
import { sendAIRequest } from '@/utils/request';

logger.log('Popup Script Loaded');

const Popup = () => {
  const [text, setText] = useState('');
  const send = async () => {
    await sendAIRequest('请问Rust是什么？', (res) => {
      setText(res);
    });
  };

  return (
    <>
      <div style={{ width: 400 }}>
        <button onClick={send} style={{ marginRight: '5px' }}>
          Make Request
        </button>
        <div>{text}</div>
      </div>
    </>
  );
};

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
