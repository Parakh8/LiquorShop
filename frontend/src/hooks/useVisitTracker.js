import { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const useVisitTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        await axios.post('http://localhost:5000/api/track-visit', {
          page: location.pathname,
          userAgent: navigator.userAgent
        });
      } catch (error) {
        console.error('Failed to track visit:', error);
      }
    };

    trackVisit();
  }, [location]);
};

export default useVisitTracker;
