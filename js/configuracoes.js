function iniciarConfiguracoes() {
  const formConfiguracoes = document.getElementById("formConfiguracoes");
  const configNomeSistema = document.getElementById("configNomeSistema");
  const configTema = document.getElementById("configTema");
  const configEmailSuporte = document.getElementById("configEmailSuporte");

  function configuracaoPadrao() {
    return {
      nomeSistema: "SI Chamados",
      tema: localStorage.getItem("si_tema") || "",
      emailSuporte: "suporte@empresa.com.br"
    };
  }

  function getConfiguracoes() {
    return {
      ...configuracaoPadrao(),
      ...lerJsonLocalStorage("si_configuracoes", {})
    };
  }

  function preencherFormulario() {
    const configuracoes = getConfiguracoes();

    configNomeSistema.value = configuracoes.nomeSistema;
    configTema.value = configuracoes.tema;
    configEmailSuporte.value = configuracoes.emailSuporte;
  }

  formConfiguracoes.addEventListener("submit", (event) => {
    event.preventDefault();

    const configuracoes = {
      nomeSistema: configNomeSistema.value.trim(),
      tema: configTema.value,
      emailSuporte: configEmailSuporte.value.trim()
    };

    localStorage.setItem("si_configuracoes", JSON.stringify(configuracoes));
    aplicarTema(configuracoes.tema);
    mostrarToast("Configurações salvas com sucesso.");
  });

  configTema.addEventListener("change", () => {
    aplicarTema(configTema.value);
  });

  preencherFormulario();
}

carregarDependenciasCompartilhadas(iniciarConfiguracoes);
