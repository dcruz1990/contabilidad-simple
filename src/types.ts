export type Account = {
  id: number;
  nature: string;
  balance: number;
  name: string;
  created_at: string;
};

export type Operation = {
  id?: number;
  name: string;
  description: string;
  created_at?: string;
  account: number;
  debit: number;
  credit: number;
  initialAmmount?: number;
  finalAmmount?: number;
};


