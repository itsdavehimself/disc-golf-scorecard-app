import '@dotlottie/player-component';

function LottiePlayerComponent() {
  return (
    <dotlottie-player
      src="https://lottie.host/00516921-7e48-4557-b511-d3c89aa0dc12/3lxTNIrLa1.json"
      background="transparent"
      speed="1"
      style={{ width: '150px', height: '150px' }}
      loop
      autoplay
    ></dotlottie-player>
  );
}

export default LottiePlayerComponent;
