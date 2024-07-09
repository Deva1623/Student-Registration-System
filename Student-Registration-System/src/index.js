
//Data Will fetch from local storage on page load----------
document.addEventListener('DOMContentLoaded', function(){
    loadStudentsData();
})
//----This function only add student details in table dynamically--------
function addStudentTable(student){
    
    //capturing table----
    const myTable = document.querySelector('#student-table').getElementsByTagName('tbody')[0];
    // then inserting row and some css
    const myRow = myTable.insertRow();
    myRow.className = "border border-black font-mono";
   
    //--adding cells in row total 5
    const firstCell = myRow.insertCell(0);
    const secondCell = myRow.insertCell(1);
    const thirdCell = myRow.insertCell(2);
    const fourthCell = myRow.insertCell(3);
    const fifthCell = myRow.insertCell(4);
    
    //--giving each cell some css
    firstCell.className = "p-2";
    secondCell.className = "p-2";
    thirdCell.className = "p-2";
    fourthCell.className = "p-2";
    fifthCell.className = "p-2 flex justify-around";
    
    //--updating each cell with value entered in form
    firstCell.textContent = student.id;
    secondCell.textContent = student.name;
    thirdCell.textContent = student.email;
    fourthCell.textContent = student.contact;

     //=====Dynamic Edit Button===========
    const editButton = document.createElement('button');
    //--icon form button
    let icon1 = document.createElement('i');
    icon1.className = "fas fa-edit";
    editButton.appendChild(icon1);
    editButton.className = "text-blue-800 p-2"
    //--adding event listener to button
    editButton.addEventListener('click', function(){
        //--capturing all updated feilds----
        document.getElementById('edited-id').value = firstCell.textContent;
        document.getElementById('edited-name').value = secondCell.textContent;
        document.getElementById('edited-email').value = thirdCell.textContent;
        document.getElementById('edited-contact').value = fourthCell.textContent
        
        //--after updating hiding dialog box
        document.getElementById('edit-student-div').classList.remove('hidden');   
        document.getElementById('update-btn').onclick = function(event){
            event.preventDefault();
            updateData(myRow);  //function called to update existing records if SAVE is cliked.
        }
    })
    //====delete Button- to delete row=========
    const deleteButton = document.createElement('button');
    //--creating icon--
    let icon2 = document.createElement('i');
    icon2.className = "fas fa-trash";
    deleteButton.appendChild(icon2);
    deleteButton.className = "text-orange-600";
    //--adding event listener to button
    deleteButton.addEventListener('click',function(){
        //Askig user to confirm delete---
        const confirmation = confirm("Are you sure you want to delete this row?");
        if(confirmation){
            //--remove row   
            myTable.removeChild(myRow);
            //--remove data from local storage
            deleteFromLocalStorage(myRow);
        }
       
    })
    //adding icon button to row---
    fifthCell.appendChild(editButton);
    fifthCell.appendChild(deleteButton);


}

// ---when form submit
document.querySelector('#student-data').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent from submitting
   
    //some validation
    let formValid = true;
    const enteredName = document.getElementById('student-name').value
    const enteredEmail = document.getElementById('email').value;
    
    //custom patterns using REGEX
    const namePattern = /^[A-Za-z\s]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    //validating name-----
    const nameError = document.getElementById('error-name');
    if(!namePattern.test(enteredName)){
        formValid = false;
        nameError.style.color = 'brown';
        nameError.style.fontWeight = 'bold';
        nameError.style.fontSize = '12px';
        nameError.textContent = 'Name can only contain characters';
    }else{
        nameError.textContent = '';
    }
    // validating email----
    const emailError = document.getElementById('error-email');
    if(!emailPattern.test(enteredEmail)){
        formValid = false;
        emailError.style.color = 'brown';
        emailError.style.fontWeight = 'bold';
        emailError.style.fontSize = '12px';
        emailError.textContent = 'Please add a valid email address';
    }else{
        emailError.textContent = '';
    }
    // if anything wrong prevent submission----
    if(!formValid){
        //function called to show red dialog box  in bottom
        errorMessage();
        return;
    }

    //if valid continue and create student object
    const student = {
        name: enteredName,
        id: document.getElementById('student-id').value,
        email:enteredEmail,
        contact: document.getElementById('contact').value
    };
    //--create or get array in local storage---
    const array = JSON.parse(localStorage.getItem('studentArray')) || [];
    //--Student with same Id not allowed throws alert
    const existingStudent = array.some(existingStudent => existingStudent.id === student.id);
    if(existingStudent){
        alert("Student with same ID already exists!");
        return;
    }
    // if new student then
    addStudentTable(student);  // Add the student to the table
    saveStudent(student);     // also add to local stoarge in array.
    
    //open green dialog to show successful regestration
    showMessage();

    // then reset all errors and feilds empty
    document.getElementById('student-data').reset();
    nameError.textContent = '';
    emailError.textContent = '';
    
});

