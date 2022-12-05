 
var aboutinfotext=document.getElementById("homepage-aboutinfo");
var about=document.querySelector('.homepage-abouttext');
function aboutinfo(){
  aboutinfotext.scrollIntoView({block:"center",behavior:"smooth"});
}
about.addEventListener('click',aboutinfo);


var contactinfotext=document.getElementById("homepage-contactinfo");
var contact=document.querySelector('.homepage-contacttext');
function contactinfo(){
  contactinfotext.scrollIntoView({block:"center",behavior:"smooth"});
}
contact.addEventListener('click',contactinfo);