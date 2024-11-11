const videos = document.querySelectorAll('.myVideo');
let currentPlayingVideo = null; 


const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;

    if (entry.isIntersecting) {
    
      if (currentPlayingVideo && currentPlayingVideo !== video) {
        currentPlayingVideo.pause();
      }
      video.play();
      currentPlayingVideo = video; 
    } else {
      video.pause();
    }
  });
}, { threshold: 1 });

videos.forEach(video => {
  observer.observe(video);

  video.addEventListener('play', () => {
    videos.forEach(v => {
      if (v !== video) {
        v.pause();
      }
    });
    currentPlayingVideo = video;
  });
});