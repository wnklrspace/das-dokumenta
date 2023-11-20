import { FC } from 'react'
import styled from 'styled-components'
import DocumentCard from './DocumentCard'
import { useRoom, useSocket } from '../../../../store/SocketProvider'
import { useUser } from '../../../../store/UserProvider'
import { DocumentProps, UserProps } from '../../../../types'
import { ErrorMessages } from '../../../../types/Errors'
import Skeleton from './Skeleton'

interface Props {
  documents: DocumentProps[]
}

const DocumentCardList: FC<Props> = ({ documents }) => {
  const socket = useSocket()
  const { user } = useUser()
  const { roomsObserver } = useRoom()

  function handleOpenDocumentRoom({
    slug,
    user,
    document
  }: {
    slug: string
    user: UserProps
    document: DocumentProps
  }) {
    if (!user) return

    socket.emit(
      'roomCheck',
      slug,
      user,
      document,
      (response: { isSuccess: boolean; message: ErrorMessages }) => {
        console.log(response.isSuccess, slug + ' successfully checked')
      }
    )
  }

  return (
    <DocumentCardWrapper>
      {documents.length === 0
        ? [0, 1, 2].map((_, index) => <Skeleton key={index} />)
        : documents
            .sort((a, b) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            })
            .map((document, index) => {
              const room = roomsObserver.find((room) => {
                return room._id === document.slug
              })

              return (
                <DocumentCard
                  key={document._id + index}
                  _id={document._id}
                  title={document.title}
                  slug={document.slug}
                  createdAt={document.createdAt}
                  createdBy={document.createdBy}
                  comments={document.comments}
                  filePath={document.filePath}
                  handleOpenDocument={() =>
                    handleOpenDocumentRoom({
                      slug: document.slug,
                      user: user as UserProps,
                      document: document as DocumentProps
                    })
                  }
                  availableTo={[]}
                  activeUsers={room ? room.users : []}
                  unresolvedComments={0}
                />
              )
            })}
    </DocumentCardWrapper>
  )
}

const DocumentCardWrapper = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 1fr);
  grid-auto-rows: auto;
  grid-gap: 16px;

  @media screen and (min-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 16px;
  }

  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

export default DocumentCardList
