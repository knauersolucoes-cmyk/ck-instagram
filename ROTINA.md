# Rotina de notícias do Instagram da CK Gestão Contábil

Perfil: @ckgestaocontabil.es · Metricool: marca 8306437, fuso America/Sao_Paulo.

## O que fazer em cada execução
1. Pesquisar as novidades dos últimos dias que afetam empresas clientes de um escritório contábil, em TODOS os setores:
   fiscal (Simples, MEI, Lucro Presumido, ICMS/ISS, NF-e/NFS-e, reforma tributária CBS/IBS), folha/DP (eSocial, FGTS,
   INSS, CLT, salário mínimo, 13º, férias), contábil/societário/burocrático (ECD, ECF, DEFIS, Junta Comercial, CNPJ, certidões) e prazos que vencem em breve.
2. Só publicar se for **realmente importante** para os clientes (lei/resolução nova, prazo novo, mudança de valor, obrigação
   nova). Notícia repetida, boato ou proposta ainda não aprovada → não publicar. Sem novidade importante → não publicar nada.
3. Antes de publicar, conferir o fato em fonte oficial ou em pelo menos duas fontes confiáveis (gov.br, Receita, Planalto,
   DOU, CGSN, eSocial). Corrigir exageros (ex.: regra que vale só acima de um limite).
4. Ver em `publicados.md` e nos agendamentos do Metricool (getScheduledPosts) se o assunto já foi tratado. Não repetir.
5. **Nunca alterar nem apagar post já agendado.** A rotina roda todo dia. O post extra vai no primeiro dia sem post agendado
   a partir de hoje, às 10h, com o story às 10h30 do mesmo dia. Notícia com prazo curto e hoje já com post: hoje às 17h
   (story 17h30). No máximo 1 post extra por dia.

## Como montar
- Arte: escrever um JSON (ver o cabeçalho de `ferramenta/arte.js`), rodar `cd ferramenta && npm i && node arte.js spec.json`.
  Gera `artes/<slug>.jpg` (post) e `artes/<slug>-story.jpg` (story). Olhar a imagem antes de usar.
  slug = `AAAA-MM-DD-assunto` (data da publicação).
- Enviar as artes para este repositório (branch main): `git add artes && git commit && git push`.
  URL pública: `https://raw.githubusercontent.com/knauersolucoes-cmyk/ck-instagram/main/artes/<slug>.jpg`
- Legenda: emoji no início, título curto, 2 a 4 pontos numerados (1️⃣ 2️⃣ 3️⃣), fecho
  "Fale com a CK Gestão Contábil pelo WhatsApp (link na bio)." e **no máximo 5 hashtags**, terminando em #contabilidade #ckgestaocontabil.
- Agendar no Metricool: post (instagramData.type POST) e story (type STORY, sem texto), autoPublish true.
- Story: nunca escrever "link", seta ou "toque aqui" — não há link clicável no story agendado.
- Registrar em `publicados.md`: data, assunto, fontes.

## Proibido
- Mexer no repositório do sistema (knauersolucoes-cmyk/contabil) ou no NFS-e Já.
- Dar opinião política; usar imagem de pessoas reais; copiar texto de notícia (escrever com palavras próprias).
