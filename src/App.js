import React, { useState, useEffect } from 'react'
import initialStories from './data.js'

import List from './components/List.js'
import InputWithLabel from './components/Search.js'

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
APP COMPONENT
====================================================================
*/
const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPresistentState('search', 'react')
  const [stories, setStories] = useState(initialStories)

  useEffect(() => {
    localStorage.setItem('search', searchTerm)
  }, [searchTerm])

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

      <List list={searchedStories} onRemoveStory={handleRemoveStory} />
    </div>
  )
}

const Label = ({ label }) => <strong>{label}:</strong>

export default App
