let information = [];
let location = '';

function submitForm(){
    event.preventDefault();
    getLocation();
    let category = document.getElementById('category').value;
    let price = document.getElementById('price').value;
    let quantity = document.getElementById('quantity').value;
    let purchasedate = document.getElementById('purchasedate').value;
    let lastupdate = document.getElementById('lastupdate').value;
    let info = {Category:category,Address:location,Price:price,Quantity:quantity,Purchasedate:purchasedate,Lastupdate:lastupdate}
    information.push(info);
    console.log(information);
}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  
  function showPosition(position) {
    let Latitude =  position.coords.latitude ;
    let Longitude =  position.coords.longitude;
    location = `https://www.google.com/maps?q=${Longitude},${Latitude}`;
  }