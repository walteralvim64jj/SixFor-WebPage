# Six For Jiu-Jitsu

Site institucional estático para a Six For Jiu-Jitsu, desenvolvido com HTML, CSS e JavaScript puro.

## Estrutura do projeto

- index.html — página principal
- css/style.css — estilos visuais, responsividade e componentes
- js/script.js — interações, FAQ, horários e galerias
- config/site.js — configuração central de contatos, textos, horários e imagens
- assets/ — imagens e ícones do layout base
- fotos/ — pasta raiz para arquivos de fotografias e galerias

## Estrutura de fotos

```text
/fotos/
├── competicao/
├── logo/
├── unidades/
│   ├── manoel-honorio/
│   └── sao-mateus/
├── alunos/
├── professores/
└── kids/
```

Use cada pasta para adicionar ou trocar as imagens correspondentes ao site.

## Como executar localmente

Na pasta do projeto, execute:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## Como adicionar a logo

Coloque a imagem em:

```text
fotos/logo/
```

Se a logo estiver em um arquivo novo, atualize o caminho em `config/site.js`:

```js
logoImage: 'fotos/logo/logo-nova.svg'
```

## Como adicionar fotos das unidades

- Manoel Honório: `fotos/unidades/manoel-honorio/`
- São Mateus: `fotos/unidades/sao-mateus/`

Os nomes dos arquivos podem ser alterados e o caminho ajustado no objeto `galleryGroups` dentro de `config/site.js`.

## Como adicionar fotos de competição

Coloque as imagens em:

```text
fotos/competicao/
```

As imagens dessa galeria são controladas por:

```js
galleryGroups.competicao.items
```

## Como adicionar fotos de alunos

Use a pasta:

```text
fotos/alunos/
```

## Como adicionar fotos de professores

Use a pasta:

```text
fotos/professores/
```

## Como adicionar fotos Kids

Use a pasta:

```text
fotos/kids/
```

## Como alterar os horários

Os horários estão centralizados em `config/site.js` no bloco `schedule`.

Exemplo:

```js
schedule: {
  'manoel-honorio': {
    adult: [
      { day: 'SEGUNDA', times: ['06:30 — Gi', '19:15 — Gi'] }
    ]
  }
}
```

Não altere o HTML inteiro para mudar os horários; ajuste apenas esse objeto.

## Como alterar textos

A maioria dos textos institucionais e das ligas de conversão ficam em:

- `index.html` para a estrutura principal
- `config/site.js` para dados de FAQ, modalidade, por que treinar e galeria

## Como alterar WhatsApp, e-mail e Instagram

No arquivo `config/site.js`:

```js
phoneDisplay: '(32) 9 8423-8650',
phoneNumber: '5532984238650',
email: 'sixforjiujitsu@gmail.com',
instagramHandle: '@64jiujitsu',
instagramUrl: 'https://www.instagram.com/64jiujitsu/',
whatsappUrl: 'https://wa.me/5532984238650'
```

## Como publicar

Como o projeto é estático, ele pode ser publicado facilmente em:

- Cloudflare Pages
- GitHub Pages
- Netlify

Basta enviar a pasta raiz do projeto como site estático.

## Como conectar o domínio

Depois de publicar no provedor escolhido, configure o domínio:

```text
www.sixforjiujitsu.com.br
```

No painel do provedor, faça a conexão do domínio e confirme o apontamento DNS conforme instruções do serviço.

## Observações finais

- O site foi pensado para mobile primeiro.
- O WhatsApp continua como principal canal de conversão.
- A pasta `fotos` foi criada para facilitar manutenção futura sem espalhar arquivos aleatórios pelo projeto.
- Os placeholders já estão disponíveis para que novas imagens sejam trocadas sem afetar o layout.
