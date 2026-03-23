import { useEffect, useState } from "react";
import { api } from "../api";
import type { Product } from "../types";

const emptyForm = {
  title: "",
  description: "",
  category: "Electronics",
  price: 0,
  image: "",
  stock: 0,
};

export const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);

  const fetchProducts = async () => {
    const { data } = await api.get("/products");
    setProducts(data);
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/admin/products", { ...form, rating: 4.4 });
    setForm(emptyForm);
    await fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    await api.delete(`/admin/products/${id}`);
    await fetchProducts();
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Admin Product Manager</h1>
      <form onSubmit={addProduct} className="mt-4 grid gap-2 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-3">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="rounded border border-slate-300 px-3 py-2" />
        <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="rounded border border-slate-300 px-3 py-2" />
        <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Price" className="rounded border border-slate-300 px-3 py-2" />
        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="rounded border border-slate-300 px-3 py-2" />
        <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} placeholder="Stock" className="rounded border border-slate-300 px-3 py-2" />
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded border border-slate-300 px-3 py-2 md:col-span-2" />
        <button className="rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white">Add Product</button>
      </form>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {products.map((product) => (
          <article key={product._id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
            <div>
              <p className="font-semibold">{product.title}</p>
              <p className="text-sm text-slate-600">${product.price.toFixed(2)}</p>
            </div>
            <button onClick={() => deleteProduct(product._id)} className="rounded bg-red-100 px-3 py-2 text-xs font-medium text-red-700">
              Delete
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};
