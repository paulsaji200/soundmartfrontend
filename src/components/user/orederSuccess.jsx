import  { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

const OrderSuccessPopup = ({ isVisible,onClose }) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    if (isVisible) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert variant="default" className="bg-green-100 border-green-500">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Order Successful!</AlertTitle>
        <AlertDescription className="text-green-700">
          Your order has been placed successfully. Thank you for your purchase!
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default OrderSuccessPopup;