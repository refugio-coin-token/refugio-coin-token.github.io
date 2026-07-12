function copyContract() {
  // Obtener el texto del contrato
  const contractText = document.getElementById("contract-address").innerText;
  
  // Utilizar la API del portapapeles para copiarlo
  navigator.clipboard.writeText(contractText).then(() => {
    const btnCopy = document.getElementById("btn-copy");
    
    // Cambiar temporalmente el estado del botón
    btnCopy.innerText = "✓ ¡Copiado!";
    btnCopy.style.background = "#28a745";
    btnCopy.style.color = "#fff";
    btnCopy.style.borderColor = "#28a745";
    
    // Devolver el botón a su diseño original después de 2 segundos
    setTimeout(() => {
      btnCopy.innerText = "📋 Copiar";
      btnCopy.style.background = "#262626";
      btnCopy.style.color = "#fff";
      btnCopy.style.borderColor = "#444";
    }, 2000);
  }).catch(err => {
    console.error("Error al intentar copiar el contrato: ", err);
  });
}
