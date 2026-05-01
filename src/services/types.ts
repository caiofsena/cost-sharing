export interface SignUpRequest {
  email: string;
  name: string;
  password: string;
}

export interface SignUpResponse {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string | null;
}

export interface UserListItem {
  id: string;
  email: string;
  name: string;
  isInActivity?: boolean;
}

export interface UserListResponse {
  users: UserListItem[];
}

export interface UserExpenseStatisticsResponse {
  activitiesCount: number;
  amountPaidInCents: number;
  amountToPayInCents: number;
  expensesCount: number;
  expensesToPayCount: number;
  paidExpensesCount: number;
  totalExpensesAmountInCents: number;
  uniqueParticipantsCount: number;
}

export interface CreateActivityRequest {
  title: string;
  activityDate: string;
}

export interface CreateActivityResponse {
  id: string;
  name: string;
  activityDate: string;
  createdAt: string | null;
}

export interface UpdateActivityRequest {
  title?: string | null;
  activityDate?: string | null;
}

export interface ActivityListItemParticipantInfo {
  id: string;
  email: string;
  name: string;
}

export interface ActivityListItem {
  id: string;
  name: string;
  activityDate: string;
  expensesAmount: number;
  participantsAmount: number;
  totalAmountInCents: number;
  participants: ActivityListItemParticipantInfo[];
}

export interface ActivityListResponse {
  activities: ActivityListItem[];
}

export interface ActivityDetailResponseParticipantInfo {
  id: string;
  email: string;
  name: string;
}

export interface ActivityDetailResponseExpenseInfoExpenseParticipantInfo {
  id: string;
  email: string;
  name: string;
  paymentStatus: string;
}

export interface ActivityDetailResponseExpenseInfo {
  id: string;
  name: string;
  amountInCents: number;
  payerId: string | null;
  payerName: string | null;
  paymentStatus: string;
  participants: ActivityDetailResponseExpenseInfoExpenseParticipantInfo[];
}

export interface ActivityDetailResponse {
  id: string;
  name: string;
  activityDate: string;
  totalAmountInCents: number;
  participants: ActivityDetailResponseParticipantInfo[];
  expenses: ActivityDetailResponseExpenseInfo[];
}

export interface CreateExpenseRequest {
  title: string;
  amountInCents: number;
  payerId?: string | null;
  participantsIds: string[];
}

export interface CreateExpenseResponseParticipantDebt {
  userId: string;
  userName: string;
  amountOwedInCents: number;
}

export interface CreateExpenseResponse {
  id: string;
  name: string;
  amountInCents: number;
  activityId: string;
  payerId: string | null;
  payerName: string | null;
  createdAt: string | null;
  participants: CreateExpenseResponseParticipantDebt[];
}

export interface UpdateExpenseRequest {
  title?: string | null;
  amountInCents?: number | null;
  payerId?: string | null;
  participantsIds?: string[] | null;
}

export interface ExpenseListItemPayerInfo {
  userId: string;
  name: string;
}

export interface ExpenseListItem {
  id: string;
  name: string;
  amountInCents: number;
  participantsCount: number;
  payer: ExpenseListItemPayerInfo;
  createdAt: string | null;
}

export interface ExpenseListResponse {
  expenses: ExpenseListItem[];
}

export interface ExpenseDetailResponsePayerInfo {
  userId: string;
  email: string;
  name: string;
}

export interface ExpenseDetailResponseParticipantInfo {
  userId: string;
  email: string;
  name: string;
  amountOwedInCents: number;
  amountPaidInCents: number;
  remainingDebtInCents: number;
  paymentStatus: string;
}

export interface ExpenseDetailResponsePaymentInfo {
  id: string;
  debtorId: string;
  debtorName: string;
  amountPaidInCents: number;
  paidAt: string | null;
}

export interface ExpenseDetailResponse {
  id: string;
  name: string;
  amountInCents: number;
  activityId: string;
  activityName: string;
  payer: ExpenseDetailResponsePayerInfo;
  participants: ExpenseDetailResponseParticipantInfo[];
  payments: ExpenseDetailResponsePaymentInfo[];
  createdAt: string | null;
}

