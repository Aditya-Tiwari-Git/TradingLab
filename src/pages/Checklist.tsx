import { useEffect, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { createChecklistItem, deleteChecklistItem, fetchChecklistItems, updateChecklistItem } from '../services/checklist'
import type { ChecklistItem } from '../types'

export const Checklist = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [text, setText] = useState('')
  const [section, setSection] = useState<'Pre Market' | 'Post Market'>('Pre Market')

  const load = async () => {
    setItems(await fetchChecklistItems(date))
  }

  useEffect(() => {
    load()
  }, [date])

  const handleAdd = async () => {
    if (!text.trim()) return
    await createChecklistItem({ date, section, text, completed: false })
    setText('')
    await load()
  }

  const handleToggle = async (item: ChecklistItem) => {
    await updateChecklistItem(item.id, { completed: !item.completed })
    await load()
  }

  const handleDelete = async (item: ChecklistItem) => {
    await deleteChecklistItem(item.id)
    await load()
  }

  return (
    <AppShell>
      <TopBar title="Daily Checklist" subtitle="Stay consistent with your routine." />
      <Card>
        <div className="flex flex-wrap gap-3">
          <Input label="Date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
          <label className="flex flex-col gap-1 text-sm text-slate-300" title="Checklist section">
            <span className="text-xs uppercase tracking-wide text-slate-500" title="Checklist section">
              Section
            </span>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value as 'Pre Market' | 'Post Market')}
              className="rounded-xl border border-bg-700/80 bg-bg-900/70 px-3 py-2 text-sm text-slate-200"
              title="Checklist section"
            >
              <option value="Pre Market">Pre Market</option>
              <option value="Post Market">Post Market</option>
            </select>
          </label>
          <Input label="Task" required value={text} onChange={(e) => setText(e.target.value)} />
          <div className="flex items-end">
            <Button onClick={handleAdd}>Add Task</Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {['Pre Market', 'Post Market'].map((sectionLabel) => (
          <Card key={sectionLabel}>
            <h3 className="text-sm font-semibold text-slate-200">{sectionLabel}</h3>
            <div className="mt-3 space-y-2">
              {items
                .filter((item) => item.section === sectionLabel)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-bg-700/70 bg-bg-900/50 px-3 py-2 text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={item.completed} onChange={() => handleToggle(item)} />
                      <span className={item.completed ? 'line-through text-slate-500' : ''}>{item.text}</span>
                    </label>
                    <button onClick={() => handleDelete(item)} className="text-xs text-red-400 hover:text-red-300">
                      Remove
                    </button>
                  </div>
                ))}
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  )
}

