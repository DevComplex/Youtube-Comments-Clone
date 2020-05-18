import { v4 as uuidv4 } from 'uuid'
import { Comment } from './interfaces'

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
                    avatar: 'https://yt3.ggpht.com/a/AATXAJwHH4GLcbtf_Vil-BMf3trfMrhrsHfBvlpKmw=s48-c-k-c0xffffffff-no-rj-mo'
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
            avatar: 'https://yt3.ggpht.com/a/AATXAJxsEgbVejE3q-uerWrae1322HfK9AfFvMi1rw=s48-c-k-c0xffffffff-no-rj-mo'
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
                    },
                    {
                        id: uuidv4(),
                        user: {
                            username: 'Narcisa luliana',
                            avatar: 'https://yt3.ggpht.com/a/AATXAJwDrXDES77IYhPHafUpXGioBsiKQwGKpAlL7A=s48-c-k-c0xffffffff-no-rj-mo'
                        },
                        message: 'CINE A VENIT DE LA ROVISION SA DA LIKE ^-^',
                        votes: 1829,
                        datePosted: new Date(),
                        replies: []
                    }
                ],
                votes: 65,
                datePosted: new Date()
            }
        ],
        message: 'Francis went from 7 bags in the 1st tweet to 4, he needs to negotiate like he throws hands'
    },
    {
        id: uuidv4(),
        user: {
            username: 'Nos régions ont du talent',
            avatar: 'https://yt3.ggpht.com/a/AATXAJyjoZ5Ta4h5en1b5mtJVg3O3UgrdZ_5Oq7aFQ=s48-c-k-c0xffffffff-no-rj-mo'
        },
        votes: 89,
        datePosted: new Date(),
        replies: [],
        message: 'Nos régions ont du talent'
    }
] as Comment[]

export default data