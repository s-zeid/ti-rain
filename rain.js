// Number of raindrops (<=100)
var R = 35;

var params, canvas, ctx, scale_factor, B, C, D, E, F, G, I, N, S, T, X, Y, Pic, Pic0, Pic99, GDB0, GDB1;

function get_params() {
 var ret = {};
 var hash = window.location.hash.replace(/^#/g, "");
 var parts = hash.split("&");
 for (var i = 0; i < parts.length; i++) {
  var part = parts[i], k, v;
  if (k == "") continue;
  if (part.match("=")) {
   var match = part.match(/^([^=]+?)=(.*)$/);
   k = decodeURIComponent(match[1]);
   v = decodeURIComponent(match[2]);
   if (v.toLowerCase() === "true")
    v = true;
   if (v.toLowerCase() === "false")
    v = false;
  } else {
   k = decodeURIComponent(part);
   v = true;
  }
  ret[k.replace("-", "_")] = v;
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
 var width = 96 * scale_factor;
 var height = 64 * scale_factor;
 canvas.width = width;
 canvas.height = height;
 canvas.style.width = String(width) + "px";
 canvas.style.height = String(height) + "px";
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
 
 // Setup canvas
 canvas = document.getElementById("screen");
 set_screen_size();
 ctx = canvas.getContext('2d');
 ctx.mozImageSmoothingEnabled = false;
 
 // Handle embed mode if requested
 if (params.embed) {
  canvas.style.background = "transparent";
  document.body.style.background = "transparent";
  document.documentElement.style.background = "transparent";
  document.getElementById("about").style.display = "none";
 }
 
 // Use a fallback image if requested,
 // or if in embed mode and not #fallback-image=false
 if (params.fallback_image || (params.embed && params.fallback_image !== false)) {
  var fallback_img = document.createElement("img");
  var src = "images/fallback.png";
  if (typeof params.fallback_image === "string")
   src = params.fallback_image;
  fallback_img.setAttribute("src", src);
  fallback_img.setAttribute("alt", "");
  fallback_img.style.mozImageRendering = "-moz-crisp-edges";
  fallback_img.style.imageRendering = "pixelated";
  fallback_img.setAttribute("style",
   "image-rendering: -moz-crisp-edges;" +
   "image-rendering: -o-crisp-edges;" +
   "image-rendering: -webkit-optimize-contrast;" +
   "-ms-interpolation-mode: nearest-neighbor;" +
   "image-rendering: crisp-edges;"
  );
  fallback_img.style.width = fallback_img.style.height = "100%";
  canvas.appendChild(fallback_img);
  if (params.test_fallback) {
   canvas.innerHTML = "";
   canvas.parentElement.insertBefore(fallback_img, canvas);
   canvas.remove();
   canvas = fallback_img;
   canvas.setAttribute("id", "screen");
   set_screen_size();
   if (params.embed)
    canvas.style.background = "transparent";
  }
 }
 
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
