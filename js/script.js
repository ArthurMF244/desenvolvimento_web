const chamadosIniciais = [
  {
    id: 1024,
    titulo: "Erro ao acessar painel financeiro",
    solicitante: "Mariana Costa",
    email: "mariana.costa@empresa.com.br",
    areaSolicitante: "Financeiro",
    areaResponsavel: "TI - Sistemas",
    categoria: "Sistema",
    prioridade: "Alta",
    impacto: "Alto",
    origem: "Portal SI",
    status: "Novo",
    descricao: "Usuária relata mensagem de erro ao tentar abrir o painel financeiro após atualização.",
    abertura: "2026-05-24 08:12",
    slaHoras: 2,
    historico: [
      "Chamado aberto pela área Financeiro.",
      "Triagem automática enviada para TI - Sistemas."
    ]
  },
  {
    id: 1023,
    titulo: "Computador da recepção sem rede",
    solicitante: "Lucas Almeida",
    email: "lucas.almeida@empresa.com.br",
    areaSolicitante: "Recepção",
    areaResponsavel: "TI - Infraestrutura",
    categoria: "Rede / Internet",
    prioridade: "Crítica",
    impacto: "Geral",
    origem: "Telefone",
    status: "Em atendimento",
    descricao: "Equipamento principal da recepção está sem acesso à rede interna e internet.",
    abertura: "2026-05-24 07:30",
    slaHoras: 1,
    historico: [
      "Chamado aberto via telefone.",
      "Técnico João iniciou o atendimento."
    ]
  },
  {
    id: 1022,
    titulo: "Solicitação de acesso ao módulo de compras",
    solicitante: "Ana Martins",
    email: "ana.martins@empresa.com.br",
    areaSolicitante: "Compras",
    areaResponsavel: "TI - Sistemas",
    categoria: "Acesso",
    prioridade: "Média",
    impacto: "Médio",
    origem: "E-mail",
    status: "Aguardando retorno",
    descricao: "Colaboradora precisa de acesso ao módulo de compras para lançamento de pedidos.",
    abertura: "2026-05-23 16:45",
    slaHoras: 8,
    historico: [
      "Chamado recebido por e-mail.",
      "Solicitada aprovação do gestor da área."
    ]
  },
  {
    id: 1021,
    titulo: "Alteração de cadastro de colaborador",
    solicitante: "Beatriz Souza",
    email: "beatriz.souza@empresa.com.br",
    areaSolicitante: "Recursos Humanos",
    areaResponsavel: "Recursos Humanos",
    categoria: "Solicitação administrativa",
    prioridade: "Baixa",
    impacto: "Baixo",
    origem: "Portal SI",
    status: "Finalizado",
    descricao: "Correção de dados cadastrais internos.",
    abertura: "2026-05-22 10:20",
    slaHoras: 24,
    historico: [
      "Chamado aberto pelo RH.",
      "Cadastro ajustado e solicitação finalizada."
    ]
  }
];

let chamados = JSON.parse(localStorage.getItem("si_chamados")) || chamadosIniciais;

const el = (id) => document.getElementById(id);

const listaChamados = el("listaChamados");
const emptyState = el("emptyState");

const filtroTexto = el("filtroTexto");
const filtroStatus = el("filtroStatus");
const filtroArea = el("filtroArea");
const filtroPrioridade = el("filtroPrioridade");

const modalChamado = el("modalChamado");
const formChamado = el("formChamado");

const drawerDetalhes = el("drawerDetalhes");
const detalheConteudo = el("detalheConteudo");
const detalheTitulo = el("detalheTitulo");

const toast = el("toast");
const btnToggleTheme = el("btnToggleTheme");

function salvarStorage() {
  localStorage.setItem("si_chamados", JSON.stringify(chamados));
}

