

function home_page(){
    window.location.href = "home.html";
  }
  
function login_page(){
    window.location.href = "loginpage2.html";
  }
  function alohomora(){
    window.location.href = "loginpage2.html";
  }
  function profile(){
    window.location.href = "profile.html";
  }
  function enrollfunc(i){
    var elective;
    elective = i;
    if (typeof window !== 'undefined'){
      localStorage.setItem("elective",elective);
    }
   
    window.location.href = "profile.html";
    
}




function myfunc(i){
  var word;
  word = i;
  if (word=='potions'){
    window.location.href="disciplins.html#potions";
  }
  if (word=='quidditch'){
    window.location.href="disciplins.html#quidditch";
  }
  if (word=='numerology'){
    window.location.href="disciplins.html#numerology";
  }
  if (word=='astronomy'){
    window.location.href="disciplins.html#astronomy";
  }
  if (word=='dda'){
    window.location.href="disciplins.html#dda";
  }


}
