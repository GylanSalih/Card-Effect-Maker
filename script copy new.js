
//
//
// Holo script for movement and everything START
//
//

const initialStyles = new WeakMap();

function saveInitialStyles(card) {
  // Initialwerte sichern
  const computedStyle = window.getComputedStyle(card);
  
  initialStyles.set(card, {
    transform: computedStyle.transform || 'rotateX(0deg) rotateY(0deg) scale(1)',
    mx: computedStyle.getPropertyValue('--mx').trim() || '0%',
    my: computedStyle.getPropertyValue('--my').trim() || '0%',
    s: computedStyle.getPropertyValue('--s').trim() || '1',
    o: computedStyle.getPropertyValue('--o').trim() || '1',
    pos: computedStyle.getPropertyValue('--pos').trim() || '0% 0%',
    posx: computedStyle.getPropertyValue('--posx').trim() || '0%',
    posy: computedStyle.getPropertyValue('--posy').trim() || '0%',
    hyp: computedStyle.getPropertyValue('--hyp').trim() || '0',
    galaxybg: computedStyle.getPropertyValue('--galaxybg').trim() || 'initial',
  });
}


function OrientCard(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const mvX = e.clientX - centerX;
  const mvY = e.clientY - centerY;
  const maxTilt = 15;
  const Xdeg = clamp(-mvY / (rect.height / 2) * maxTilt, -maxTilt, maxTilt);
  const Ydeg = clamp(mvX / (rect.width / 2) * maxTilt, -maxTilt, maxTilt);

  gsap.to(card, {
    duration: 0.5,
    transform: `rotateX(${Xdeg}deg) rotateY(${Ydeg}deg) scale(1.05)`,
    "--mx": `${40 - (Ydeg * 2.5)}%`,
    "--my": `${5 + Xdeg / 2}%`,
    "--pos": `${Ydeg * 2.5}% ${Xdeg * 0.5}%`,
    "--posx": `${50 + Ydeg / 2 + Xdeg * 0.5}%`,
    "--posy": `${50 + Xdeg / 2 + Ydeg / 2}%`,
    "--hyp": `${Math.min(Math.max(Math.sqrt((mvX * mvX) + (mvY * mvY)) / 50, 0), 1)}`,
    ease: "power4.out",
    overwrite: true // Overwrite previous GSAP animations
  });
}

function handleMouseLeave(e) {
  const card = e.currentTarget;
  const initial = initialStyles.get(card);

  if (initial) {
    gsap.to(card, {
      duration: 0.5,
      transform: initial.transform,
      "--mx": initial.mx,
      "--my": initial.my,
      "--pos": initial.pos,
      "--posx": initial.posx,
      "--posy": initial.posy,
      "--hyp": initial.hyp,
      "--scale": initial.s,
      ease: "power4.inOut",
      overwrite: true // Overwrite previous GSAP animations
    });
  }
}

function clamp(value, min = -20, max = 20) {
  return Math.min(Math.max(value, min), max);
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
    document.getElementById('mouseMoveLabel').innerHTML = 'Phone move';
    window.addEventListener('deviceorientation', orientationhandler, false);
    window.addEventListener('MozOrientation', orientationhandler, false);
  } else {
    document.getElementById('mouseMoveLabel').innerHTML = 'Mouse move';
  }

  document.querySelectorAll(".card").forEach(card => {
    saveInitialStyles(card);
    card.addEventListener('mousemove', e => {
      document.querySelector('.PNL_Infos').innerHTML = `M.x:${e.clientX}px; M.y:${e.clientY}px;`;
      OrientCard(e);
    });
    card.addEventListener('mouseleave', handleMouseLeave);
  });
});

function orientationhandler(event) {
  const alpha = event.alpha; // Rotation um die Z-Achse (0–360 Grad)
  const beta = event.beta;   // Neigung um die X-Achse (-180 bis 180 Grad)
  const gamma = event.gamma; // Neigung um die Y-Achse (-90 bis 90 Grad)

  gsap.to(".card", {
    duration: 0.5,
    transform: `rotateX(${beta}deg) rotateY(${gamma}deg) rotateZ(${alpha}deg)`,
    ease: "power2.out",
    overwrite: true // Overwrite previous GSAP animations
  });
}




//
//
// Holo script for movement and everything ENDE
//
//




































//
//
// FILTER JAVASCRIPT START
//
//

// Filter for PNL_ChooseCard -> Change all cards to X Image
// Update the image source for all cards based on input value
function changeCard(e) {
  var cards = document.querySelectorAll(".card img");
  Array.from(cards).forEach(card => {
    card.setAttribute('src', e.value);
  });
}

// Filter for PNL_options -> Which Holo do you want?
// Update the Holographic source for all cards based on input value
function adaptCardType(e) {
  var cards = document.getElementsByClassName("card");
  Array.from(cards).forEach(card => {
    card.setAttribute('data-rarity', e.value);
  });
}


// Filter for Sort by
document.addEventListener("DOMContentLoaded", function() {
  const categoryFilter = document.getElementById('category-filter');
  const cardGrid = document.querySelector('.card-grid');

  categoryFilter.addEventListener('change', function() {
      const selectedCategory = categoryFilter.value;
      filterCards(selectedCategory);
  });

  function filterCards(category) {
      const cards = Array.from(cardGrid.querySelectorAll('.holographic__section'));

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


// Filter for Grid-Layout Changer

document.addEventListener("DOMContentLoaded", function() {
  // Get references to the buttons
  const grid1Button = document.querySelector("button img[alt='Grid 1']").parentElement;
  const grid2Button = document.querySelector("button img[alt='Grid 2']").parentElement;
  const barsButton = document.querySelector("button img[alt='Grid 3']").parentElement;

  // Get reference to the card grid
  const cardGrid = document.querySelector(".card-grid");

  // Set initial layout and active button
  changeGridLayout(1); // Set layout-3 as the initial layout

  // Add event listeners to the buttons
  grid1Button.addEventListener("click", () => changeGridLayout(1));
  grid2Button.addEventListener("click", () => changeGridLayout(2));
  barsButton.addEventListener("click", () => changeGridLayout(3));

  // Function to change grid layout
  function changeGridLayout(layout) {
    cardGrid.classList.remove("layout-1", "layout-2", "layout-3");
    grid1Button.classList.remove("active");
    grid2Button.classList.remove("active");
    barsButton.classList.remove("active");

    switch(layout) {
      case 1:
        cardGrid.classList.add("layout-1");
        grid1Button.classList.add("active");
        break;
      case 2:
        cardGrid.classList.add("layout-2");
        grid2Button.classList.add("active");
        break;
      case 3:
        cardGrid.classList.add("layout-3");
        barsButton.classList.add("active");
        break;
    }
  }
});


//
//
// FILTER JAVASCRIPT ENDE
//
//