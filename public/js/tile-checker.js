'use strict'

// Check Tile Status / Move Player ------------------------------------------------------------*
AFRAME.registerComponent('tile-checker', {
    
    init: function() {
        //must be const or the event listener later in the code won't be able to reference the variable
        const CONTEXT_AF = this;                                            //this refers to the component, not the element that the component is attached to
        CONTEXT_AF.rigObject = document.querySelector('#ID_Rig');           //query the ID_Rig element and use CONTEXT_AF.rigObject to reference it
    },

    tick: function(time, timeDelta) {      
        const CONTEXT_AF = this;                                            //this refers to the component, not the element that the component is attached to
        CONTEXT_AF.rigObject = document.querySelector('#ID_Rig');           //query the ID_Rig element and use CONTEXT_AF.rigObject to reference it
        CONTEXT_AF.row1 = document.querySelector('#ID_Row_1');              //query row1 of tiles
        CONTEXT_AF.row2 = document.querySelector('#ID_Row_2');              //query row2 of tiles
        CONTEXT_AF.row3 = document.querySelector('#ID_Row_3');              //query row3 of tiles
        CONTEXT_AF.row4 = document.querySelector('#ID_Row_4');              //query row4 of tiles
        CONTEXT_AF.row5 = document.querySelector('#ID_Row_5');              //query row5 of tiles
        CONTEXT_AF.realWorldPosition = new THREE.Vector3();                 //create a new vector in 000 world position that can be used to reference an objects relative position in worldspace

        //check if player has stepped within a tile that is NOT safe
        if (playerWithinDeadlyTile(CONTEXT_AF.rigObject, CONTEXT_AF.row1, '.Tile_Left')) {
            console.log('THOU HAVE DIED IN ROW 1 TILE LEFT');   //debug message
            sendPlayerToStart(CONTEXT_AF.rigObject);            //send player to start pos
        }
        if (playerWithinDeadlyTile(CONTEXT_AF.rigObject, CONTEXT_AF.row1, '.Tile_Right')) {
            console.log('THOU HAVE DIED IN ROW 1 TILE RIGHT');   //debug message
            sendPlayerToStart(CONTEXT_AF.rigObject);            //send player to start pos
        }
        if (playerWithinDeadlyTile(CONTEXT_AF.rigObject, CONTEXT_AF.row2, '.Tile_Left')) {
            console.log('THOU HAVE DIED IN ROW 2 TILE LEFT');   //debug message
            sendPlayerToStart(CONTEXT_AF.rigObject);            //send player to start pos
        }
        if (playerWithinDeadlyTile(CONTEXT_AF.rigObject, CONTEXT_AF.row2, '.Tile_Right')) {
            console.log('THOU HAVE DIED IN ROW 2 TILE RIGHT');   //debug message
            sendPlayerToStart(CONTEXT_AF.rigObject);            //send player to start pos
        }
        if (playerWithinDeadlyTile(CONTEXT_AF.rigObject, CONTEXT_AF.row3, '.Tile_Left')) {
            console.log('THOU HAVE DIED IN ROW 3 TILE LEFT');   //debug message
            sendPlayerToStart(CONTEXT_AF.rigObject);            //send player to start pos
        }
        if (playerWithinDeadlyTile(CONTEXT_AF.rigObject, CONTEXT_AF.row3, '.Tile_Right')) {
            console.log('THOU HAVE DIED IN ROW 3 TILE RIGHT');   //debug message
            sendPlayerToStart(CONTEXT_AF.rigObject);            //send player to start pos
        }
        if (playerWithinDeadlyTile(CONTEXT_AF.rigObject, CONTEXT_AF.row4, '.Tile_Left')) {
            console.log('THOU HAVE DIED IN ROW 4 TILE LEFT');   //debug message
            sendPlayerToStart(CONTEXT_AF.rigObject);            //send player to start pos
        }
        if (playerWithinDeadlyTile(CONTEXT_AF.rigObject, CONTEXT_AF.row4, '.Tile_Right')) {
            console.log('THOU HAVE DIED IN ROW 4 TILE RIGHT');   //debug message
            sendPlayerToStart(CONTEXT_AF.rigObject);            //send player to start pos
        }
        if (playerWithinDeadlyTile(CONTEXT_AF.rigObject, CONTEXT_AF.row5, '.Tile_Left')) {
            console.log('THOU HAVE DIED IN ROW 5 TILE LEFT');   //debug message
            sendPlayerToStart(CONTEXT_AF.rigObject);            //send player to start pos
        }
        if (playerWithinDeadlyTile(CONTEXT_AF.rigObject, CONTEXT_AF.row5, '.Tile_Right')) {
            console.log('THOU HAVE DIED IN ROW 5 TILE RIGHT');   //debug message
            sendPlayerToStart(CONTEXT_AF.rigObject);            //send player to start pos
        }
        
    },

    //other possible functions
    //update:function() {oldData},            //IS NOT OF's update ... only called when a property in the schema changes
    //tick:function() {time, timeDelta},      //Is called every update
    //tock:function() {time, timeDelta},      //Is called immediately after tick
    //remove:function() {},                   //Deconstructor
    //pause:function() {},                    //Web pauses, this happens when you go to another tab
    //play:function() {},                     //Web plays, this happens when you return to the tab
    //updateSchema:function() {data},         //

});

