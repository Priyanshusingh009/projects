const body = document.querySelector("body");

body.addEventListener('click',(e)=>{
  const circleElement=document.createElement('div')
  circleElement.textContent="hi";
  circleElement.classList.add("circle");
  const color=["red","green","blue","gold","white","pink","yellow","orange","purple","cyan","magenta","teal","lime","brown","gray","olive","navy","maroon","fuchsia"]
  circleElement.style.backgroundColor = color[Math.floor(Math.random()*color.length)];
  circleElement.style.top=`${e.clientY-25}px`;
  circleElement.style.left=`${e.clientX-25}px`;
  body.append(circleElement);
  setTimeout(()=>{
    circleElement.remove();
  },5000);
})