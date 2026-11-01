import { api } from "@/lib/axios";
import { LoginData, LoginResponse, Products, UpdateProducts } from "@/types/auth";

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", data);

  return response.data;
};
export const getProducts = async (): Promise<Products[]> => {
  const response = await api.get("/products");

  return response.data;
};

export const addProduct = async (
  data: Omit<Products, "id">
): Promise<Products> => {
  const response = await api.post("/products", data);

  return response.data;
};
export const updateProduct = async (
  data: UpdateProducts
): Promise<Products> => {
  const response = await api.put(`/products/${data.id}`, data);

  return response.data;
};

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};