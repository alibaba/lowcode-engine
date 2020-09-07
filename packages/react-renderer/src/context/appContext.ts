import { createContext } from 'react';

const context = (window.__appContext = createContext({}));
export default context;
