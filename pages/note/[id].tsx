import { NoteState } from 'libs/web/state/note'
import { has } from 'lodash'
import router, { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import LayoutMain from 'components/layout/layout-main'
import { NoteTreeState } from 'libs/web/state/tree'
import NoteNav from 'components/note-nav'
import dynamic from 'next/dynamic'
import { GetServerSideProps, NextPage } from 'next'
import withTree from 'libs/server/with-tree'
import withUA from 'libs/server/with-ua'
import classNames from 'classnames'
import { useDarkMode } from 'next-dark-mode'
import { UIState } from 'libs/web/state/ui'
import { TreeModel } from 'libs/shared/tree'
import Link from 'next/link'

const NoteEditor = dynamic(() => import('components/editor/note-editor'))

const EditContainer = () => {
  const {
    title: { updateTitle },
  } = UIState.useContainer()
  const { darkModeActive } = useDarkMode()
  const { genNewId } = NoteTreeState.useContainer()
  const { fetchNote, initNote, note } = NoteState.useContainer()
  const { query } = useRouter()

  const loadNoteById = useCallback(
    (id: string) => {
      const pid = router.query.pid as string
      if (id === 'welcome') {
        return
      } else if (id === 'new') {
        const url = `/note/${genNewId()}?new` + (pid ? `&pid=${pid}` : '')

        router.replace(url, undefined, { shallow: true })
      } else if (id && !has(router.query, 'new')) {
        fetchNote(id).catch((msg) => {
          if (msg.status === 404) {
            // todo: toast
            console.error('页面不存在')
          }
          router.push('/', undefined, { shallow: true })
        })
      } else {
        initNote({
          id,
          content: '\n',
        })
      }
    },
    [fetchNote, genNewId, initNote]
  )

  useEffect(() => {
    loadNoteById(query.id as string)
  }, [loadNoteById, query.id])

  useEffect(() => {
    updateTitle(note?.title)
  }, [note?.title, updateTitle])

  return query.id !== 'welcome' ? (
    <>
      <NoteNav />
      <section
        className={classNames('overflow-y-scroll h-full', {
          'prose-dark': darkModeActive,
        })}
      >
        <NoteEditor />
      </section>
    </>
  ) : (
    <div>
      使用说明之类的
      <Link href="/note/new">
        <a>Create Note</a>
      </Link>
    </div>
  )
}

const EditNotePage: NextPage<{ tree: TreeModel }> = ({ tree }) => {
  return (
    <LayoutMain tree={tree}>
      <EditContainer />
    </LayoutMain>
  )
}

export default EditNotePage

export const getServerSideProps: GetServerSideProps = withUA(
  withTree(() => {
    return {}
  })
)