export interface SetExpensePayerRequest {
  payerId: string;
}

export interface SetExpensePayerResponse {
  id: string;
  name: string;
  payerId: string | null;
  payerName: string | null;
  updatedAt: string | null;
}

export interface MarkPaymentRequest {
  amountInCents: number;
}

export interface MarkPaymentResponse {
  id: string;
  expenseId: string;
  debtorId: string;
  debtorName: string;
  amountPaidInCents: number;
  paidAt: string | null;
}

export interface ToggleParticipantPaymentResponse {
  participantId: string;
  participantName: string;
  participantEmail: string;
  expenseId: string;
  amountOwedInCents: number;
  amountPaidInCents: number;
  remainingDebtInCents: number;
  paymentStatus: string;
}

export interface AddParticipantsRequest {
  participantsIds: string[];
}

export interface AddParticipantsResponseParticipantInfo {
  userId: string;
  email: string;
  name: string;
  joinedAt: string | null;
}

export interface AddParticipantsResponse {
  acitivityId: string;
  message: string;
  addedParticipants: AddParticipantsResponseParticipantInfo[];
}

export interface ActivityParticipantsResponseParticipantsInfo {
  userId: string;
  email: string;
  name: string;
  joinedAt: string | null;
}

export interface ActivityParticipantsResponse {
  activityId: string;
  activityName: string;
  participants: ActivityParticipantsResponseParticipantsInfo[];
}

export interface RemoveParticipantResponse {
  activityId: string;
  message: string;
  removedUserId: string;
  removedUserName: string;
}

export interface ActivityBalanceResponseUserInfo {
  userId: string;
  name: string;
}

export interface ActivityBalanceResponseTransfer {
  from: ActivityBalanceResponseUserInfo;
  to: ActivityBalanceResponseUserInfo;
  amountInCents: number;
}

export interface ActivityBalanceResponse {
  activityId: string;
  activityName: string;
  transfers: ActivityBalanceResponseTransfer[];
}

export interface UserGlobalBalanceResponseActivityBreakdown {
  activityId: string;
  activityName: string;
  amountInCents: number;
}

export interface UserGlobalBalanceResponseCompensatedCredit {
  debtorId: string;
  debtorName: string;
  netAmountInCents: number;
  activitiesCount: number;
  activities: UserGlobalBalanceResponseActivityBreakdown[];
}

export interface UserGlobalBalanceResponseCompensatedDebt {
  creditorId: string;
  creditorName: string;
  netAmountInCents: number;
  activitiesCount: number;
  activities: UserGlobalBalanceResponseActivityBreakdown[];
}

export interface UserGlobalBalanceResponse {
  globalNetBalanceInCents: number;
  compensatedCredits: UserGlobalBalanceResponseCompensatedCredit[];
  compensatedDebts: UserGlobalBalanceResponseCompensatedDebt[];
}

export interface DetailedBalanceResponseDebtDetail {
  activityId: string;
  activityName: string;
  expenseId: string;
  expenseName: string;
  creditorId: string;
  creditorName: string;
  amountInCents: number;
}

export interface DetailedBalanceResponseCreditDetail {
  activityId: string;
  activityName: string;
  expenseId: string;
  expenseName: string;
  debtorId: string;
  debtorName: string;
  amountInCents: number;
}

export interface DetailedBalanceResponse {
  totalUserOwesInCents: number;
  totalOwedToUserInCents: number;
  debts: DetailedBalanceResponseDebtDetail[];
  credits: DetailedBalanceResponseCreditDetail[];
}

export interface BalanceBetweenUsersResponseUserInfo {
  userId: string;
  name: string;
}

export interface BalanceBetweenUsersResponseNetBalance {
  creditor: BalanceBetweenUsersResponseUserInfo;
  debtor: BalanceBetweenUsersResponseUserInfo;
  amountInCents: number;
}

export interface BalanceBetweenUsersResponseActivityDetail {
  activityId: string;
  activityName: string;
  fromUser: string;
  toUser: string;
  amountInCents: number;
}

export interface BalanceBetweenUsersResponse {
  netBalance: BalanceBetweenUsersResponseNetBalance;
  details: BalanceBetweenUsersResponseActivityDetail[];
}
