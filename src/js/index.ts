import '../sass/index.scss'

import Comments from './Comments'
import CommentsData from './commentsData'

const root = document.getElementById('root')

const c  = new Comments(CommentsData).render()

root.appendChild(c)