import { useEffect, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { createNote, deleteNote, fetchNotes } from '../services/notes'
import type { LearningNote } from '../types'

export const Notes = () => {
  const [notes, setNotes] = useState<LearningNote[]>([])
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')

  const load = async () => {
    setNotes(await fetchNotes())
  }

  useEffect(() => {
    load()
  }, [])

  const handleAdd = async () => {
    if (!title.trim()) return
    const tagArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
    await createNote({ title, tags: tagArray, content })
    setTitle('')
    setTags('')
    setContent('')
    await load()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this note?')) return
    await deleteNote(id)
    await load()
  }

  return (
    <AppShell>
      <TopBar title="Learning Notes" subtitle="Capture trading insights and lessons." />
      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input label="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
          <Textarea label="Content" required value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleAdd}>Add Note</Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {notes.map((note) => (
          <Card key={note.id}>
            <h3 className="text-sm font-semibold text-slate-200">{note.title}</h3>
            <p className="mt-2 text-xs text-slate-400">{note.tags?.join(', ')}</p>
            <p className="mt-3 text-xs text-slate-300 whitespace-pre-wrap">{note.content}</p>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={() => handleDelete(note.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  )
}

