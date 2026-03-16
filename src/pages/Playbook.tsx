import { useEffect, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { createPlaybook, deletePlaybook, fetchPlaybook } from '../services/playbook'
import type { PlaybookSetup } from '../types'

export const Playbook = () => {
  const [setups, setSetups] = useState<PlaybookSetup[]>([])
  const [name, setName] = useState('')
  const [rules, setRules] = useState('')
  const [checklist, setChecklist] = useState('')

  const load = async () => {
    setSetups(await fetchPlaybook())
  }

  useEffect(() => {
    load()
  }, [])

  const handleAdd = async () => {
    if (!name.trim()) return
    const checklistItems = checklist
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((text) => ({ text, checked: false }))
    await createPlaybook({ name, rules, checklist: checklistItems })
    setName('')
    setRules('')
    setChecklist('')
    await load()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this setup?')) return
    await deletePlaybook(id)
    await load()
  }

  return (
    <AppShell>
      <TopBar title="Trade Playbook" subtitle="Create setup templates and checklists." />
      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Setup Name" required value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea label="Rules" value={rules} onChange={(e) => setRules(e.target.value)} />
          <Textarea label="Checklist (comma separated)" value={checklist} onChange={(e) => setChecklist(e.target.value)} />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleAdd}>Add Setup</Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {setups.map((setup) => (
          <Card key={setup.id}>
            <h3 className="text-sm font-semibold text-slate-200">{setup.name}</h3>
            <p className="mt-2 text-xs text-slate-500">{setup.rules}</p>
            <ul className="mt-3 list-disc pl-4 text-xs text-slate-400">
              {setup.checklist?.map((item) => (
                <li key={item.text}>{item.text}</li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={() => handleDelete(setup.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  )
}

