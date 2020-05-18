import { Comment } from './interfaces'
import { children } from './types'
import { getTimeAgo, getVotes } from './util'

class Comments {
    private comments: Comment[]
    private level: number
    private hidden: boolean
    private id: string

    constructor(comments: Comment[], level: number=0, hidden: boolean=false, id: string='') {
        this.comments = comments
        this.level = level
        this.hidden = hidden
        this.id = id
    }

    public render(): Element {
        const commentClass = this.getCommentsClass(this.hidden, this.level, this.id)
        const comments = createElement('div', { class: commentClass })

        const elements = document.createDocumentFragment()

        for(const comment of this.comments) {
            elements.appendChild(this.renderComment(comment))
        }

        comments.appendChild(elements)

        return comments
    }

    private getCommentsClass(hidden: boolean, level: number, id: string) : string {
        const classNames = ['comments']

        if (hidden) {
            classNames.push('hide')
        }

        if (level) {
            classNames.push(`comments--level-${level}`)
        }

        if (id) {
            classNames.push(`comments--id-${id}`)
        }

        return classNames.join(' ')
    }

    private renderComment({ id, user, votes, replies, datePosted, message }: Comment) : Element {
        const commentContainer = createElement('div', { class: 'comment' })

        const commentAvatar = this.renderCommentAvatar(user.avatar)
        const commentMainContent = this.renderCommentMainContent({ id, user, votes, replies, datePosted, message })

        commentContainer.appendChild(commentAvatar)
        commentContainer.appendChild(commentMainContent)

        return commentContainer
    }

    private renderCommentAvatar(avatar: string) : Element {
        const commentAvatarContainer = createElement('div', { class: 'comment-avatar-container' })
        const commentAvatar = createElement('img', { class: 'comment-avatar', src: avatar })
        commentAvatarContainer.appendChild(commentAvatar)
        return commentAvatarContainer
    }

    private renderCommentMainContent({ id, user, votes, replies, datePosted, message }: Comment) : Element {
        const commentMainContent = createElement('div', { class: 'comment-main-content '})
        
        const commentHeader = this.renderCommentHeader(user.username, datePosted)
        const commentActions = this.renderCommentActions(votes)
        const commentMessage = createElement('p', { class: 'comment-message'}, message)
        const commentReplies = this.renderReplies(id, replies)

        commentMainContent.appendChild(commentHeader)
        commentMainContent.appendChild(commentMessage)
        commentMainContent.appendChild(commentActions)

        if (commentReplies) {
            commentMainContent.appendChild(commentReplies)
        }

        return commentMainContent
    }

    private renderReplies(id: string, replies: Comment[]) : Element {
        if (replies.length === 0) {
            return null
        }

        const SHOW_MESSAGE = `View ${replies.length} replies`
        const HIDE_MESSAGE = `Hide ${replies.length} replies`

        let isExpanded = false
        
        const commentRepliesContainer = createElement('div', { class: 'comment-replies' })
        
        const commentRepliesAction = createElement('div', { class: 'comment-replies-action '}, SHOW_MESSAGE)

        commentRepliesAction.addEventListener('click', () => {
            const commentReplies = document.querySelector(`.comments--id-${id}`)

            if (isExpanded) {
                commentReplies.classList.add('hide')
                commentRepliesAction.innerHTML = SHOW_MESSAGE
            } else {
                commentReplies.classList.remove('hide')
                commentRepliesAction.innerHTML = HIDE_MESSAGE
            }

            isExpanded = !isExpanded
        })

        const commentReplies = new Comments(replies, this.level + 1, true, id).render()
         
        commentRepliesContainer.appendChild(commentRepliesAction)
        commentRepliesContainer.appendChild(commentReplies)

        return commentRepliesContainer
    }

    private renderCommentActions(votes: number): Element {
        let currVotes = votes

        const commentActions = createElement('div', { class: 'comment-actions' })
        const voteUp = createElement('span', { class: 'vote-action vote-action--up' }, '+')
        const voteDown = createElement('span', { class: 'vote-action vote-action--down' }, '-')
        const commentVotes = createElement('span', { class: 'votes' }, getVotes(currVotes))

        voteUp.addEventListener('click', () => {
            currVotes += 1
            commentVotes.innerHTML = getVotes(currVotes)
        })

        voteDown.addEventListener('click', () => {
            currVotes -= 1
            commentVotes.innerHTML = getVotes(currVotes)
        })

        commentActions.appendChild(voteUp)
        commentActions.appendChild(commentVotes)
        commentActions.appendChild(voteDown)

        return commentActions
    }

    private renderCommentHeader(username: string, datePosted: Date) : Element {
        const commentHeader = createElement('div', { class: 'comment-header '})
        const commentDatePosted = createElement('span', { class: 'comment-date-posted' }, getTimeAgo(datePosted))
        const commentUser = createElement('span', { class: 'username' }, username)
        commentHeader.appendChild(commentUser)
        commentHeader.appendChild(commentDatePosted)
        return commentHeader
    }
}


function createElement(type: string, props: { [key: string]: any }, children: children='') : Element {
    const element = document.createElement(type)

    Object.keys(props).forEach(prop => {
        const value : string = props[prop]
        element.setAttribute(prop, value)
    })

    if (typeof children === 'string') {
        element.innerHTML = children
    } else if (children instanceof Element) {
        element.appendChild(children)
    }

    return element
}

export default Comments