const chamadosIniciais = [
  {
    id: 1024,
    titulo: "Erro ao acessar painel financeiro",
    solicitante: "Mariana Costa",
    responsavel: "",
    areaSolicitante: "Financeiro",
    areaResponsavel: "TI - Sistemas",
    categoria: "Sistema",
    prioridade: "Alta",
    impacto: "Alto",
    status: "Novo",
    descricao: "Usuária relata mensagem de erro ao tentar abrir o painel financeiro após atualização.",
    abertura: "2026-05-24 08:12",
    historico: [
      "Chamado aberto pela área Financeiro.",
      "Triagem automática enviada para TI - Sistemas."
    ]
  },
  {
    id: 1023,
    titulo: "Computador da recepção sem rede",
    solicitante: "Lucas Almeida",
    responsavel: "João Técnico",
    areaSolicitante: "Recepção",
    areaResponsavel: "TI - Infraestrutura",
    categoria: "Rede / Internet",
    prioridade: "Crítica",
    impacto: "Geral",
    status: "Em atendimento",
    descricao: "Equipamento principal da recepção está sem acesso à rede interna e internet.",
    abertura: "2026-05-24 07:30",
    historico: [
      "Chamado aberto via telefone.",
      "Técnico João iniciou o atendimento."
    ]
  },
  {
    id: 1022,
    titulo: "Solicitação de acesso ao módulo de compras",
    solicitante: "Ana Martins",
    responsavel: "Arthur Faggion",
    areaSolicitante: "Compras",
    areaResponsavel: "TI - Sistemas",
    categoria: "Acesso",
    prioridade: "Média",
    impacto: "Médio",
    status: "Aguardando retorno",
    descricao: "Colaboradora precisa de acesso ao módulo de compras para lançamento de pedidos.",
    abertura: "2026-05-23 16:45",
    historico: [
      "Chamado recebido por e-mail.",
      "Solicitada aprovação do gestor da área."
    ]
  },
  {
    id: 1021,
    titulo: "Alteração de cadastro de colaborador",
    solicitante: "Beatriz Souza",
    responsavel: "Beatriz Souza",
    areaSolicitante: "Recursos Humanos",
    areaResponsavel: "Recursos Humanos",
    categoria: "Solicitação administrativa",
    prioridade: "Baixa",
    impacto: "Baixo",
    status: "Finalizado",
    descricao: "Correção de dados cadastrais internos.",
    abertura: "2026-05-22 10:20",
    historico: [
      "Chamado aberto pelo RH.",
      "Cadastro ajustado e solicitação finalizada."
    ]
  }
];

function lerJsonLocalStorage(chave, valorPadrao = null) {
  try {
    return JSON.parse(localStorage.getItem(chave)) || valorPadrao;
  } catch (error) {
    localStorage.removeItem(chave);
    return valorPadrao;
  }
}

function getChamados() {
  const chamadosSalvos = lerJsonLocalStorage("si_chamados");

  if (!chamadosSalvos) {
    localStorage.setItem("si_chamados", JSON.stringify(chamadosIniciais));
    return chamadosIniciais;
  }

  return chamadosSalvos;
}

function setChamados(chamados) {
  localStorage.setItem("si_chamados", JSON.stringify(chamados));
}

function getChamadoPorId(id) {
  return getChamados().find((chamado) => Number(chamado.id) === Number(id));
}

function atualizarChamado(chamadoAtualizado) {
  const chamados = getChamados().map((chamado) => {
    if (Number(chamado.id) === Number(chamadoAtualizado.id)) {
      return chamadoAtualizado;
    }

    return chamado;
  });

  setChamados(chamados);
}

