initLocalSorage();				//initialize local storage with local json data file
showUserslist();
var my_data = JSON.parse(localStorage.getItem("myData"));
showUserById(my_data[0].id); 	// display 1st user
initDragAndDrop();

function initLocalSorage(){
	if (typeof(Storage) !== "undefined") {	//checks if local storage is supported
		if(localStorage.getItem("isIniti")==null){ // if first use -> copy data.json to local storage under "my_data"
			//set initialize to yes
			localStorage.setItem("isIniti", "yes");
			//init all values from file to local storage
			localStorage.setItem("myData", JSON.stringify(data));
		}
	}			
	 else {
		alert("Sorry, your browser does not support Web Storage...");
	}
}

function showUserslist() {		//displays all users in nav -> checkList -> ul
	var out = '';
	var my_data = JSON.parse(localStorage.getItem("myData"));  //extractimg most updated data
    for(var i = 0; i<my_data.length; i++)//building styled div for each user data 
		out += '<li class="listItem" draggable="true"><div class = "listDiv" onclick="showUserById(' + my_data[i].id + ')"><img class = "userImg" src="' + my_data[i].profileImage + '"><div class = "nameAndBday"><h2 id="name"> ' + my_data[i].firstName + ' ' + my_data[i].lastName + '</h2><h3> ' + formatDate(new Date(my_data[i].birthDate)) + '</h3></div><img class = "deleteImg" src="deleteIcon.png" onclick="deleteUserById(' + my_data[i].id + ')">	</div><br></li>';
    document.getElementById("checklist").innerHTML = out;
	initDragAndDrop();
}

function formatDate(date) { // transform a numeric raw date to a styled format
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  return monthNames[monthIndex] + ' ' + day + ', ' + year;
}

function showUserById(id){
	//input: User Id 
	//displays user details in <article>
	resetDetailsView();	//restes view in case the view is set for addUser
	var my_data = JSON.parse(localStorage.getItem("myData"));
	for(var i = 0; i<my_data.length; i++) {
		if(my_data[i].id==id){
			document.getElementById("userImgBig").src = my_data[i].profileImage;
			document.getElementById("id").innerHTML = my_data[i].id;
			document.getElementById("fName").innerHTML = my_data[i].firstName;
			document.getElementById("lName").innerHTML = my_data[i].lastName;
			document.getElementById("bDay").innerHTML = formatDate(new Date(my_data[i].birthDate));
			return;
		}
	
	}
}

function deleteUserById(id){
	var my_data = JSON.parse(localStorage.getItem("myData"));
	for(var i = 0; i<my_data.length; i++){
		if(my_data[i].id==id){
			temp = my_data[0];        // putting found elemnt at first position in order to use shift() to delete element
			my_data[0] = my_data[i];
			my_data[i] = temp;
			my_data.shift();
			break;
		}
	}
	localStorage.setItem("myData", JSON.stringify(my_data)); //updating local storage
	showUserslist();
}

function showAddUserForm(){
	//changing inner html of existing tags to create an add user form -- all of the tags return to their state when resetDetailsView() is called
	document.getElementById("detailsHeadr").innerHTML = 'New User';
	document.getElementById("idTxt").innerHTML = '<input type="file" id="selectedImg" class="custom-file-input" accept="image/*" onchange="onFileSelected(event)"/>';
	document.getElementById("userImgBig").src = "plusImg.png";	
	document.getElementById("id").innerHTML = '';
	document.getElementById("fName").innerHTML = '<input type="text" id="fNameBox">';
	document.getElementById("lName").innerHTML = '<input type="text" id="lNameBox">';
	document.getElementById("bDay").innerHTML = '<input type="date" id="bDayBox">';
	document.getElementById("submit").innerHTML = '<button class = "btn" onclick="addUser()">send</button>';
	document.getElementById("cancel").innerHTML = '<button class = "btn" onclick="cancel()">cancel</button>';
}

function cancel(){
	//return to default view (before the add user form)
	resetDetailsView();
	showUserById(data[0].id);
}
function resetDetailsView(){//resets deltails view to its original state
		document.getElementById("submit").innerHTML = '';
		document.getElementById("cancel").innerHTML = '';
		document.getElementById("detailsHeadr").innerHTML = 'User Details';
		document.getElementById("idTxt").innerHTML = 'ID';
}

function addUser(){
	if(validateForm()){ //checks if all input were filled
		var newUser = {	//creates a new user object styled json... extracting values from input boxes
					id: uniqueId(),												
					firstName: document.getElementById("fNameBox").value,		
					lastName: document.getElementById("lNameBox").value,		
					birthDate: document.getElementById("bDayBox").value,		
					profileImage: document.getElementById("selectedImg").files[0].name
					};
		var my_data = JSON.parse(localStorage.getItem("myData"));
		my_data.push(newUser);
		localStorage.setItem("myData", JSON.stringify(my_data)); // updating local storage with the new user added
		resetDetailsView();
		showUserById(data[0].id);
		showUserslist();
	}
}
function validateForm(){
	//check if all input fiels were filled, including an upload image
		if(document.getElementById("fNameBox").value=='' || document.getElementById("lNameBox").value==0|| document.getElementById("bDayBox").value==0 || document.getElementById("selectedImg").files.length == 0 ){
			alert("Please Fill ALL Details");
			return false;
		}
		else
			return true;
}
function uniqueId() {
	//generates a uniqe number for id, using time...
  return new Date().getUTCMilliseconds();;
}

