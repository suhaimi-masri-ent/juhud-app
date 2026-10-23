"use client";

import { useState, useEffect, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

type Ahbab = {
  id: string;
  fullname: string;
  created_at: string;
};

export default function Home() {
  const [ahbabList, setAhbabList] = useState<Ahbab[]>([]);
  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function muatAhbab() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("ahbab")
      .select("id, fullname, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setError("Gagal memuat data: " + error.message);
    } else {
      setAhbabList(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    muatAhbab();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fullname.trim()) return;

    setSubmitting(true);
    setError(null);

    const { error } = await supabase
      .from("ahbab")
      .insert({ fullname: fullname.trim() });

    if (error) {
      setError("Gagal menambah: " + error.message);
    } else {
      setFullname("");
      await muatAhbab();
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("ahbab").delete().eq("id", id);
    if (error) {
      setError("Gagal memadam: " + error.message);
    } else {
      await muatAhbab();
    }
  }

  return (
    <main className="page-container">
      <h1 className="page-title">Sistem Pengurusan Ahbab (HR)</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullname">
              Nama Ahbab
            </label>
            <input
              className="form-input"
              type="text"
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Masukkan nama Ahbab"
              required
              disabled={submitting}
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Menambah..." : "Tambah Ahbab"}
          </button>
        </form>
      </div>

      <h2 className="section-title">Senarai Ahbab</h2>

      {loading ? (
        <div className="loading-state">Memuatkan data...</div>
      ) : ahbabList.length === 0 ? (
        <div className="empty-state">Tiada data Ahbab lagi.</div>
      ) : (
        ahbabList.map((ahbab) => (
          <div key={ahbab.id} className="ahbab-card">
            <div>
              <div className="ahbab-name">{ahbab.fullname}</div>
              <div className="ahbab-date">
                {new Date(ahbab.created_at).toLocaleDateString("ms-MY", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(ahbab.id)}
            >
              Padam
            </button>
          </div>
        ))
      )}
    </main>
  );
}
