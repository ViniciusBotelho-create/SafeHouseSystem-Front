# SafeHouseSystem - Controle de Gastos Residenciais

Sistema para gerenciamento de despesas e receitas de moradores de uma residência.

## Tecnologias

### Front-end

* React
* TypeScript
* Vite
* Axios
* React Router DOM

### Back-end

* .NET (Web API)

## Funcionalidades

* Cadastro de moradores
* Cadastro de categorias
* Registro de transações (receitas e despesas)
* Dashboard com resumo financeiro

## Estrutura do projeto

```
src/
  components/
  pages/
  services/
  types/
```

## Configuração do ambiente

Antes de rodar o projeto, é necessário configurar as variáveis de ambiente.

1. Crie um arquivo `.env` na raiz do projeto
2. Use o arquivo `.env.example` como base

Exemplo:

```
VITE_API_URL=https://localhost:7099/api
```

## Como rodar o projeto

```bash
# instalar dependências
npm install

# rodar o projeto
npm run dev
```

O projeto estará disponível em:

```
http://localhost:5173
```

## Observações

* Certifique-se de que a API esteja rodando antes de iniciar o front-end
* A URL da API deve corresponder à configurada no arquivo `.env`
* O projeto utiliza HTTPS por padrão no back-end