function sortUsers(){	//sorts the user jason data structue via a custom compare function
	var my_data = JSON.parse(localStorage.getItem("myData"));
	my_data.sort(compare);
	localStorage.setItem("myData", JSON.stringify(my_data));
	showUserslist();
}
function compare(a,b) {
  if (a.firstName < b.firstName)
    return -1;
  if (a.firstName > b.firstName)
    return 1;
  return 0;
}

function onFileSelected(event) { //displaing a preview of the uploaded user image 
  var selectedFile = event.target.files[0];
  var reader = new FileReader();
  var imgtag = document.getElementById("userImgBig");
  imgtag.title = selectedFile.name;
  reader.onload = function(event) {
    imgtag.src = event.target.result;
  };
  reader.readAsDataURL(selectedFile);
}



/* --------------------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------------------- */
/* --------------------------------             Drag&Drop Functions                            ------------------------- */


function initDragAndDrop(){
	var listItems = document.querySelectorAll('.listItem');
	var dragSrcEl = null;
	for (i = 0; i < listItems.length; i++) {
	  listItem = listItems[i];


	  listItem.setAttribute("order-id", i);



	  listItem.addEventListener('dragstart', handleDragStart, false)
	  listItem.addEventListener('dragenter', handleDragEnter, false)
	  listItem.addEventListener('dragover', handleDragOver, false)
	  listItem.addEventListener('dragleave', handleDragLeave, false)
	  listItem.addEventListener('drop', handleDrop, false)
	  listItem.addEventListener('dragend', handleDragEnd, false)
	}
}

function handleDragStart(e) {
  this.className += " dragStartClass";
  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
  e.dataTransfer.setDragClass("dataTransferClass");

}

function handleDragOver(e) {
  // if (e.preventDefault) { not needed according to my question and anwers on : http://stackoverflow.com/questions/36920665/why-if-statement-with-e-preventdefault-drag-and-drop-javascript
  e.preventDefault();
  // }
  e.dataTransfer.dropEffect = 'move'; // sets cursor
  return false;

}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over'); // this / e.target is previous target element.
}

function handleDrop(e) {

  var listItems = document.querySelectorAll('.listItem');
  e.stopPropagation(); // stops the browser from redirecting.
  dragSrcOrderId = parseInt(dragSrcEl.getAttribute("order-id"));
  dragTargetOrderId = parseInt(this.getAttribute("order-id"));
  var tempThis = this;


  // Don't do anything if dropping the same column we're dragging.
  // and
  // check if only one difference and then do not execute
  // && ((Math.abs(dragSrcOrderId - dragTargetOrderId)) != 1)
  if (dragSrcEl != this) {
    // Set the source column's HTML to the HTML of the column we dropped on.
    var tempThis = this;

    function makeNewOrderIds(tempThis) {
      // check if up or down movement

      dragSrcEl.setAttribute("order-id", dragTargetOrderId);
      tempThis.setAttribute("order-id", dragTargetOrderId);

      //  find divs between old and new location and set new ids - different in up or down movement (if else)
      if (dragSrcOrderId < dragTargetOrderId) {
        for (i = dragSrcOrderId + 1; i < dragTargetOrderId; i++) {
          listItems[i].setAttribute("order-id", i - 1);
          // set new id src
          dragSrcEl.setAttribute("order-id", dragTargetOrderId - 1);
        }
      } else {
        for (i = dragTargetOrderId; i < dragSrcOrderId; i++) {
          listItems[i].setAttribute("order-id", i + 1);
          // set new id src
          dragSrcEl.setAttribute("order-id", dragTargetOrderId);

        }
      }

    };
    makeNewOrderIds(tempThis);


    dragSrcEl.classList.remove("dragStartClass");

    reOrder(listItems);




  } else {

    dragSrcEl.classList.remove("dragStartClass");
    return false;

  }

};

function handleDragEnd(e) {

  for (i = 0; i < listItems.length; i++) {
    listItem = listItems[i];
    listItem.classList.remove('over');
  }
  dragSrcEl.classList.remove("dragStartClass");


}

function reOrder(listItems) {


  var tempListItems = listItems;
  tempListItems = Array.prototype.slice.call(tempListItems, 0);

  tempListItems.sort(function(a, b) {
    return a.getAttribute("order-id") - b.getAttribute("order-id");
  });



  var parent = document.getElementById('checklist');
  parent.innerHTML = "";

  for (var i = 0, l = tempListItems.length; i < l; i++) {
    parent.appendChild(tempListItems[i]);
  }
};
