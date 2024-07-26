

// Flag to control auto-rotation of cards
var MvAuto = false;

// Store the initial styles of each card for later restoration
const initialStyles = new WeakMap();

// Speichern der anfänglichen Stile eines Cards
function saveInitialStyles(card) {
  initialStyles.set(card, {
    transform: card.style.transform,
    mx: card.style.getPropertyValue('--mx'),
    my: card.style.getPropertyValue('--my'),
    tx: card.style.getPropertyValue('--tx'),
    ty: card.style.getPropertyValue('--ty'),
    s: card.style.getPropertyValue('--s'),
    o: card.style.getPropertyValue('--o'),
    rx: card.style.getPropertyValue('--rx'),
    ry: card.style.getPropertyValue('--ry'),
    pos: card.style.getPropertyValue('--pos'),
    posx: card.style.getPropertyValue('--posx'),
    posy: card.style.getPropertyValue('--posy'),
    hyp: card.style.getPropertyValue('--hyp'),
    galaxybg: card.style.getPropertyValue('--galaxybg'),
    pointerX: card.style.getPropertyValue('--pointer-x'),
    pointerY: card.style.getPropertyValue('--pointer-y'),
    cardScale: card.style.getPropertyValue('--card-scale'),
    cardOpacity: card.style.getPropertyValue('--card-opacity'),
  });
}


// Wiederherstellen der anfänglichen Stile eines Cards
function restoreInitialStyles(card) {
  const styles = initialStyles.get(card);
  if (styles) {
    card.style.transform = styles.transform;
    card.style.setProperty('--mx', styles.mx);
    card.style.setProperty('--my', styles.my);
    card.style.setProperty('--tx', styles.tx);
    card.style.setProperty('--ty', styles.ty);
    card.style.setProperty('--s', styles.s);
    card.style.setProperty('--o', styles.o);
    card.style.setProperty('--rx', styles.rx);
    card.style.setProperty('--ry', styles.ry);
    card.style.setProperty('--pos', styles.pos);
    card.style.setProperty('--posx', styles.posx);
    card.style.setProperty('--posy', styles.posy);
    card.style.setProperty('--hyp', styles.hyp);
    card.style.setProperty('--galaxybg', styles.galaxybg);
    card.style.setProperty('--pointer-x', styles.pointerX);
    card.style.setProperty('--pointer-y', styles.pointerY);
    card.style.setProperty('--card-scale', styles.cardScale);
    card.style.setProperty('--card-opacity', styles.cardOpacity);
  }
}








/* 
OrientCard Funktion: Diese Funktion wird aufgerufen, wenn sich die Maus über einer Karte bewegt.
Sie berechnet die Neigung und Position der Karte basierend auf der Mausposition und wendet entsprechende Transformationen und Stile an.
*/

// Handle card movement based on mouse movement
function OrientCard(e) {
  const card = e.currentTarget;
  
  // Get the card's center coordinates
  const rect = card.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const mvX = e.clientX - centerX;
  const mvY = e.clientY - centerY;

  // Define the max tilt
  const maxTilt = 15; // The maximum tilt angle in degrees

  // Calculate tilt angles
  const Xdeg = Math.min(Math.max(-mvY / (rect.height / 2) * maxTilt, -maxTilt), maxTilt);
  const Ydeg = Math.min(Math.max(mvX / (rect.width / 2) * maxTilt, -maxTilt), maxTilt);

  // Apply transformations
  card.style.transform = `rotateX(${Xdeg}deg) rotateY(${Ydeg}deg) scale(var(--scale, 1))`;
  
  // Set additional CSS custom properties for smoother effects
  card.style.setProperty('--mx', `${40 - (Ydeg * 2.5)}%`);
  card.style.setProperty('--my', `${5 + Xdeg / 2}%`);
  card.style.setProperty('--tx', `${Ydeg}px`);
  card.style.setProperty('--ty', `${Xdeg / 2}px`); // Adjusted for smoother vertical movement
  card.style.setProperty('--pos', `${Ydeg * 2.5}% ${Xdeg * 0.5}%`);
  card.style.setProperty('--posx', `${50 + Ydeg / 2 + Xdeg * 0.5}%`);
  card.style.setProperty('--posy', `${50 + Xdeg / 2 + Ydeg / 2}%`);
  
  // Calculate the hypotenuse distance for the card effect
  const hyp = Math.sqrt((mvX * mvX) + (mvY * mvY)) / 50;
  card.style.setProperty('--hyp', `${Math.min(Math.max(hyp, 0), 1)}`);
  
  card.style.setProperty('--scale', '1.05'); // Scale up on hover
}

