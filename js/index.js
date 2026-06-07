function iniciarIndex() {
  let chamados = getChamados();

  const el = (id) => document.getElementById(id);

  const listaChamados = el("listaChamados");
  const emptyState = el("emptyState");

  const filtroTexto = el("filtroTexto");
  const filtroStatus = el("filtroStatus");
  const filtroArea = el("filtroArea");
  const filtroPrioridade = el("filtroPrioridade");

  const modalFiltros = el("modalFiltros");
  const btnFiltros = el("btnFiltros");
  const btnFecharModalFiltros = el("btnFecharModalFiltros");
  const btnBuscarFiltros = el("btnBuscarFiltros");
  const btnLimparFiltros = el("btnLimparFiltros");

  const modalChamado = el("modalChamado");
  const formChamado = el("formChamado");
  const solicitante = el("solicitante");
  const responsavel = el("responsavel");
  const areaSolicitante = el("areaSolicitante");

  function chamadosFiltrados() {
    const texto = normalizar(filtroTexto.value);
    const status = filtroStatus.value;
    const area = filtroArea.value;
    const prioridade = filtroPrioridade.value;

    return chamados.filter((chamado) => {
      const conteudoBusca = normalizar(`
        ${chamado.id}
        ${chamado.titulo}
        ${chamado.status}
        ${chamado.prioridade}
        ${chamado.abertura}
        ${chamado.solicitante}
        ${chamado.responsavel || ""}
        ${chamado.areaSolicitante}
        ${chamado.areaResponsavel}
        ${chamado.categoria}
        ${chamado.descricao}
      `);

      const combinaTexto = !texto || conteudoBusca.includes(texto);
      const combinaStatus = !status || chamado.status === status;
      const combinaArea = !area || chamado.areaResponsavel === area;
      const combinaPrioridade = !prioridade || chamado.prioridade === prioridade;

      return combinaTexto && combinaStatus && combinaArea && combinaPrioridade;
    });
  }

  function atualizarKpis() {
    const emAtendimento = chamados.filter((chamado) => chamado.status !== "Finalizado");
    const finalizados = chamados.filter((chamado) => chamado.status === "Finalizado");

    el("kpiAbertos").textContent = chamados.length;
    el("kpiAtendimento").textContent = emAtendimento.length;
    el("kpiFinalizados").textContent = finalizados.length;
  }

  function renderizarChamados() {
    chamados = getChamados();

    const dados = chamadosFiltrados();

    listaChamados.innerHTML = dados.map((chamado) => `
      <tr
        class="clickable-row"
        tabindex="0"
        onclick="abrirTelaChamado(${chamado.id})"
        onkeydown="abrirTelaChamadoPeloTeclado(event, ${chamado.id})"
      >
        <td><strong>#${chamado.id}</strong></td>
        <td><strong class="called-title">${chamado.titulo}</strong></td>
        <td><span class="badge ${statusClasse(chamado.status)}">${chamado.status}</span></td>
        <td><span class="badge ${prioridadeClasse(chamado.prioridade)}">${chamado.prioridade}</span></td>
        <td>${chamado.abertura}</td>
        <td>${chamado.solicitante}</td>
        <td>${chamado.responsavel || ""}</td>
        <td>${chamado.areaSolicitante}</td>
        <td>${chamado.areaResponsavel}</td>
      </tr>
    `).join("");

    emptyState.style.display = dados.length ? "none" : "block";

    atualizarKpis();
  }

  function abrirTelaChamado(id) {
    window.location.href = `chamado.html?id=${id}`;
  }

  function abrirTelaChamadoPeloTeclado(event, id) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      abrirTelaChamado(id);
    }
  }

  function abrirModalFiltros() {
    modalFiltros.classList.add("open");
    modalFiltros.setAttribute("aria-hidden", "false");
    filtroTexto.focus();
  }

  function fecharModalFiltros() {
    modalFiltros.classList.remove("open");
    modalFiltros.setAttribute("aria-hidden", "true");
  }

  function limparFiltros() {
    filtroTexto.value = "";
    filtroStatus.value = "";
    filtroArea.value = "";
    filtroPrioridade.value = "";

    renderizarChamados();
    fecharModalFiltros();
    mostrarToast("Filtros limpos com sucesso.");
  }

  function buscarComFiltros() {
    renderizarChamados();
    fecharModalFiltros();
  }

  function abrirModalChamado() {
    popularSelectUsuarios(solicitante, {
      incluirVazio: true,
      textoVazio: "Selecione"
    });

    popularSelectUsuarios(responsavel, {
      incluirVazio: true,
      textoVazio: "Sem responsável"
    });

    modalChamado.classList.add("open");
    modalChamado.setAttribute("aria-hidden", "false");
    el("titulo").focus();
  }

  function fecharModalChamado() {
    modalChamado.classList.remove("open");
    modalChamado.setAttribute("aria-hidden", "true");
    formChamado.reset();
  }

  function criarChamadoPeloFormulario() {
    return criarChamado({
      titulo: el("titulo").value.trim(),
      solicitante: solicitante.value,
      responsavel: responsavel.value,
      areaSolicitante: areaSolicitante.value,
      areaResponsavel: el("areaResponsavel").value,
      categoria: el("categoria").value,
      prioridade: el("prioridade").value,
      impacto: el("impacto").value,
      status: "Novo",
      descricao: el("descricao").value.trim(),
      abertura: dataAtualFormatada(),
      historico: [
        `Chamado cadastrado por ${solicitante.value} em ${new Date().toLocaleString("pt-BR")}.`,
        `Encaminhado para ${el("areaResponsavel").value}.`
      ]
    });
  }

  formChamado.addEventListener("submit", (event) => {
    event.preventDefault();

    const novoChamado = criarChamadoPeloFormulario();

    chamados = getChamados();
    renderizarChamados();
    fecharModalChamado();

    mostrarToast(`Chamado #${novoChamado.id} cadastrado com sucesso.`);
  });

  btnFiltros.addEventListener("click", abrirModalFiltros);
  btnFecharModalFiltros.addEventListener("click", fecharModalFiltros);
  btnBuscarFiltros.addEventListener("click", buscarComFiltros);
  btnLimparFiltros.addEventListener("click", limparFiltros);

  el("btnNovoChamado").addEventListener("click", abrirModalChamado);
  el("btnFecharModal").addEventListener("click", fecharModalChamado);
  el("btnCancelar").addEventListener("click", fecharModalChamado);

  solicitante.addEventListener("change", () => {
    const usuario = getUsuarioPorNome(solicitante.value);

    if (usuario && Array.from(areaSolicitante.options).some((option) => option.value === usuario.setor)) {
      areaSolicitante.value = usuario.setor;
    }
  });

  modalFiltros.addEventListener("click", (event) => {
    if (event.target === modalFiltros) {
      fecharModalFiltros();
    }
  });

  modalChamado.addEventListener("click", (event) => {
    if (event.target === modalChamado) {
      fecharModalChamado();
    }
  });

  window.abrirTelaChamado = abrirTelaChamado;
  window.abrirTelaChamadoPeloTeclado = abrirTelaChamadoPeloTeclado;

  renderizarChamados();
}

carregarDependenciasCompartilhadas(iniciarIndex);
