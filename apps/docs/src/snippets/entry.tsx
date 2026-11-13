// Import the stylesheet once, at the root of your application.
import '@up201905892/ui/styles.css';
import { createRoot } from 'react-dom/client';
import { FirstButton } from './first-button';

createRoot(document.getElementById('root')!).render(<FirstButton />);
