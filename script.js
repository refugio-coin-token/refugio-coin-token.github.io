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
// MOTOR DEL CARRUSEL (Guía de compra Paso a Paso con Soporte Táctil)
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

  // ==========================================================================
  // DETECCIÓN DE GESTOS TÁCTILES (SWIPE) PARA MÓVILES
  // ==========================================================================
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50; // Distancia mínima en píxeles para deslizar
    if (touchStartX - touchEndX > swipeThreshold) {
      // Deslizar hacia la izquierda -> Siguiente diapositiva
      if (currentIndex < slides.length - 1) {
        moveToSlide(currentIndex + 1);
      }
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Deslizar hacia la derecha -> Diapositiva anterior
      if (currentIndex > 0) {
        moveToSlide(currentIndex - 1);
      }
    }
  };

  // Inicializar estado de botones
  updateButtonsState();
});
// ==========================================================================
// MÓDULO DE HOLDERS (Covalent API - A PRUEBA DE FALLOS)
// ==========================================================================
async function fetchHoldersCount() {
  const contractAddress = "0xaA56277974856D221393EB9783dd0b07af7de4d1";
  
  // OJO: Si aún no tienes tu API Key, déjalo vacío o pon algo temporal. 
  // El código ahora detectará si falla y pondrá un botón por defecto.
  const apiKey = "TU_API_KEY_DE_COVALENT_AQUI"; 
  const url = `https://api.covalenthq.com/v1/56/tokens/${contractAddress}/token_holders_v2/?key=${apiKey}&page-size=1`;

  const holdersElement = document.getElementById("holders-data");

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("API Key inválida o límite excedido");
    
    const data = await response.json();

    if (data?.data?.pagination?.total_count !== undefined) {
      const totalHolders = data.data.pagination.total_count;
      holdersElement.innerText = totalHolders.toLocaleString();
    } else {
      throw new Error("Datos no encontrados");
    }
  } catch (error) {
    console.warn("Aviso de Holders:", error.message);
    // FALLBACK: Si no hay API o falla, quita el "Cargando..." y muestra esto:
    holdersElement.innerHTML = `<span style="font-size: 1.5rem; color: #9aa0b0;">Datos en BscScan</span>`;
  }
}

// ==========================================================================
// MÓDULO DE ACTIVIDAD DE LA RED (TRANSACCIONES DEX - A PRUEBA DE FALLOS)
// ==========================================================================
async function fetchNetworkActivity() {
  const contractAddress = "0xaA56277974856D221393EB9783dd0b07af7de4d1";
  const txBody = document.getElementById("tx-body");
  
  try {
    const poolResponse = await fetch(`https://api.geckoterminal.com/api/v2/networks/bsc/tokens/${contractAddress}`);
    if (!poolResponse.ok) throw new Error("Token no indexado aún en GeckoTerminal");
    
    const poolData = await poolResponse.json();
    
    // VALIDACIÓN CLAVE: Verificamos que realmente exista un pool de liquidez
    const pools = poolData?.data?.relationships?.top_pools?.data;
    
    if (pools && pools.length > 0) {
      const poolAddress = pools[0].id.split('_')[1];
      
      const tradesResponse = await fetch(`https://api.geckoterminal.com/api/v2/networks/bsc/pools/${poolAddress}/trades`);
      if (!tradesResponse.ok) throw new Error("No hay trades indexados");
      
      const tradesData = await tradesResponse.json();
      const trades = tradesData?.data;
      
      txBody.innerHTML = ""; 
      
      if (trades && trades.length > 0) {
        const recentTrades = trades.slice(0, 5);
        
        recentTrades.forEach(trade => {
          const attributes = trade.attributes;
          const isBuy = attributes.kind === "buy";
          const typeClass = isBuy ? "tx-buy" : "tx-sell";
          const typeText = isBuy ? "🟢 Compra" : "🔴 Venta";
          
          const priceUsd = parseFloat(attributes.price_to_in_usd).toFixed(6);
          const amountToken = parseFloat(attributes.to_token_amount).toLocaleString(undefined, {maximumFractionDigits: 0});
          const totalUsd = parseFloat(attributes.volume_in_usd).toFixed(2);
          
          const date = new Date(attributes.block_timestamp * 1000);
          const timeString = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td><span class="tx-type ${typeClass}">${typeText}</span></td>
            <td>$${priceUsd}</td>
            <td>${amountToken} $RFG</td>
            <td>$${totalUsd}</td>
            <td>${timeString}</td>
          `;
          txBody.appendChild(tr);
        });
      } else {
        throw new Error("No hay transacciones recientes");
      }
    } else {
      throw new Error("Sin pool de liquidez activo");
    }
  } catch (error) {
    console.warn("Aviso de Transacciones:", error.message);
    // FALLBACK: Si no hay transacciones o el token es muy nuevo, muestra este mensaje amigable
    txBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding: 2rem; color: #9aa0b0;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">⏳</div>
          Esperando indexación de liquidez en DEX...
        </td>
      </tr>`;
  }
}

// Ejecutar las funciones al cargar la página de forma segura
document.addEventListener("DOMContentLoaded", () => {
  fetchHoldersCount();
  setTimeout(fetchNetworkActivity, 1000);
});
