import { FC } from 'react'
import styled from 'styled-components'
import { ScrollbarGray } from '../../../../styles/scrollbars'
import {
  useCommentDraft,
  useComments,
  useScrollContainerRefs,
  useSidebar
} from '../../../../store/DocumentProvider'
import FullCommentItem from '../Comment/FullCommentItem'
import { useUser } from '../../../../store/UserProvider'
import { colors } from '../../../../theme'

const Sidebar: FC = () => {
  const { user } = useUser()
  const { sidebar, showResolved, setShowResolved } = useSidebar()
  const { comments } = useComments()
  const { commentDraft } = useCommentDraft()
  const { sidebarContainerRef } = useScrollContainerRefs()

  const unresolvedComments = comments.filter((comment) => !comment.resolved)
  const resolvedComments = comments.filter((comment) => comment.resolved)

  return (
    <Wrapper open={sidebar}>
      <Toggler>
        <ToggleItem active={!showResolved} onClick={() => setShowResolved(false)}>
          <p>Open</p>
          <ToggleNumber active={!showResolved}>
            <p>{unresolvedComments.length.toString()}</p>
          </ToggleNumber>
        </ToggleItem>
        <ToggleItem active={showResolved} onClick={() => setShowResolved(true)}>
          <p>Resolved</p>
          <ToggleNumber active={showResolved}>
            <p>{resolvedComments.length.toString()}</p>
          </ToggleNumber>
        </ToggleItem>
      </Toggler>
      <Menu ref={sidebarContainerRef}>
        {comments.length === 0 && !commentDraft && (
          <NoCommentsBox>
            <p>
              Hey {user?.userName},
              <br />
              <br />
              Seems like there has not been set any comment yet. <br />
              <br /> Be proactive! <br />
              It's a great way to communicate with your colleagues!
            </p>
          </NoCommentsBox>
        )}

        {commentDraft && (
          <FullCommentItem
            key={commentDraft._id}
            _id={commentDraft._id}
            left={commentDraft.left}
            top={commentDraft.top}
            resolved={commentDraft.resolved}
            timesEdited={commentDraft.timesEdited}
            className={commentDraft.className}
            content={commentDraft.content}
            createdAt={commentDraft.createdAt}
            createdBy={commentDraft.createdBy}
            document={commentDraft.document}
          />
        )}

        {/*Sort the comments in the sidebar by their (top) position in the document, not by the date they were added.*/}
        {showResolved
          ? resolvedComments.length > 0
            ? resolvedComments.map((comment) => {
                return (
                  <FullCommentItem
                    key={comment._id}
                    _id={comment._id}
                    left={comment.left}
                    top={comment.top}
                    resolved={comment.resolved}
                    timesEdited={comment.timesEdited}
                    className={comment.className}
                    content={comment.content}
                    createdAt={comment.createdAt}
                    createdBy={comment.createdBy}
                    document={comment.document}
                  />
                )
              })
            : comments.length !== 0 && (
                <NoCommentsBox>
                  <p>
                    Hey {user?.name}, <br /> there are currently no resolved comments.
                  </p>
                </NoCommentsBox>
              )
          : unresolvedComments.length > 0
          ? unresolvedComments.map((comment) => {
              return (
                <FullCommentItem
                  key={comment._id}
                  _id={comment._id}
                  left={comment.left}
                  top={comment.top}
                  resolved={comment.resolved}
                  timesEdited={comment.timesEdited}
                  className={comment.className}
                  content={comment.content}
                  createdAt={comment.createdAt}
                  createdBy={comment.createdBy}
                  document={comment.document}
                />
              )
            })
          : comments.length !== 0 && (
              <NoCommentsBox>
                <p>
                  Howdy {user?.name}, <br /> nice work today! <br /> There are currently no open
                  comments.
                </p>
              </NoCommentsBox>
            )}
      </Menu>
    </Wrapper>
  )
}

const NoCommentsBox = styled.div`
  border-radius: 0.5rem;
  opacity: 0.4;
`

const Wrapper = styled.div<{ open: boolean }>`
  background-color: ${colors.grey[0]};
  position: sticky;
  top: 6.4rem;
  width: 0;
  overflow: hidden;
  height: calc(100vh - 6.4rem);
  transition: width 0.2s ease-out;
  ${ScrollbarGray}

  ${({ open }) => open && `width: 30rem;`}
`

const Toggler = styled.div`
  height: 6rem;
  background-color: ${colors.grey[500]};
  display: flex;
  align-items: center;
  padding: 0 2rem;
  border-top: 0.1rem solid ${colors.grey[400]};
  border-bottom: 0.2rem solid ${colors.grey[200]};
`

const ToggleItem = styled.div<{ active: boolean }>`
  position: relative;
  height: 3rem;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 1rem;

  ${({ active }) =>
    active &&
    `
    &:after {
      content: '';
      position: absolute;
      bottom: -1.4rem;
      left: 0;
      width: 100%;
      height: 0.4rem;
      border-radius: 0.2rem;
      background-color: ${colors.complementary};
    }
  `}

  p {
    font-size: 1.6rem;
    color: ${({ active }) => (active ? colors.white : 'rgba(255,255,255,0.5)')}};
  }
`

const ToggleNumber = styled.div<{ active: boolean }>`
  height: 2.4rem;
  width: 2.4rem;
  border-radius: 50%;
  background-color: ${colors.grey[400]};
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    font-size: 1.2rem;
    color: ${({ active }) => (active ? colors.white : 'rgba(255,255,255,0.5)')}};
  }
`

const Menu = styled.div`
  max-height: 100%;
  height: calc(100% - 6rem);
  width: 100%;
  position: relative;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  scroll-behavior: smooth;
  overflow-x: hidden;
  overflow-y: scroll;
`

export default Sidebar
