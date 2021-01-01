class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor

    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }


    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1 // sempre que houver a tentativa de gravação é necessário atualizar o valor da gravação
    }



    gravar(d) { // parâmetro d = despesa - objeto literal que precisa ser convertido para JSON
        //localStorage.setItem('despesa', JSON.stringify(d)) // colocando setItem, todos os registros com a chave 'despesa' vão ser atualizados, então é necessária uma lógica de identificador único para cada registro dentro de localStorage
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        // Array de despesas
        let despesas = Array()

        let id = localStorage.getItem('id')

        //recuperar todas as despesas cadastradas em localStorage
        for (let i = 1; i <= id; i++) {

            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //checar se existe a possibilidade de haver índices que foram pulados/removidos
            //nestes casos nós vamos pular esses índices

            if (despesa === null) {
                continue
            }
            despesa.id = i //inclui id como atributo de despesas, o valor de i (key no LS), ao elemento recuperado. assim conseguimos conectar esse id ao botão de remover despesa.
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisar(despesa) {

        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()

        console.log(despesa)
        console.log(despesasFiltradas)
        //ano
        if (despesa.ano != '') {
            console.log('Filtro de ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mes
        if (despesa.mes != '') {
            console.log('Filtro de mês')
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        //dia
        if (despesa.dia != '') {
            console.log('Filtro de dia')
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if (despesa.tipo != '') {
            console.log('Filtro de tipo')
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descricao
        if (despesa.descricao != '') {
            console.log('Filtro de descrição')
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        //valor

        if (despesa.valor != '') {
            console.log('Filtro de valor')
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }

}

let bd = new Bd()


function cadastrarDespesa() {
    // recupera os ids de todos os campos pra efetuar o cadastro completo
    // ao ser disparada a função cadastrarDespesa() recupera os ids e cria um OBJETO com os valores recuperados e com base na classe Despesa

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')


    // cria um objeto com base na classe utilizando os parâmetros recuperados 
    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if (despesa.validarDados()) {

        bd.gravar(despesa)

        //dialogo sucesso
        document.getElementById('modal_titulo').innerHTML = 'Registro efetuado com sucesso!'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'A despesa foi cadastrada com sucesso!'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'

        $('#modalRegistraDespesa').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    } else {
        //dialogo de erro
        document.getElementById('modal_titulo').innerHTML = 'Algo deu errado!'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Todos os campos devem ser preenchidos corretamente'
        document.getElementById('modal_btn').innerHTML = 'Corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'

        $('#modalRegistraDespesa').modal('show')

    }

}

function carregaListaDespesas(despesas = Array(), filtro = false) {
    
    if (despesas.length == 0 && filtro == false) {
    despesas = bd.recuperarTodosRegistros()
}
    //selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''


    //percorrer o array despesa, listando cada despesa de forma dinâmica
    despesas.forEach(function (d) {

        //criando a linha (tr)
        let linha = listaDespesas.insertRow()

        //criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        //ajustando o tipo
        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
        }
        linha.insertCell(1).innerHTML = `${d.tipo}`
        linha.insertCell(2).innerHTML = `${d.descricao}`
        linha.insertCell(3).innerHTML = `R$ ${d.valor}`

        //criar o botão de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}` //d sendo a variável dentro do for que percorre a relação de despesas carregadas pela aplicação
        btn.onclick = function () {
            //remover a despesa
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)

            window.location.reload()

        }
        linha.insertCell(4).append(btn)

        console.log(d)

    })
}

function pesquisarDespesas() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

        carregaListaDespesas(despesas, true)

}
