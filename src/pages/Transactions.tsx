import { useEffect, useState } from 'react'
import api from '../services/api'
import type { Transaction, CreateTransactionDto } from '../types/Transaction'
import { TransactionType } from '../types/Transaction'
import type { Category } from '../types/Category'
import type { Person } from '../types/Person'

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function calculateCategoryTotals(transactions: Transaction[]) {
  return transactions.reduce(
    (acc, t) => {
      if (t.type === TransactionType.Income) acc.income += t.amount
      else acc.expense += t.amount
      return acc
    },
    { income: 0, expense: 0 }
  )
}

function Modal({ onClose, onSave, categories, persons }: {
  onClose: () => void
  onSave: (d: CreateTransactionDto) => Promise<void>
  categories: Category[]
  persons: Person[]
}) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransactionType>(TransactionType.Expense)
  const [categoryId, setCategoryId] = useState('')
  const [personId, setPersonId] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim() || !amount || !categoryId || !personId) return
    setSaving(true)
    setErr('')
    try {
      await onSave({ description: description.trim(), amount: parseFloat(amount), type, categoryId, personId })
      onClose()
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setErr(msg || 'Erro ao salvar.')
    } finally { setSaving(false) }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid var(--border)',
    borderRadius: 7, fontSize: 13.5, outline: 'none', background: 'var(--bg)', color: 'var(--text)'
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
      <div style={{ background: 'var(--surface)', borderRadius: 12, padding: 28, width: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 20 }}>Nova Transação</div>
        {err && <div style={{ background: 'var(--red-light)', color: 'var(--red)', borderRadius: 6, padding: '8px 12px', fontSize: 13, marginBottom: 14 }}>{err}</div>}
        <form onSubmit={handleSubmit}>
          {/* Type toggle */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Tipo</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {([TransactionType.Expense, TransactionType.Income] as TransactionType[]).map(t => (
                <button key={t} type="button" onClick={() => setType(t)} style={{
                  flex: 1, padding: '8px', borderRadius: 7, border: '1px solid',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  borderColor: type === t ? (t === TransactionType.Income ? 'var(--green)' : '#fca5a5') : 'var(--border)',
                  background: type === t ? (t === TransactionType.Income ? 'var(--green-light)' : 'var(--red-light)') : 'transparent',
                  color: type === t ? (t === TransactionType.Income ? 'var(--green)' : 'var(--red)') : 'var(--text-2)',
                }}>
                  {t === TransactionType.Income ? '↑ Receita' : '↓ Despesa'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Descrição</label>
            <input value={description} onChange={e => setDescription(e.target.value)} required placeholder="Descrição da transação" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Valor (R$)</label>
              <input value={amount} onChange={e => setAmount(e.target.value)} required type="number" min="0.01" step="0.01" placeholder="0,00" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Morador</label>
              <select value={personId} onChange={e => setPersonId(e.target.value)} required style={inputStyle}>
                <option value="">Selecionar...</option>
                {persons.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Categoria</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required style={inputStyle}>
              <option value="">Selecionar...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.description}</option>)}
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

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [persons, setPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  function load() {
    Promise.all([
      api.get<Transaction[]>('/transaction'),
      api.get<Category[]>('/category'),
      api.get<Person[]>('/person'),
    ]).then(([t, c, p]) => {
      setTransactions(t.data)
      setCategories(c.data)
      setPersons(p.data)
    }).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  async function handleSave(data: CreateTransactionDto) {
    await api.post('/transaction', data)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir esta transação?')) return
    setDeleting(id)
    await api.delete(`/transaction/${id}`).catch(() => {})
    setDeleting(null)
    load()
  }

  const totalIncome = transactions.filter(t => t.type === TransactionType.Income).reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === TransactionType.Expense).reduce((s, t) => s + t.amount, 0)

const totalsByCategory = categories.map(c => {
  const t = transactions.filter(t => t.categoryId === c.id)
  const { income, expense } = calculateCategoryTotals(t)

  return {
    categoryId: c.id,
    categoryDescription: c.description,
    income,
    expense,
    balance: income - expense
  }
}).filter(c => c.income > 0 || c.expense > 0)

  return (
    <div>
      <div className="animate-fade" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Transações</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Registre receitas e despesas</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: 'var(--text)', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 16 }}>+</span> Nova Transação
        </button>
      </div>

      {/* Mini stats */}
      {!loading && transactions.length > 0 && (
        <div className="animate-fade-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 18px', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Receitas</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--green)' }}>{fmt(totalIncome)}</div>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 18px', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Despesas</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--red)' }}>{fmt(totalExpense)}</div>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 18px', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Saldo</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: (totalIncome - totalExpense) >= 0 ? 'var(--green)' : 'var(--red)' }}>{fmt(totalIncome - totalExpense)}</div>
          </div>
        </div>
        
      )}

      {!loading && totalsByCategory.length > 0 && (
      <div className="animate-fade-2" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          Totais por Categoria
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {totalsByCategory.map(c => (
            <div key={c.categoryId} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '12px 16px',
              boxShadow: 'var(--shadow)', minWidth: 150
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500, marginBottom: 4 }}>
                {c.categoryDescription}
              </div>
             <div style={{ fontSize: 16, fontWeight: 600 }}>
                <div style={{ color: 'var(--green)' }}>+ {fmt(c.income)}</div>
                <div style={{ color: 'var(--red)' }}>- {fmt(c.expense)}</div>
                <div style={{
                  marginTop: 4,
                  color: c.balance >= 0 ? 'var(--green)' : 'var(--red)',
                  fontWeight: 600
                }}>
                  Saldo: {fmt(c.balance)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

      <div className="animate-fade-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Carregando...</div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💳</div>
            <div style={{ fontWeight: 500, marginBottom: 6 }}>Nenhuma transação</div>
            <div style={{ color: 'var(--text-3)', fontSize: 13 }}>Adicione sua primeira transação</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)' }}>
                {['Tipo', 'Descrição', 'Categoria', 'Valor', 'Ações'].map(h => (
                  <th key={h} style={{ padding: '10px 20px', textAlign: h === 'Ações' ? 'right' : 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => {
                const isIncome = t.type === TransactionType.Income
                return (
                  <tr key={t.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg)' }}>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px',
                        borderRadius: 20, fontSize: 12, fontWeight: 500,
                        background: isIncome ? 'var(--green-light)' : 'var(--red-light)',
                        color: isIncome ? 'var(--green)' : 'var(--red)',
                      }}>
                        {isIncome ? '↑' : '↓'} {isIncome ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 20px', fontSize: 13.5, fontWeight: 500 }}>{t.description}</td>
                    <td style={{ padding: '12px 20px', color: 'var(--text-2)', fontSize: 13 }}>{t.categoryDescription}</td>
                    <td style={{ padding: '12px 20px', fontWeight: 600, fontSize: 13.5, color: isIncome ? 'var(--green)' : 'var(--red)' }}>
                      {isIncome ? '+' : '-'}{fmt(t.amount)}
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                      <button onClick={() => handleDelete(t.id)} disabled={deleting === t.id}
                        style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #fca5a5', background: 'var(--red-light)', fontSize: 12, cursor: 'pointer', color: 'var(--red)', opacity: deleting === t.id ? 0.5 : 1 }}>
                        {deleting === t.id ? '...' : 'Excluir'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <Modal onClose={() => setShowModal(false)} onSave={handleSave} categories={categories} persons={persons} />}
    </div>
  )
}