function normalizar(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function statusClasse(status) {
  const mapa = {
    "Novo": "novo",
    "Em atendimento": "atendimento",
    "Aguardando retorno": "aguardando",
    "Finalizado": "finalizado"
  };

  return mapa[status] || "novo";
}

function prioridadeClasse(prioridade) {
  const mapa = {
    "Baixa": "baixa",
    "Média": "media",
    "Alta": "alta",
    "Crítica": "critica"
  };

  return mapa[prioridade] || "media";
}

function calcularSla(chamado) {
  if (chamado.status === "Finalizado") {
    return {
      texto: "Finalizado",
      classe: "ok"
    };
  }

  const abertura = new Date(chamado.abertura.replace(" ", "T"));
  const vencimento = new Date(abertura.getTime() + chamado.slaHoras * 60 * 60 * 1000);
  const diff = vencimento.getTime() - Date.now();

  const abs = Math.abs(diff);
  const horas = Math.floor(abs / 1000 / 60 / 60);
  const minutos = Math.floor((abs / 1000 / 60) % 60);

  const formatado = `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;

  if (diff < 0) {
    return {
      texto: `-${formatado}`,
      classe: "late"
    };
  }

  const percentualRestante = diff / (chamado.slaHoras * 60 * 60 * 1000);

  if (percentualRestante <= 0.3) {
    return {
      texto: formatado,
      classe: "warn"
    };
  }

  return {
    texto: formatado,
    classe: "ok"
  };
}

function chamadosFiltrados() {
  const texto = normalizar(filtroTexto.value);
  const status = filtroStatus.value;
  const area = filtroArea.value;
  const prioridade = filtroPrioridade.value;

  return chamados.filter((chamado) => {
    const conteudoBusca = normalizar(`
      ${chamado.id}
      ${chamado.titulo}
      ${chamado.solicitante}
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

function renderizarChamados() {
  const dados = chamadosFiltrados();

  listaChamados.innerHTML = dados.map((chamado) => {
    const sla = calcularSla(chamado);

    return `
      <tr>
        <td>
          <strong>#${chamado.id}</strong>
          <small>${chamado.abertura}</small>
        </td>

        <td>
          <strong>${chamado.titulo}</strong>
          <small>${chamado.categoria} • ${chamado.solicitante}</small>
        </td>

        <td>${chamado.areaSolicitante}</td>
        <td>${chamado.areaResponsavel}</td>

        <td>
          <span class="badge ${prioridadeClasse(chamado.prioridade)}">
            ${chamado.prioridade}
          </span>
        </td>

        <td>
          <span class="badge ${statusClasse(chamado.status)}">
            ${chamado.status}
          </span>
        </td>

        <td>
          <span class="sla ${sla.classe}">
            ${sla.texto}
          </span>
        </td>

        <td>
          <div class="actions">
            <button class="action-btn" type="button" onclick="abrirDetalhes(${chamado.id})">
              <i class="fa-solid fa-eye"></i>
              Ver
            </button>

            <button class="action-btn" type="button" onclick="alterarStatus(${chamado.id}, 'Em atendimento')">
              <i class="fa-solid fa-headset"></i>
              Atender
            </button>

            <button class="action-btn" type="button" onclick="alterarStatus(${chamado.id}, 'Finalizado')">
              <i class="fa-solid fa-check"></i>
              Finalizar
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  emptyState.style.display = dados.length ? "none" : "block";

  atualizarKpis();
}

function atualizarKpis() {
  el("kpiAbertos").textContent = chamados.filter((chamado) => chamado.status === "Novo").length;

  el("kpiAtendimento").textContent = chamados.filter((chamado) => chamado.status === "Em atendimento").length;

  el("kpiAguardando").textContent = chamados.filter((chamado) => chamado.status === "Aguardando retorno").length;

  el("kpiVencidos").textContent = chamados.filter((chamado) => calcularSla(chamado).classe === "late").length;
}

function abrirModal() {
  modalChamado.classList.add("open");
  modalChamado.setAttribute("aria-hidden", "false");
  el("titulo").focus();
}

function fecharModal() {
  modalChamado.classList.remove("open");
  modalChamado.setAttribute("aria-hidden", "true");
  formChamado.reset();
}

function abrirDetalhes(id) {
  const chamado = chamados.find((item) => item.id === id);

  if (!chamado) {
    return;
  }

  const sla = calcularSla(chamado);

  detalheTitulo.textContent = `Chamado #${chamado.id}`;

  detalheConteudo.innerHTML = `
    <h2>${chamado.titulo}</h2>
    <p>${chamado.descricao}</p>

    <div class="detail-grid">
      <div class="detail-item">
        <span>Solicitante</span>
        ${chamado.solicitante}
      </div>

      <div class="detail-item">
        <span>E-mail</span>
        ${chamado.email || "Não informado"}
      </div>

      <div class="detail-item">
        <span>Área solicitante</span>
        ${chamado.areaSolicitante}
      </div>

      <div class="detail-item">
        <span>Área responsável</span>
        ${chamado.areaResponsavel}
      </div>

      <div class="detail-item">
        <span>Categoria</span>
        ${chamado.categoria}
      </div>

      <div class="detail-item">
        <span>Origem</span>
        ${chamado.origem}
      </div>

      <div class="detail-item">
        <span>Prioridade</span>
        ${chamado.prioridade}
      </div>

      <div class="detail-item">
        <span>Impacto</span>
        ${chamado.impacto}
      </div>

      <div class="detail-item">
        <span>Status</span>
        ${chamado.status}
      </div>

      <div class="detail-item">
        <span>SLA</span>
        <strong class="sla ${sla.classe}">${sla.texto}</strong>
      </div>
    </div>

    <div class="actions">
      <button class="btn secondary" type="button" onclick="alterarStatus(${chamado.id}, 'Em atendimento')">
        <i class="fa-solid fa-headset"></i>
        Iniciar atendimento
      </button>

      <button class="btn secondary" type="button" onclick="alterarStatus(${chamado.id}, 'Aguardando retorno')">
        <i class="fa-solid fa-clock"></i>
        Aguardar retorno
      </button>

      <button class="btn primary" type="button" onclick="alterarStatus(${chamado.id}, 'Finalizado')">
        <i class="fa-solid fa-check"></i>
        Finalizar
      </button>
    </div>

    <h3 class="history-title">Histórico</h3>

    <div class="history">
      ${chamado.historico.map((item) => `
        <div class="history-item">
          ${item}
        </div>
      `).join("")}
    </div>
  `;

  drawerDetalhes.classList.add("open");
  drawerDetalhes.setAttribute("aria-hidden", "false");
}

function fecharDrawer() {
  drawerDetalhes.classList.remove("open");
  drawerDetalhes.setAttribute("aria-hidden", "true");
}

function alterarStatus(id, novoStatus) {
  const chamado = chamados.find((item) => item.id === id);

  if (!chamado || chamado.status === novoStatus) {
    return;
  }

  chamado.status = novoStatus;

  chamado.historico.unshift(
    `Status alterado para "${novoStatus}" em ${new Date().toLocaleString("pt-BR")}.`
  );

  salvarStorage();
  renderizarChamados();
  abrirDetalhes(id);
  mostrarToast(`Chamado #${id} atualizado para ${novoStatus}.`);
}

function mostrarToast(mensagem) {
  toast.textContent = mensagem;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

function dataAtualFormatada() {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  const hora = String(agora.getHours()).padStart(2, "0");
  const minuto = String(agora.getMinutes()).padStart(2, "0");

  return `${ano}-${mes}-${dia} ${hora}:${minuto}`;
}

function slaPorPrioridade(prioridade) {
  const mapa = {
    "Baixa": 24,
    "Média": 8,
    "Alta": 4,
    "Crítica": 1
  };

  return mapa[prioridade] || 8;
}

function atualizarBotaoTema() {
  const temaAtual = document.documentElement.getAttribute("data-theme");

  if (temaAtual === "dark") {
    btnToggleTheme.innerHTML = `
      <i class="fa-solid fa-sun"></i>
      Tema
    `;
  } else {
    btnToggleTheme.innerHTML = `
      <i class="fa-solid fa-moon"></i>
      Tema
    `;
  }
}

formChamado.addEventListener("submit", (event) => {
  event.preventDefault();

  const novoChamado = {
    id: Math.max(...chamados.map((item) => item.id), 1000) + 1,
    titulo: el("titulo").value.trim(),
    solicitante: el("solicitante").value.trim(),
    email: el("email").value.trim(),
    areaSolicitante: el("areaSolicitante").value,
    areaResponsavel: el("areaResponsavel").value,
    categoria: el("categoria").value,
    prioridade: el("prioridade").value,
    impacto: el("impacto").value,
    origem: el("origem").value,
    status: "Novo",
    descricao: el("descricao").value.trim(),
    abertura: dataAtualFormatada(),
    slaHoras: slaPorPrioridade(el("prioridade").value),
    historico: [
      `Chamado cadastrado por ${el("solicitante").value.trim()} em ${new Date().toLocaleString("pt-BR")}.`,
      `Encaminhado para ${el("areaResponsavel").value}.`
    ]
  };

  chamados.unshift(novoChamado);

  salvarStorage();
  renderizarChamados();
  fecharModal();

  mostrarToast(`Chamado #${novoChamado.id} cadastrado com sucesso.`);
});

[filtroTexto, filtroStatus, filtroArea, filtroPrioridade].forEach((campo) => {
  campo.addEventListener("input", renderizarChamados);
});

el("btnNovoChamado").addEventListener("click", abrirModal);

el("btnFecharModal").addEventListener("click", fecharModal);

el("btnCancelar").addEventListener("click", fecharModal);

el("btnFecharDrawer").addEventListener("click", fecharDrawer);

el("btnLimparFiltros").addEventListener("click", () => {
  filtroTexto.value = "";
  filtroStatus.value = "";
  filtroArea.value = "";
  filtroPrioridade.value = "";

  renderizarChamados();
});

btnToggleTheme.addEventListener("click", () => {
  const temaAtual = document.documentElement.getAttribute("data-theme");
  const novoTema = temaAtual === "dark" ? "" : "dark";

  document.documentElement.setAttribute("data-theme", novoTema);
  localStorage.setItem("si_tema", novoTema);

  atualizarBotaoTema();
});

modalChamado.addEventListener("click", (event) => {
  if (event.target === modalChamado) {
    fecharModal();
  }
});

drawerDetalhes.addEventListener("click", (event) => {
  if (event.target === drawerDetalhes) {
    fecharDrawer();
  }
});

const temaSalvo = localStorage.getItem("si_tema");

if (temaSalvo) {
  document.documentElement.setAttribute("data-theme", temaSalvo);
}

atualizarBotaoTema();
renderizarChamados();

setInterval(renderizarChamados, 60000);