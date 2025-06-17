import React, { useState } from 'react'
import TrashIcon from '../images/trash-icon.svg'
import EditIcon from '../images/edit.svg'
import EmojiPicker from 'emoji-picker-react'
import SmileIcon from '../images/smile-icon.png'


const PostItem = ({ title, text, done, onDone, onDeletePost, textDone, onEditPost }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(title)

    const handleSave = () => {
        onEditPost(editTitle)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setEditTitle(title)
        setIsEditing(false)
    }

    const [showPicker, setShowPicker] = useState(false)

    const onEmojiClick = (emojiData) => {
        setEditTitle(prev => prev + emojiData.emoji)
        setShowPicker(false)
    }

    return (
        <div className={`post ${done ? 'disabled' : ''}`}>
            <div className='post__content'>
                {isEditing ? (
                    <form className='post__form-item'>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="post__input-title"
                        />
                        <button onClick={handleSave} className='post__save enter'>Save</button>
                        <button onClick={handleCancel} className='post__cancel enter'>Cancel</button>
                        <button className='post-form__emoji' type="button" onClick={() => setShowPicker(prev => !prev)}><img src={SmileIcon} alt="Smile"></img></button>
                        {showPicker && <div className='post-form__wrapper'>
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>}
                    </form>
                ) : (
                    <>
                        <h2>{title}</h2>
                        <p>{text}</p>
                    </>
                )}
            </div>
            <div className='post__buttons'>
                <button onClick={onDone}
                 className={`post__done ${isEditing ? 'disabled' : ''}`} disabled={isEditing}>{textDone}</button>
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className='post__save'>Save</button>
                        <button onClick={handleCancel} className='post__cancel'>Cancel</button>
                    </>
                ) : (
                    <button
                        className={`post__edit ${done ? 'disabled' : ''}`}
                        onClick={() => setIsEditing(true)}
                        disabled={done}
                    >
                        <img src={EditIcon} alt="Редактировать" />
                    </button>
                )}
                <button onClick={onDeletePost} className='post__delete'>
                    <img src={TrashIcon} alt="Удалить" />
                </button>
            </div>
        </div>
    )
}

export default PostItem
