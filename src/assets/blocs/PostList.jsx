import React, { useState, useEffect } from 'react'
import PostForm from './PostForm.jsx'
import PostItem from './PostItem.jsx'
import { AnimatePresence, motion } from 'framer-motion'
import DoneMark from '../images/done-mark.png'
import UndoneMark from '../images/undone-mark.png'

const LOCAL_STORAGE_KEY = 'my-app-posts'

const setDoneMark = <img src={DoneMark} alt="Done mark" />
const setUndoneMark = <img src={UndoneMark} alt="Undone mark" />


const PostList = () => {
    const [posts, setPosts] = useState(() => {
        const storedPosts = localStorage.getItem(LOCAL_STORAGE_KEY)
        return storedPosts ? JSON.parse(storedPosts) : []
    })

    useEffect(() => {
        const storedPosts = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (storedPosts) {
            setPosts(JSON.parse(storedPosts))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts))
    }, [posts])

    const addPost = (newPost) => {
        const postWithId = { ...newPost, id: Date.now(), done: false }
        setPosts([postWithId, ...posts])
    }

    const markAsDone = (id) => {
        const updatedPosts = posts.map(post =>
            post.id === id ? { ...post, done: !post.done } : post
        )
        setPosts(updatedPosts)
    }

    const editPost = (id, newTitle, newText) => {
        const updatedPosts = posts.map(post =>
            post.id === id ? { ...post, title: newTitle, text: newText } : post
        )
        setPosts(updatedPosts)
    }

    const deletePost = (id) => {
        setPosts(posts.filter(post => post.id !== id))
    }

    const groupedPosts = posts.reduce((groups, post) => {
        if (!post.date) return groups
        if (!groups[post.date]) groups[post.date] = []
        groups[post.date].push(post)
        return groups
    }, {})

    const sortedDateGroups = Object.entries(groupedPosts).sort(([dateA], [dateB]) => {
        const now = new Date().setHours(0, 0, 0, 0)
        const timeA = new Date(dateA).setHours(0, 0, 0, 0)
        const timeB = new Date(dateB).setHours(0, 0, 0, 0)

        const diffA = timeA - now
        const diffB = timeB - now

        // Сначала будущие и сегодняшние даты, потом прошлые
        if (diffA >= 0 && diffB >= 0) {
            return diffA - diffB // оба в будущем или сегодня → по возрастанию
        } else if (diffA < 0 && diffB < 0) {
            return diffB - diffA // оба в прошлом → по убыванию (чем ближе к сегодня, тем выше)
        } else {
            return diffB - diffA // будущее > прошлое
        }
    })

    const formatToDDMMYYYY = (dateString) => {
        const [year, month, day] = dateString.split('-')
        return `${day}-${month}-${year}`
      }


    const formatDateLabel = (dateString) => {
        const today = new Date()
        const target = new Date(dateString)
        const diffTime = target.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return ''
        if (diffDays === 1) return 'Завтра'
        if (diffDays === 2) return 'Послезавтра'
        if (diffDays === -1) return 'Вчера'
        if (diffDays === -2) return 'Позавчера'

        return formatToDDMMYYYY(dateString) // формат YYYY-MM-DD
    }



    return (
        <div>
            <PostForm onAddPost={addPost} onDeletePost={deletePost} />
            {sortedDateGroups.map(([date, postsForDate]) => (
                <div key={date}>
                    <h2>{formatDateLabel(date)}</h2>
                    <AnimatePresence>
                        {postsForDate
                            .filter(post => post.title.trim() !== '' || post.text?.trim() !== '')
                            .map(post => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <PostItem
                                        done={post.done}
                                        title={post.title}
                                        text={post.text}
                                        textDone={post.done ? setUndoneMark : setDoneMark}
                                        onDone={() => markAsDone(post.id)}
                                        onEditPost={(newTitle, newText) => editPost(post.id, newTitle, newText)}
                                        onDeletePost={() => deletePost(post.id)}
                                    />
                                </motion.div>
                            ))}
                    </AnimatePresence>
                </div>
            ))}


        </div>
    )
}

export default PostList
