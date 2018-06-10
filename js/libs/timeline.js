 function bubbleClicked(bubbleName) { 
  
  $("body p").highlight("consectetur");
  
  // loop through all the divs of this page and if the div is of type row parse then name and decide to hide or not.
  jQuery( "div" ).each( 
   
   function() { 
   
   if(this.className == "col-md-12" && this.id != "")
  
  if( searchInName(this.id, bubbleName)  )
  
     $(this).show();
     
     else
     
     $(this).hide();
   }

  )
  
 };
 
 
 function searchInName(id, name){
  
  var cells =  id.split("-");


for (var i = 0; i < cells.length; i++) 
  {
    if( cells[i] == name )
     return true;
  }
  
  return false;
 }
 

 //jQuery('#2015Tcell').toggle('show');


 
 function showClicked( name )
 {
  
 
  
  
  
 }
