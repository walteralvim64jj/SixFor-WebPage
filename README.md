# Six For Jiu-Jitsu

Site institucional estático em HTML, CSS e JavaScript. A página mantém os horários, contatos, unidades e turmas em uma configuração central; as fotos das categorias são descobertas no processo de build, sem lista manual no HTML.

## Mapa do projeto

- `index.html` — site institucional.
- `imagens.html` — inventário visual: pastas, uso, prévias e categorias vazias. No site publicado, abra `/imagens.html`.
- `config/site.js` — contatos, mensagens, turmas, FAQ e horários.
- `js/script.js` — navegação, horário interativo e aplicação do inventário de fotos.
- `scripts/build-site.js` — cria o inventário das imagens e o pacote estático de produção.
- `images/` — fotos da academia; use a tabela abaixo.
- `assets/` — logo, ícones e arte original mantida pelo projeto.
- `css/style.css` — identidade visual e adaptação responsiva.

As pastas antigas `fotos/` e `assets/images/` contêm placeholders e arquivos anteriores à organização atual. Não são mais lidas pelo site nem publicadas no pacote novo. Coloque novas fotos somente em `images/`; não precisa apagar os arquivos antigos do repositório.

## Mapa de imagens

| Pasta | Finalidade | Onde aparece |
|---|---|---|
| `images/hero/` | Foto de abertura | Fundo do hero da página inicial; usa a primeira foto em ordem alfabética. |
| `images/unidades/manoel-honorio/` | Fotos da unidade Manoel Honório | Galeria dentro do cartão dessa unidade. |
| `images/unidades/sao-mateus/` | Fotos da unidade São Mateus | Galeria dentro do cartão dessa unidade. |
| `images/equipe/` | Fotos coletivas da equipe | Galeria ao lado da apresentação dos seis integrantes. As fotos não são associadas automaticamente a nomes. |
| `images/treinos/` | Fotos de treino | Primeira foto em ordem alfabética ilustra a aula experimental; todas aparecem na galeria de treinos. |
| `images/eventos/` | Campeonatos e eventos | Galeria de eventos. |
| `images/kids/` | Fotos das turmas Kids | Galeria Kids. |

Todas as categorias são opcionais. Sem foto, a galeria correspondente é ocultada e o layout mantém as informações textuais sem mostrar imagem quebrada.

### Comportamento de imagem e galeria

- **0 fotos:** nenhuma galeria aparece; os cartões e textos da unidade permanecem.
- **1 foto:** aparece como imagem estática, sem controles de carrossel.
- **2 ou mais:** aparecem controles, indicadores e troca automática a cada 7 segundos. Passar o mouse ou focar os controles pausa a troca; existe botão para pausar/retomar; toque permite deslizar. Com `prefers-reduced-motion`, a troca automática é desativada.
- Fotos são enquadradas sem distorção e dentro de áreas com proporção estável. Se um arquivo não carregar, sua área opcional é removida sem exibir imagem quebrada.

## Adicionar ou trocar fotos

1. Coloque a imagem na pasta da categoria adequada — por exemplo, fotos de campeonato em `images/eventos/`.
2. Use JPG, JPEG, PNG, WebP, AVIF, GIF ou SVG. O nome pode conter espaços, acentos, números e letras maiúsculas; não precisa renomear.
3. Para conferir localmente, rode `npm run build` na raiz do projeto e sirva a pasta `dist` em um servidor local. O arquivo `images/image-manifest.json` é gerado automaticamente.
4. Envie a foto para o repositório conectado ao Cloudflare Pages. O build da produção encontra as imagens e publica a nova versão.

Subpastas também são percorridas. Imagens em formatos que navegadores não exibem (por exemplo, HEIC) precisam ser convertidas para um formato listado acima.

## Gerenciador visual

Abra `/imagens.html` no site publicado para ver as imagens reconhecidas, prévias, pastas de destino e categorias vazias. É um inventário somente leitura: o projeto é estático e não dispõe de servidor seguro para receber uploads. O envio e a publicação da foto continuam sendo feitos pelo repositório.

## Publicação automática no Cloudflare Pages

Para que **colocar a foto no repositório e publicar** atualize automaticamente a lista, o Cloudflare Pages precisa gerar o inventário durante um build conectado ao GitHub:

- **Framework preset:** None / sem framework
- **Production branch:** `main`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** raiz do repositório

O site não tem dependências npm externas; o build usa apenas Node.js. Faça um deploy inicial e teste o endereço `*.pages.dev` antes de conectar o domínio.

**Limitação importante:** o upload manual/Direct Upload do Cloudflare Pages não consegue listar arquivos de uma pasta no navegador e não executa este build. Para descoberta automática, use integração Git. Um projeto Pages criado como Direct Upload não pode ser convertido em Git integrado; nesse caso, crie um novo projeto Git-integrado, valide o `pages.dev` e então conecte o domínio personalizado pelo painel do Cloudflare. Não apague nem mude os DNS até validar o novo projeto.

Se estiver usando outro host estático, rode o build antes de publicar e envie todo o conteúdo de `dist/`. Não publique apenas `index.html`.

## Prévia local

Com Node.js instalado, na raiz do projeto:

```bash
npm run build
```

Depois sirva a pasta `dist` com qualquer servidor HTTP estático. Não abra o HTML diretamente como `file://`: o navegador bloqueia a leitura do manifesto JSON nesse modo.

## Conteúdo e dados

- Contatos e mensagens de WhatsApp: `config/site.js`.
- Horários por unidade e turma: `config/site.js`, objeto `schedule`.
- Textos, endereços e estrutura das seções: `index.html`.

Horários e endereços existentes foram preservados; confirme esses dados com a equipe antes de novas alterações.
