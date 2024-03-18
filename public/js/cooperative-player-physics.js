'use strict'

// Player Teleportation To Object------------------------------------------------------------
AFRAME.registerComponent('custom-player-physics', {
    
    init: function() {
        //must be const or the event listener later in the code won't be able to reference the variable
        const CONTEXT_AF = this;                                            //this refers to the component, not the element that the component is attached to
        CONTEXT_AF.rigObject = document.querySelector('#ID_Rig');           //query the ID_Rig element and use CONTEXT_AF.rigObject to reference it
    },

    tick: function(time, timeDelta) {      
        const CONTEXT_AF = this;                                            //this refers to the component, not the element that the component is attached to
        CONTEXT_AF.rigObject = document.querySelector('#ID_Rig');           //query the ID_Rig element and use CONTEXT_AF.rigObject to reference it
        
        // CHECK PLAYER -X POSITION
        if (CONTEXT_AF.rigObject.object3D.position.x < 14) {
            CONTEXT_AF.rigObject.object3D.position.set(14, CONTEXT_AF.rigObject.object3D.position.y, CONTEXT_AF.rigObject.object3D.position.z);
        }
        // CHECK PLAYER +X POSITION
        if (CONTEXT_AF.rigObject.object3D.position.x > 17) {
            CONTEXT_AF.rigObject.object3D.position.set(17, CONTEXT_AF.rigObject.object3D.position.y, CONTEXT_AF.rigObject.object3D.position.z);
        }
        // CHECK PLAYER -Z POSITION
        if (CONTEXT_AF.rigObject.object3D.position.z < -65) {
            CONTEXT_AF.rigObject.object3D.position.set(CONTEXT_AF.rigObject.object3D.position.x, CONTEXT_AF.rigObject.object3D.position.y, -65);
        }
        // CHECK PLAYER +Z POSITION
        if (CONTEXT_AF.rigObject.object3D.position.z > 5) {
            CONTEXT_AF.rigObject.object3D.position.set(CONTEXT_AF.rigObject.object3D.position.x, CONTEXT_AF.rigObject.object3D.position.y, 5);
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