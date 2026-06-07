function iniciarAtribuidos() {
  const listaAtribuidos = document.getElementById("listaAtribuidos");
  const emptyState = document.getElementById("emptyState");
  const perfil = buscarPerfilSalvo();

  function abrirTelaChamado(id) {
    window.location.href = `chamado.html?id=${id}`;
  }

  function renderizarAtribuidos() {
    const chamados = getChamados().filter((chamado) => chamado.responsavel === perfil.nome);

    listaAtribuidos.innerHTML = chamados.map((chamado) => `
      <tr class="clickable-row" tabindex="0" onclick="abrirTelaChamado(${chamado.id})">
        <td><strong>#${chamado.id}</strong></td>
        <td><strong class="called-title">${chamado.titulo}</strong></td>
        <td><span class="badge ${statusClasse(chamado.status)}">${chamado.status}</span></td>
        <td><span class="badge ${prioridadeClasse(chamado.prioridade)}">${chamado.prioridade}</span></td>
        <td>${chamado.solicitante}</td>
        <td>${chamado.areaResponsavel}</td>
      </tr>
    `).join("");

    emptyState.style.display = chamados.length ? "none" : "block";
  }

  window.abrirTelaChamado = abrirTelaChamado;
  renderizarAtribuidos();
}

carregarDependenciasCompartilhadas(iniciarAtribuidos);
