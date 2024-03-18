const socket=io();      //connects webpage to socket.io
let ID_User = null;     //represents local user ID

//socket function calls for receiving emits
socket.on('generate_existing_users', generateExistingUsers);
socket.on('create_user', createUser);
socket.on('destroy_user', destroyUser);
socket.on('update_user_position', updateUserPosition);
socket.on('update_tile_values', updateTileValues);

//LOCAL FUNCTIONS FOR RECEIVING DATA FROM SERVER -----------------------------------------------------------*
//on connection to server
socket.on('connect', () => {
    ID_User = socket.id;                                            //set local variable ID_User to equal server id
    console.log("Your Server Connection ID is: " + ID_User);        //debug message
    
    //set button to send randomization request for tile safety values to server
    buttonEl = document.querySelector('#randomization_button');     //get button element
    buttonEl.addEventListener('click', function() {                 //add event listener for on click
        sendNewRandomizationRequest()                               //run sendNewRandomizationRequest function
    });
});

//call createUser for every user already connected to the server before the user joined
function generateExistingUsers(Connected_Users) {
    //list all users who are currently connected to the server
    console.log('Current Server Connections: ');    //debug message
    let listUsers = Object.keys(Connected_Users);   //create list of all users currently connected to server
    let numUsers = listUsers.length;                //determine number of users connected to server
    for (i = 1; i <= numUsers; i++) {               //use for loop to go through each user
        console.log(listUsers[i - 1]);              //output each users id in local console
    }

    //call createUser() function for each user already connected to server
    for (i = 1; i <= numUsers; i++) {                                               //use for loop to go through each user
        if (!(Connected_Users[listUsers[i - 1]] === Connected_Users[ID_User])) {    //for each user who is NOT you
            createUser(Connected_Users[listUsers[i - 1]]);                          //call createUser() for that user id
        }
    }
}

//create new elements in a-scene to represent other users
function createUser(data) {
    console.log(data.id + ' Created');                                                  //debug Message
    
    const newUserEl = document.createElement('a-entity');                               //create new scene element of type a-entity to represent user and to contain head rotation value for y axis (will be updated to user camera rotation)
    newUserEl.setAttribute('id', data.id);                                              //set element id to match user id on server
    newUserEl.setAttribute('position', data.xPos + ' ' + data.yPos + ' ' + data.zPos);  //set element position to match user position on server
    
    let userModel = document.createElement('a-cylinder');                               //create new scene element of type a-cylinder to represent user model
    userModel.setAttribute('color', 'red');                                             //set element color to red
    userModel.setAttribute('height', '1.8');                                            //set element height to 1.8
    userModel.setAttribute('radius', '0.5');                                            //set element radius to 0.5
    userModel.setAttribute('position', '0 -0.2 0');                                     //set element position to 0 0.2 0
    newUserEl.appendChild(userModel);                                                   //append user model to user element

    let userModelLeftArm = document.createElement('a-box');                             //create new scene element of type a-box to represent user models left arm
    userModelLeftArm.setAttribute('position', '-0.65 0.25 0');                          //set element position to -0.65 0.25 0
    userModelLeftArm.setAttribute('color', 'black');                                    //set element color to black
    userModelLeftArm.setAttribute('height', '1');                                       //set element height to 1
    userModelLeftArm.setAttribute('depth', '0.25');                                     //set element depth to 0.25
    userModelLeftArm.setAttribute('width', '0.25');                                     //set element width to 0.25
    newUserEl.appendChild(userModelLeftArm);                                            //append user model left arm to user model element

    let userModelRightArm = document.createElement('a-box');                            //create new scene element of type a-box to represent user models right arm
    userModelRightArm.setAttribute('position', '0.65 0.25 0');                          //set element position to 0.65 0.25 0
    userModelRightArm.setAttribute('color', 'black');                                   //set element color to black
    userModelRightArm.setAttribute('height', '1');                                      //set element height to 1
    userModelRightArm.setAttribute('depth', '0.25');                                    //set element depth to 0.25
    userModelRightArm.setAttribute('width', '0.25');                                    //set element width to 0.25
    newUserEl.appendChild(userModelRightArm);                                           //append user model right arm to user model element

    let userHeadEl = document.createElement('a-entity');                                //create new scene element of type a-entity to contain head rotation value for x and z axis (will be updated to user camera rotation)
    userHeadEl.setAttribute('class', 'User_Head');                                      //set element id to match user id on server
    userHeadEl.setAttribute('position', '0 1.25 0');                                    //set element position to 0 1.25 0
    newUserEl.appendChild(userHeadEl);                                                  //appen userhead element to user element

    let userModelHead = document.createElement('a-cylinder');                           //create new scene element of type a-cylinder to represent user models head
    userModelHead.setAttribute('color', 'white');                                       //set element color to white
    userModelHead.setAttribute('height', '0.5');                                        //set element height to 0.5
    userModelHead.setAttribute('radius', '0.5');                                        //set element radius to 0.5
    userModelHead.setAttribute('rotation', '90 0 0');                                   //set element rotation to 0 90 0
    userHeadEl.appendChild(userModelHead);                                              //append user model head to user model element

    let userModelFace = document.createElement('a-box');                                //create new scene element of type a-box to represent user models face
    userModelFace.setAttribute('position', '0 0.1 -0.4');                               //set element position to 0 0.1 -0.4
    userModelFace.setAttribute('color', 'black');                                       //set element color to black
    userModelFace.setAttribute('height', '0.6');                                        //set element height to 0.6
    userModelFace.setAttribute('depth', '0.05');                                        //set element depth to 0.05
    userModelFace.setAttribute('width', '0.4');                                         //set element width to 0.4
    userHeadEl.appendChild(userModelFace);                                              //append user model head to user model element

    let playerModelsParent = document.querySelector('#ID_Player_Models_Parent');        //reference the parent element that all user model elements will be children of
    playerModelsParent.appendChild(newUserEl);                                          //append user element to player models parent element as child
}

