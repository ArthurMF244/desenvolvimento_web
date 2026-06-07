function iniciarUsuarios() {
  const listaUsuarios = document.getElementById("listaUsuarios");
  const modalUsuario = document.getElementById("modalUsuario");
  const formUsuario = document.getElementById("formUsuario");
  const btnNovoUsuario = document.getElementById("btnNovoUsuario");
  const btnFecharModalUsuario = document.getElementById("btnFecharModalUsuario");
  const btnCancelarUsuario = document.getElementById("btnCancelarUsuario");

  const usuarioNome = document.getElementById("usuarioNome");
  const usuarioEmail = document.getElementById("usuarioEmail");
  const usuarioSetor = document.getElementById("usuarioSetor");
  const usuarioPerfil = document.getElementById("usuarioPerfil");
  const usuarioStatus = document.getElementById("usuarioStatus");

  function renderizarUsuarios() {
    const usuarios = getUsuarios();

    listaUsuarios.innerHTML = usuarios.map((usuario) => {
      const statusClasseUsuario = usuario.status === "Inativo" ? "user-status inativo" : "user-status";

      return `
        <tr>
          <td><strong>${usuario.nome}</strong></td>
          <td>${usuario.email}</td>
          <td>${usuario.setor}</td>
          <td>${usuario.perfil}</td>
          <td><span class="${statusClasseUsuario}">${usuario.status}</span></td>
        </tr>
      `;
    }).join("");
  }

  function abrirModalUsuario() {
    formUsuario.reset();
    modalUsuario.classList.add("open");
    modalUsuario.setAttribute("aria-hidden", "false");
    usuarioNome.focus();
  }

  function fecharModalUsuario() {
    modalUsuario.classList.remove("open");
    modalUsuario.setAttribute("aria-hidden", "true");
    formUsuario.reset();
  }

  formUsuario.addEventListener("submit", (event) => {
    event.preventDefault();

    const usuarios = getUsuarios();

    usuarios.push({
      nome: usuarioNome.value.trim(),
      email: usuarioEmail.value.trim(),
      setor: usuarioSetor.value.trim(),
      perfil: usuarioPerfil.value,
      status: usuarioStatus.value
    });

    setUsuarios(usuarios);
    renderizarUsuarios();
    fecharModalUsuario();
    mostrarToast("Usuário cadastrado com sucesso.");
  });

  btnNovoUsuario.addEventListener("click", abrirModalUsuario);
  btnFecharModalUsuario.addEventListener("click", fecharModalUsuario);
  btnCancelarUsuario.addEventListener("click", fecharModalUsuario);

  modalUsuario.addEventListener("click", (event) => {
    if (event.target === modalUsuario) {
      fecharModalUsuario();
    }
  });

  renderizarUsuarios();
}

carregarDependenciasCompartilhadas(iniciarUsuarios);
