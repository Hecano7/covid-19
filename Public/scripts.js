let coordinates;
let photo;

document.addEventListener("DOMContentLoaded", function () {
  console.log(window.document.location.href);
  if (window.document.location.href == `https://covid-19-resource-finder.herokuapp.com/found.html`) {
    document.getElementById("category").value = localStorage.getItem("item");
    uploadPhoto();

    getPosition()
    .then((position) => {
      showPosition(position);
    })
    .catch((err) => {
      console.error(err.message);
    });
  }

  if (window.document.location.href == `https://covid-19-resource-finder.herokuapp.com/seeking.html`) {
    console.log(localStorage.getItem("item"));
      let settings = { method: "Get" };
      getPosition()
      .then((position) => {showPosition(position)
      .then(fetch(`/data`, settings)
      .then((response) => response.json())
      .then(data => data.map(function(obj) {
        var o = Object.assign({}, obj);
        o.Dist = parseFloat(distance(coordinates[0],coordinates[1],obj.Location.lat,obj.Location.lon));
        return o;
      }))
      .then(data => data.sort(function(a, b){return a.Dist-b.Dist}))
      .then(function(objects) { if(localStorage.getItem("item") != "all"){objects.filter(obj => obj.Name == localStorage.getItem("item"))}})
      .then(data => data.map(obj => createRow(obj)))
      // .then(data => data.map(obj => console.log(obj)))
      
      )
    })
  }
});

function distance(lat1,lon1,lat2,lon2){
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
 }
 var R = 6371; // km 
 //has a problem with the .toRad() method below.
 var x1 = lat2-lat1;
 var dLat = x1.toRad();  
 var x2 = lon2-lon1;
 var dLon = x2.toRad();  
 var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                 Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                 Math.sin(dLon/2) * Math.sin(dLon/2);  
 var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
 var d = R * c; 
 var m = (d * 0.62137).toFixed(2);
 return m;
}

function createRow(obj) {
  var table = document.getElementById("list");
  var row = table.insertRow(-1);
  var cell = row.insertCell(0);
  var cell1 = row.insertCell(1);
  var cell2 = row.insertCell(2);
  var cell3 = row.insertCell(3);
  var cell4 = row.insertCell(4);
  var cell5 = row.insertCell(5);
  var cell6 = row.insertCell(6);
  var img = document.createElement('img');
  if(obj.Photo){
    img.src = obj.Photo;
    cell6.appendChild(img).setAttribute("class" , "mini");
};
  cell.innerHTML = obj.Dist.toFixed(2) + " mi";
  cell1.innerHTML = obj.Name;
  cell2.innerHTML = obj.Location.capStoreName;
  cell2.setAttribute("href" , obj.Location.address);
  if(obj.Price ){
      cell3.innerHTML = "$"+obj.Price;
}
  cell5.innerHTML = obj.Last_Updated.slice(4,16);
  cell4.innerHTML = obj.Quantity;
  cell2.addEventListener("click", () => {
    window.location.replace(obj.Location.address)
  });
  cell6.addEventListener("click", () => {
    console.log("clicked");
    var imgPop = document.getElementById("imgPop");
      imgPop.style.display = "block";
      imgPop.src = obj.Photo;
      imgPop.addEventListener("click", () => {
      imgPop.style.display = "none";
    })
  })
}

let date = '';

function submitForm() {
  event.preventDefault();
  console.log(coordinates);

    let lat = coordinates[0];
    let lon = coordinates[1];
    let address = `https://www.google.com/maps?q=${lat},${lon}`;
    let category = document.getElementById("category").value;
    let price = document.getElementById("price").value;
    let quantity = document.getElementById("quantity").value;
    let storeName = document.getElementById("storeName").value;
    let capStoreName = storeName.charAt(0).toUpperCase() + storeName.slice(1);
    let text1 = "Thank you for your contribution!<br/> Why dont you checkout listings near you by clicking on the link bellow.";
    let text2 = "Atleast the first two fields have to be filled out before submitting.";

    let info = {
      Name: category.charAt(0).toUpperCase() + category.slice(1),
      Location: {
        address,
        capStoreName,
        lat,
        lon
      },
      Price: price,
      Last_Updated: JSON.stringify(date),
      Quantity: quantity,
      Photo: photo
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    };

    if(category != "" && storeName != ""){    
        console.log(info);
        fetch("/api", options).then((response) => {
          console.log(response);
        });
        prompt(text1,listings);
      }else{
        prompt(text2);
      }
};

const getPosition = function (options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

function showPosition(position) {
  date = new Date().toString();
  let Latitude = position.coords.latitude;
  let Longitude = position.coords.longitude;
  return coordinates = [Latitude,Longitude];
};

function radioButton(pic) {
  const radio = document.getElementsByName("options");
  for (let i = 0; i < radio.length; i++) {
    if (radio[i].checked == true){
      console.log(radio[i]);
        window.document.location.replace(`https://covid-19-resource-finder.herokuapp.com/${radio[i].value}.html`);
      }
    }
    localStorage.setItem("item", pic);
}

function prompt(text,listings){
  var prompt = document.getElementById("prompt");
  var span = document.getElementsByClassName("close1")[0];
  var string = document.getElementById("text");
  string.innerHTML = text;
  prompt.style.display = "block";
  span.onclick = function() {
    prompt.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == prompt) {
      prompt.style.display = "none";
    }
  }
  if(listings){
    document.getElementById("listings").style.display = "block";
  }
}

function uploadPhoto(){
  let inpFile = document.getElementById("inpFile");
  let previewContainer = document.getElementById("imagePreview");
  let previewImage = previewContainer.querySelector(".image-preview__image");
  let previewDefaultText = previewContainer.querySelector(".image-preview__default-text");
  
  inpFile.addEventListener("change", function(){
    let file = this.files[0];
    if(file){
      let reader = new FileReader();
      previewDefaultText.style.display = "none";
      previewImage.style.display = "block";

      reader.addEventListener("load", function(){
        console.log(this.result);
        photo = this.result;
        previewImage.setAttribute("src", this.result)
      });
      reader.readAsDataURL(file)
    }else{
      previewDefaultText.style.display = null;
      previewImage.style.display = null;
      previewImage.setAttribute("src","");
    }
  })
}

function redirectListings(){
  window.location.href = 'https://covid-19-resource-finder.herokuapp.com/seeking.html';
  localStorage.setItem("item", "all");
}
