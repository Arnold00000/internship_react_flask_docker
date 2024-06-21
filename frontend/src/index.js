// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import './styles.css';

// ReactDOM.render(<App />, document.getElementById('root'));


import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const container = document.getElementById('root');
const root = createRoot(container);  // createRoot(container!) if you use TypeScript
root.render(<App />);
