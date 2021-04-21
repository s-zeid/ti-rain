// Number of raindrops (<=100)
const R = 35;

let params, canvas, ctx, scaleFactor;
let B, C, D, E, F, G, I, N, S, T, X, Y, Pic, Pic0, Pic99, GDB0, GDB1;

function getParams() {
 const result = {};
 const hash = location.hash.replace(/^#/, "");
 for (let [k, v] of new URLSearchParams(hash)) {
  if (v.toLowerCase() === "true" || v.length === 0)
   v = true;
  else if (v.toLowerCase() === "false")
   v = false;
  result[k] = v;
 }
 return result;
}

// Determines the screen size.
function setScreenSize() {
 const viewportWidth = window.innerWidth;
 const viewportHeight = window.innerHeight;
 if (typeof viewportWidth != "undefined" && typeof viewportHeight != "undefined") {
  scaleFactor = Math.floor(viewportHeight / 64);
  if ((96 * scaleFactor) > viewportWidth) {
   scaleFactor = Math.floor(viewportWidth / 96);
  }
 }
 else {
  scaleFactor = 3;
 }
 const width = 96 * scaleFactor;
 const height = 64 * scaleFactor;
 canvas.width = width;
 canvas.height = height;
 canvas.style.width = String(width) + "px";
 canvas.style.height = String(height) + "px";
}
window.addEventListener("resize", () => setScreenSize());

// Returns an Image object with the image specified by src.
function load_image(src) {
 const img = new Image();
 img.src = src;
 return img;
}
// Returns a random integer from 0 to (maximum - 1).
function randomInt(maximum) {
 return Math.floor(Math.random() * (maximum));
}
// Clears the entire canvas.
function clearScreen() {
 ctx.clearRect(0, 0, canvas.width, canvas.height);
}
// Draws a rectangle, scaling it and its position to correspond to the canvas
// size.
function drawRect(x, y, w, h) {
 ctx.fillRect(x * scaleFactor, y * scaleFactor, w * scaleFactor, h * scaleFactor);
}

// Main function
function main() {
 params = getParams();
 
 // Setup canvas
 canvas = document.getElementById("screen");
 setScreenSize();
 ctx = canvas.getContext("2d");
 ctx.mozImageSmoothingEnabled = false;
 
 // Handle embed mode if requested
 if (params["embed"]) {
  canvas.style.background = "transparent";
  document.body.style.background = "transparent";
  document.documentElement.style.background = "transparent";
  document.querySelector("aside").style.display = "none";
 }
 
 // Use a fallback image if requested,
 // or if in embed mode and not #fallback-image=false
 if (params["fallback-image"] || (params["embed"] && params["fallback-image"] !== false)) {
  const fallbackImg = document.createElement("img");
  let src = "images/fallback.png";
  if (typeof params["fallback-image"] == "string")
   src = params["fallback-image"];
  fallbackImg.setAttribute("src", src);
  fallbackImg.setAttribute("alt", "");
  if (CSS.supports("image-rendering: pixelated"))
   fallbackImg.style.imageRendering = "pixelated";
  else
   fallbackImg.style.imageRendering = "optimizeSpeed";
  fallbackImg.style.width = fallbackImg.style.height = "100%";
  canvas.appendChild(fallbackImg);
  if (params["test-fallback"]) {
   canvas.innerHTML = "";
   canvas.parentElement.insertBefore(fallbackImg, canvas);
   canvas.remove();
   canvas = fallbackImg;
   canvas.setAttribute("id", "screen");
   setScreenSize();
   if (params["embed"])
    canvas.style.background = "transparent";
  }
 }
 
 // Initialize X (0-108) and Y (0-76) coordinate arrays
 GDB0 = new Array(100);
 GDB1 = new Array(100);
 
 // Set initial coordinates
 for (A=0;A<R;A++) {
  GDB0[A] = randomInt(109);
  GDB1[A] = randomInt(77);
 }
 
 B = 0; // BG Number
 T = 0; // Timer
 N = 0; // Raindrop+1 to move down
 I = 1; // Initial run?
 L = 0; // Initialize
 M = 0; // delays
 
 L = 15; // BG Delay = L
 M = 50; // FG Delay = M
 
 setInterval(loop, L);
}
// Draws the background and appropriate raindrops.
function loop() {
 clearScreen();
 // Draw BG
 for (Y=0;Y<8;Y++) {
  for (X=0;X<12;X++) {
   drawBgSprite(X, Y, B);
  }
 }
 B = B+1;
 if (B > 7) {
  B = 0;
 }
 // Do raindrops
 for (A=0;A<R;A++) {
  X = GDB0[A];
  Y = GDB1[A];
  if (I==0 || A<=N) {
   drawRaindrop(X-5, Y-3);
   if (T==M) {
    Y = Y+1;
   }
  }
  if (Y>76) {
   X = randomInt(109);
   Y = randomInt(77);
  }
  GDB0[A] = X;
  GDB1[A] = Y;
 }
 //Timer logic
 T = T+1;
 if (T>M) {
  N = N+1;
  T = 0;
 }
 if (N>R) {
  N = 1;
  if (I==1) {
   I = 0;
  }
 }
}
// Draws a raindrop, scaling it and its position to correspond to the canvas
// size.
function drawRaindrop(x, y) {
 drawRect(x + 3, y + 0, 2, 1);
 drawRect(x + 2, y + 1, 1, 2);
 drawRect(x + 5, y + 1, 1, 2);
 drawRect(x + 1, y + 3, 1, 3);
 drawRect(x + 6, y + 3, 1, 3);
 drawRect(x + 2, y + 6, 1, 1);
 drawRect(x + 5, y + 6, 1, 1);
 drawRect(x + 3, y + 7, 2, 1);
}
function drawBgSprite(x, y, n) {
 if (n == 0) {
  drawRect(x*8 + 1, y*8 + 0, 1, 4);
  drawRect(x*8 + 5, y*8 + 4, 1, 4);
 }
 if (n == 1) {
  drawRect(x*8 + 1, y*8 + 1, 1, 4);
  drawRect(x*8 + 5, y*8 + 5, 1, 3);
  drawRect(x*8 + 5, y*8 + 0, 1, 1);
 }
 if (n == 2) {
  drawRect(x*8 + 1, y*8 + 2, 1, 4);
  drawRect(x*8 + 5, y*8 + 6, 1, 2);
  drawRect(x*8 + 5, y*8 + 0, 1, 2);
 }
 if (n == 3) {
  drawRect(x*8 + 1, y*8 + 3, 1, 4);
  drawRect(x*8 + 5, y*8 + 7, 1, 1);
  drawRect(x*8 + 5, y*8 + 0, 1, 3);
 }
 if (n == 4) {
  drawRect(x*8 + 1, y*8 + 4, 1, 4);
  drawRect(x*8 + 5, y*8 + 0, 1, 4);
 }
 if (n == 5) {
  drawRect(x*8 + 1, y*8 + 5, 1, 3);
  drawRect(x*8 + 1, y*8 + 0, 1, 1);
  drawRect(x*8 + 5, y*8 + 1, 1, 4);
 }
 if (n == 6) {
  drawRect(x*8 + 1, y*8 + 6, 1, 2);
  drawRect(x*8 + 1, y*8 + 0, 1, 2);
  drawRect(x*8 + 5, y*8 + 2, 1, 4);
 }
 if (n == 7) {
  drawRect(x*8 + 1, y*8 + 7, 1, 1);
  drawRect(x*8 + 1, y*8 + 0, 1, 3);
  drawRect(x*8 + 5, y*8 + 3, 1, 4);
 }
 /*if (n == 0) {
  drawRect(x*8 + 1, y*8 + 0, 1, 4);
  drawRect(x*8 + 5, y*8 + 2, 1, 4);
 }
 if (n == 1) {
  drawRect(x*8 + 1, y*8 + 1, 1, 4);
  drawRect(x*8 + 5, y*8 + 3, 1, 4);
 }
 if (n == 2) {
  drawRect(x*8 + 1, y*8 + 2, 1, 4);
  drawRect(x*8 + 5, y*8 + 4, 1, 4);
 }
 if (n == 3) {
  drawRect(x*8 + 1, y*8 + 3, 1, 4);
  drawRect(x*8 + 5, y*8 + 5, 1, 3);
  drawRect(x*8 + 5, y*8 + 0, 1, 1);
 }
 if (n == 4) {
  drawRect(x*8 + 1, y*8 + 4, 1, 4);
  drawRect(x*8 + 5, y*8 + 6, 1, 2);
  drawRect(x*8 + 5, y*8 + 0, 1, 2);
 }
 if (n == 5) {
  drawRect(x*8 + 1, y*8 + 5, 1, 3);
  drawRect(x*8 + 1, y*8 + 0, 1, 1);
  drawRect(x*8 + 5, y*8 + 7, 1, 1);
  drawRect(x*8 + 5, y*8 + 0, 1, 3);
 }
 if (n == 6) {
  drawRect(x*8 + 1, y*8 + 6, 1, 2);
  drawRect(x*8 + 1, y*8 + 0, 1, 2);
  drawRect(x*8 + 5, y*8 + 0, 1, 4);
 }
 if (n == 7) {
  drawRect(x*8 + 1, y*8 + 7, 1, 1);
  drawRect(x*8 + 1, y*8 + 0, 1, 3);
  drawRect(x*8 + 5, y*8 + 1, 1, 4);
 }*/
}
