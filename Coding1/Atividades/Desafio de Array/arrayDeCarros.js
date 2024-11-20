import { parseArgs } from "@std/cli";

const args = parseArgs(Deno.args, { alias: { help: "h", data: "d" } });

function help() {
  console.log(`
===========================
Atividade: Desafio de Array
===========================

Por padrão, o arquivo de dados é o arquivo "data_1.json".
se você quiser alterar o arquivo de dados,
basta passar o caminho como argumento usando o parâmetro --data ou -d.

Comandos:

--help, -h: Mostra este menu de ajuda.
--data, -d: Caminho para o arquivo de dados.
  `);
}

console.clear(); // Limpando a tela.

/**
 * Módulo contendo métodos e recursos necessários para interação do usuário com a lista de carros.
 */
export const LocadoraDeCarros = {
  /**
   * Lista de carros para interação, inicia vazia.
   * Adicione items com `carregarLista()` antes de começar a interação.
   *
   * @type {string[]}
   */
  listaParaInteragir: [],

  /** Limpa a tela, e então exibe a lista de carros. */
  exibirLista() {
    console.clear();
    console.log(`
█░░ █▀▀█ █▀▀ █▀▀█ █▀▀▄ █▀▀█ █▀▀█ █▀▀█ 
█░░ █░░█ █░░ █▄▄█ █░░█ █░░█ █▄▄▀ █▄▄█ 
▀▀▀ ▀▀▀▀ ▀▀▀ ▀░░▀ ▀▀▀░ ▀▀▀▀ ▀░▀▀ ▀░░▀ `);
    console.log("\nLista de carros disponíveis:");
    console.table(this.listaParaInteragir);
    this.exibirQuantidade();
  },

  /** Exibe a quantidade de carros na lista. */
  exibirQuantidade() {
    console.log(
      `Temos um total de %c${this.listaParaInteragir.length} %ccarros disponíveis!`,
      "color:green; text-weight: bold",
      "color:",
    );
  },

  /**
   * Carrega a lista de carros importando um arquivo JSON.
   *
   * @async
   * @param {string | URL} lista - Arquivo JSON contendo a lista de carros.
   */
  async carregarLista(lista) {
    try {
      // Carregando o arquivo de dados.
      const data = await Deno.readTextFile(args.data || lista);
      this.listaParaInteragir = JSON.parse(data);
    } catch (err) {
      // Caso arquivo não seja encontrado.
      if (err instanceof Deno.errors.NotFound) {
        this.listaParaInteragir = []; // Definindo a lista como vazia em caso de erro.
        console.error("Erro ao ler o arquivo de dados.  ");
        throw err;
      }
    }
  },

  /**
   * Recebe input do usuário.
   *
   * @param {string} mensagemPrompt - Mensagem a ser exibida ao usuário.
   * @returns {string?} Retorna o input do usuário ou null.
   */
  receberInput(mensagemPrompt) {
    const input = prompt(mensagemPrompt)?.trim();
    return input || null;
  },

  /**
   * Exibe uma mensagem de feedback no console sobre a adição ou remoção de um carro.
   *
   * @param {string} mensagem - Mensagem a ser exibida no console.
   * @param {string?} [nomeDoCarro="Nenhum carro"] - Nome do carro removido ou adicionado.
   * @param {string?} [corTexto="yellow"] - Cor do texto do **nome** do carro, em _inglês_.
   */
  exibirMensagemFeedback(
    mensagem,
    nomeDoCarro = "Nenhum carro",
    corTexto = "yellow",
  ) {
    console.log(
      `%c${nomeDoCarro} %c${mensagem}`,
      `color:${corTexto}; text-weight: bold`,
      "color:white",
    );
  },

  /**
   * Remove o carro da lista passando o ID como argumento.
   *
   * @param {string} id - ID do carro a ser removido.
   */
  removerCarro(id) {
    const parsedID = parseInt(id);

    // Early return
    if (
      parsedID == null ||
      isNaN(parsedID) ||
      parsedID < 0 ||
      parsedID > this.listaParaInteragir.length
    ) {
      this.exibirLista();
      this.exibirMensagemFeedback("foi removido."); // Mensagem padrão.
      // this.exibirQuantidade();
      return;
    }

    // Remove o carro da lista.
    const [nomeCarroRemovido] = this.listaParaInteragir.splice(parsedID, 1);
    this.exibirLista(); // Exibe a lista atualizada.
    this.exibirMensagemFeedback(
      "foi removido da lista!",
      nomeCarroRemovido,
      "red",
    );
    // this.exibirQuantidade();
  },

  /** Inicia um `while` loop onde o usuário pode continuar removendo os carros. */
  executarLoopDeRemocao() {
    console.log(
      "\nGostaria de %cREMOVER %cmais alguns? ",
      "color:red",
      "color:",
      "\n==================================================",
    );

    /**
     * Inicia um `while` loop caso valor seja `true`.
     * @type {boolean} */
    let continuarRemocao = confirm("");

    this.exibirLista();

    removendoCarros: while (continuarRemocao) {
      const idCarroSelecionado = this.receberInput(
        "\nInsira o ID do carro ou deixe em branco para sair." +
          "\n==================================================" +
          "\n>",
      );

      if (!idCarroSelecionado) {
        continuarRemocao = false;
        break removendoCarros;
      }

      this.removerCarro(idCarroSelecionado);
    }

    this.exibirLista();
  },

  /** Inicia a interação com o usuário. */
  iniciarRemocaoDeCarros() {
    if (this.listaParaInteragir.length === 0) {
      // Caso não haja carros na lista.
      throw new Deno.errors.InvalidData("Não há carros na lista.");
    }

    this.exibirLista();

    console.log(
      "\nGostaria de %cREMOVER %calgum carro da lista? ",
      "color:red; text-weight: bold",
      "color:",
      "\n==================================================",
    );

    /** @type {string?} */
    const idCarroInicial = this.receberInput(
      "Insira o ID do carro ou deixe em branco para sair.\n\n>",
    );

    if (idCarroInicial) {
      this.removerCarro(idCarroInicial);
      this.executarLoopDeRemocao();
    }
  },

  /**
   * Adiciona o carro no final da lista passando o nome como argumento.
   *
   * @param {string} nomeCarro - Nome do carro a ser adicionado.
   */
  adicionarCarro(nomeCarro) {
    if (!nomeCarro) {
      this.exibirLista(); // Atualizando
      this.exibirMensagemFeedback("foi adicionado");
      // this.exibirQuantidade();
      return; // Early return
    }

    this.listaParaInteragir.push(nomeCarro); // Adiciona o carro na lista
    this.exibirLista();
    this.exibirMensagemFeedback("adicionado!", nomeCarro, "green");
    // this.exibirQuantidade();
  },

  /** Inicia um `while` loop onde o usuário pode continuar adicionando os carros. */
  executarLoopDeAdicao() {
    console.log(
      "\nGostaria de %cADICIONAR %cmais alguns? ",
      "color:green",
      "color:",
      "\n==================================================",
    );

    /**
     * Inicia um `while` loop caso valor seja `true`.
     * @type {boolean} */
    let continuarAdicao = confirm("");

    this.exibirLista();

    adicionandoCarros: while (continuarAdicao) {
      const carroParaAdicionar = this.receberInput(
        "\nInsira o nome do carro ou deixe em branco para sair." +
          "\n====================================================" +
          "\n>",
      );

      if (!carroParaAdicionar) {
        continuarAdicao = false;
        break adicionandoCarros;
      }

      this.adicionarCarro(carroParaAdicionar);
    }

    this.exibirLista();
  },

  /** Inicia a interação com o usuário. */
  iniciarAdicaoDeCarros() {
    this.exibirLista();

    console.log(
      "\nGostaria de %cADICIONAR %calgum carro na lista? ",
      "color:green; text-weight: bold",
      "color:",
      "\n==================================================",
    );

    /** @type {string?} */
    const nomeCarroInicial = this.receberInput(
      "Insira o nome do carro ou deixe em branco para sair.\n\n>",
    );

    if (nomeCarroInicial) {
      this.adicionarCarro(nomeCarroInicial);
      this.executarLoopDeAdicao();
    }
  },
};

// Apenas executa se o script for executado diretamente.
if (import.meta.main) {
  if (args.help) {
    help();
    Deno.exit();
  }

  await LocadoraDeCarros.carregarLista("./data_1.json"); // Importando o arquivo de dados.
  LocadoraDeCarros.iniciarRemocaoDeCarros(); // Iniciando
  LocadoraDeCarros.iniciarAdicaoDeCarros();
  LocadoraDeCarros.exibirLista();
  console.log("\n%c -- == Script finalizado! == --\n", "color:yellow;");
}
