// ---------- Typewriter link animation (unchanged) ----------
document.querySelectorAll('.link').forEach(el => {
  const text = el.textContent.trim();
  el.textContent = text;
  el.style.setProperty('--text-length', text.length + 'ch');
});

const linkObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      linkObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0 });

document.querySelectorAll('.link').forEach(el => linkObserver.observe(el));

// ---------- Element references ----------
const input = document.querySelector(".input");
const qrContainer = document.querySelector("#qr");
const downloadBtn = document.querySelector("#btn2");
const qrchoice = document.getElementById("qrchoice");
const btn1 = document.getElementById("btn1");

const but1 = document.querySelector("#but1");
const but2 = document.querySelector("#but2");
const but3 = document.querySelector("#but3");
const but4 = document.querySelector("#but4");
const but5 = document.querySelector("#but5");
const but6 = document.querySelector("#but6");

// ---------- Modal open/close ----------
btn1.addEventListener("click", () => {
  qrchoice.classList.add("open");
});

qrchoice.addEventListener("click", (e) => {
  if (e.target === qrchoice) {
    qrchoice.classList.remove("open");
  }
});

// ---------- QR style definitions ----------
// One entry per design button, in the same order as your gallery
const styles = [
  { first: "#9fd5de", second: "#ef60ce", third: "#d2eb6d", image: "images/heart2.png" },      // 90's neon
  { first: "#a50e1d", second: "#7fdaf3", third: "#eef0e6", image: "images/heart2.png" },      // Valentine Red
  { first: "#c9a678", second: "#dbe30a92", third: "#c10d1095", image: "images/phone1.png" }, // Khaki punk
  { first: "#69e434cf", second: "#eef196f8", third: "#f0e6e795", image: "images/phone2.png" },// Touch Grass
  { first: "#c40babcf", second: "#1457b5cf", third: "#fe07c895", image: "images/headphone.png" }, // Cool Purple
  { first: "#726f72cf", second: "#000000d3", third: "#9c949a95", image: "images/laptop.png" } // Sophisticated Black
];

let selectedStyle = null; // null = no manual/auto choice made yet
let qrCode = null;        // current QRCodeStyling instance

// ---------- Placeholder vs QR rendering ----------
function showPlaceholder() {
  qrContainer.innerHTML = `<img src="images/qr.png" alt="QR placeholder" style="width:100%;height:100%;object-fit:contain;">`;
  qrCode = null;
}

function renderQr(text, style) {
  qrContainer.innerHTML = ""; // clear placeholder or old canvas
  qrCode = new QRCodeStyling({
    type: "canvas",
    data: text,
    image: style.image,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 5,
      crossOrigin: "anonymous"
    },
    dotsOptions: { color: style.first, type: "rounded" },
    backgroundOptions: { color: "none" },
    cornersSquareOptions: { color: style.second, type: "extra-rounded" },
    cornersDotOptions: { color: style.third, type: "dot" }
  });
  qrCode.append(qrContainer);
}

// Start with the placeholder shown
showPlaceholder();

// ---------- Typing behavior ----------
input.addEventListener("input", () => {
  const text = input.value.trim();

  if (text === "") {
    showPlaceholder();
    return;
  }

  // If user hasn't manually picked a style yet, pick one at random the first time they type
  if (!selectedStyle) {
    selectedStyle = styles[Math.floor(Math.random() * styles.length)];
  }

  renderQr(text, selectedStyle);
});

// ---------- Manual style selection (optional, overrides random pick) ----------
function chooseStyle(style) {
  selectedStyle = style;
  const text = input.value.trim();
  if (text !== "") {
    renderQr(text, selectedStyle);
  }
  qrchoice.classList.remove("open"); // close modal after picking
}

but1.addEventListener("click", () => chooseStyle(styles[0]));
but2.addEventListener("click", () => chooseStyle(styles[1]));
but3.addEventListener("click", () => chooseStyle(styles[2]));
but4.addEventListener("click", () => chooseStyle(styles[3]));
but5.addEventListener("click", () => chooseStyle(styles[4]));
but6.addEventListener("click", () => chooseStyle(styles[5]));

// ---------- Download ----------
downloadBtn.addEventListener("click", () => {
  if (!qrCode) {
    alert("Enter some text to generate a QR code first!");
    return;
  }
  qrCode.download({
    name: "my-qr-code",
    extension: "png"
  });
});