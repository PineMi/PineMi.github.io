
//* Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

// Orb-related code
const orbs = document.querySelectorAll('.orb'); // Select all orbs
const orb_container = document.getElementById('orb-container'); // Select container element
const border = document.getElementById('orb-border-container') 

const spacing = 20; // Spacing between orbs
const wanderInterval = 3000; // Interval for wandering behavior (milliseconds)
const wanderDistance = 90; // Maximum distance for wandering (pixels)

let isOrganized = false; // Flag to track if orbs are organized
let wanderIntervalId; // Interval ID for wandering behavior
let lockOrbs = false;

// Function to randomize orb positions
function randomizeOrbs() {
orbs.forEach((orb) => {
  // Calculate random positions within the container
  const randomX = Math.random() * (orb_container.offsetWidth - orb.offsetWidth);
  const randomY = Math.random() * (orb_container.offsetHeight - orb.offsetHeight);
  
  // Set orb positions with transitions
  orb.style.transition = `left ${wanderInterval}ms, top ${wanderInterval}ms`;
  orb.style.left = randomX + 'px';
  orb.style.top = randomY + 'px';
});

clearInterval(wanderIntervalId); // Stop wandering when randomizing
startWandering(); // Start wandering again after randomizing
}


// Function to organize orbs into rows and columns
function organizeOrbs() {
  const orbWidth = orbs[0].offsetWidth;
  const orbHeight = orbs[0].offsetHeight;
  const containerWidth = orb_container.offsetWidth;
  let columns = Math.floor(containerWidth / (orbWidth + spacing));
  let currentColumn = 0;
  let currentRow = 0;

  orbs.forEach((orb, index) => {
    console.log(orb.children[1])
    
    orb.children[1].classList.remove("fadeOut")
    orb.children[1].classList.add("fadeIn")
    orb.children[1].style = "opacity: 1;"
    
    // Calculate positions for each orb in a grid pattern
    orb.style.transition = `left ${wanderInterval}ms, top ${wanderInterval}ms`;
    orb.style.left = currentColumn * (orbWidth + spacing) + 'px';
    orb.style.top = currentRow * (orbHeight + spacing) + 'px';

    currentColumn++;
    if (currentColumn >= columns) {
      currentColumn = 0;
      currentRow++;
    }

  });

  isOrganized = true; // Set flag to indicate orbs are organized
  clearInterval(wanderIntervalId); // Stop wandering when organized
}


// Function for orb wandering behavior
function wanderOrbs() {
  orbs.forEach((orb) => {
    
    // Calculate new positions within the container with random deltas
    const currentX = parseFloat(orb.style.left);
    const currentY = parseFloat(orb.style.top);
    const deltaX = Math.random() * wanderDistance * 2 - wanderDistance;
    const deltaY = Math.random() * wanderDistance * 2 - wanderDistance;
    const newX = Math.min(Math.max(currentX + deltaX, 0), orb_container.offsetWidth - orb.offsetWidth);
    const newY = Math.min(Math.max(currentY + deltaY, 0), orb_container.offsetHeight - orb.offsetHeight);
    
    // Update orb positions
    orb.style.left = newX + 'px';
    orb.style.top = newY + 'px';
  });
}

// Function to start wandering behavior
function startWandering() {
  if (!isOrganized) {
    wanderIntervalId = setInterval(wanderOrbs, wanderInterval); // Start wandering if not organized
  }
}

// Initial random positioning of orbs
randomizeOrbs();

// Event listener to organize orbs on container hover
orb_container.addEventListener('mouseenter', organizeOrbs);

// Event listener to lock orbs
orb_container.addEventListener('click', ()=>{
  if (isOrganized && !lockOrbs){
    lockOrbs = true;
    border.style.border = "5px solid #151515"
  } else if (isOrganized && lockOrbs){
    lockOrbs = false;
    border.style.border = "5px solid #15151500"
  }
});


// Event listener to randomize orbs again when leaving container
orb_container.addEventListener('mouseleave', () => {

  if(!lockOrbs) {
    orbs.forEach((orb) => {
      orb.children[1].classList.remove("fadeIn")
      orb.children[1].classList.add("fadeOut")
      orb.children[1].style = "opacity: 0;"
    })
    randomizeOrbs();
    isOrganized = false; // Reset organized flag
    startWandering(); // Start wandering behavior
  }

  });
