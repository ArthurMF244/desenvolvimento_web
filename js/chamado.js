function iniciarChamado() {
  const params = new URLSearchParams(window.location.search);
  const chamadoId = params.get("id");

  let chamado = getChamadoPorId(chamadoId);

  const tituloPaginaChamado = document.getElementById("tituloPaginaChamado");
  const detalheTituloChamado = document.getElementById("detalheTituloChamado");
  const detalheDescricao = document.getElementById("detalheDescricao");
  const historicoChamado = document.getElementById("historicoChamado");

  const resumoNumero = document.getElementById("resumoNumero");
  const resumoStatus = document.getElementById("resumoStatus");
  const resumoPrioridade = document.getElementById("resumoPrioridade");
  const resumoAbertura = document.getElementById("resumoAbertura");

  const detalheFinalizadoEm = document.getElementById("detalheFinalizadoEm");
  const detalheAreaSolicitante = document.getElementById("detalheAreaSolicitante");
  const detalheAreaResponsavel = document.getElementById("detalheAreaResponsavel");
  const detalheImpacto = document.getElementById("detalheImpacto");
  const detalheSolicitante = document.getElementById("detalheSolicitante");
  const detalheResponsavel = document.getElementById("detalheResponsavel");
  const detalheCategoria = document.getElementById("detalheCategoria");

  const btnAbrirEdicao = document.getElementById("btnAbrirEdicao");
  const modalEdicaoChamado = document.getElementById("modalEdicaoChamado");
  const btnFecharModalEdicao = document.getElementById("btnFecharModalEdicao");
  const btnCancelarEdicao = document.getElementById("btnCancelarEdicao");
  const formEdicaoChamado = document.getElementById("formEdicaoChamado");

  const edicaoStatus = document.getElementById("edicaoStatus");
  const edicaoResponsavel = document.getElementById("edicaoResponsavel");
  const edicaoPrioridade = document.getElementById("edicaoPrioridade");
  const edicaoAreaResponsavel = document.getElementById("edicaoAreaResponsavel");
  const edicaoDescricao = document.getElementById("edicaoDescricao");
  const edicaoAnexo = document.getElementById("edicaoAnexo");

  function setText(element, value) {
    element.textContent = value || "-";
  }

  function badgeHtml(texto, classe) {
    return `<span class="badge ${classe}">${texto || "-"}</span>`;
  }

  function normalizarMovimento(item) {
    if (typeof item === "string") {
      return {
        autor: "Sistema",
        texto: item,
        data: chamado?.abertura || dataAtualFormatada(),
        tipo: "sistema",
        anexo: ""
      };
    }

    return {
      autor: item.autor || "Sistema",
      texto: item.texto || "",
      data: item.data || chamado?.abertura || dataAtualFormatada(),
      tipo: item.tipo || "movimento",
      anexo: item.anexo || ""
    };
  }

  function criarMovimento(texto, tipo = "movimento", anexo = "") {
    const perfil = buscarPerfilSalvo();

    return {
      autor: perfil.nome,
      texto,
      data: dataAtualFormatada(),
      tipo,
      anexo
    };
  }

  function movimentoEhMeu(movimento) {
    const perfil = buscarPerfilSalvo();

    return movimento.autor === perfil.nome;
  }

  function renderizarTelaChamado() {
    chamado = getChamadoPorId(chamadoId);

    if (!chamado) {
      document.title = "SI | Chamado não encontrado";
      tituloPaginaChamado.textContent = "Chamado não encontrado";
      detalheTituloChamado.textContent = "Não foi possível localizar o chamado.";
      detalheDescricao.textContent = "Volte para a listagem e selecione um chamado válido.";
      btnAbrirEdicao.disabled = true;
      return;
    }

    if (!Array.isArray(chamado.historico)) {
      chamado.historico = [];
    }

    document.title = `SI | Chamado #${chamado.id}`;

    tituloPaginaChamado.textContent = `Chamado #${chamado.id}`;
    setText(resumoNumero, `#${chamado.id}`);
    setText(detalheTituloChamado, chamado.titulo);
    setText(resumoAbertura, chamado.abertura);
    setText(detalheFinalizadoEm, chamado.finalizadoEm);
    setText(detalheAreaSolicitante, chamado.areaSolicitante);
    setText(detalheAreaResponsavel, chamado.areaResponsavel);
    setText(detalheImpacto, chamado.impacto);
    setText(detalheSolicitante, chamado.solicitante);
    setText(detalheResponsavel, chamado.responsavel);
    setText(detalheCategoria, chamado.categoria);
    setText(detalheDescricao, chamado.descricao);

    resumoStatus.innerHTML = badgeHtml(chamado.status, statusClasse(chamado.status));
    resumoPrioridade.innerHTML = badgeHtml(chamado.prioridade, prioridadeClasse(chamado.prioridade));

    btnAbrirEdicao.disabled = false;
    renderizarMovimentacoes();
  }

  function renderizarMovimentacoes() {
    const movimentos = chamado.historico.map(normalizarMovimento);

    if (!movimentos.length) {
      historicoChamado.innerHTML = `
        <div class="empty-movement">
          <i class="fa-solid fa-message"></i>
          <strong>Nenhuma movimentação registrada</strong>
          <span>Quando alguém atualizar o chamado, os movimentos aparecerão aqui.</span>
        </div>
      `;

      return;
    }

    historicoChamado.innerHTML = movimentos.map((movimento) => {
      const meuMovimento = movimentoEhMeu(movimento);
      const classeLado = meuMovimento ? "mine" : "other";
      const icone = movimento.tipo === "status" ? "fa-arrows-rotate" : "fa-comment-dots";
      const anexo = movimento.anexo
        ? `<div class="movement-attachment"><i class="fa-solid fa-paperclip"></i>${movimento.anexo}</div>`
        : "";

      return `
        <div class="movement-row ${classeLado}">
          <div class="movement-card">
            <div class="movement-meta">
              <strong>
                <i class="fa-solid ${icone}"></i>
                ${movimento.autor}
              </strong>

              <span>${movimento.data}</span>
            </div>

            <p>${movimento.texto}</p>
            ${anexo}
          </div>
        </div>
      `;
    }).join("");
  }

  function abrirModalEdicao() {
    if (!chamado) {
      return;
    }

    popularSelectUsuarios(edicaoResponsavel, {
      incluirVazio: true,
      textoVazio: "Sem responsável",
      valorSelecionado: chamado.responsavel || ""
    });

    edicaoStatus.value = chamado.status || "Novo";
    edicaoPrioridade.value = chamado.prioridade || "Baixa";
    edicaoAreaResponsavel.value = chamado.areaResponsavel || "TI - Sistemas";
    edicaoDescricao.value = "";
    edicaoAnexo.value = "";

    modalEdicaoChamado.classList.add("open");
    modalEdicaoChamado.setAttribute("aria-hidden", "false");
    edicaoDescricao.focus();
  }

  function fecharModalEdicao() {
    modalEdicaoChamado.classList.remove("open");
    modalEdicaoChamado.setAttribute("aria-hidden", "true");
    formEdicaoChamado.reset();
  }

  function montarResumoAlteracoes(alteracoes, descricao, anexoNome) {
    const partes = [];

    if (alteracoes.length) {
      partes.push(`Alterações realizadas: ${alteracoes.join("; ")}.`);
    }

    if (descricao) {
      partes.push(descricao);
    }

    if (anexoNome) {
      partes.push(`Anexo adicionado: ${anexoNome}.`);
    }

    return partes.join("\n");
  }

  function salvarEdicaoChamado(event) {
    event.preventDefault();

    if (!chamado) {
      return;
    }

    const statusAnterior = chamado.status || "";
    const responsavelAnterior = chamado.responsavel || "";
    const prioridadeAnterior = chamado.prioridade || "";
    const areaResponsavelAnterior = chamado.areaResponsavel || "";

    const novoStatus = edicaoStatus.value;
    const novoResponsavel = edicaoResponsavel.value;
    const novaPrioridade = edicaoPrioridade.value;
    const novaAreaResponsavel = edicaoAreaResponsavel.value;
    const descricaoMovimentacao = edicaoDescricao.value.trim();
    const anexoNome = edicaoAnexo.files[0]?.name || "";

    const alteracoes = [];

    if (statusAnterior !== novoStatus) {
      alteracoes.push(`status de "${statusAnterior}" para "${novoStatus}"`);
      chamado.status = novoStatus;
    }

    if (responsavelAnterior !== novoResponsavel) {
      alteracoes.push(`responsável de "${responsavelAnterior || "-"}" para "${novoResponsavel || "-"}"`);
      chamado.responsavel = novoResponsavel;
    }

    if (prioridadeAnterior !== novaPrioridade) {
      alteracoes.push(`prioridade de "${prioridadeAnterior}" para "${novaPrioridade}"`);
      chamado.prioridade = novaPrioridade;
    }

    if (areaResponsavelAnterior !== novaAreaResponsavel) {
      alteracoes.push(`área responsável de "${areaResponsavelAnterior}" para "${novaAreaResponsavel}"`);
      chamado.areaResponsavel = novaAreaResponsavel;
    }

    if (novoStatus === "Finalizado" && statusAnterior !== "Finalizado") {
      chamado.finalizadoEm = dataAtualFormatada();
    }

    if (novoStatus !== "Finalizado") {
      chamado.finalizadoEm = "";
    }

    const textoMovimento = montarResumoAlteracoes(alteracoes, descricaoMovimentacao, anexoNome);

    if (!textoMovimento) {
      mostrarToast("Nenhuma alteração para salvar.");
      return;
    }

    chamado.historico.unshift(
      criarMovimento(textoMovimento, "movimento", anexoNome)
    );

    atualizarChamado(chamado);
    fecharModalEdicao();
    renderizarTelaChamado();
    mostrarToast("Chamado atualizado com sucesso.");
  }

  btnAbrirEdicao.addEventListener("click", abrirModalEdicao);
  btnFecharModalEdicao.addEventListener("click", fecharModalEdicao);
  btnCancelarEdicao.addEventListener("click", fecharModalEdicao);
  formEdicaoChamado.addEventListener("submit", salvarEdicaoChamado);

  modalEdicaoChamado.addEventListener("click", (event) => {
    if (event.target === modalEdicaoChamado) {
      fecharModalEdicao();
    }
  });

  renderizarTelaChamado();
}

carregarDependenciasCompartilhadas(iniciarChamado);
