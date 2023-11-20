import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

export default function RevealOnScroll({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const scrollObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          scrollObserver.unobserve(entry.target);
        }
      },
      {
        threshold: 0.5,
      },
    );

    scrollObserver.observe(ref.current);

    return () => {
      if (ref.current) {
        scrollObserver.unobserve(ref.current);
      }
    };
  }, []);

  const classes = `transition-all duration-1000 delay-100 
        ${isVisible ? 'opacity-100 translate-y-8' : 'opacity-0 translate-y-0'}`;

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}

RevealOnScroll.propTypes = {
  children: PropTypes.any,
};
