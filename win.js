const envelope = document.getElementById("envelope");
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const response = document.getElementById("response");

// 1️⃣ Envelope click opens the letter
envelope.addEventListener("click", () => {
    envelope.classList.add("open");
});

// 2️⃣ Yes button: grows and leads to surprise page
yesBtn.addEventListener("click", () => {
    yesBtn.style.transform = "scale(1.5)";
    response.textContent = "Yay! 💖 You made me so happy!";
    response.style.color = "#ff1493";
    setTimeout(() => {
        window.location.href = "surprise.html"; // Redirect to surprise page
    }, 800);
});

// 3️⃣ No button: avoids the mouse cursor
noBtn.addEventListener("mousemove", (e) => {
    const offsetX = (Math.random() * 200) - 100; 
    const offsetY = (Math.random() * 200) - 100; 
    const parent = noBtn.parentElement;
    const rect = parent.getBoundingClientRect();

    let newX = e.clientX + offsetX - rect.left;
    let newY = e.clientY + offsetY - rect.top;

    // Keep button inside parent container
    newX = Math.max(0, Math.min(newX, rect.width - noBtn.offsetWidth));
    newY = Math.max(0, Math.min(newY, rect.height - noBtn.offsetHeight));

    noBtn.style.position = "absolute";
    noBtn.style.left = newX + "px";
    noBtn.style.top = newY + "px";
});