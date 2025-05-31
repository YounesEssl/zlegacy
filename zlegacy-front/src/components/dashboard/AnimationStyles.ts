// Animation des bulles simplifiée pour garantir une montée continue jusqu'en haut
export const bubbleAnimation = `
  @keyframes bubble-rise {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 0.8;
    }
    100% {
      transform: translate3d(5px, -300px, 0) scale(1.2);
      opacity: 0;
    }
  }
  
  @keyframes bubble-rise-alt {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 0.8;
    }
    100% {
      transform: translate3d(-5px, -300px, 0) scale(1.25);
      opacity: 0;
    }
  }
  
  @keyframes bubble-rise-third {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 0.8;
    }
    100% {
      transform: translate3d(3px, -300px, 0) scale(1.15);
      opacity: 0;
    }
  }
  
  @keyframes shine {
    0% { transform: skewX(-45deg) translateX(-150%); }
    100% { transform: skewX(-45deg) translateX(150%); }
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
  }
`;
