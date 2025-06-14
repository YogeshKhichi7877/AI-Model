let para = document.querySelector('#text-ans');
let text = document.querySelector('#text');
let btn = document.querySelector('#btn');

function showLoader() {
  document.getElementById('loader').style.display = 'flex';
  document.getElementById('load').style.display = 'flex';
}

function hideLoader() {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('load').style.display = 'none';
}


// Add this in a script tag or in your JS file
document.getElementById('btn').addEventListener('click', async () => {
    
    const userText = document.getElementById('text').value;
     if(userText === ""){
       para.innerHTML = "PLEASE ENTER YOUR QUESTION"
    }else{
        
        console.log(userText);
        showLoader();
        const response = await fetch('http://localhost:5000/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userText }) 
    });
    const data = await response.json(); // or .json() if your server sends JSON
    document.getElementById('text-ans').innerText = data.answer;
    text.innerHTML = "" ;
    hideLoader();}
});

