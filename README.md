# Rain-Simulation
A fun little project I made to simulate 2D rainfall.

Somethings I would change to make this better are:
  • Use a double ended queue (deque) for my water algorithm
      Didn't feel it was neccessary for the small grid size, but it would make it more optimized
  • Prettier graphics
      I handmade all the walls, rain and such in paint, didn't spend too much time on the vizuals. Same goes for the CSS on the page.
  • Optimize queue 
      The queue can get backlogged, currently if a tile is still checking if it's going to spill out of bounds, it just appends itself back into the queue.
      This means that both the water filling up and spilling runs in one BFS queue, which is overly complicated because of that. I would break it up into smaller,
      easier to manage pieces.
      
