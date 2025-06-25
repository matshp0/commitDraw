export type Action = {
  before: string;
  after: string;
  cell: Cell;
};

export type Cell = {
  column: number;
  row: number;
};
