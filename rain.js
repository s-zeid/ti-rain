class Rain {
 // Number of raindrops (<=100)
 get R() { return 35; }
 
 constructor() {
  this.params = this.canvas = this.ctx = this.scaleFactor = null;
  
  // Animation state
  this.B = null;
  this.C = null;
  this.D = null;
  this.E = null;
  this.F = null;
  this.G = null;
  this.I = null;
  this.N = null;
  this.S = null;
  this.T = null;
  this.X = null;
  this.Y = null;
  this.Pic = null;
  this.Pic0 = null;
  this.Pic99 = null;
  this.GDB0 = null;
  this.GDB1 = null;
  
  this.main();
 }
 
 static getParams() {
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
 setScreenSize() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  if (typeof viewportWidth != "undefined" && typeof viewportHeight != "undefined") {
   this.scaleFactor = Math.floor(viewportHeight / 64);
   if ((96 * this.scaleFactor) > viewportWidth) {
    this.scaleFactor = Math.floor(viewportWidth / 96);
   }
  }
  else {
   this.scaleFactor = 3;
  }
  const width = 96 * this.scaleFactor;
  const height = 64 * this.scaleFactor;
  this.canvas.width = width;
  this.canvas.height = height;
  this.canvas.style.width = String(width) + "px";
  this.canvas.style.height = String(height) + "px";
 }
 
 // Returns a random integer from 0 to maximum.
 static randomInt(maximum) {
  return Math.floor(Math.random() * (maximum));
 }
 
 // Clears the entire canvas.
 clearScreen() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
 }
 
 // Draws a rectangle, scaling it and its position to correspond to the canvas
 // size.
 drawRect(x, y, w, h) {
  this.ctx.fillRect(
   x * this.scaleFactor, y * this.scaleFactor,
   w * this.scaleFactor, h * this.scaleFactor,
  );
 }
 
 // Main function
 main() {
  window.addEventListener("resize", this.setScreenSize.bind(this));
  
  this.params = this.constructor.getParams();
  if (window.top === window)
   window.addEventListener("hashchange", () => location.reload());
  
  // Setup canvas
  this.canvas = document.getElementById("screen");
  this.setScreenSize();
  this.ctx = this.canvas.getContext("2d");
  this.ctx.mozImageSmoothingEnabled = false;
  
  // Handle embed mode if requested
  if (this.params["embed"]) {
   this.canvas.style.background = "transparent";
   this.canvas.style.color = "black";
   document.body.style.background = "transparent";
   document.documentElement.style.background = "transparent";
   document.querySelector("aside").style.display = "none";
  }
  
  // Set runtime canvas options
  this.ctx.fillStyle = window.getComputedStyle(this.canvas).color;
  
  // Use a fallback image if requested,
  // or if in embed mode and not #fallback-image=false
  if (
   this.params["fallback-image"] ||
   (this.params["embed"] && this.params["fallback-image"] !== false)
  ) {
   const fallbackImg = document.createElement("img");
   let src = "images/fallback.png";
   if (typeof this.params["fallback-image"] == "string")
    src = this.params["fallback-image"];
   fallbackImg.setAttribute("src", src);
   fallbackImg.setAttribute("alt", "");
   if (CSS.supports("image-rendering: pixelated"))
    fallbackImg.style.imageRendering = "pixelated";
   else
    fallbackImg.style.imageRendering = "optimizeSpeed";
   fallbackImg.style.width = fallbackImg.style.height = "100%";
   this.canvas.appendChild(fallbackImg);
   if (this.params["test-fallback"]) {
    this.canvas.innerHTML = "";
    this.canvas.parentElement.insertBefore(fallbackImg, this.canvas);
    this.canvas.remove();
    this.canvas = fallbackImg;
    this.canvas.setAttribute("id", "screen");
    this.setScreenSize();
    if (this.params["embed"])
     this.canvas.style.background = "transparent";
   }
  }
  
  // Initialize X (0-108) and Y (0-76) coordinate arrays
  this.GDB0 = new Array(100);
  this.GDB1 = new Array(100);
  
  // Set initial coordinates
  for (this.A=0;this.A<this.R;this.A++) {
   this.GDB0[this.A] = this.constructor.randomInt(109);
   this.GDB1[this.A] = this.constructor.randomInt(77);
  }
  
  this.B = 0; // BG Number
  this.T = 0; // Timer
  this.N = 0; // Raindrop+1 to move down
  this.I = 1; // Initial run?
  this.L = 0; // Initialize
  this.M = 0; // delays
  
  this.L = 15; // BG Delay = L
  this.M = 50; // FG Delay = M
  
  setInterval(this.loop.bind(this), this.L);
 }
 
 // Draws the background and appropriate raindrops.
 loop() {
  this.clearScreen();
  // Draw BG
  for (this.Y=0;this.Y<8;this.Y++) {
   for (this.X=0;this.X<12;this.X++) {
    this.drawBgSprite(this.X, this.Y, this.B);
   }
  }
  this.B = this.B+1;
  if (this.B > 7) {
   this.B = 0;
  }
  // Do raindrops
  for (this.A=0;this.A<this.R;this.A++) {
   this.X = this.GDB0[this.A];
   this.Y = this.GDB1[this.A];
   if (this.I==0 || this.A<=this.N) {
    this.drawRaindrop(this.X-5, this.Y-3);
    if (this.T==this.M) {
     this.Y = this.Y+1;
    }
   }
   if (this.Y>76) {
    this.X = this.constructor.randomInt(109);
    this.Y = this.constructor.randomInt(77);
   }
   this.GDB0[this.A] = this.X;
   this.GDB1[this.A] = this.Y;
  }
  //Timer logic
  this.T = this.T+1;
  if (this.T>this.M) {
   this.N = this.N+1;
   this.T = 0;
  }
  if (this.N>this.R) {
   this.N = 1;
   if (this.I==1) {
    this.I = 0;
   }
  }
 }
 
 // Draws a raindrop, scaling it and its position to correspond to the canvas
 // size.
 drawRaindrop(x, y) {
  this.drawRect(x + 3, y + 0, 2, 1);
  this.drawRect(x + 2, y + 1, 1, 2);
  this.drawRect(x + 5, y + 1, 1, 2);
  this.drawRect(x + 1, y + 3, 1, 3);
  this.drawRect(x + 6, y + 3, 1, 3);
  this.drawRect(x + 2, y + 6, 1, 1);
  this.drawRect(x + 5, y + 6, 1, 1);
  this.drawRect(x + 3, y + 7, 2, 1);
 }
 
 // Draws the background rain.
 drawBgSprite(x, y, n) {
  if (n == 0) {
   this.drawRect(x*8 + 1, y*8 + 0, 1, 4);
   this.drawRect(x*8 + 5, y*8 + 4, 1, 4);
  }
  if (n == 1) {
   this.drawRect(x*8 + 1, y*8 + 1, 1, 4);
   this.drawRect(x*8 + 5, y*8 + 5, 1, 3);
   this.drawRect(x*8 + 5, y*8 + 0, 1, 1);
  }
  if (n == 2) {
   this.drawRect(x*8 + 1, y*8 + 2, 1, 4);
   this.drawRect(x*8 + 5, y*8 + 6, 1, 2);
   this.drawRect(x*8 + 5, y*8 + 0, 1, 2);
  }
  if (n == 3) {
   this.drawRect(x*8 + 1, y*8 + 3, 1, 4);
   this.drawRect(x*8 + 5, y*8 + 7, 1, 1);
   this.drawRect(x*8 + 5, y*8 + 0, 1, 3);
  }
  if (n == 4) {
   this.drawRect(x*8 + 1, y*8 + 4, 1, 4);
   this.drawRect(x*8 + 5, y*8 + 0, 1, 4);
  }
  if (n == 5) {
   this.drawRect(x*8 + 1, y*8 + 5, 1, 3);
   this.drawRect(x*8 + 1, y*8 + 0, 1, 1);
   this.drawRect(x*8 + 5, y*8 + 1, 1, 4);
  }
  if (n == 6) {
   this.drawRect(x*8 + 1, y*8 + 6, 1, 2);
   this.drawRect(x*8 + 1, y*8 + 0, 1, 2);
   this.drawRect(x*8 + 5, y*8 + 2, 1, 4);
  }
  if (n == 7) {
   this.drawRect(x*8 + 1, y*8 + 7, 1, 1);
   this.drawRect(x*8 + 1, y*8 + 0, 1, 3);
   this.drawRect(x*8 + 5, y*8 + 3, 1, 4);
  }
  /*if (n == 0) {
   this.drawRect(x*8 + 1, y*8 + 0, 1, 4);
   this.drawRect(x*8 + 5, y*8 + 2, 1, 4);
  }
  if (n == 1) {
   this.drawRect(x*8 + 1, y*8 + 1, 1, 4);
   this.drawRect(x*8 + 5, y*8 + 3, 1, 4);
  }
  if (n == 2) {
   this.drawRect(x*8 + 1, y*8 + 2, 1, 4);
   this.drawRect(x*8 + 5, y*8 + 4, 1, 4);
  }
  if (n == 3) {
   this.drawRect(x*8 + 1, y*8 + 3, 1, 4);
   this.drawRect(x*8 + 5, y*8 + 5, 1, 3);
   this.drawRect(x*8 + 5, y*8 + 0, 1, 1);
  }
  if (n == 4) {
   this.drawRect(x*8 + 1, y*8 + 4, 1, 4);
   this.drawRect(x*8 + 5, y*8 + 6, 1, 2);
   this.drawRect(x*8 + 5, y*8 + 0, 1, 2);
  }
  if (n == 5) {
   this.drawRect(x*8 + 1, y*8 + 5, 1, 3);
   this.drawRect(x*8 + 1, y*8 + 0, 1, 1);
   this.drawRect(x*8 + 5, y*8 + 7, 1, 1);
   this.drawRect(x*8 + 5, y*8 + 0, 1, 3);
  }
  if (n == 6) {
   this.drawRect(x*8 + 1, y*8 + 6, 1, 2);
   this.drawRect(x*8 + 1, y*8 + 0, 1, 2);
   this.drawRect(x*8 + 5, y*8 + 0, 1, 4);
  }
  if (n == 7) {
   this.drawRect(x*8 + 1, y*8 + 7, 1, 1);
   this.drawRect(x*8 + 1, y*8 + 0, 1, 3);
   this.drawRect(x*8 + 5, y*8 + 1, 1, 4);
  }*/
 }
}
