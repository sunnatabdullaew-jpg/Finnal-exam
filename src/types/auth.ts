export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}
export interface Products {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}
export type UpdateProducts = Partial<Omit<Products, "id">> & {
  id: number;
};
