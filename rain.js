class Rain {
 // Number of raindrops (<=100)
 get R() { return 35; }
 
 // Hide the given element(s) if the animation is embedded.
 // The value may be an array of Elements, a single Element, or null.
 get hideIfEmbedded() {
  return this._hideIfEmbedded || [];
 }
 set hideIfEmbedded(value) {
  value = (value ? ((value instanceof Element) ? [value] : value) : []);
  const oldValue = this.hideIfEmbedded;
  this._hideIfEmbedded = value;
  for (const el of oldValue) {
   el.hidden = false;
  }
  if (this.params["embed"]) {
   for (const el of value) {
    el.hidden = true;
   }
  }
 }
 
 // Start the animation and add it to the given host element.
 constructor(host) {
  if (!(host instanceof Element))
   throw new TypeError("host must be an element");
  
  // Instance state
  this.params = this.constructor.getParams();
  this.canvas = document.createElement("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.scaleFactor = 0;
  
  // Animation state (nulls are unused)
  this.B = 0; // BG Number
  this.C = null;
  this.D = null;
  this.E = null;
  this.F = null;
  this.G = null;
  this.I = 1; // Initial run?
  this.N = 0; // Raindrop+1 to move down
  this.S = null;
  this.T = 0; // Timer
  this.X = null;
  this.Y = null;
  this.Pic = null;
  this.Pic0 = null;
  this.Pic99 = null;
  this.GDB0 = new Array(100);  // X coordinates (0-108)
  this.GDB1 = new Array(100);  // Y coordinates (0-76)
  
  // Set initial coordinates
  for (this.A=0;this.A<this.R;this.A++) {
   this.GDB0[this.A] = this.constructor.randomInt(109);
   this.GDB1[this.A] = this.constructor.randomInt(77);
  }
  
  this.L = 15; // BG delay
  this.M = 50; // FG delay
  
  // Animation options
  this.bgVersion = 2;
  
  // Setup host environment
  this.canvas.hidden = true;
  host.appendChild(this.canvas);
  window.addEventListener("resize", this.setScreenSize.bind(this));
  if (window.top === window)
   window.addEventListener("hashchange", () => location.reload());
  
  // Setup canvas
  this.canvas.setAttribute("data-rain", "");
  if (this.canvas instanceof HTMLCanvasElement) {
   this.canvas.width = 96;
   this.canvas.height = 64;
   this.setScreenSize();
   this.makePixelated();
  }
  this.canvas.innerHTML = `
   Please upgrade your browser to one that supports the HTML5 Canvas element.
  `.trim();
  this.canvas.hidden = false;
  
  // Handle embed mode if requested
  if (this.params["embed"]) {
   this.canvas.style.background = "transparent";
   this.canvas.style.color = "black";
   document.body.style.background = "transparent";
   document.documentElement.style.background = "transparent";
  }
  
  // Set runtime canvas options
  this.ctx.fillStyle = window.getComputedStyle(this.canvas).color;
  
  // Set runtime animation options
  if (Number(this.params["bg-version"]) > 0) {
   const bgVersion = this.params["bg-version"];
   if (bgVersion >= 1 && bgVersion <= 2)
    this.bgVersion = bgVersion;
  }
  
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
   fallbackImg.style.width = fallbackImg.style.height = "100%";
   this.canvas.appendChild(fallbackImg);
   if (this.params["test-fallback"]) {
    this.canvas.innerHTML = "";
    this.canvas.parentElement.insertBefore(fallbackImg, this.canvas);
    this.canvas.remove();
    this.canvas = fallbackImg;
    this.canvas.setAttribute("data-rain", "");
    this.setScreenSize();
    this.makePixelated();
    if (this.params["embed"])
     this.canvas.style.background = "transparent";
   }
  }
  
  setInterval(this.loop.bind(this), this.L);
 }
 
 // Gets hash parameters, formatted as if query string parameters.
 // Values of "true" and "false" will be converted to Booleans.
 // Parameters with no value will be set to the Boolean value true.
 static getParams(hash) {
  const result = {};
  hash = (hash || location.hash).replace(/^#/, "");
  for (let [k, v] of new URLSearchParams(hash)) {
   if (v.toLowerCase() === "true" || v.length === 0)
    v = true;
   else if (v.toLowerCase() === "false")
    v = false;
   result[k] = v;
  }
  return result;
 }
 
 // Returns a random integer from 0 to maximum.
 static randomInt(maximum) {
  return Math.floor(Math.random() * (maximum));
 }
 
 // Makes the canvas or fallback image pixelated when upscaled.
 makePixelated() {
  if (CSS.supports("image-rendering: pixelated"))
   this.canvas.style.imageRendering = "pixelated";
  else
   this.canvas.style.imageRendering = "optimizeSpeed";
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
 
 // Draws the background and appropriate raindrops.
 loop() {
  this.clearScreen();
  // Draw BG
  for (this.Y=0;this.Y<8;this.Y++) {
   for (this.X=0;this.X<12;this.X++) {
    this.drawBgSprite(this.X, this.Y, this.B, this.bgVersion);
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
 drawBgSprite(x, y, n, v) {
  if (n == 0) {
   this.drawRect(x*8 + 1, y*8 + 0, 1, 4);
   v==1 && this.drawRect(x*8 + 5, y*8 + 2, 1, 4);
   v==2 && this.drawRect(x*8 + 5, y*8 + 4, 1, 4);
  }
  if (n == 1) {
   this.drawRect(x*8 + 1, y*8 + 1, 1, 4);
   v==1 && this.drawRect(x*8 + 5, y*8 + 3, 1, 4);
   v==2 && this.drawRect(x*8 + 5, y*8 + 5, 1, 3);
   v==2 && this.drawRect(x*8 + 5, y*8 + 0, 1, 1);
  }
  if (n == 2) {
   this.drawRect(x*8 + 1, y*8 + 2, 1, 4);
   v==1 && this.drawRect(x*8 + 5, y*8 + 4, 1, 4);
   v==2 && this.drawRect(x*8 + 5, y*8 + 6, 1, 2);
   v==2 && this.drawRect(x*8 + 5, y*8 + 0, 1, 2);
  }
  if (n == 3) {
   this.drawRect(x*8 + 1, y*8 + 3, 1, 4);
   v==1 && this.drawRect(x*8 + 5, y*8 + 5, 1, 3);
   v==1 && this.drawRect(x*8 + 5, y*8 + 0, 1, 1);
   v==2 && this.drawRect(x*8 + 5, y*8 + 7, 1, 1);
   v==2 && this.drawRect(x*8 + 5, y*8 + 0, 1, 3);
  }
  if (n == 4) {
   this.drawRect(x*8 + 1, y*8 + 4, 1, 4);
   v==1 && this.drawRect(x*8 + 5, y*8 + 6, 1, 2);
   v==1 && this.drawRect(x*8 + 5, y*8 + 0, 1, 2);
   v==2 && this.drawRect(x*8 + 5, y*8 + 0, 1, 4);
  }
  if (n == 5) {
   this.drawRect(x*8 + 1, y*8 + 5, 1, 3);
   this.drawRect(x*8 + 1, y*8 + 0, 1, 1);
   v==1 && this.drawRect(x*8 + 5, y*8 + 7, 1, 1);
   v==1 && this.drawRect(x*8 + 5, y*8 + 0, 1, 3);
   v==2 && this.drawRect(x*8 + 5, y*8 + 1, 1, 4);
  }
  if (n == 6) {
   this.drawRect(x*8 + 1, y*8 + 6, 1, 2);
   this.drawRect(x*8 + 1, y*8 + 0, 1, 2);
   v==1 && this.drawRect(x*8 + 5, y*8 + 0, 1, 4);
   v==2 && this.drawRect(x*8 + 5, y*8 + 2, 1, 4);
  }
  if (n == 7) {
   this.drawRect(x*8 + 1, y*8 + 7, 1, 1);
   this.drawRect(x*8 + 1, y*8 + 0, 1, 3);
   v==1 && this.drawRect(x*8 + 5, y*8 + 1, 1, 4);
   v==2 && this.drawRect(x*8 + 5, y*8 + 3, 1, 4);
  }
 }
}
