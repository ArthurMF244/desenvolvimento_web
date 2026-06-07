function paginaAtual() {
  return window.location.pathname.split("/").pop() || "index.html";
}

function sidebarComprimida() {
  return localStorage.getItem("si_sidebar_comprimida") === "true";
}

function aplicarEstadoSidebar(comprimida) {
  document.body.classList.toggle("sidebar-collapsed", comprimida);
  localStorage.setItem("si_sidebar_comprimida", String(comprimida));
}

function classeAtiva(paginas) {
  return paginas.includes(paginaAtual()) ? "active" : "";
}

function renderSidebar() {
  const sidebarContainer = document.getElementById("sidebarContainer");

  if (!sidebarContainer) {
    return;
  }

  const pagina = paginaAtual();
  const perfil = buscarPerfilSalvo();
  const iniciais = iniciaisDoNome(perfil.nome);
  const comprimida = sidebarComprimida();
  const relatoriosAtivo = ["indicadores.html", "relatorios.html"].includes(pagina);

  aplicarEstadoSidebar(comprimida);

  sidebarContainer.innerHTML = `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-main">
          <div class="brand-icon">SI</div>

          <div class="brand-text">
            <strong>SI</strong>
            <span>Sistema Interno</span>
          </div>
        </div>

        <button class="sidebar-toggle" id="btnToggleSidebar" type="button" aria-label="${comprimida ? "Expandir menu" : "Comprimir menu"}">
          <i class="fa-solid ${comprimida ? "fa-chevron-right" : "fa-chevron-left"}"></i>
        </button>
      </div>

      <nav class="menu" aria-label="Menu principal">
        <a class="menu-link ${classeAtiva(["index.html", "", "chamado.html"])}" href="index.html" title="Chamados área">
          <i class="fa-solid fa-ticket"></i>
          <span class="menu-label">Chamados área</span>
        </a>

        <a class="menu-link ${classeAtiva(["atribuidos.html"])}" href="atribuidos.html" title="Chamados atribuídos a mim">
          <i class="fa-solid fa-user-check"></i>
          <span class="menu-label">Chamados atribuídos a mim</span>
        </a>

        <a class="menu-link ${classeAtiva(["meus-chamados.html"])}" href="meus-chamados.html" title="Meus chamados">
          <i class="fa-solid fa-inbox"></i>
          <span class="menu-label">Meus chamados</span>
        </a>

        <a class="menu-link ${classeAtiva(["usuarios.html"])}" href="usuarios.html" title="Usuários">
          <i class="fa-solid fa-users"></i>
          <span class="menu-label">Usuários</span>
        </a>

        <div class="menu-group ${relatoriosAtivo ? "open" : ""}">
          <button class="menu-parent ${relatoriosAtivo ? "active" : ""}" id="btnRelatoriosMenu" type="button" aria-expanded="${relatoriosAtivo}">
            <i class="fa-solid fa-chart-pie"></i>
            <span class="menu-label">Relatórios</span>
            <i class="fa-solid fa-chevron-down submenu-arrow"></i>
          </button>

          <div class="submenu">
            <a class="${classeAtiva(["indicadores.html"])}" href="indicadores.html">
              <span>Indicadores</span>
            </a>

            <a class="${classeAtiva(["relatorios.html"])}" href="relatorios.html">
              <span>Relatórios</span>
            </a>
          </div>
        </div>

        <a class="menu-link ${classeAtiva(["configuracoes.html"])}" href="configuracoes.html" title="Configurações">
          <i class="fa-solid fa-gear"></i>
          <span class="menu-label">Configurações</span>
        </a>
      </nav>

      <button class="sidebar-user" id="btnAbrirPerfil" type="button" title="Perfil do usuário">
        <div class="user-avatar" id="avatarUsuario">${iniciais}</div>

        <div class="user-info">
          <strong id="nomeUsuarioSidebar">${perfil.nome}</strong>
          <span id="emailUsuarioSidebar">${perfil.email}</span>
        </div>

        <i class="fa-solid fa-chevron-up user-arrow"></i>
      </button>
    </aside>
  `;

  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-backdrop" id="modalPerfil" aria-hidden="true">
      <div class="modal modal-perfil" role="dialog" aria-modal="true" aria-labelledby="modalPerfilTitulo">
        <div class="modal-header">
          <div>
            <span class="eyebrow">Usuário</span>
            <h2 id="modalPerfilTitulo">Editar perfil</h2>
          </div>

          <button class="icon-btn" id="btnFecharModalPerfil" type="button" aria-label="Fechar perfil">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form id="formPerfil" class="profile-form">
          <div class="profile-preview full">
            <div class="profile-avatar-large" id="avatarUsuarioModal">${iniciais}</div>

            <div>
              <strong id="nomeUsuarioModal">${perfil.nome}</strong>
              <span id="emailUsuarioModal">${perfil.email}</span>
            </div>
          </div>

          <label>
            Nome
            <input id="perfilNome" type="text" required />
          </label>

          <label>
            E-mail
            <input id="perfilEmail" type="email" required />
          </label>

          <label>
            Setor
            <input id="perfilSetor" type="text" />
          </label>

          <label>
            Tema
            <select id="perfilTema">
              <option value="">Claro</option>
              <option value="dark">Escuro</option>
            </select>
          </label>

          <div class="modal-footer full">
            <button class="btn ghost" id="btnCancelarPerfil" type="button">
              <i class="fa-solid fa-ban"></i>
              Cancelar
            </button>

            <button class="btn primary" type="submit">
              <i class="fa-solid fa-floppy-disk"></i>
              Salvar perfil
            </button>
          </div>
        </form>
      </div>
    </div>
  `);

  configurarSidebar();
  configurarPerfil();
}

function configurarSidebar() {
  const btnToggleSidebar = document.getElementById("btnToggleSidebar");
  const btnRelatoriosMenu = document.getElementById("btnRelatoriosMenu");

  btnToggleSidebar.addEventListener("click", () => {
    const novoEstado = !document.body.classList.contains("sidebar-collapsed");

    aplicarEstadoSidebar(novoEstado);
    btnToggleSidebar.innerHTML = `<i class="fa-solid ${novoEstado ? "fa-chevron-right" : "fa-chevron-left"}"></i>`;
    btnToggleSidebar.setAttribute("aria-label", novoEstado ? "Expandir menu" : "Comprimir menu");
  });

  btnRelatoriosMenu.addEventListener("click", () => {
    if (document.body.classList.contains("sidebar-collapsed")) {
      aplicarEstadoSidebar(false);
      btnToggleSidebar.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
      btnToggleSidebar.setAttribute("aria-label", "Comprimir menu");
    }

    const grupo = btnRelatoriosMenu.closest(".menu-group");
    const aberto = grupo.classList.toggle("open");

    btnRelatoriosMenu.setAttribute("aria-expanded", String(aberto));
  });
}

function configurarPerfil() {
  const modalPerfil = document.getElementById("modalPerfil");
  const btnAbrirPerfil = document.getElementById("btnAbrirPerfil");
  const btnFecharModalPerfil = document.getElementById("btnFecharModalPerfil");
  const btnCancelarPerfil = document.getElementById("btnCancelarPerfil");
  const formPerfil = document.getElementById("formPerfil");

  const perfilNome = document.getElementById("perfilNome");
  const perfilEmail = document.getElementById("perfilEmail");
  const perfilSetor = document.getElementById("perfilSetor");
  const perfilTema = document.getElementById("perfilTema");

  function atualizarCamposPerfil() {
    const perfil = buscarPerfilSalvo();
    const iniciais = iniciaisDoNome(perfil.nome);

    document.getElementById("nomeUsuarioSidebar").textContent = perfil.nome;
    document.getElementById("emailUsuarioSidebar").textContent = perfil.email;
    document.getElementById("nomeUsuarioModal").textContent = perfil.nome;
    document.getElementById("emailUsuarioModal").textContent = perfil.email;

    document.getElementById("avatarUsuario").textContent = iniciais;
    document.getElementById("avatarUsuarioModal").textContent = iniciais;

    perfilNome.value = perfil.nome;
    perfilEmail.value = perfil.email;
    perfilSetor.value = perfil.setor;
    perfilTema.value = perfil.tema;

    aplicarTema(perfil.tema);
  }

  function abrirModalPerfil() {
    atualizarCamposPerfil();
    modalPerfil.classList.add("open");
    modalPerfil.setAttribute("aria-hidden", "false");
    perfilNome.focus();
  }

  function fecharModalPerfil() {
    modalPerfil.classList.remove("open");
    modalPerfil.setAttribute("aria-hidden", "true");
  }

  btnAbrirPerfil.addEventListener("click", abrirModalPerfil);
  btnFecharModalPerfil.addEventListener("click", fecharModalPerfil);
  btnCancelarPerfil.addEventListener("click", fecharModalPerfil);

  perfilTema.addEventListener("change", () => {
    aplicarTema(perfilTema.value);
  });

  modalPerfil.addEventListener("click", (event) => {
    if (event.target === modalPerfil) {
      fecharModalPerfil();
    }
  });

  formPerfil.addEventListener("submit", (event) => {
    event.preventDefault();

    const perfil = {
      nome: perfilNome.value.trim(),
      email: perfilEmail.value.trim(),
      setor: perfilSetor.value.trim(),
      tema: perfilTema.value
    };

    salvarPerfilUsuario(perfil);
    atualizarCamposPerfil();
    fecharModalPerfil();

    mostrarToast("Perfil atualizado com sucesso.");
  });

  atualizarCamposPerfil();
}

const temaSalvo = localStorage.getItem("si_tema");

if (temaSalvo) {
  aplicarTema(temaSalvo);
}

renderSidebar();