// Function to constrain values between a minimum and maximum
function clamp(value, min = -20, max = 20) {
  return Math.min(Math.max(value, min), max);
}








// Restore the initial styles when the mouse leaves a card // Back to Position after leaving the Card by Hover
/* 
handleMouseLeave Funktion: Diese Funktion wird aufgerufen, wenn der Mauszeiger eine Karte verlässt.
Sie stellt die anfänglichen Stile der Karte wieder her, was bedeutet, dass alle Transformationen und Stiländerungen, 
die durch OrientCard vorgenommen wurden, zurückgesetzt werden.
*/

function handleMouseLeave(e) {
  const card = e.currentTarget;
  restoreInitialStyles(card);
}

// Add event listeners to cards for mouse movements and leave events
document.querySelectorAll(".card").forEach(card => {
  saveInitialStyles(card);
  card.addEventListener('mousemove', OrientCard);
  card.addEventListener('mouseleave', handleMouseLeave);
});








// 2 List options js script PNL_options & PNL_ChooseCard

// Update the image source for all cards based on input value
function changeCard(e) {
  var cards = document.querySelectorAll(".card__front img");
  Array.from(cards).forEach(card => {
    card.setAttribute('src', e.value);
  });
}

// Update the Holographic source for all cards based on input value
function adaptCardType(e) {
  var cards = document.getElementsByClassName("card");
  Array.from(cards).forEach(card => {
    card.setAttribute('data-rarity', e.value);
  });
}















// Handle device orientation events for mobile devices
document.addEventListener("DOMContentLoaded", (event) => {
  if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
    document.getElementById('mouseMoveLabel').innerHTML = 'Phone move';
    window.addEventListener('deviceorientation', orientationhandler, false);
    window.addEventListener('MozOrientation', orientationhandler, false);
  } else {
    document.getElementById('mouseMoveLabel').innerHTML = 'Mouse move';
  }

  // Update the panel information and apply card orientation on mouse move
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener('mousemove', e => {
      document.getElementsByClassName('PNL_Infos')[0].innerHTML = `M.x:${e.clientX}px;M.y:${e.clientY}px`;
      OrientCard(e);
    });
  });

  setTimeout(function() {
    rotate();
  }, 40);
});







// toolbar
document.addEventListener("DOMContentLoaded", function() {
  const categoryFilter = document.getElementById('category-filter');
  const cardGrid = document.querySelector('.card-grid');

  categoryFilter.addEventListener('change', function() {
      const selectedCategory = categoryFilter.value;
      filterCards(selectedCategory);
  });

  function filterCards(category) {
      const cards = Array.from(cardGrid.querySelectorAll('.showcase2'));

      cards.forEach(card => {
          const cardCategory = card.querySelector('.card').getAttribute('data-category');
          if (category === 'all' || cardCategory === category) {
              card.style.display = '';
          } else {
              card.style.display = 'none';
          }
      });
  }
});





// Get elements
const openPanel = document.getElementById('open-panel');
const closePanel = document.getElementById('close-panel');
const sidePanel = document.getElementById('side-panel');

// Function to open the side panel
function openSidePanel() {
    sidePanel.classList.add('open');
}

// Function to close the side panel
function closeSidePanel() {
    sidePanel.classList.remove('open');
}

// Event listeners for opening and closing the panel
openPanel.addEventListener('click', openSidePanel);
closePanel.addEventListener('click', closeSidePanel);

