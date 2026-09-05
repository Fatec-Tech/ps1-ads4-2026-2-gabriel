// Array que guarda os pacientes cadastrados (em memória, só nesta sessão)
const pacientes = [];

// Referências aos elementos do DOM que vamos usar várias vezes
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const totalPacientes = document.getElementById('total-pacientes');
const busca = document.getElementById('busca');
const usarLocalStorage = document.getElementById('usar-localstorage');

// Função responsável por adicionar um paciente ao array
function adicionarPaciente(nome, email, telefone, nascimento) {
	const novoPaciente = { nome, email, telefone, nascimento };
	pacientes.push(novoPaciente);
	salvarPacientes();
}

function removerPaciente(indice) {
	pacientes.splice(indice, 1);
	salvarPacientes();
	renderizarTabela();
}

function ordenarPorNome() {
	pacientes.sort((a, b) => a.nome.localeCompare(b.nome));
	salvarPacientes();
	renderizarTabela();
}

function salvarPacientes() {
	if (usarLocalStorage.checked) {
		localStorage.setItem('pacientes', JSON.stringify(pacientes));
	} else {
		localStorage.removeItem('pacientes');
	}
}

function carregarPacientes() {
	const pacientesSalvos = localStorage.getItem('pacientes');

	if (pacientesSalvos) {
		pacientes.push(...JSON.parse(pacientesSalvos));
		usarLocalStorage.checked = true;
	}
}

// Função responsável por desenhar a tabela inteira a partir do array
function renderizarTabela() {
	tabela.innerHTML = ''; // limpa a tabela antes de redesenhar
	totalPacientes.textContent = `Total de pacientes: ${pacientes.length}`;

	pacientes.forEach((paciente, indice) => {
		if (!paciente.nome.toLowerCase().includes(busca.value.toLowerCase())) {
			return;
		}

		const linha = document.createElement('tr');

		linha.innerHTML = `
      <td>${paciente.nome}</td>
      <td>${paciente.email}</td>
      <td>${paciente.telefone}</td>
      <td>${formatarData(paciente.nascimento)}</td>
      <td>${calcularIdade(paciente.nascimento)}</td>
      <td><button onclick="removerPaciente(${indice})">Remover</button></td>
    `;

		tabela.appendChild(linha);
	});
}

busca.addEventListener('input', () => {
	renderizarTabela();
});

// Função utilitária só para formatar a data no padrão dd/mm/aaaa
function formatarData(dataISO) {
	const [ano, mes, dia] = dataISO.split('-');
	return `${dia}/${mes}/${ano}`;
}

function calcularIdade(data) {
	const [ano, mes, dia] = data.split('-').map(Number);
	const hoje = new Date();
	let idade = hoje.getFullYear() - ano;

	if (hoje.getMonth() + 1 < mes || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia)) {
		idade--;
	}

	return idade;
}

// Evento disparado quando o formulário é enviado
formulario.addEventListener('submit', (event) => {
	event.preventDefault(); // evita o recarregamento da página

	const nome = document.getElementById('nome').value;
	const email = document.getElementById('email').value;
	const telefone = document.getElementById('telefone').value;
	const nascimento = document.getElementById('nascimento').value;
	const salvarNoNavegador = usarLocalStorage.checked;

	for (let i = 0; i < pacientes.length; i++) {
		if (pacientes[i].email === email) {
			alert('Este e-mail já está cadastrado.');
			return;
		}
	}

	adicionarPaciente(nome, email, telefone, nascimento);
	renderizarTabela();

	formulario.reset(); // limpa os campos do formulário
	usarLocalStorage.checked = salvarNoNavegador;
});

carregarPacientes();
renderizarTabela();
