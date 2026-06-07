function iniciarRelatorios() {
  const listaRelatorios = document.getElementById("listaRelatorios");
  const chamados = getChamados();
  const areas = [...new Set(chamados.map((chamado) => chamado.areaResponsavel))].sort();

  listaRelatorios.innerHTML = areas.map((area) => {
    const chamadosArea = chamados.filter((chamado) => chamado.areaResponsavel === area);
    const finalizados = chamadosArea.filter((chamado) => chamado.status === "Finalizado").length;
    const emAndamento = chamadosArea.length - finalizados;

    return `
      <tr>
        <td><strong>${area}</strong></td>
        <td>${chamadosArea.length}</td>
        <td>${emAndamento}</td>
        <td>${finalizados}</td>
      </tr>
    `;
  }).join("");
}

carregarDependenciasCompartilhadas(iniciarRelatorios);