//=====load data from local storage=====
function loadStudentsData(){
    const studentArray = JSON.parse(localStorage.getItem('studentArray')) || [];
    studentArray.forEach(student=>{
        addStudentTable(student);
    })
}
//========Save student data local storage=====
function saveStudent(student){
    let studentArray = JSON.parse(localStorage.getItem('studentArray')) || [];
    studentArray.push(student);
    localStorage.setItem('studentArray', JSON.stringify(studentArray));
}
//======update record function  to update data===========
function updateData(row){
    
    //---- Capturing updated values
    const id = document.querySelector('#edited-id').value;
    const newName = document.querySelector('#edited-name').value;
    const newEmail = document.querySelector('#edited-email').value;
    const newContact = document.querySelector('#edited-contact').value;
    
    //updating table contents
    row.cells[0].textContent = id;
    row.cells[1].textContent = newName;
    row.cells[2].textContent = newEmail;
    row.cells[3].textContent = newContact;
    
    //hiding dialog box after edit
    document.getElementById('edit-student-div').classList.add('hidden');
    
    //taking array from localstorage
    const studentArray =JSON.parse(localStorage.getItem('studentArray')) || [];
    console.log(studentArray);

    //finding which student row clicked----
    const targetStudent = studentArray.find(student => student.id === id);

    if (targetStudent){

        targetStudent.name = newName;
        targetStudent.email = newEmail;
        targetStudent.contact = newContact;
        
        //setting new details
        localStorage.setItem('studentArray', JSON.stringify(studentArray) );
        console.log('Updated student = ', targetStudent);
    }
    
}
// when row is deleted function to delete from local storage also----------
function deleteFromLocalStorage(myRow){
    const studentArray = JSON.parse(localStorage.getItem('studentArray')) || [];
    //  finding which row clicked-----
    const index = studentArray.findIndex(student=> student.id === myRow.cells[0].textContent);
    if(index != -1){
        studentArray.splice(index,1);
        localStorage.setItem('studentArray', JSON.stringify(studentArray));
    }
}

//======cancel editing button ==========
const closeButton = document.getElementById('close-btn').addEventListener('click',function(){
    document.getElementById('edit-student-div').classList.add('hidden');
})
//======Green dialog to show success==========
function showMessage(){
    const div = document.createElement('div');
    div.textContent = "Student Added Successfully";
    div.style.padding = '10px';
    div.style.backgroundColor = 'lightgreen'
    div.style.border = '2px solid green';
    div.style.position = 'absolute';
    div.style.bottom = '25px';
    div.style.left = '50%';  
    div.style.transform = 'translateX(-50%)';
    div.style.borderRadius = '15px';
    div.style.fontFamily = 'monospace';
    div.style.fontWeight = 'bold';
    div.style.fontSize = '15px';

    const button = document.createElement('button');
    button.style.backgroundColor = 'white'
    button.style.color = 'black';
    button.style.padding = '5px';
    button.style.marginLeft = '10px';
    button.style.borderRadius = '50%';
    button.style.border = '1px solid black';
    
    button.textContent = "OK";

    button.addEventListener('click', function(){
        
        div.remove();
      
    })

    div.appendChild(button);
    document.body.appendChild(div);

    // to remove dialog after 5 sec
    setTimeout(function() {
        div.remove();
    }, 5000);
}
//======RED dialog to show Error in form values==========
function errorMessage(){
    const div = document.createElement('div');
    div.textContent = "Please check entered values are correct ";
    div.style.padding = '10px';
    div.style.backgroundColor = '#ff5843'
    div.style.border = '2px solid orangered';
    div.style.position = 'absolute';
    div.style.bottom = '25px';
    div.style.left = '50%';  
    div.style.transform = 'translateX(-50%)';
    div.style.borderRadius = '15px';
    div.style.fontFamily = 'monospace';
    div.style.fontWeight = 'bold';
    div.style.fontSize = '15px';
  

    const button = document.createElement('button');
    button.style.backgroundColor = 'white'
    button.style.color = 'black';
    button.style.padding = '5px';
    button.style.marginLeft = '10px';
    button.style.borderRadius = '50%';
    button.style.border = '1px solid black';
    button.textContent = "OK";

    button.addEventListener('click', function(){
        div.remove();
    })

    div.appendChild(button);
    document.body.appendChild(div);
    
    // to remove dialog after 5 sec
    setTimeout(function() {
        div.remove();
    }, 5000);
}
//-----------------------------------------------------END---------------------------------------------------------
