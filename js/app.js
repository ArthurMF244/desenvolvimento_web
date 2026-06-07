function carregarScriptCompartilhado(src) {
  return new Promise((resolve, reject) => {
    const existente = document.querySelector(`script[src="${src}"]`);

    if (existente) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function carregarDependenciasCompartilhadas(callback) {
  carregarScriptCompartilhado("js/data.js")
    .then(() => carregarScriptCompartilhado("js/sidebar.js"))
    .then(callback)
    .catch((error) => {
      console.error("Não foi possível carregar os scripts compartilhados.", error);
    });
}