//delete elements in a-scene that were representing disconnected user
function destroyUser(data) {
    console.log(data.id + ' Destroyed');           //debug message

    document.getElementById(data.id).remove();     //remove disconnecting users element for document
}

//update position of another user on server
function updateUserPosition(data) {
    const updatedUserEl = document.getElementById(data.id);                                 //retrieve element of user who is being updated
    const updatedUserHeadEl = updatedUserEl.querySelector('.User_Head');                    //retrieve child element that represents users head
    updatedUserEl.setAttribute('position', data.xPos + ' ' + data.yPos + ' ' + data.zPos);  //update position of user element to match their new position
    updatedUserEl.setAttribute('rotation', '0' + ' ' + data.yRot + ' ' + '0');              //update rotation of user element to match their new y rotation
    updatedUserHeadEl.setAttribute('rotation', data.xRot + ' ' + '0' + ' ' + data.zRot);    //update rotation of user head element to match their new x and z rotation (z rotation currently not applicable)
}

//updates the local values of tiles to match the server values
function updateTileValues(data) {
    console.log('Tile Values Being Updated')    //debug message
    const tileRow1 = document.getElementById('ID_Row_1');
    tileRow1.querySelector('.Tile_Left').setAttribute('issafe', data['ID_Row_1'].tileLeft_isSafe);
    tileRow1.querySelector('.Tile_Right').setAttribute('issafe', data['ID_Row_1'].tileRight_isSafe);
    
    const tileRow2 = document.getElementById('ID_Row_2');
    tileRow2.querySelector('.Tile_Left').setAttribute('issafe', data['ID_Row_2'].tileLeft_isSafe);
    tileRow2.querySelector('.Tile_Right').setAttribute('issafe', data['ID_Row_2'].tileRight_isSafe);

    const tileRow3 = document.getElementById('ID_Row_3');
    tileRow3.querySelector('.Tile_Left').setAttribute('issafe', data['ID_Row_3'].tileLeft_isSafe);
    tileRow3.querySelector('.Tile_Right').setAttribute('issafe', data['ID_Row_3'].tileRight_isSafe);

    const tileRow4 = document.getElementById('ID_Row_4');
    tileRow4.querySelector('.Tile_Left').setAttribute('issafe', data['ID_Row_4'].tileLeft_isSafe);
    tileRow4.querySelector('.Tile_Right').setAttribute('issafe', data['ID_Row_4'].tileRight_isSafe);

    const tileRow5 = document.getElementById('ID_Row_5');
    tileRow5.querySelector('.Tile_Left').setAttribute('issafe', data['ID_Row_5'].tileLeft_isSafe);
    tileRow5.querySelector('.Tile_Right').setAttribute('issafe', data['ID_Row_5'].tileRight_isSafe);

    //check if truesight is true, if so, set tile colors respectively (green=safe, red=dangerous)
    if (document.querySelector('#ID_Rig').getAttribute('truesight') === 'true') {
        if(data['ID_Row_1'].tileLeft_isSafe === true) {
            tileRow1.querySelector('.Tile_Left').setAttribute('color', 'green');
        } else {
            tileRow1.querySelector('.Tile_Left').setAttribute('color', 'red');
        }
        if(data['ID_Row_1'].tileRight_isSafe === true) {
            tileRow1.querySelector('.Tile_Right').setAttribute('color', 'green');
        } else {
            tileRow1.querySelector('.Tile_Right').setAttribute('color', 'red');
        }
        if(data['ID_Row_2'].tileLeft_isSafe === true) {
            tileRow2.querySelector('.Tile_Left').setAttribute('color', 'green');
        } else {
            tileRow2.querySelector('.Tile_Left').setAttribute('color', 'red');
        }
        if(data['ID_Row_2'].tileRight_isSafe === true) {
            tileRow2.querySelector('.Tile_Right').setAttribute('color', 'green');
        } else {
            tileRow2.querySelector('.Tile_Right').setAttribute('color', 'red');
        }
        if(data['ID_Row_3'].tileLeft_isSafe === true) {
            tileRow3.querySelector('.Tile_Left').setAttribute('color', 'green');
        } else {
            tileRow3.querySelector('.Tile_Left').setAttribute('color', 'red');
        }
        if(data['ID_Row_3'].tileRight_isSafe === true) {
            tileRow3.querySelector('.Tile_Right').setAttribute('color', 'green');
        } else {
            tileRow3.querySelector('.Tile_Right').setAttribute('color', 'red');
        }
        if(data['ID_Row_4'].tileLeft_isSafe === true) {
            tileRow4.querySelector('.Tile_Left').setAttribute('color', 'green');
        } else {
            tileRow4.querySelector('.Tile_Left').setAttribute('color', 'red');
        }
        if(data['ID_Row_4'].tileRight_isSafe === true) {
            tileRow4.querySelector('.Tile_Right').setAttribute('color', 'green');
        } else {
            tileRow4.querySelector('.Tile_Right').setAttribute('color', 'red');
        }
        if(data['ID_Row_5'].tileLeft_isSafe === true) {
            tileRow5.querySelector('.Tile_Left').setAttribute('color', 'green');
        } else {
            tileRow5.querySelector('.Tile_Left').setAttribute('color', 'red');
        }
        if(data['ID_Row_5'].tileRight_isSafe === true) {
            tileRow5.querySelector('.Tile_Right').setAttribute('color', 'green');
        } else {
            tileRow5.querySelector('.Tile_Right').setAttribute('color', 'red');
        }
    }
}

//LOCAL FUNCTIONS FOR SENDING DATA TO SERVER ---------------------------------------------------------------*
//send local user position to server
function sendUserPosition() {
    const rigEl = document.querySelector('#ID_Rig');        //retrieve ID_Rig el
    const cameraEl = document.querySelector('#ID_Camera');  //retrieve ID_Camera el
    const rigPos = rigEl.getAttribute('position');          //get position of ID_Rig
    const cameraRot = cameraEl.getAttribute('rotation');    //get rotation of ID_Camera
    //emit stuffs
    socket.emit('send_user_position', {                     //send id, rotation, and position data to server
        id: ID_User,
        xPos: rigPos.x,
        // yPos: rigPos.y,  //removed as user y position should never change
        zPos: rigPos.z,
        xRot: cameraRot.x,
        yRot: cameraRot.y,
        zRot: cameraRot.z
    });
}

function sendNewRandomizationRequest() {
    console.log('Requesting New Tile Layout');  //debug message
    socket.emit('randomize_tile_values');       //send request for new tile layout to server
}

//automatically update user positions every 100 miliseconds
setInterval(sendUserPosition, 100);