//this function checks if player (rigEl) is within the bounds of a specific tile ('.Tile_Left' or '.Tile_Right') in a specific row (rowEl) 
function playerWithinDeadlyTile(rigEl, rowEl, tile) {
    //bools to determine if player is inside each bound
    let rightOfLeftEdge = false;
    let leftOfRightEdge = false;
    let bottomOfTopEdge = false;
    let topOfBottomEdge = false;

    //create a new vector in 000 world position that can be used to reference an objects relative position in worldspace
    let realWorldPosition = new THREE.Vector3();                 

    //check if player is within each bound (only if tile is not safe)
    if (rowEl.querySelector(tile).getAttribute('issafe') === 'false') {
        // CHECK PLAYER IS RIGHT OF THE LEFTMOST EDGE
        if (rigEl.object3D.position.x > rowEl.querySelector(tile).object3D.getWorldPosition(realWorldPosition).x - (rowEl.querySelector(tile).getAttribute('width') / 2.0)) {
            // console.log('rightOfLeftEdge = true');
            rightOfLeftEdge = true;
        }
        // CHECK PLAYER IS LEFT OF THE RIGHTMOST EDGE
        if (rigEl.object3D.position.x < rowEl.querySelector(tile).object3D.getWorldPosition(realWorldPosition).x + (rowEl.querySelector(tile).getAttribute('width') / 2.0)) {
            // console.log('leftOfRightEdge = true');
            leftOfRightEdge = true;
        }
        // CHECK PLAYER ENTERS TOP OF TILE
        if (rigEl.object3D.position.z > rowEl.querySelector(tile).object3D.getWorldPosition(realWorldPosition).z - (rowEl.querySelector(tile).getAttribute('depth') / 2.0)) {
            // console.log('bottomOfTopEdge = true');
            bottomOfTopEdge = true;
        }
        // CHECK PLAYER ENTERS BOTTOM OF TILE
        if (rigEl.object3D.position.z < rowEl.querySelector(tile).object3D.getWorldPosition(realWorldPosition).z + (rowEl.querySelector(tile).getAttribute('depth') / 2.0)) {
            // console.log('topOfBottomEdge = true');
            topOfBottomEdge = true;
        }
    }

    //if player is within all bounds return true
    if (rightOfLeftEdge === true && leftOfRightEdge === true && bottomOfTopEdge === true && topOfBottomEdge === true) {
        return true;
    } else {
        return false;
    }
}

//this function returns player to starting position
function sendPlayerToStart(rigEl) {
    //starting position="0 2.6 2"
    rigEl.object3D.position.set(0, 2.6, 2);
}