import { Comment } from './interfaces'
import { children } from './types'
import { getTimeAgo, getVotes } from './util'
import { v4 as uuidv4 } from 'uuid'

class EventEmitter {
    private events: { [key: string]: Array<(arg: any) => void> }

    constructor() {
        this.events = {}
    }

    emit(event: string, arg: any) {
        for (const cb of this.events[event]) {
            cb(arg)
        }
    }

    subscribe(event: string, cb: (arg: any) => void) {
        if (!(event in this.events)) {
            this.events[event] = []
        }

        this.events[event].push(cb)
    }
}

class Comments {
    private comments: Comment[]
    private level: number
    private hidden: boolean
    private id: string
    private emitter: EventEmitter

    constructor(comments: Comment[], level: number=0, hidden: boolean=false, id: string='') {
        this.comments = comments
        this.level = level
        this.hidden = hidden
        this.id = id
        this.emitter = new EventEmitter()
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
        const commentMessage = createElement('p', { class: 'comment-message'}, message)
        const commentReplies = this.renderReplies(id, replies)
        const commentActions = this.renderCommentActions(id, votes)

        commentMainContent.appendChild(commentHeader)
        commentMainContent.appendChild(commentMessage)
        commentMainContent.appendChild(commentActions)

        if (commentReplies) {
            commentMainContent.appendChild(commentReplies)
        }

        return commentMainContent
    }

    private renderReplies(id: string, replies: Comment[]) : Element {
        let isExpanded = false
        
        const commentReplies = new Comments(replies, this.level + 1, true, id).render()

        const commentRepliesContainer = createElement('div', { class: 'comment-replies' })

        if (replies.length === 0) {
            commentRepliesContainer.classList.add('hide')
        }
        
        const commentRepliesAction = createElement('div', { class: 'comment-replies-action'}, `View ${commentReplies.children.length} replies`)

        commentRepliesAction.addEventListener('click', () => {
            const commentReplies = document.querySelector(`.comments--id-${id}`)

            if (isExpanded) {
                commentReplies.classList.add('hide')
                commentRepliesAction.innerHTML = `View ${commentReplies.children.length} replies`
            } else {
                commentReplies.classList.remove('hide')
                commentRepliesAction.innerHTML = `Hide ${commentReplies.children.length} replies`
            }

            isExpanded = !isExpanded
        })

        this.emitter.subscribe(`add-comment-${id}`, (comment: Comment) => {
            const hadNoChildren = commentReplies.children.length === 0

            commentReplies.appendChild(this.renderComment(comment))

            if (hadNoChildren) {
                commentRepliesContainer.classList.remove('hide')
            }

            isExpanded = true
            commentReplies.classList.remove('hide')
            commentRepliesAction.innerHTML = `Hide ${commentReplies.children.length} replies`
        }) 
         
        commentRepliesContainer.appendChild(commentRepliesAction)
        commentRepliesContainer.appendChild(commentReplies)

        return commentRepliesContainer
    }

    private renderReplySection(id: string): Element {
        const replySection = createElement('div', { class: 'reply-section-container hide' })

        const topSection = createElement('div', { class: 'reply-top-section'})
        const myAvatar = createElement('img', { class: 'profile-avatar', src: 'http://lh3.googleusercontent.com/-kx9VF9ZLPOw/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmMt_bsuybzC6vMz1l6jL7blh2MYA/s88/photo.jpg'})
        const inputReply = createElement('input', { class: 'input-reply', type: 'text', placeholder: 'Add a public reply...'}) as HTMLInputElement
                
        topSection.appendChild(myAvatar)
        topSection.appendChild(inputReply)

        const bottomSection = createElement('div', { class: 'reply-bottom-section' })
        const cancelButton = createElement('div', { class: 'cancel-button' }, 'CANCEL')
        const replyButton = createElement('div', { class: 'reply-button' }, 'REPLY')

        let replyValue = ''

        replyButton.addEventListener('click', () => {
            if (replyValue) {
                const newComment = {
                    id: uuidv4(),
                    user: {
                        username: 'Pedram T\'Kanchi',
                        avatar: 'http://lh3.googleusercontent.com/-kx9VF9ZLPOw/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmMt_bsuybzC6vMz1l6jL7blh2MYA/s88/photo.jpg'
                    },
                    votes: 0,
                    datePosted: new Date(),
                    replies: [] as Comment[],
                    message: replyValue
                }

                this.emitter.emit(`add-comment-${id}`, newComment)

                replyValue = ''
                inputReply.value = ''
                replySection.classList.add('hide')
            }
        })

        inputReply.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement
            replyValue = target.value

            if (replyValue) {
                replyButton.classList.add('enabled')                
            } else {
                replyButton.classList.remove('enabled')
            }
        })

        cancelButton.addEventListener('click', () => {
            replySection.classList.add('hide')
        })


        bottomSection.appendChild(replyButton)
        bottomSection.appendChild(cancelButton)

        replySection.appendChild(topSection)
        replySection.appendChild(bottomSection)

        return replySection
    }

    private renderCommentActions(id: string, votes: number): Element {
        let currVotes = votes

        const commentActions = createElement('div', { class: 'comment-actions' })
        const voteUp = createElement('span', { class: 'vote-action vote-action--up' }, '+')
        const voteDown = createElement('span', { class: 'vote-action vote-action--down' }, '-')
        const commentVotes = createElement('span', { class: 'votes' }, getVotes(currVotes))
        const replyAction = createElement('span', { class: 'reply-action' }, 'REPLY')
        const replySection = this.renderReplySection(id)

        voteUp.addEventListener('click', () => {
            currVotes += 1
            commentVotes.innerHTML = getVotes(currVotes)
        })

        voteDown.addEventListener('click', () => {
            currVotes -= 1
            commentVotes.innerHTML = getVotes(currVotes)
        })

        replyAction.addEventListener('click', () => {
            replySection.classList.remove('hide')
        })

        commentActions.appendChild(voteUp)
        commentActions.appendChild(commentVotes)
        commentActions.appendChild(voteDown)
        commentActions.appendChild(replyAction)
        commentActions.appendChild(replySection)

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