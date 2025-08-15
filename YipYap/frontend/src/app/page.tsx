'use client'

import { useTheme } from '@/components/theme-provider'
import { useState, useEffect } from 'react'
import {
  createUser,
  createYip,
  getYipsByLocation,
  voteOnYip,
  addCommentToYip,
} from '@/lib/api'
import * as ngeohash from 'ngeohash'

// Define types for our data
interface User {
  id: string
  username: string
}

interface Comment {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
}

interface Yip {
  id: string
  user_id: string
  content: string
  created_at: string
  upvotes: number
  downvotes: number
  comments: Comment[]
}

export default function Home() {
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState<User | null>(null)
  const [yips, setYips] = useState<Yip[]>([])
  const [newYipContent, setNewYipContent] = useState('')
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [selectedYip, setSelectedYip] = useState<Yip | null>(null)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    // Check for user in local storage
    const storedUser = localStorage.getItem('yipYapUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // If no user, prompt for a username
      const username = prompt('Please enter a username:')
      if (username) {
        handleCreateUser(username)
      }
    }
  }, [])

  const handleCreateUser = async (username: string) => {
    try {
      const newUser = await createUser(username)
      setUser(newUser)
      localStorage.setItem('yipYapUser', JSON.stringify(newUser))
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          fetchYips(position.coords.latitude, position.coords.longitude)
        },
        error => {
          console.error('Error getting location:', error)
          alert('Error getting location. Please enter it manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  const fetchYips = async (latitude: number, longitude: number) => {
    try {
      const geohash = ngeohash.encode(latitude, longitude, 7)
      const fetchedYips = await getYipsByLocation(geohash)
      setYips(fetchedYips)
    } catch (error) {
      console.error('Failed to get yips:', error)
    }
  }

  const handleCreateYip = async () => {
    if (user && newYipContent && location) {
      try {
        await createYip(
          user.id,
          newYipContent,
          location.latitude,
          location.longitude
        )
        setNewYipContent('')
        fetchYips(location.latitude, location.longitude) // Refresh yips
      } catch (error) {
        console.error('Failed to create yip:', error)
      }
    }
  }

  const handleVote = async (yipId: string, direction: 'up' | 'down') => {
    if (user) {
      try {
        await voteOnYip(yipId, user.id, direction)
        if (location) {
            fetchYips(location.latitude, location.longitude) // Refresh yips
        }
      } catch (error) {
        console.error('Failed to vote on yip:', error)
      }
    }
  }

  const handleAddComment = async () => {
    if (user && selectedYip && newComment) {
      try {
        await addCommentToYip(selectedYip.id, user.id, newComment)
        setNewComment('')
        if (location) {
            fetchYips(location.latitude, location.longitude) // Refresh yips
        }
        // Also update the selected yip to show the new comment immediately
        const updatedYip = { ...selectedYip, comments: [...selectedYip.comments, { id: '', user_id: user.id, content: newComment, created_at: '' }] };
        setSelectedYip(updatedYip);

      } catch (error) {
        console.error('Failed to add comment:', error)
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">YipYap</h1>
          <button
            onClick={toggleTheme}
            className={`
              px-4 py-2 rounded-lg font-semibold
              ${theme === 'light' ? 'bg-light-primary' : 'bg-dark-primary'}
              ${theme === 'light' ? 'shadow-neumorphic-light' : 'shadow-neumorphic-dark'}
            `}
          >
            Toggle Theme
          </button>
        </div>

        {!user && (
          <div className="mb-4">
            <p>Please create a user to start yapping.</p>
          </div>
        )}

        {user && (
          <div>
            {!location && (
              <div className="mb-4">
                <button
                  onClick={handleGetLocation}
                  className={`
                    w-full mt-2 px-4 py-2 rounded-lg font-semibold
                    ${theme === 'light' ? 'bg-light-primary' : 'bg-dark-primary'}
                    ${theme === 'light' ? 'shadow-neumorphic-light' : 'shadow-neumorphic-dark'}
                  `}
                >
                  Get My Location
                </button>
              </div>
            )}

            {location && (
              <div>
                <div className="mb-4">
                  <textarea
                    placeholder="What's on your mind?"
                    value={newYipContent}
                    onChange={e => setNewYipContent(e.target.value)}
                    className="w-full p-2 rounded-lg bg-light-secondary dark:bg-dark-secondary"
                  />
                  <button
                    onClick={handleCreateYip}
                    className={`
                      w-full mt-2 px-4 py-2 rounded-lg font-semibold
                      ${theme === 'light' ? 'bg-light-primary' : 'bg-dark-primary'}
                      ${theme === 'light' ? 'shadow-neumorphic-light' : 'shadow-neumorphic-dark'}
                    `}
                  >
                    Yap
                  </button>
                </div>

                <div>
                  {yips.map(yip => (
                    <div
                      key={yip.id}
                      className="p-4 mb-4 rounded-lg liquid-glass"
                    >
                      <p>{yip.content}</p>
                      <div className="text-sm text-gray-500 flex justify-between">
                        <div>
                          <button onClick={() => handleVote(yip.id, 'up')}>
                            ▲ Up ({yip.upvotes})
                          </button>
                          <button onClick={() => handleVote(yip.id, 'down')}>
                            ▼ Down ({yip.downvotes})
                          </button>
                        </div>
                        <button onClick={() => setSelectedYip(yip)}>
                          Comments ({yip.comments.length})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedYip && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-light-secondary dark:bg-dark-secondary p-4 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Comments</h2>
              <button
                onClick={() => setSelectedYip(null)}
                className="absolute top-2 right-2"
              >
                Close
              </button>
              <div>
                {selectedYip.comments.map(comment => (
                  <div key={comment.id} className="p-2 mb-2 rounded-lg liquid-glass">
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <textarea
                  placeholder="Add a comment"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="w-full p-2 rounded-lg bg-light-primary dark:bg-dark-primary"
                />
                <button
                  onClick={handleAddComment}
                  className={`
                    w-full mt-2 px-4 py-2 rounded-lg font-semibold
                    ${theme === 'light' ? 'bg-light-primary' : 'bg-dark-primary'}
                    ${theme === 'light' ? 'shadow-neumorphic-light' : 'shadow-neumorphic-dark'}
                  `}
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}