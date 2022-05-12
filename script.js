(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    function getDateFormat(unformatted) {
        const data = typeof unformatted === 'string' ? new Date(unformatted) : unformatted;
        return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()} - ${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`;
    }
    function patio() {
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
            render();
        }
        function adicionar(veiculo) {
            console.log(ler());
            const veiculos = [...ler(), veiculo];
            salvar(veiculos);
        }
        function remover(placa) {
            const veiculos = ler();
            const { entrada, nome } = veiculos.find(veiculo => veiculo.placa === placa);
            const periodo = new Date().getTime() - new Date(entrada).getTime();
            const tempo = calcTempo(periodo);
            if (!confirm(`O veiculo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) {
                return;
            }
            const updatedVeiculos = veiculos.filter(veiculo => veiculo.placa !== placa);
            salvar(updatedVeiculos);
        }
        function render() {
            $("#patio").innerHTML = '';
            const veiculos = ler();
            veiculos.forEach(veiculo => {
                var _a;
                const row = document.createElement("tr");
                row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${getDateFormat(veiculo.entrada)}</td>
            <td>
              <button class="delete" data-placa="${veiculo.placa}">
                X
              </button>
            </td>
          `;
                row.querySelector(".delete").addEventListener("click", function () {
                    remover(this.dataset.placa);
                });
                (_a = $("#patio")) === null || _a === void 0 ? void 0 : _a.appendChild(row);
            });
        }
        return { ler, salvar, adicionar, remover, render };
    }
    function cadastrar() {
        const nome = $("#nome");
        const placa = $("#placa");
        if (!(nome === null || nome === void 0 ? void 0 : nome.value) || !(placa === null || placa === void 0 ? void 0 : placa.value)) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }
        const veiculo = {
            nome: nome.value,
            placa: placa.value,
            entrada: new Date().toISOString()
        };
        patio().adicionar(veiculo);
        nome.value = '';
        placa.value = '';
    }
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", cadastrar);
    patio().render();
})();
