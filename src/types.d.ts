export type Account = {
  id: number;
  name: string;
  owns: OwnerCertificate[];
};

export type OwnerCertificate = {
  id: number;
  stockId: number;
  amount: number;
  initialValue: number;
  // time: number;
};

export type Transaction = {
  id: number;
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

export type StockTendency = number;
