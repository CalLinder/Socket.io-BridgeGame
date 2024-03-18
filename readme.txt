Cal Linder (101 208 861)

Overview of what you did (i.e. what are the controls? Why this design?)

To control the character you use the WASD controls on your keyboard and drag your cursor on the screen.
I recreated the Bridge Game from Netflix's Squid Game.
The game works by presenting players with a series of 50/50 odds.
The only way to win and get to the far end is to correctly guess every 50/50 in a row.
By pressing a button in the room, competetive players can randomize the layout of the safe and dangerous tiles.
Competetive players are all trying to be the first to get to the far end.
Cooperative players watch from the sidelines but are able to see which tiles and safe and which are not.
The goal of the cooperative players is to assist the competetive players is getting to the far end.

What was challenging.

I originally wanted to use a navmesh and for the scene to be themed more appropriately to match Squid Game.
Unfortunately my family experienced a severe shock when my Aunt passed away last weekend.
As such, I had to stop all development and when I was able to return, was ultimately unable to complete the original scope without jepordizing other project deadlines.
I did try to get a navmesh working once I returned, but I was ultimately unable to.
Because of the time constraints, I decided to streamline the creation process and only use primitive shapes instead of original models.

What went well (i.e. how did you solve the above challenges?).

I'm satisfied with how I ultimately chose to represent the player models to other connected players.
I used primitives for both the torso, face, head, and arms.
The server uses the x and z rotation of the camera to rotate the head primitive for players to match where they are looking.
A parent element of the entire model then uses the rotation of the cameras y axis for body rotation.
When players join the server, a new element is created for every connected player that uses the new players unique server ID as the element ID.
All model primitives are then appended to that element.

GitHub: 