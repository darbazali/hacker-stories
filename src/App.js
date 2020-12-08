import React, { useState, useEffect } from 'react'
import initialStories from './data.js'

import List from './components/List.js'
import InputWithLabel from './components/Search.js'
import Loading from './components/Loading.js'

/* 
====================================================================
CUSTOM HOOK
====================================================================
*/
const useSemiPresistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState)

  useEffect(() => {
    localStorage.setItem('value', value)
  }, [value, key])

  return [value, setValue]
}

/* 
====================================================================
GET DATA ASYNCHRONOUSLY
====================================================================
*/
const getAsyncStories = () =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
  )

/* 
====================================================================
APP COMPONENT
====================================================================
*/
const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPresistentState('search', '')
  const [stories, setStories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    getAsyncStories()
      .then((result) => {
        setStories(result.data.stories)
        setIsLoading(false)
      })
      .catch(() => setIsError(true))
  }, [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    )
    setStories(newStories)
  }

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <div>
      <h1>Hacker Stories</h1>

      <InputWithLabel
        onInputChange={handleSearch}
        value={searchTerm}
        id='search'
        type='text'
        isFocused={true}
      >
        <Label label='Search' />
      </InputWithLabel>

      {/* give feedback if an error ocured */}
      {isError && <p style={{ color: 'red' }}>Something went wrong...</p>}

      {isLoading ? (
        <Loading />
      ) : (
        <List list={searchedStories} onRemoveStory={handleRemoveStory} />
      )}
    </div>
  )
}

const Label = ({ label }) => <strong>{label}:</strong>

export default App
