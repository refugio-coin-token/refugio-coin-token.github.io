// ==========================================================================
// FUNCIÓN PARA COPIAR EL CONTRATO OFICIAL
// ==========================================================================
function copyContract() {
  const contractText = document.getElementById("contract-address").innerText;
  
  navigator.clipboard.writeText(contractText).then(() => {
    const btnCopy = document.getElementById("btn-copy");
    
    // Feedback visual moderno en el botón
    btnCopy.innerText = "✓ ¡Copiado!";
    btnCopy.style.background = "#00ff66";
    btnCopy.style.color = "#000";
    
    setTimeout(() => {
      btnCopy.innerText = "📋 Copiar";
      btnCopy.style.background = "#d4af37";
      btnCopy.style.color = "#000";
    }, 2000);
  }).catch(err => {
    console.error("Error al intentar copiar el contrato: ", err);
  });
}

// ==========================================================================
// MOTOR DEL CARRUSEL (Guía de compra Paso a Paso)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carouselTrack");
  const slides = Array.from(track.children);
  const nextButton = document.getElementById("nextBtn");
  const prevButton = document.getElementById("prevBtn");
  const dotsContainer = document.getElementById("carouselDots");
  
  let currentIndex = 0;

  // Generar indicadores de puntos (dots) automáticamente
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.classList.add("carousel-dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => moveToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  // Moverse al slide correspondiente
  const moveToSlide = (index) => {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots[currentIndex].classList.remove("active");
    dots[index].classList.add("active");
    currentIndex = index;
    updateButtonsState();
  };

  // Deshabilitar botones si se llega a los límites
  const updateButtonsState = () => {
    if (currentIndex === 0) {
      prevButton.style.opacity = "0.3";
      prevButton.style.pointerEvents = "none";
    } else {
      prevButton.style.opacity = "1";
      prevButton.style.pointerEvents = "auto";
    }

    if (currentIndex === slides.length - 1) {
      nextButton.style.opacity = "0.3";
      nextButton.style.pointerEvents = "none";
    } else {
      nextButton.style.opacity = "1";
      nextButton.style.pointerEvents = "auto";
    }
  };

  // Event Listeners para los botones Anterior / Siguiente
  nextButton.addEventListener("click", () => {
    if (currentIndex < slides.length - 1) {
      moveToSlide(currentIndex + 1);
    }
  });

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      moveToSlide(currentIndex - 1);
    }
  });

  // Inicializar estado de botones
  updateButtonsState();
});
