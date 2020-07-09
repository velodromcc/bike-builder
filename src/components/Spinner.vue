<template>
  <svg id="spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 286 182">

    <circle id="spinner-wheel-left" class="spinner-stroke" cx="77" cy="115" r="39"/>
    <circle id="spinner-wheel-right" class="spinner-stroke" cx="209.5" cy="115.5" r="39"/>
    <path id="spinner-frameset" fill="#e6e6e6" d="M77.39,114.7v3.23a1.48,1.48,0,0,1-.44,1,8.25,8.25,0,0,1-.82.69h-.75s-.36,0,0-.67c0,0-.84-.42,0-1.78,0,0,.15-.23-.1-1.72s-.47-1.77.69-3.3,37.88-46.06,37.88-46.06a3.79,3.79,0,0,0,.88-1.74,38.39,38.39,0,0,0-1.17-4.44s2-1.07,7.33-1.84,42.49-5.91,42.49-5.91,3.52-.37,11.31-3.47,8.34-3.31,9.11-3.15,1.07,1.28,1.76,3.4,4.21,12.77,5.8,18.74c0,0,1.26.11,4.17,7s15.08,35.78,15.08,35.78a3.19,3.19,0,0,1,.36,1.4c0,.75,0,1.51-.32,1.51h-.52s-.55,0-.57-.8-.08-.88-.29-.88-.31,0-.31.38v.63s.06.75-.23.75-.67,0-1.41-1.65-19.85-39.65-19.85-39.65-1.05-2.47-2.72-2.47-4.72,3.08-5.62,4.06-37.67,46.2-37.67,46.2a23.11,23.11,0,0,1-3.52,5.47c-1.89,1.88-5.91.94-5.91.94L80,116.54s-1-.2-1.09-1.07-.69-1.57-1-1.58S77.39,114,77.39,114.7Zm57.36,4.39a3,3,0,1,0,3,3A2.95,2.95,0,0,0,134.75,119.09ZM122,120.22s3.74.66,5.28-.25a9.61,9.61,0,0,0,2.54-2.26s1-1.14.16-3.68-13.57-44.45-13.57-44.45-.22-.76-.79-.76-.94.38-1.6,1.23-33.77,40-33.77,40-.85.72-.85,1.35.25,1.1,1.35,1.85,4.78,1.35,4.78,1.35Zm14.86-5.62a2.29,2.29,0,0,0,2-.92S175.34,68.51,178,65.31s2.58-3.68,2.86-4.62a6.47,6.47,0,0,0-.41-3.43c-.35-.94-.66-2.2-1.51-2.82s-4.21,0-4.21,0-44.39,6-50.29,6.78-4.4,4-4.4,4l14.89,46.89S135.35,114.6,136.86,114.6Z"/>
    <path id="spinner-bar" class="spinner-stroke" d="M179.5,43.5l-3-7s16-7.59,22,2c5,8-5,11-5,11"/>
    <line id="spinner-seatpost" class="spinner-stroke" x1="115" y1="57" x2="110.5" y2="43.5"/>
    <path id="spinner-saddle" fill="#ccc" d="M96.66,45.44c-3.24,0-5.94-1.37-7.31-3.76a5.69,5.69,0,0,1,.09-6c1.36-2,3.92-2.93,7-2.5a108.26,108.26,0,0,0,13.44,1v0c4-1.32,9.22-1.54,16.42,1.47l-1.93,4.61c-9.75-4.08-14.31-1.14-18.72,1.71-2.47,1.59-5,3.25-8.24,3.46Q97.05,45.44,96.66,45.44Z"/>

  </svg>
</template>

<style>

  .spinner-stroke {
    fill:none;
    stroke:#b3b3b3;
    stroke-miterlimit:10;
    stroke-width:5px;
  }

  @keyframes frameset {
    from { opacity: 0; }
    50% { opacity: 1; }
  }
  @keyframes spinner-wheel-left {
    from, 10% { opacity: 0; transform: scale(1.5); }
    30% { opacity: 1; transform: scale(1); }
  }
  @keyframes spinner-wheel-right {
    from, 20% { opacity: 0; transform-origin: 50% 50%; transform: scale(1.5); }
    50% { opacity: 1; transform: scale(1); }
  }
  @keyframes spinner-bar {
    from, 20% { stroke-dasharray: 200; stroke-dashoffset: 200; }
    80% { stroke-dashoffset: 0; }
  }
  @keyframes spinner-seatpost {
    from, 10% { stroke-dasharray: 200; stroke-dashoffset: 200; }
    80% { stroke-dashoffset: 0; }
  }
  @keyframes spinner-saddle {
    from, 30% { opacity: 0; transform-origin: 50% 50%; transform: scale(1.5); }
    60% { opacity: 1; transform: scale(1); }
  }

  #spinner-frameset {
    animation: frameset 3s;
    animation-iteration-count: infinite;
  }
  #spinner-wheel-left {
    animation: spinner-wheel-left 3s;
    animation-iteration-count: infinite;
  }
  #spinner-wheel-right {
    animation: spinner-wheel-right 3s;
    animation-iteration-count: infinite;
  }
  #spinner-bar {
    animation: spinner-bar 3s;
    animation-iteration-count: infinite;
  }
  #spinner-seatpost {
    animation: spinner-bar 3s;
    animation-iteration-count: infinite;
  }
  #spinner-saddle {
    animation: spinner-saddle 3s;
    animation-iteration-count: infinite;
  }

</style>
