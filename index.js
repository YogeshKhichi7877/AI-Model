document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  // your fetch code here
  const username = document.querySelector("#username").value;
const password = document.querySelector("#password").value;

if (username === "" || password === "") {
  alert("Please enter your name and password");
} else {
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: username,
      password: password
    })
  });
  const data = await response.json(); // If the response is JSON
  if (response.ok) {
  // Login successful, redirect to your main site
    //window.location.href = "ai-chat.html";
    window.location.assign("https://ai-model-8.onrender.com");

    console.log("redirected successfull"); // <-- CHANGE to your main site URL
} else {
  // Success logic here
    alert(data.error || "Login failed");
}
}
});
