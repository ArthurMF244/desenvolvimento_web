function iniciarIndicadores() {
  const cardsIndicadores = document.getElementById("cardsIndicadores");
  const indicadoresArea = document.getElementById("indicadoresArea");
  const chamados = getChamados();
  const total = chamados.length;
  const emAndamento = chamados.filter((chamado) => chamado.status !== "Finalizado").length;
  const finalizados = chamados.filter((chamado) => chamado.status === "Finalizado").length;
  const altaPrioridade = chamados.filter((chamado) => ["Alta", "Crítica"].includes(chamado.prioridade)).length;

  const cards = [
    ["Total", total],
    ["Em andamento", emAndamento],
    ["Finalizados", finalizados],
    ["Alta prioridade", altaPrioridade]
  ];

  cardsIndicadores.innerHTML = cards.map(([label, value]) => `
    <article class="indicator-card">
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `).join("");

  const porArea = chamados.reduce((acc, chamado) => {
    acc[chamado.areaResponsavel] = (acc[chamado.areaResponsavel] || 0) + 1;
    return acc;
  }, {});

  indicadoresArea.innerHTML = Object.entries(porArea).map(([area, quantidade]) => `
    <div class="area-row">
      <div>
        <strong>${area}</strong>
        <span>${quantidade} chamado(s)</span>
      </div>

      <span class="badge media">${quantidade}</span>
    </div>
  `).join("");
}

carregarDependenciasCompartilhadas(iniciarIndicadores);
