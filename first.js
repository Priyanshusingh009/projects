const quotes=[
    "The best way to predict the future is to create it.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "The only way to do great work is to love what you do.","do it anyhow"
];
const quote=document.querySelector("h1");
const button= document.querySelector("button  ");
button.addEventListener("click",() =>{
    const index=Math.floor(Math.random()*4);
    quote.textContent=quotes[index];
})