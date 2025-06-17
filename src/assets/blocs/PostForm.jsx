import React, { useState } from 'react'
import EmojiPicker from 'emoji-picker-react'

const PostForm = ({ onAddPost }) => {
  const [title, setTitle] = useState('')
  const [showPicker, setShowPicker] = useState(false)

  const createPost = (e) => {
    e.preventDefault()
    if (!title) return
    onAddPost({ title, date })
    setTitle('')
  }

  const onEmojiClick = (emojiData) => {
    setTitle(prev => prev + emojiData.emoji)
    setShowPicker(false)
  }

  const getTodayDate = () => {
    const today = new Date()
    /*  const year = today.getFullYear()
     const month = String(today.getMonth() + 1).padStart(2, '0')
     const day = String(today.getDate()).padStart(2, '0') */
    return today.toISOString().split('T')[0]
  }

  const [date, setDate] = useState(getTodayDate())

  return (
    <form onSubmit={createPost} className='post-form'>
      <label className='post-form__label'>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What to do today?"
        />
        <button className='post-form__emoji' type="button" onClick={() => setShowPicker(prev => !prev)}>😊</button>
        {showPicker && <div className='post-form__wrapper'>
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>}
      </label>
      <div className="form-wrapper">
        <button className={`post-form__button ${!title ? 'disabled' : ''}`} type="submit" disabled={!title}>Add</button>
        <input onChange={e => setDate(e.target.value)} value={date} className='post-form__date' type="date" />
      </div>
    </form>
  )
}

export default PostForm
