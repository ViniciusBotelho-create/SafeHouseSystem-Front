import { useEffect, useState } from 'react'
import api from '../services/api'
import type { Category, CreateCategoryDto } from '../types/Category'
import { CategoryFinality } from '../types/Category'

const finalityLabel: Record<CategoryFinality, string> = {
  [CategoryFinality.Expense]: 'Despesa',
  [CategoryFinality.Income]: 'Receita',
  [CategoryFinality.Both]: 'Ambos',
}

const finalityColor: Record<CategoryFinality, { bg: string; color: string }> = {
  [CategoryFinality.Expense]: { bg: 'var(--red-light)', color: 'var(--red)' },
  [CategoryFinality.Income]: { bg: 'var(--green-light)', color: 'var(--green)' },
  [CategoryFinality.Both]: { bg: 'var(--yellow-light)', color: 'var(--yellow)' },
}

function Modal({ onClose, onSave }: { onClose: () => void; onSave: (d: CreateCategoryDto) => Promise<void> }) {
  const [description, setDescription] = useState('')
  const [finality, setFinality] = useState<CategoryFinality>(CategoryFinality.Expense)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) return
    setSaving(true)
    setErr('')
    try {
      await onSave({ description: description.trim(), finality })
      onClose()
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setErr(msg || 'Erro ao salvar.')
    } finally { setSaving(false) }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface)', borderRadius: 12, padding: 28, width: 400,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid var(--border)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 20 }}>Nova Categoria</div>
        {err && <div style={{ background: 'var(--red-light)', color: 'var(--red)', borderRadius: 6, padding: '8px 12px', fontSize: 13, marginBottom: 14 }}>{err}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Descrição</label>
            <input value={description} onChange={e => setDescription(e.target.value)} required placeholder="Nome da categoria"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13.5, outline: 'none', background: 'var(--bg)', color: 'var(--text)' }} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Finalidade</label>
            <select value={finality} onChange={e => setFinality(Number(e.target.value) as CategoryFinality)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13.5, outline: 'none', background: 'var(--bg)', color: 'var(--text)' }}>
              <option value={CategoryFinality.Expense}>Despesa</option>
              <option value={CategoryFinality.Income}>Receita</option>
              <option value={CategoryFinality.Both}>Ambos</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'var(--text-2)' }}>Cancelar</button>
            <button type="submit" disabled={saving} style={{ padding: '8px 18px', borderRadius: 7, border: 'none', background: 'var(--text)', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  function load() {
    api.get<Category[]>('/category').then(r => setCategories(r.data)).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  async function handleSave(data: CreateCategoryDto) {
    await api.post('/category', data)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir esta categoria?')) return
    setDeleting(id)
    await api.delete(`/category/${id}`).catch(() => {})
    setDeleting(null)
    load()
  }

  return (
    <div>
      <div className="animate-fade" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Categorias</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Organize despesas e receitas por categoria</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          padding: '9px 18px', borderRadius: 8, border: 'none',
          background: 'var(--text)', color: 'white', fontSize: 13, fontWeight: 500,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: 16 }}>+</span> Nova Categoria
        </button>
      </div>

      <div className="animate-fade-2" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Carregando...</div>
        ) : categories.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📁</div>
            <div style={{ fontWeight: 500, marginBottom: 6 }}>Nenhuma categoria</div>
            <div style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>Crie categorias para organizar suas transações</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)' }}>
                {['Descrição', 'Finalidade', 'Ações'].map(h => (
                  <th key={h} style={{ padding: '10px 20px', textAlign: h === 'Ações' ? 'right' : 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => {
                const fc = finalityColor[c.finality]
                return (
                  <tr key={c.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg)' }}>
                    <td style={{ padding: '13px 20px', fontWeight: 500, fontSize: 13.5 }}>{c.description}</td>
                    <td style={{ padding: '13px 20px' }}>
                      <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: fc.bg, color: fc.color }}>
                        {finalityLabel[c.finality]}
                      </span>
                    </td>
                    <td style={{ padding: '13px 20px', textAlign: 'right' }}>
                      <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                        style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #fca5a5', background: 'var(--red-light)', fontSize: 12, cursor: 'pointer', color: 'var(--red)', opacity: deleting === c.id ? 0.5 : 1 }}>
                        {deleting === c.id ? '...' : 'Excluir'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <Modal onClose={() => setShowModal(false)} onSave={handleSave} />}
    </div>
  )
}
