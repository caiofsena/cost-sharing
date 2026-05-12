# Cost Sharing

Aplicativo React Native para divisão de despesas entre participantes de atividades compartilhadas. Gerencie atividades, registre despesas, acompanhe saldos e controle quem pagou o quê.

<img width="240" height="550" alt="Simulator Screenshot - iPhone 17 - 2026-05-12 at 14 06 25" src="https://github.com/user-attachments/assets/b8664754-50eb-4dbc-b289-4be6c5f24393" />
<img width="240" height="550" alt="Simulator Screenshot - iPhone 17 - 2026-05-12 at 14 06 15" src="https://github.com/user-attachments/assets/1fab7a6a-c689-4e2f-84ff-c6073f2ea555" />
<img width="240" height="550" alt="Simulator Screenshot - iPhone 17 - 2026-05-12 at 14 06 18" src="https://github.com/user-attachments/assets/d27c6f34-f0fc-4fb5-b608-ada5ff091a18" />
<img width="240" height="550" alt="Simulator Screenshot - iPhone 17 - 2026-05-12 at 14 06 21" src="https://github.com/user-attachments/assets/b00cc3e9-32e7-4248-82bf-047ee87da647" />

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Expo SDK 54 / React Native 0.81 |
| Linguagem | TypeScript 5.9 |
| Estilização | NativeWind v4 + Tailwind CSS + tailwind-variants |
| State Management | Redux Toolkit + React Redux |
| Formulários | react-hook-form + yup + @hookform/resolvers |
| Navegação | React Navigation v7 (Bottom Tabs + Native Stack) |
| HTTP | Axios com interceptors JWT |
| Fontes | Inter + Sora (expo-font) |
| Storage | @react-native-async-storage/async-storage |

## Funcionalidades

- **Autenticação** — Login e signup com JWT, token persistido em AsyncStorage
- **Atividades** — Criar, editar e excluir atividades com nome e data
- **Despesas** — Criar despesas com título, valor e participantes; visualizar detalhe com status de pagamento por participante
- **Participantes** — Gerenciar participantes por atividade (adicionar/remover)
- **Resumo financeiro** — Saldo global, débitos e créditos detalhados por atividade
- **UI Components** — Bottom sheet modals, Select multi-select com chips, StatusSelect (segmented control), cards, badges, inputs com ícone

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── CreateActivityModal.tsx
│   ├── CreateExpenseModal.tsx
│   ├── Divider.tsx
│   ├── EditActivityModal.tsx
│   ├── EditExpenseModal.tsx       # Detail + toggle pagamento
│   ├── EditExpenseFormModal.tsx   # Edição de despesa
│   ├── Input.tsx
│   ├── InputIcon.tsx
│   ├── Select.tsx                 # Multi-select com chips
│   ├── StatusSelect.tsx           # Segmented control Pendente/Pago
│   └── icons/
├── navigation/
│   └── AppNavigator.tsx           # Auth stack + Main tabs + expense stack
├── schemas/                       # Validação yup
├── screens/
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   ├── HomeScreen.tsx
│   ├── ActivitiesScreen.tsx
│   ├── ExpensesScreen.tsx
│   ├── ResumeScreen.tsx
│   ├── ParticipantsScreen.tsx
│   └── ComponentsScreen.tsx       # Catálogo de componentes
├── services/
│   ├── api.ts                     # Axios client com JWT interceptors
│   ├── authService.ts
│   ├── activitiesService.ts
│   ├── expensesService.ts
│   ├── participantsService.ts
│   ├── balanceService.ts
│   ├── types.ts
│   └── index.ts
└── store/
    ├── index.ts                   # configureStore com todos os reducers
    ├── hooks.ts                   # useAppDispatch / useAppSelector
    ├── authSlice.ts
    ├── activitiesSlice.ts
    ├── expensesSlice.ts
    ├── participantsSlice.ts
    └── balanceSlice.ts