function criarChamado(chamado) {
  const chamados = getChamados();
  const novoId = Math.max(...chamados.map((item) => item.id), 1000) + 1;

  const novoChamado = {
    ...chamado,
    id: novoId
  };

  chamados.unshift(novoChamado);
  setChamados(chamados);

  return novoChamado;
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

function dataAtualFormatada() {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  const hora = String(agora.getHours()).padStart(2, "0");
  const minuto = String(agora.getMinutes()).padStart(2, "0");

  return `${ano}-${mes}-${dia} ${hora}:${minuto}`;
}

function iniciaisDoNome(nome) {
  const partes = String(nome || "")
    .trim()
    .split(" ")
    .filter(Boolean);

  if (!partes.length) {
    return "U";
  }

  const primeira = partes[0]?.[0] || "";
  const ultima = partes.length > 1 ? partes[partes.length - 1]?.[0] : "";

  return `${primeira}${ultima}`.toUpperCase();
}

function perfilPadrao() {
  return {
    nome: "Arthur Faggion",
    email: "arthur@empresa.com.br",
    setor: "TI - Sistemas",
    tema: localStorage.getItem("si_tema") || ""
  };
}

function usuariosPadrao() {
  const perfil = perfilPadrao();

  return [
    {
      nome: perfil.nome,
      email: perfil.email,
      setor: perfil.setor,
      perfil: "Administrador",
      status: "Ativo"
    },
    {
      nome: "Mariana Costa",
      email: "mariana.costa@empresa.com.br",
      setor: "Financeiro",
      perfil: "Solicitante",
      status: "Ativo"
    },
    {
      nome: "Lucas Almeida",
      email: "lucas.almeida@empresa.com.br",
      setor: "Recepção",
      perfil: "Solicitante",
      status: "Ativo"
    },
    {
      nome: "Ana Martins",
      email: "ana.martins@empresa.com.br",
      setor: "Compras",
      perfil: "Solicitante",
      status: "Ativo"
    },
    {
      nome: "Beatriz Souza",
      email: "beatriz.souza@empresa.com.br",
      setor: "Recursos Humanos",
      perfil: "Atendente",
      status: "Ativo"
    },
    {
      nome: "João Técnico",
      email: "joao.tecnico@empresa.com.br",
      setor: "TI - Infraestrutura",
      perfil: "Atendente",
      status: "Ativo"
    }
  ];
}

function getUsuarios() {
  const usuariosSalvos = lerJsonLocalStorage("si_usuarios");

  if (!usuariosSalvos) {
    const usuarios = usuariosPadrao();
    setUsuarios(usuarios);
    return usuarios;
  }

  const usuariosCompletos = [...usuariosSalvos];

  usuariosPadrao().forEach((usuarioPadrao) => {
    const usuarioExiste = usuariosCompletos.some((usuario) => usuario.nome === usuarioPadrao.nome);

    if (!usuarioExiste) {
      usuariosCompletos.push(usuarioPadrao);
    }
  });

  setUsuarios(usuariosCompletos);

  return usuariosCompletos;
}

function setUsuarios(usuarios) {
  localStorage.setItem("si_usuarios", JSON.stringify(usuarios));
}

function getUsuariosAtivos() {
  return getUsuarios()
    .filter((usuario) => usuario.status !== "Inativo")
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

function getUsuarioPorNome(nome) {
  return getUsuarios().find((usuario) => usuario.nome === nome);
}

function popularSelectUsuarios(select, options = {}) {
  const {
    incluirVazio = false,
    textoVazio = "Selecione",
    valorSelecionado = ""
  } = options;

  select.innerHTML = "";

  if (incluirVazio) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = textoVazio;
    select.appendChild(option);
  }

  getUsuariosAtivos().forEach((usuario) => {
    const option = document.createElement("option");
    option.value = usuario.nome;
    option.textContent = `${usuario.nome} - ${usuario.setor}`;
    select.appendChild(option);
  });

  const valorExiste = Array.from(select.options).some((option) => option.value === valorSelecionado);

  if (valorSelecionado && !valorExiste) {
    const option = document.createElement("option");
    option.value = valorSelecionado;
    option.textContent = valorSelecionado;
    select.appendChild(option);
  }

  select.value = valorSelecionado;
}

function buscarPerfilSalvo() {
  const perfilSalvo = lerJsonLocalStorage("si_perfil_usuario", {});

  return {
    ...perfilPadrao(),
    ...(perfilSalvo || {})
  };
}

function salvarPerfilUsuario(perfil) {
  localStorage.setItem("si_perfil_usuario", JSON.stringify(perfil));
}

function aplicarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema || "");
  localStorage.setItem("si_tema", tema || "");
}

function mostrarToast(mensagem) {
  const toast = document.getElementById("toast");

  if (!toast) {
    return;
  }

  toast.textContent = mensagem;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}
