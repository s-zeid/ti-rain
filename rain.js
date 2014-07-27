// Number of raindrops (<=100)
var R = 35;

var params, canvas, ctx, scale_factor, B, C, D, E, F, G, I, N, S, T, X, Y, Pic, Pic0, Pic99, GDB0, GDB1;

function get_params() {
 var ret = {};
 var hash = window.location.hash.replace(/^#/g, "");
 var parts = hash.split("&");
 for (var i = 0; i < parts.length; i++) {
  var part = parts[i], k, v;
  if (part.match("=")) {
   var match = part.match(/^([^=]+?)=(.*)$/);
   k = decodeURIComponent(match[1]);
   v = decodeURIComponent(match[2]);
  } else {
   k = decodeURIComponent(part);
   v = true;
  }
  ret[k] = v;
 }
 return ret;
}

// Determines the screen size.
function set_screen_size() {
 var viewport_width = window.innerWidth;
 var viewport_height = window.innerHeight;
 if ((typeof(viewport_width) != "undefined") && (typeof(viewport_height) != "undefined")) {
  scale_factor = Math.floor(viewport_height / 64);
  if ((96 * scale_factor) > viewport_width) {
   scale_factor = Math.floor(viewport_width / 96);
  }
 }
 else {
  scale_factor = 3;
 }
 canvas.width = 96 * scale_factor;
 canvas.height = 64 * scale_factor;
}
window.onresize = set_screen_size;

// Returns an Image object with the image specified by src.
function load_image(src) {
 var img = new Image();
 img.src = src;
 return img;
}
// Returns a random integer from 0 to (maximum - 1).
function random_int(maximum) {
 return Math.floor(Math.random() * (maximum));
}
// Clears the entire canvas.
function clear_screen() {
 ctx.clearRect(0, 0, canvas.width, canvas.height);
}
// Draws a rectangle, scaling it and its position to correspond to the canvas
// size.
function draw_rect(x, y, w, h) {
 ctx.fillRect(x * scale_factor, y * scale_factor, w * scale_factor, h * scale_factor);
}

// Main function
function main() {
 params = get_params();
 
 // Handle embed mode if requested
 if (params.embed) {
  document.getElementById("screen").style.background = "transparent";
  document.body.style.background = "transparent";
  document.documentElement.style.background = "transparent";
  document.getElementById("about").style.display = "none";
 }
 
 // Setup canvas
 canvas = document.getElementById("screen");
 set_screen_size();
 ctx = canvas.getContext('2d');
 ctx.mozImageSmoothingEnabled = false;
 
 // Initialize X (0-108) and Y (0-76) coordinate arrays
 GDB0 = new Array(100);
 GDB1 = new Array(100);
 
 // Set initial coordinates
 for (A=0;A<R;A++) {
  GDB0[A] = random_int(109);
  GDB1[A] = random_int(77);
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
 clear_screen();
 // Draw BG
 for (Y=0;Y<8;Y++) {
  for (X=0;X<12;X++) {
   draw_bg_sprite(X, Y, B);
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
   draw_raindrop(X-5, Y-3);
   if (T==M) {
    Y = Y+1;
   }
  }
  if (Y>76) {
   X = random_int(109);
   Y = random_int(77);
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
function draw_raindrop(x, y) {
 draw_rect(x + 3, y + 0, 2, 1);
 draw_rect(x + 2, y + 1, 1, 2);
 draw_rect(x + 5, y + 1, 1, 2);
 draw_rect(x + 1, y + 3, 1, 3);
 draw_rect(x + 6, y + 3, 1, 3);
 draw_rect(x + 2, y + 6, 1, 1);
 draw_rect(x + 5, y + 6, 1, 1);
 draw_rect(x + 3, y + 7, 2, 1);
}
function draw_bg_sprite(x, y, n) {
 if (n == 0) {
  draw_rect(x*8 + 1, y*8 + 0, 1, 4);
  draw_rect(x*8 + 5, y*8 + 4, 1, 4);
 }
 if (n == 1) {
  draw_rect(x*8 + 1, y*8 + 1, 1, 4);
  draw_rect(x*8 + 5, y*8 + 5, 1, 3);
  draw_rect(x*8 + 5, y*8 + 0, 1, 1);
 }
 if (n == 2) {
  draw_rect(x*8 + 1, y*8 + 2, 1, 4);
  draw_rect(x*8 + 5, y*8 + 6, 1, 2);
  draw_rect(x*8 + 5, y*8 + 0, 1, 2);
 }
 if (n == 3) {
  draw_rect(x*8 + 1, y*8 + 3, 1, 4);
  draw_rect(x*8 + 5, y*8 + 7, 1, 1);
  draw_rect(x*8 + 5, y*8 + 0, 1, 3);
 }
 if (n == 4) {
  draw_rect(x*8 + 1, y*8 + 4, 1, 4);
  draw_rect(x*8 + 5, y*8 + 0, 1, 4);
 }
 if (n == 5) {
  draw_rect(x*8 + 1, y*8 + 5, 1, 3);
  draw_rect(x*8 + 1, y*8 + 0, 1, 1);
  draw_rect(x*8 + 5, y*8 + 1, 1, 4);
 }
 if (n == 6) {
  draw_rect(x*8 + 1, y*8 + 6, 1, 2);
  draw_rect(x*8 + 1, y*8 + 0, 1, 2);
  draw_rect(x*8 + 5, y*8 + 2, 1, 4);
 }
 if (n == 7) {
  draw_rect(x*8 + 1, y*8 + 7, 1, 1);
  draw_rect(x*8 + 1, y*8 + 0, 1, 3);
  draw_rect(x*8 + 5, y*8 + 3, 1, 4);
 }
 /*if (n == 0) {
  draw_rect(x*8 + 1, y*8 + 0, 1, 4);
  draw_rect(x*8 + 5, y*8 + 2, 1, 4);
 }
 if (n == 1) {
  draw_rect(x*8 + 1, y*8 + 1, 1, 4);
  draw_rect(x*8 + 5, y*8 + 3, 1, 4);
 }
 if (n == 2) {
  draw_rect(x*8 + 1, y*8 + 2, 1, 4);
  draw_rect(x*8 + 5, y*8 + 4, 1, 4);
 }
 if (n == 3) {
  draw_rect(x*8 + 1, y*8 + 3, 1, 4);
  draw_rect(x*8 + 5, y*8 + 5, 1, 3);
  draw_rect(x*8 + 5, y*8 + 0, 1, 1);
 }
 if (n == 4) {
  draw_rect(x*8 + 1, y*8 + 4, 1, 4);
  draw_rect(x*8 + 5, y*8 + 6, 1, 2);
  draw_rect(x*8 + 5, y*8 + 0, 1, 2);
 }
 if (n == 5) {
  draw_rect(x*8 + 1, y*8 + 5, 1, 3);
  draw_rect(x*8 + 1, y*8 + 0, 1, 1);
  draw_rect(x*8 + 5, y*8 + 7, 1, 1);
  draw_rect(x*8 + 5, y*8 + 0, 1, 3);
 }
 if (n == 6) {
  draw_rect(x*8 + 1, y*8 + 6, 1, 2);
  draw_rect(x*8 + 1, y*8 + 0, 1, 2);
  draw_rect(x*8 + 5, y*8 + 0, 1, 4);
 }
 if (n == 7) {
  draw_rect(x*8 + 1, y*8 + 7, 1, 1);
  draw_rect(x*8 + 1, y*8 + 0, 1, 3);
  draw_rect(x*8 + 5, y*8 + 1, 1, 4);
 }*/
}
