import '../sass/index.scss'
import { v4 as uuidv4 } from 'uuid';

const root = document.getElementById('root')

const data = [
    {
        id: uuidv4(),
        user: {
            username: 'KING SIMBA',
            avatar: 'https://yt3.ggpht.com/a/AATXAJzotAFPS2KRe-7TOoRgwv-IBqi7jFNpIZ_FWQ=s48-c-k-c0xffffffff-no-rj-mo'
        },
        votes: 262,
        datePosted: new Date(),
        replies: [
            {
                user: {
                    username: 'Abe McGee',
                    avatar: 'https://yt3.ggpht.com/a/AATXAJxyLAYfDccB5UJnwwzVMqqCQD6Hys9yzfpwlQ=s48-c-k-c0xffffffff-no-rj-mo'
                },
                votes: 16,
                datePosted: new Date(),
                replies: [],
                message: 'Jones has a great chin at LHW, but we\'ll see at HW'
            }
        ],
        message: 'Dude if Ngannou lands a clean hit to Jones it\'s over and we know this. 💀'
    },
    {
        id: uuidv4(),
        user: {
            username: 'Rogan Toad',
            avatar: 'https://yt3.ggpht.com/a/AATXAJxyLAYfDccB5UJnwwzVMqqCQD6Hys9yzfpwlQ=s48-c-k-c0xffffffff-no-rj-mo'
        },
        votes: 624,
        datePosted: new Date(),
        replies: [

        ],
        message: '<div>Ngannou: Hits like a Ford escort</div><div>Jones: <b>Hits people with a Ford escort</b></div>'
    },
    {
        id: uuidv4(),
        user: {
            username: 'Siddharth Mouli',
            avatar: '//yt3.ggpht.com/a/AATXAJxsEgbVejE3q-uerWrae1322HfK9AfFvMi1rw=s48-c-k-c0xffffffff-no-rj-mo'
        },
        votes: 103,
        datePosted: new Date(),
        replies: [
            {
                id: uuidv4(),
                user: {
                    username: 'Headkick Ko',
                    avatar: 'https://yt3.ggpht.com/a/AATXAJzHUFlakabQ_MgBuKOVz_tQBL1crJTJIcUMpg=s48-c-k-c0xffffffff-no-rj-mo'
                },
                message: 'Francis is gonna KO Jon so hard, his probation period is over when he wakes up.',
                replies: [
                    {
                        id: uuidv4(),
                        user: {
                            username: 'Crystal Pope',
                            avatar: 'https://yt3.ggpht.com/a/AATXAJw6LvYSfjOeH_lEr3VyNwsvEphIIYo7h7ENtA=s48-c-k-c0xffffffff-no-rj-mo'
                        },
                        message: 'All praise to the Music Gods!!! Please spread your beneficence to those whom you have not yet blessed with this song. <span class="hashtag">#rebelforkicks</span> <span class="hashtag">#FightBack</span>',
                        votes: 26,
                        datePosted: new Date(),
                        replies: []
                    }
                ],
                votes: 65,
                datePosted: new Date()
            }
        ],
        message: 'Francis went from 7 bags in the 1st tweet to 4, he needs to negotiate like he throws hands'
    }
] as Comment[]

interface User {
    username: string
    avatar: string
}

interface Comment {
    id: string,
    user: User
    votes: number
    replies: Comment[]
    datePosted: Date,
    message: string
}

type children = string | Element

type time = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

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
        const commentVotes = createElement('span', { class: 'votes' }, currVotes.toString())

        voteUp.addEventListener('click', () => {
            currVotes += 1
            commentVotes.innerHTML = currVotes.toString()
        })

        voteDown.addEventListener('click', () => {
            currVotes -= 1
            commentVotes.innerHTML = currVotes.toString()
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

const c  = new Comments(data).render()

root.appendChild(c)

function getTimeMessage(value: number, unit: time, round: (val: number) => number) : string {
    const roundedValue = round(value)
    let formattedUnit = unit


    if (roundedValue > 1) {
        formattedUnit += 's'
    }

    return `${roundedValue} ${formattedUnit} ago`
}

function getTimeAgo(then: Date) : string {
    const diff = new Date().getTime() - then.getTime()
    const seconds = diff / 1000
    const minutes = seconds / 60
    const hours = minutes / 60
    const days = hours / 24
    const weeks = days / 7
    const months = weeks / 4
    const years = months / 12

    const roundDown = (val: number) => Math.floor(val)
    const roundUp = (val: number) => Math.ceil(val)

    if (years >= 1) {
        return getTimeMessage(years, 'year', roundDown)
    }

    if (months >= 1) {
        return getTimeMessage(months, 'month', roundDown)
    }

    if (weeks >= 1) {
        return getTimeMessage(weeks, 'week', roundDown)
    }

    if (days >= 1) {
        return getTimeMessage(days, 'day', roundDown)
    }

    if (hours >= 1) {
        return getTimeMessage(hours, 'hour', roundDown)
    }

    if (minutes >= 1) {
        return getTimeMessage(minutes, 'minute', roundDown)
    }

    return getTimeMessage(seconds, 'second', roundUp)
}