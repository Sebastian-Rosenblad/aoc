import { useEffect, useState } from 'react';
import './CopyToast.scss';
import { FiCopy } from 'react-icons/fi';

export default function CopyToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleCopy(event: ClipboardEvent) {
      setVisible(true);
      const timeoutId = setTimeout(() => setVisible(false), 1500);
      return () => clearTimeout(timeoutId);
    }
    document.addEventListener('copy', handleCopy);
    return () => {
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className='toast-container'>
      <div className='toast'>
        <FiCopy />
        <p>Copied to clipboard</p>
      </div>
    </div>
  );
}
