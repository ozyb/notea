import dayjs from 'dayjs'
import Link from 'next/link'
import { FC } from 'react'
import { NoteCacheItem } from 'libs/web/cache'
import MarkText from 'components/modal/filter-modal/mark-text'
import ModalState from 'libs/web/state/modal'

const SearchItem: FC<{
  note: NoteCacheItem
  keyword?: string
}> = ({ note, keyword }) => {
  const {
    search: { close },
  } = ModalState.useContainer()

  return (
    <li className="hover:bg-gray-200 cursor-pointer">
      <Link href={`/${note.id}`}>
        <a className="py-2 px-4 block text-xs text-gray-500" onClick={close}>
          <h4 className="text-sm font-bold">
            <MarkText text={note.title} keyword={keyword} />
          </h4>
          <p className="mt-1">
            <MarkText text={note.rawContent} keyword={keyword} />
          </p>
          <time className="text-gray-300 mt-2 block" dateTime={note.date}>
            {dayjs(note.date).format('DD/MM/YYYY HH:mm')}
          </time>
        </a>
      </Link>
    </li>
  )
}

export default SearchItem