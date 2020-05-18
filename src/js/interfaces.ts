export interface User {
    username: string
    avatar: string
}

export interface Comment {
    id: string,
    user: User
    votes: number
    replies: Comment[]
    datePosted: Date,
    message: string
}
