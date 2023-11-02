import { useState, useEffect } from 'react';
import LottiePlayerComponent from './lottiePlayerComponent';

export default function LoadingScreen() {
  const [loadingPhrase, setLoadingPhrase] = useState('');

  useEffect(() => {
    const loadingPhrases = [
      'Embarking on a woodland disc hunt...',
      'Commencing the teebox disc dump...',
      'Awaiting calmer winds...',
      'Hitting every tree on the fairway...',
      'Listening for chains...',
    ];

    const chooseLoadingPhrase = () => {
      const randomNumber = Math.floor(Math.random() * 5);
      const phrase = loadingPhrases[randomNumber];
      setLoadingPhrase(phrase);
    };

    chooseLoadingPhrase();
  }, []);

  return (
    <div className="bg-white w-screen flex flex-col items-center justify-center px-3">
      <div>
        <LottiePlayerComponent />
      </div>
      <div className="flex items-center justify-center text-center text-lg font-semibold text-jade">
        {loadingPhrase}
      </div>
    </div>
  );
}
