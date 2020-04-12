import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import io from 'socket.io-client';

const socket = io('', {
  path: '/api/ws',
  reconnection: false,
});

function Root() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    socket.on('message', setValue);
  });

  return <h1>{value}</h1>;
}

socket.addEventListener;

ReactDOM.render(<Root />, document.querySelector('#app'));
