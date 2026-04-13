import { useEffect, useState } from 'react'
import api from '../services/api'
import type { Person, CreatePersonDto } from '../types/Person'

function Modal({ onClose, onSave, initial }: {
  onClose: () => void
  onSave: (data: CreatePersonDto) => Promise<void>
  initial?: Person
}) {
  const [name, setName] = useState(initial?.name || '')
  const [age, setAge] = useState(initial?.age?.toString() || '')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !age) return
    setSaving(true)
    setErr('')
    try {
      await onSave({ name: name.trim(), age: Number(age) })
      onClose()
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setErr(msg || 'Erro ao salvar.')
    } finally {
      setSaving(false)
    }
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
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 20 }}>
          {initial ? 'Editar Morador' : 'Novo Morador'}
        </div>
        {err && (
          <div style={{ background: 'var(--red-light)', color: 'var(--red)', borderRadius: 6, padding: '8px 12px', fontSize: 13, marginBottom: 14 }}>
            {err}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Nome</label>
            <input
              value={name} onChange={e => setName(e.target.value)} required
              placeholder="Nome completo"
              style={{
                width: '100%', padding: '9px 12px', border: '1px solid var(--border)',
                borderRadius: 7, fontSize: 13.5, outline: 'none', background: 'var(--bg)',
                color: 'var(--text)',
              }}
            />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Idade</label>
            <input
              value={age} onChange={e => setAge(e.target.value)} required type="number" min="1" max="120"
              placeholder="Idade"
              style={{
                width: '100%', padding: '9px 12px', border: '1px solid var(--border)',
                borderRadius: 7, fontSize: 13.5, outline: 'none', background: 'var(--bg)',
                color: 'var(--text)',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{
              padding: '8px 16px', borderRadius: 7, border: '1px solid var(--border)',
              background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'var(--text-2)',
            }}>Cancelar</button>
            <button type="submit" disabled={saving} style={{
              padding: '8px 18px', borderRadius: 7, border: 'none',
              background: 'var(--text)', color: 'white', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', opacity: saving ? 0.6 : 1,
            }}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Persons() {
  const [persons, setPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'create' | Person | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  function load() {
    api.get<Person[]>('/person').then(r => setPersons(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleSave(data: CreatePersonDto) {
    if (modal && typeof modal === 'object') {
      await api.put(`/person/${modal.id}`, data)
    } else {
      await api.post('/person', data)
    }
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir este morador?')) return
    setDeleting(id)
    await api.delete(`/person/${id}`).catch(() => {})
    setDeleting(null)
    load()
  }

  return (
    <div>
      <div className="animate-fade" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Moradores</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Gerencie os moradores do sistema</p>
        </div>
        <button onClick={() => setModal('create')} style={{
          padding: '9px 18px', borderRadius: 8, border: 'none',
          background: 'var(--text)', color: 'white', fontSize: 13, fontWeight: 500,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Novo Morador
        </button>
      </div>

      <div className="animate-fade-2" style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Carregando...</div>
        ) : persons.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>👤</div>
            <div style={{ fontWeight: 500, marginBottom: 6 }}>Nenhum morador</div>
            <div style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>Adicione o primeiro morador para começar</div>
            <button onClick={() => setModal('create')} style={{
              padding: '8px 16px', borderRadius: 7, border: '1px solid var(--border)',
              background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'var(--text-2)',
            }}>
              Adicionar morador
            </button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)' }}>
                {['Nome', 'Idade', 'Ações'].map(h => (
                  <th key={h} style={{
                    padding: '10px 20px', textAlign: h === 'Ações' ? 'right' : 'left',
                    fontSize: 11, fontWeight: 600, color: 'var(--text-3)',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {persons.map((p, i) => (
                <tr key={p.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg)' }}>
                  <td style={{ padding: '13px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: 'var(--surface-2)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 600, color: 'var(--text-2)', flexShrink: 0,
                      }}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500, fontSize: 13.5 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 20px', color: 'var(--text-2)', fontSize: 13 }}>{p.age} anos</td>
                  <td style={{ padding: '13px 20px', textAlign: 'right' }}>
                    <button onClick={() => setModal(p)} style={{
                      padding: '5px 12px', borderRadius: 6, border: '1px solid var(--border)',
                      background: 'transparent', fontSize: 12, cursor: 'pointer', color: 'var(--text-2)', marginRight: 6,
                    }}>Editar</button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      style={{
                        padding: '5px 12px', borderRadius: 6, border: '1px solid #fca5a5',
                        background: 'var(--red-light)', fontSize: 12, cursor: 'pointer', color: 'var(--red)',
                        opacity: deleting === p.id ? 0.5 : 1,
                      }}>
                      {deleting === p.id ? '...' : 'Excluir'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal
          onClose={() => setModal(null)}
          onSave={handleSave}
          initial={typeof modal === 'object' ? modal : undefined}
        />
      )}
    </div>
  )
}
