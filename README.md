# Agenda Boa Vista 2026

Calendário oficial de Boa Vista 2026 com anotações que sincronizam entre todos os
aparelhos onde o app for instalado (via Firebase). Funciona como um **app instalável**
(PWA) — dá pra "Adicionar à tela inicial" no celular e usar como um app normal, com
ícone e tudo.

## Estrutura de arquivos

```
├── index.html       (o app em si)
├── manifest.json     (deixa o app instalável)
├── sw.js              (service worker - permite abrir offline)
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

Suba **todos esses arquivos, mantendo essa mesma estrutura de pastas**, para o seu
repositório no GitHub (a pasta `icons` precisa continuar se chamando `icons`).

## 1. Criar o projeto no Firebase (grátis)

1. Acesse **console.firebase.google.com** e clique em **Adicionar projeto** (qualquer nome, ex: `agenda-boa-vista`).
2. No menu lateral, vá em **Firestore Database** → **Criar banco de dados** → escolha **modo de teste**.
3. Clique na engrenagem ⚙ → **Configurações do projeto** → role até "Seus aplicativos" → clique no ícone **</>** (Web) → dê um nome ao app → **não** marque "Hosting".
4. O Firebase vai te mostrar um objeto `firebaseConfig`. Copie ele.

## 2. Colar a configuração no `index.html`

Abra o `index.html`, procure por:

```js
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    ...
};
```

E substitua pelos valores que o Firebase te deu.

## 3. Ajustar a regra do Firestore

Em **Firestore Database → Regras**, cole:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /agendas/{agendaId}/notes/{noteId} {
      allow read, write: if true;
    }
  }
}
```

Como não são dados sensíveis, isso é seguro o suficiente para uso pessoal — o
código de sincronização funciona como uma senha compartilhada só entre seus
aparelhos.

## 4. Publicar no GitHub Pages

1. Crie um repositório novo no GitHub e suba estes 4 itens (`index.html`,
   `manifest.json`, `sw.js` e a pasta `icons/`).
2. Vá em **Settings → Pages** → em "Source" escolha a branch `main` e a pasta `/root`
   → **Save**.
3. Em alguns minutos o GitHub te dá um link tipo:
   `https://seuusuario.github.io/nome-do-repositorio/`

⚠️ Importante: o service worker e o "instalar app" só funcionam em conexão
**HTTPS** — o GitHub Pages já entrega assim automaticamente, então não precisa
fazer nada extra.

## 5. Instalar nos aparelhos

Abra o link do GitHub Pages em cada aparelho:

- **Android (Chrome):** vai aparecer um botão ⬇️ no topo do app, ou o menu do
  navegador oferece "Instalar aplicativo" / "Adicionar à tela inicial".
- **iPhone (Safari):** toque no ícone de compartilhar (📤) → **Adicionar à Tela de Início**.
- **Computador (Chrome/Edge):** clique no ícone de instalar que aparece na barra de endereço.

Na primeira vez que abrir, o app pede um **código de sincronização**:

- No primeiro aparelho, clique em **"Gerar novo"** — isso cria um código único.
- Nos demais aparelhos, digite **esse mesmo código** em "Usar este código".

A partir daí, qualquer anotação feita em um aparelho aparece em tempo real nos
outros.

## Observações

- O calendário (feriados, pontos facultativos e datas de pagamento) fica fixo
  no código — só as anotações pessoais são sincronizadas.
- Se quiser trocar de código de sincronização depois (por exemplo, separar
  agendas), é só clicar no botão 🔄 e digitar/gerar outro.
