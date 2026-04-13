import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import type { Summary } from '../types/Summary'

function StatCard({ label, value, sub, color, delay }: {
  label: string
  value: string
  sub?: string
  color?: string
  delay?: string
}) {
  return (
    <div
      className={`animate-fade${delay || ''}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '20px 22px',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, color: color || 'var(--text)', lineHeight: 1.2, marginBottom: sub ? 4 : 0 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{sub}</div>}
    </div>
  )
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Summary>('/person/summary')
      .then(r => setSummary(r.data))
      .catch(() => setError('Não foi possível carregar o resumo.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Header */}
      <div className="animate-fade" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Visão geral do sistema SafeHouse</p>
      </div>

      {loading && (
        <div style={{ color: 'var(--text-3)', padding: '40px 0', textAlign: 'center' }}>Carregando...</div>
      )}
      {error && (
        <div style={{
          background: 'var(--red-light)', border: '1px solid #fca5a5',
          color: 'var(--red)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 20
        }}>{error}</div>
      )}

      {summary && (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
            <StatCard label="Receita Total" value={fmt(summary.totalIncome)} color="var(--green)" delay="-2" />
            <StatCard label="Despesa Total" value={fmt(summary.totalExpense)} color="var(--red)" delay="-3" />
            <StatCard
              label="Saldo"
              value={fmt(summary.balance)}
              color={summary.balance >= 0 ? 'var(--green)' : 'var(--red)'}
              sub={summary.balance >= 0 ? 'Positivo' : 'Negativo'}
              delay="-4"
            />
          </div>

          {/* Persons table */}
          <div className="animate-fade-5" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Moradores</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{summary.persons.length} pessoa(s)</div>
              </div>
              <Link to="/persons" style={{
                fontSize: 12, color: 'var(--accent)', fontWeight: 500, textDecoration: 'none',
                padding: '5px 12px', background: 'var(--accent-light)', borderRadius: 6,
              }}>
                Ver todos →
              </Link>
            </div>

            {summary.persons.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-3)' }}>
                Nenhum morador cadastrado.{' '}
                <Link to="/persons" style={{ color: 'var(--accent)' }}>Adicionar</Link>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-2)' }}>
                    {['Nome', 'Receitas', 'Despesas', 'Saldo'].map(h => (
                      <th key={h} style={{
                        padding: '10px 20px', textAlign: 'left',
                        fontSize: 11, fontWeight: 600, color: 'var(--text-3)',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {summary.persons.map((p, i) => (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg)' }}>
                      <td style={{ padding: '12px 20px', fontWeight: 500, fontSize: 13.5 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'var(--surface-2)',
                            border: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 600, color: 'var(--text-2)',
                            flexShrink: 0,
                          }}>
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          {p.name}
                        </div>
                      </td>
                      <td style={{ padding: '12px 20px', color: 'var(--green)', fontWeight: 500, fontSize: 13 }}>{fmt(p.totalIncome)}</td>
                      <td style={{ padding: '12px 20px', color: 'var(--red)', fontWeight: 500, fontSize: 13 }}>{fmt(p.totalExpense)}</td>
                      <td style={{ padding: '12px 20px', fontWeight: 600, fontSize: 13, color: p.balance >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {fmt(p.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
