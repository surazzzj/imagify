import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { motion } from "framer-motion"
import { AppContext } from '../context/AppContext'

const Result = () => {

  const [image, setImage] = useState(assets.sample_img_1)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')

  const { generateImage } = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!input || loading) return

    setLoading(true)

    try {
      const generatedImage = await generateImage(input)
      if (generatedImage) {
        setImage(generatedImage) // replace ONLY after success
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={onSubmitHandler}
      className='flex flex-col min-h-[90vh] justify-center items-center'
    >

      {/* IMAGE */}
      <div className='relative'>
        <img
          src={image}
          alt="Generated"
          className='max-w-sm rounded'
          loading="lazy"
        />

        {loading && (
          <span className='absolute bottom-0 left-0 h-1 bg-blue-500 w-full animate-pulse'></span>
        )}
      </div>

      {loading && (
        <p className='mt-2 text-sm text-gray-600'>
          Generating image...
        </p>
      )}

      {/* INPUT */}
      <div className='flex w-full max-w-xl text-white bg-neutral-500 rounded-full mt-6'>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 text-white'
          type="text"
          placeholder='Describe what you want to generate'
        />
        <button
          disabled={loading}
          className={`px-10 sm:px-16 py-3 rounded-full 
            ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-zinc-900'}`}
          type='submit'
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {/* ACTION BUTTONS */}
      {!loading && (
        <div className='flex gap-2 flex-wrap justify-center text-white text-sm mt-6'>
          <button
            type="button"
            onClick={() => setInput('')}
            className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full'
          >
            Generate Another
          </button>

          <a
            href={image}
            download
            className='bg-zinc-900 px-10 py-3 rounded-full'
          >
            Download
          </a>
        </div>
      )}

    </motion.form>
  )
}

export default Result


