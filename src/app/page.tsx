"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from "@/service/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Products, UpdateProducts } from "@/types/auth";

export default function Page() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateProducts>({
    id: 0,
    title: "",
    price: 0,
    description: "",
    category: "",
    image: ""
  });

  const [form, setForm] = useState({
    title: "",
    price: 0,
    description: "",
    category: "",
    image: ""
  });

  const editMutation = useMutation({
    mutationFn: updateProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditOpen(false);
    }
  });

  const handleEdit = (product: Products) => {
    setEditForm({
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image
    });

    setEditOpen(true);
  };

  const addMutation = useMutation({
    mutationFn: addProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"]
      });

      setOpen(false);

      setForm({
        title: "",
        price: 0,
        description: "",
        category: "",
        image: ""
      });
    }
  });
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      alert("Product deleted!");
    },

    onError: () => {
      alert("Delete failed!");
    }
  });

  const handleLogout = () => {
    Cookies.remove("token");
    router.replace("/login");
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts
  });

  return (
    <div className="min-h-screen bg-[#080808] text-white p-6">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-semibold">Products</h1>

        <button
          onClick={handleLogout}
          className="bg-[#1c1c1c] px-5 py-2 rounded-lg hover:bg-[#292929]"
        >
          Logout
        </button>
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-medium">All Products</h2>

        <button
          onClick={() => setOpen(true)}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium"
        >
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto border border-[#252525] rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-[#151515] border text-white-400">
            <tr>
              <th className="p-4 border">ID</th>
              <th className="border p-4">Product</th>
              <th className="border p-4">Category</th>
              <th className="border p-4">Price</th>
              <th className="border p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="p-5 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td colSpan={5} className="p-5 text-center text-red-500">
                  Nma durn hattoo
                </td>
              </tr>
            )}

            {data?.map((product) => (
              <tr key={product.id} className="border-t border-[#252525]">
                <td className="p-4">{product.id}</td>

                <td className="p-4 flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-10 h-10 object-contain"
                  />
                  {product.title}
                </td>

                <td className="p-4">{product.category}</td>

                <td className="p-4">${product.price}</td>

                <td className="p-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-[#292929] text-white px-3 py-2 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(product.id)}
                    disabled={deleteMutation.isPending}
                    className="rounded-lg bg-red-700 px-3 py-2 text-sm  transition  disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            editMutation.mutate(editForm);
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            value={editForm.title}
            onChange={(e) =>
              setEditForm({ ...editForm, title: e.target.value })
            }
            placeholder="Product title"
            className="rounded-xl bg-[#242424] p-3 text-white outline-none"
          />

          <input
            type="number"
            value={editForm.price}
            onChange={(e) =>
              setEditForm({ ...editForm, price: Number(e.target.value) })
            }
            placeholder="Price"
            className="rounded-xl bg-[#242424] p-3 text-white outline-none"
          />

          <input
            type="text"
            value={editForm.category}
            onChange={(e) =>
              setEditForm({ ...editForm, category: e.target.value })
            }
            placeholder="Category"
            className="rounded-xl bg-[#242424] p-3 text-white outline-none"
          />

          <input
            type="text"
            value={editForm.image}
            onChange={(e) =>
              setEditForm({ ...editForm, image: e.target.value })
            }
            placeholder="Image URL"
            className="rounded-xl bg-[#242424] p-3 text-white outline-none"
          />

          <textarea
            value={editForm.description}
            onChange={(e) =>
              setEditForm({ ...editForm, description: e.target.value })
            }
            placeholder="Description"
            className="rounded-xl bg-[#242424] p-3 text-white outline-none"
          />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setEditOpen(false)}>
              Cancel
            </button>

            <button type="submit" disabled={editMutation.isPending}>
              {editMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addMutation.mutate(form);
              }}
              className="w-full max-w-md bg-[#111] p-6 rounded-xl flex flex-col gap-3"
            >
              <h2 className="text-xl font-semibold text-white mb-2">
                Add Product
              </h2>

              <input
                placeholder="Product title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-[#1c1c1c] text-white p-3 rounded-lg outline-none border border-[#333] focus:border-gray-500"
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={form.price || ""}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="bg-[#1c1c1c] text-white p-3 rounded-lg outline-none border border-[#333] focus:border-gray-500"
                required
              />

              <input
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="bg-[#1c1c1c] text-white p-3 rounded-lg outline-none border border-[#333] focus:border-gray-500"
                required
              />

              <input
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="bg-[#1c1c1c] text-white p-3 rounded-lg outline-none border border-[#333] focus:border-gray-500"
                required
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="bg-[#1c1c1c] text-white p-3 rounded-lg outline-none border border-[#333] focus:border-gray-500 resize-none"
                rows={3}
                required
              />

              <button
                type="submit"
                disabled={addMutation.isPending}
                className="bg-white text-black p-3 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50"
              >
                {addMutation.isPending ? "Adding..." : "Add Product"}
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="bg-[#252525] text-white p-3 rounded-lg hover:bg-[#333]"
              >
                Cancel
              </button>

              {addMutation.isError && (
                <p className="text-red-500 text-sm">
                  Product qo‘shishda xatolik!
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