```

## Design Tokens

### Cores

| Token | Valor | Uso |
|---|---|---|
| `gray.800` | `#0B0B0E` | Background principal |
| `gray.700` | `#121216` | Cards, modals |
| `gray.600` | `#1C1C22` | Elementos secundários |
| `gray.500` | `#2A2A2D` | Bordas, dividers |
| `gray.400` | `#585860` | Texto secundário |
| `gray.200` | `#E1E1E6` | Texto principal |
| `gray.100` | `#FAFAFA` | Branco suave |
| `green.base` | `#30A65D` | Ações primárias |
| `green.light` | `#71D697` | Destaques positivos |
| `danger.light` | `#E77482` | Erros, ações destrutivas |
| `danger.low` | `#360F14` | Background de erro |
| `alert.light` | `#DEB55E` | Status parcial/atenção |
| `alert.low` | `#281F0B` | Background de alerta |

### Tipografia

| Token | Fonte | Tamanho | Peso |
|---|---|---|---|
| `heading-lg` | Sora | 20px | 700 |
| `heading-sm` | Sora | 14px | 700 |
| `label-lg` | Inter | 20px | 600 |
| `label-md` | Inter | 16px | 600 |
| `label-sm` | Inter | 14px | 600 |
| `text-md` | Inter | 16px | 400 |
| `text-sm` | Inter | 14px | 400 |
| `text-xs` | Inter | 12px | 400 |

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm start

# Rodar no Android
npm run dev:android

# Rodar no iOS
npm run dev:ios
```

## API

O app consome uma API REST com base URL configurada em `src/services/api.ts`:

```
Base URL: http://localhost:8080/api/v1
Auth: Bearer token via AsyncStorage
```

### Endpoints utilizados

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/auth/signin` | Login |
| POST | `/auth/signup` | Registro |
| GET | `/users/profile` | Perfil do usuário |
| POST | `/activities` | Criar atividade |
| GET | `/activities/:id` | Detalhe da atividade |
| PUT | `/activities/:id` | Atualizar atividade |
| DELETE | `/activities/:id` | Excluir atividade |
| GET | `/users/:id/activities` | Listar atividades do usuário |
| POST | `/activities/:id/expenses` | Criar despesa |
| GET | `/activities/:id/expenses` | Listar despesas da atividade |
| GET | `/expenses/:id` | Detalhe da despesa |
| PUT | `/expenses/:id` | Atualizar despesa |
| DELETE | `/expenses/:id` | Excluir despesa |
| PUT | `/expenses/:id/payer` | Definir pagador |
| POST | `/expenses/:id/payments` | Registrar pagamento |
| PUT | `/expenses/:id/participants/:pid/payment/toggle` | Alternar status |
| GET | `/activities/:id/participants` | Listar participantes |
| POST | `/activities/:id/participants` | Adicionar participantes |
| DELETE | `/activities/:id/participants/:uid` | Remover participante |
| GET | `/activities/:id/balance` | Balanço da atividade |
| GET | `/balance/users/:id/global` | Balanço global |
| GET | `/balance/users/:id/detailed` | Balanço detalhado |
| GET | `/balance/between/:uid1/:uid2` | Balanço entre usuários |

## Arquitetura

### State Management

Cada domínio possui seu próprio Redux slice com:

- **Async thunks** para operações CRUD
- **Extra reducers** para cache/invalidação automática (refetch após create/update/delete)
- **Estado normalizado** com `items` (lista) e `current` (detalhe)

```
authSlice          → token, user, login/signup errors
activitiesSlice    → items[], current, loading, error
expensesSlice      → items[], current, loading, error
participantsSlice  → items[], activityName, loading, error
balanceSlice       → activityBalance, globalBalance, detailedBalance, betweenUsers
```

### Formulários

Todos os formulários usam **react-hook-form** com **yup** para validação:

```tsx
const { control, handleSubmit, reset } = useForm<FormData>({
  resolver: yupResolver(schema),
  defaultValues: { ... },
});
```

### Modais

- **CreateActivityModal** — Criação de atividade
- **EditActivityModal** — Edição + exclusão de atividade
- **CreateExpenseModal** — Bottom sheet com título, valor (R$ fixo), select de participantes
- **EditExpenseModal** — Detail view com toggle de pagamento (StatusSelect)
- **EditExpenseFormModal** — Edição de despesa pré-preenchida

## Licença

MIT
