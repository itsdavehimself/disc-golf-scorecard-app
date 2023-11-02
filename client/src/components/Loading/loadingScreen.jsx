import { useState, useEffect } from 'react';
import LottiePlayerComponent from './lottiePlayerComponent';

export default function LoadingScreen() {
  const [loadingPhrase, setLoadingPhrase] = useState('');

  useEffect(() => {
    const loadingPhrases = [
      'Embarking on a woodland disc hunt...',
      'Unloading the entire bag off the tee...',
      'Awaiting calmer winds...',
      'Hitting every tree on the fairway...',
      'Listening for chains...',
      'Running after a rollaway...',
      'Wading through a pond...',
      'Climbing a pine tree...',
      'Trading discs in the parking lot...',
    ];

    const chooseLoadingPhrase = () => {
      const randomNumber = Math.floor(Math.random() * loadingPhrases.length);
      const phrase = loadingPhrases[randomNumber];
      setLoadingPhrase(phrase);
    };

    chooseLoadingPhrase();
  }, []);

  return (
    <div className="bg-white w-screen flex flex-col items-center justify-center px-6">
      <div>
        <LottiePlayerComponent />
      </div>
      <div className="flex items-center justify-center text-center text-lg font-semibold text-jade">
        {loadingPhrase}
      </div>
    </div>
  );
}
