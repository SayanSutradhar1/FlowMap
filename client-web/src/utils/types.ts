export interface UserType {
  id: string;
  name: string;
  email: string;
  state: State;
  profession: Profession;
  age: number;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
  expenses: string[];
  cash: string;
  isVerified: boolean;
  verifiedAt: Date;
  verificationOtp: string;
}

export interface CashType {
  id: string;
  userId: string;
  user?: UserType; // relation (optional unless always included)
  amount: number;
  dailyLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryDistribution {
  _sum: {
    amount: number;
  };
  category: ExpenseCategory;
}

export interface CashDetailsType {
  amount: number;
  dailyLimit: number;
  monthlyExpense: number;
  monthlyInflow: number;
  monthlySavings: number;
  categoryDistribution: CategoryDistribution[];
}

export interface CategoryDistributionType {
  month: number;
  topCategory: string;
  topCategoryAmount: number;
}

export interface ExpenseType {
  id: string;
  userId: string;
  name: string;
  amount: number;
  recoverable?: boolean; // optional because Boolean?
  category: ExpenseCategory;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedExpenseType {
  expenses : ExpenseType[]
  count : number
  total : number
}

export interface TransactionType {
  id: string;
  userId: string;
  amount: number;
  transactionType: string;
  transactionDetails?: {
    amount: number;
    createdAt: Date;
    id: string;
    description?: string;
  };
  refId: string;
  createdAt: Date;
  updatedAt: Date;
  currentBalance: number;
}

export interface PaginatedTransactionType {
  transactions: TransactionType[];
  count: number;
}

export interface InflowType {
  id: string;
  userId: string;
  amount: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedInflowType {
  inflows: InflowType[];
  count: number;
  totalAmount: number;
}

export interface BasicAnalyticsType {
  highestSpendingMonthData: {
    month: string;
    amount: number;
  };
  lowestSpendingMonthData: {
    month: string;
    amount: number;
  };
  avgMonthlySpending: number;
  topCategoryData: {
    category: string;
    amount: number;
  };
}

export interface MonthlyAnalysisType {
  monthlyExpenses: {
    month: number;
    amount: number;
  }[];
  monthlyInflows: {
    month: number;
    amount: number;
  }[];
  monthlySavings: {
    month: number;
    amount: number;
  }[];
}

export interface BudgetDetailsType {
  category: string;
  amount: number;
  budgetAmount: number | null;
}

export interface TransactionsReportType {
  transactionId: string;
  amount: number;
  type: "IN" | "OUT";
  description: string;
  date: string;
  cashIn: number;
  cashOut: number;
  currentBalance: number;
}

export type State =
  | "ANDHRA_PRADESH"
  | "ARUNACHAL_PRADESH"
  | "ASSAM"
  | "BIHAR"
  | "CHHATTISGARH"
  | "GOA"
  | "GUJARAT"
  | "HARYANA"
  | "HIMACHAL_PRADESH"
  | "JHARKHAND"
  | "KARNATAKA"
  | "KERALA"
  | "MADHYA_PRADESH"
  | "MAHARASHTRA"
  | "MANIPUR"
  | "MEGHALAYA"
  | "MIZORAM"
  | "NAGALAND"
  | "ODISHA"
  | "PUNJAB"
  | "RAJASTHAN"
  | "SIKKIM"
  | "TAMIL_NADU"
  | "TELANGANA"
  | "TRIPURA"
  | "UTTAR_PRADESH"
  | "UTTARAKHAND"
  | "WEST_BENGAL";

export type Profession =
  | "STUDENT"
  | "EMPLOYED"
  | "SELF_EMPLOYED"
  | "BUSINESS"
  | "RETIRED"
  | "UNEMPLOYED";

export type ExpenseCategory =
  | "EDUCATION"
  | "HEALTH"
  | "TRAVEL"
  | "FOOD"
  | "ENTERTAINMENT"
  | "BILL"
  | "HOUSING"
  | "ELECTRONICS"
  | "CLOTHING"
  | "INVESTS"
  | "MISCELLANEOUS"
  | "OTHER";

export type Gender =
  | "MALE"
  | "FEMALE"
  | "OTHER";


