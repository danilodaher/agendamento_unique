# Unique - Sistema de Reservas

Sistema web para agendamento de quadras esportivas, eventos e festas. Desenvolvido com React, TypeScript e Node.js.

## Funcionalidades

### Reservas
- Seleção de tipo de serviço (Quadra, Evento, Festa)
- Escolha de data e horários disponíveis
- Cálculo automático de valores
- Formulário de dados do cliente
- Confirmação e cancelamento de reservas

### Gestão
- Banco de dados SQLite para persistência
- Notificações por email para cliente e proprietário
- Integração com Google Calendar
- Bloqueio automático de horários ocupados
- Gerenciamento de disponibilidade em tempo real

## Tecnologias

**Frontend**
- React 18
- TypeScript
- Tailwind CSS
- Radix UI
- TanStack Query
- Wouter

**Backend**
- Node.js
- Express
- TypeScript
- Drizzle ORM
- SQLite
- Resend API
- Google Calendar API

## Instalação

```bash
npm install
npm run db:push
npm run dev
```

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
RESEND_API_KEY=sua_chave_resend
RESEND_FROM_EMAIL=contato@seudominio.com
OWNER_EMAIL=uniquearaguari@gmail.com

GOOGLE_CLIENT_EMAIL=seu-service-account@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary

BASE_URL=http://localhost:5001
PORT=5001
```

## Scripts

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Servidor de produção
- `npm run check` - Verificação TypeScript
- `npm run db:push` - Migrações do banco

## Estrutura

```
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Schemas compartilhados
└── database.sqlite  # Banco de dados
```

## Licença

MIT
