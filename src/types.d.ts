export type Account = {
  name: string;
  owns: OwnerCertificate[];
};

export type OwnerCertificate = {
  stockId: number;
  amount: number;
  initialValue: number;
  time: number;
};

export type Transaction = {
  account: Account;
  stock: Stock;
  amount: number;
  price: number;
  total: number;
  time: number;
  type: "BUY" | "SELL";
};

export type Stock = {
  id: number;
  name: string;
  shortName: string;
  value: number;
  volatile: number;
  min: number;
  max: number;
  historical: number[];
  color: string;
  mood: StockTendency;
};

export type StockTendency = 3 | 2 | 1 | 0 | -1 | -2 | -3;
