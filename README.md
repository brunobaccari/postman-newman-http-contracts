# Postman / Newman — contratos HTTP

[English version](README.en.md)

Coleção executada no [Postman Echo](https://postman-echo.com). Sete requisições conferem o que chega ao servidor: Unicode e caracteres reservados na query, tipos JSON, formulário URL-encoded, objeto aninhado, status 404 e Basic Auth com/sem credencial. Não há aplicação local.

## Executar

Node.js 22 ou superior e Python 3 para o summary.

```bash
npm ci
cp .env.example .env
npm test
```

No PowerShell, use `Copy-Item .env.example .env`. Variáveis do processo têm prioridade. A coleção também pode ser importada no Postman: configure `base_url`, `demo_username` e `demo_password` com os valores públicos do exemplo. A conta `postman/password` pertence à demonstração; não envie dados ou credenciais reais a um serviço de echo.

## Decisões de teste

Cada requisição compara status e conteúdo relevante, não apenas HTTP 200. Os dados incluem `false`, `null`, zero, array vazio, `+`, `&` e acentos para detectar perda de tipo ou codificação. Basic Auth é testado separadamente da serialização do corpo. Não existe armazenamento: um PUT ecoado não prova persistência nem autorização entre usuários.

O runner exige sete requisições e sete testes de contrato. Falha, erro de script, timeout ou execução incompleta reprovam. Não há retry automático nem redirecionamento silencioso. Instabilidade do serviço público é falha da execução; confira a resposta antes de mudar o esperado.

## Resultados

[Actions](https://github.com/brunobaccari/postman-newman-http-contracts/actions) publica tabela por cenário e o artifact `results`, com `junit.xml` e `summary.md`, por 14 dias, inclusive após falhas. Relatório ausente, inválido, vazio, ignorado ou com contagem diferente bloqueia o gate. `python scripts/summary.py --self-test` confere o parser. `.env`, logs e resultados ficam fora do Git.

Não é teste de carga, segurança completa ou regra de negócio. Referências: [Postman Echo](https://learning.postman.com/docs/reference/developer-resources/echo-api/) e [reporters nativos do Newman](https://learning.postman.com/docs/reference/newman-cli/newman-built-in-reporters).

Dependências: em 06/10/2026, overrides compatíveis removeram o alerta crítico e outros avisos transitivos. `npm audit` ainda aponta dez dependências afetadas (seis altas e quatro moderadas), incluindo bibliotecas internas do Newman. A coleção usa scripts próprios e dados sintéticos; não execute coleções não confiáveis neste runner. Isso não elimina os alertas restantes.
