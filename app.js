//this is our javascript web server
const express   = require("express");       //require == #include
const app       = express();
const http      = require("http");
const server    = require('http').createServer(app);
const io        = require('socket.io')(server)

const LISTEN_PORT       = 8080;                     //default port 8080
const ABS_STATIC_PATH   = __dirname + '/public';

//set our routes
app.get('/', function (req, res) {
    res.sendFile('index.html', {root:ABS_STATIC_PATH});
});

app.get('/', function (req, res) {
    res.sendFile('competitive.html', {root:ABS_STATIC_PATH});
});

server.listen(LISTEN_PORT);                         //starts server
app.use(express.static(__dirname + '/public'));     //the client can access these files via http
console.log("Listening on port: " + LISTEN_PORT);   //a console output so we know something is happening

//game stuff


//socket.io stuff
const Connected_Users = {}    //create an object that will contain a named index key for each socket.id that connects (with said index having several properties)
const Tile_States = {}        //create an object that will contain a named index key for each tile id

//create an index for each row of tiles, setting both tiles to isSafe=true
Tile_States['ID_Row_1'] = {
    tileLeft_isSafe: true,
    tileRight_isSafe: true
};

Tile_States['ID_Row_2'] = {
    tileLeft_isSafe: true,
    tileRight_isSafe: true
};

Tile_States['ID_Row_3'] = {
    tileLeft_isSafe: true,
    tileRight_isSafe: true
};

Tile_States['ID_Row_4'] = {
    tileLeft_isSafe: true,
    tileRight_isSafe: true
};

Tile_States['ID_Row_5'] = {
    tileLeft_isSafe: true,
    tileRight_isSafe: true
};

//the following funciton runs when a user first connects to the server
io.on('connection', (socket) => {
    //ON CONNECTION ----------------------------------------------------------------------------------*
    //initial connection debug messages
    console.log(socket.id + " connected");                  //display socket.id in terminal on connection
    
    //add users connection id to index of connected users (Connected_Users[]) and set properties to object index
    Connected_Users[socket.id] = {
        id: socket.id,      //this id will be sent to other connected users, allowing them to create/destroy avatar elements with the same id
        xPos: 0,            //xPos determines where the position of a user is along the x axis
        yPos: 2.6,          //yPos determines where the position of a user is along the y axis (this value will not change from 2, but I am including it for now just in case)
        zPos: 2,            //xPos determines where the position of a user is along the z axis
        xRot: 0,            //xRot determines where the user camera is rotated along the x axis
        yRot: 0,            //yRot determines where the user camera is rotated along the y axis
        zRot: 0             //zRot determines where the user camera is rotated along the z axis (this value will not change from 0, but I am including it for now just in case)
    };

    //emit function call to new connecting user, calling the createUser() function in socket-io.js for every player already connected to server
    socket.emit('generate_existing_users', Connected_Users);   //send list of all current server connections to new user

    //emit function call to all other connected users, calling the createUser function in socket-io.js to create a new model for the connecting user
    socket.broadcast.emit('create_user', Connected_Users[socket.id]);   //emit call for other users to create an a-entity element that will represent the connected user

    //update users local tile issafe values to match server and set tile colors depending if user has trueSight (local variable attached to user rig)
    socket.emit('update_tile_values', Tile_States);   //send all current server tile values to new connecting user
    
        
    //OTHER FUNCTIONS: -------------------------------------------------------------------------------*
    //received when a users position updates
    socket.on('send_user_position', (data) => {
        Connected_Users[data.id].xPos = data.xPos;
        // Connected_Users[data.id].yPos = data.yPos;   //removed as user y position should never change
        Connected_Users[data.id].zPos = data.zPos;
        Connected_Users[data.id].xRot = data.xRot;
        Connected_Users[data.id].yRot = data.yRot;
        Connected_Users[data.id].zRot = data.zRot;
        //send updated user position to all other users
        socket.broadcast.emit('update_user_position', (Connected_Users[data.id]));
    });

    //received when a user presses the randomize button
    socket.on('randomize_tile_values', () => {
        //rng (0, 1) inclusive, 0 is left tile safe and 1 is right tile safe
        if (Math.floor(Math.random() * 2) === 0) {
            Tile_States['ID_Row_1'].tileLeft_isSafe = true;
            Tile_States['ID_Row_1'].tileRight_isSafe = false;
        } else {
            Tile_States['ID_Row_1'].tileLeft_isSafe = false;
            Tile_States['ID_Row_1'].tileRight_isSafe = true;
        }
        if (Math.floor(Math.random() * 2) === 0) {
            Tile_States['ID_Row_2'].tileLeft_isSafe = true;
            Tile_States['ID_Row_2'].tileRight_isSafe = false;
        } else {
            Tile_States['ID_Row_2'].tileLeft_isSafe = false;
            Tile_States['ID_Row_2'].tileRight_isSafe = true;
        }
        if (Math.floor(Math.random() * 2) === 0) {
            Tile_States['ID_Row_3'].tileLeft_isSafe = true;
            Tile_States['ID_Row_3'].tileRight_isSafe = false;
        } else {
            Tile_States['ID_Row_3'].tileLeft_isSafe = false;
            Tile_States['ID_Row_3'].tileRight_isSafe = true;
        }
        if (Math.floor(Math.random() * 2) === 0) {
            Tile_States['ID_Row_4'].tileLeft_isSafe = true;
            Tile_States['ID_Row_4'].tileRight_isSafe = false;
        } else {
            Tile_States['ID_Row_4'].tileLeft_isSafe = false;
            Tile_States['ID_Row_4'].tileRight_isSafe = true;
        }
        if (Math.floor(Math.random() * 2) === 0) {
            Tile_States['ID_Row_5'].tileLeft_isSafe = true;
            Tile_States['ID_Row_5'].tileRight_isSafe = false;
        } else {
            Tile_States['ID_Row_5'].tileLeft_isSafe = false;
            Tile_States['ID_Row_5'].tileRight_isSafe = true;
        }
        io.emit('update_tile_values', Tile_States);   //send new updated server tile values to all connected users
    });

    //ON DISCONNECT: ---------------------------------------------------------------------------------*
    //when a user disconnects, remove their id from the index of connected users (Connected_Users[]) 
    //and emit a call telling all client to delete that users avatar from the scene
    socket.on('disconnect', () => {
        console.log(socket.id + " disconnected");   //display socket.id on disconnection
        //emit call for other users to destroy the a-entity element that represented the disconnected user
        socket.broadcast.emit('destroy_user', Connected_Users[socket.id]);
        //delete user from Connected_Users[]
        delete Connected_Users[socket.id];
    });
});