interface IVeiculo {
  nome: string;
  placa: string;
  entrada: Date | string;
}

(function() {
  const $ = (query: string): HTMLInputElement | null => document.querySelector(query)

  function calcTempo(mil: number) {
    const min = Math.floor(mil / 60000)
    const sec = Math.floor((mil % 60000) / 1000)

    return `${min}m e ${sec}s`
  }

  function getDateFormat(unformatted: string | Date) {
    const data = typeof unformatted === 'string' ? new Date(unformatted) : unformatted

    return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()} - ${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`
  }

  function patio() {

      function ler(): IVeiculo[] { 
      
        return localStorage.patio ? JSON.parse(localStorage.patio) : []
      }
  
      function salvar(veiculos: IVeiculo[]) {
        localStorage.setItem("patio", JSON.stringify(veiculos))
        
        render()
      }
  
      function adicionar(veiculo: IVeiculo) {
        console.log(ler())
        const veiculos = [...ler(), veiculo]
  
        salvar(veiculos) 
      }
  
      function remover(placa: string) {
        const veiculos = ler() as IVeiculo[]
  
        const {entrada, nome} = veiculos.find(veiculo => veiculo.placa === placa)
  
        const periodo = new Date().getTime() - new Date(entrada).getTime()
        const tempo = calcTempo(periodo)
  
        if(!confirm(`O veiculo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) {
          return
        }
  
        const updatedVeiculos = veiculos.filter(veiculo => veiculo.placa !== placa)
        salvar(updatedVeiculos)
      }
  
      function render() {
        $("#patio")!.innerHTML = ''
        const veiculos = ler()
  
        veiculos.forEach(veiculo => {
          const row = document.createElement("tr")

          row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${getDateFormat(veiculo.entrada)}</td>
            <td>
              <button class="delete" data-placa="${veiculo.placa}">
                X
              </button>
            </td>
          `
          row.querySelector(".delete").addEventListener("click", function() {
            remover(this.dataset.placa)
          })

          $("#patio")?.appendChild(row)
        }) 
      }

    return {ler,salvar,adicionar,remover,render}
  }

  function cadastrar() {
    const nome = $("#nome")
    const placa = $("#placa")

    
    if(!nome?.value || !placa?.value) {
      alert("Os campos nome e placa são obrigatórios")
      return
    }

    const veiculo: IVeiculo = {
      nome: nome.value, 
      placa: placa.value, 
      entrada: new Date().toISOString()
    }

    patio().adicionar(veiculo)

    nome.value = ''
    placa.value = ''
  }
  

  $("#cadastrar")?.addEventListener("click", cadastrar)  
  patio().render()
})()
