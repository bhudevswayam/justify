import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import './compiler.css'
import axios from 'axios'
import Editor from '@monaco-editor/react'

function Compiler() {
  const [language, setLanguage] = useState('python3')
  const [editorLanguage, setEditorLanguage] = useState('python')
  const [version, setVersion] = useState('latest')
  const [code, setCode] = useState('')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [questionData, setQuestionData] = useState(null)
  const [testCases, setTestCases] = useState([])
  const [remainingTime, setRemainingTime] = useState(0)
  const [cameraStream, setCameraStream] = useState(null)
  const [pictures, setPictures] = useState([{}])
  const [testPassed, setTestPassed] = useState(0)
  const videoRef = useRef()
  const editorRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const questionid = urlParams.get('questionId')
        const response = await axios.get(
          `https://apptest-88ck.onrender.com/get-question/${questionid}`,
        )

        if (!response.data) {
          throw new Error('No data received')
        }

        setQuestionData(response.data)

        // Extract hour and minute from question data and calculate total time in seconds
        const { hour, minute } = response.data
        const totalTimeInSeconds = hour * 3600 + minute * 60
        setRemainingTime(totalTimeInSeconds)
      } catch (error) {
        console.error('Error fetching question data:', error.message)
        // Handle error (e.g., set an error state)
      }
    }

    fetchQuestionData()

    // Run the effect only once when the component mounts
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (remainingTime > 0) {
        setRemainingTime(remainingTime - 1)
      } else {
        handleSubmit()
        navigate(`/thank-you`)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [remainingTime])

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = timeInSeconds % 60
    return `${hours}h ${minutes}m ${seconds}s`
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
          .then(() => console.log('Fullscreen mode activated'))
          .catch(error => console.error('Error entering fullscreen mode:', error));
      }
    };

    // Request fullscreen mode when component mounts
    handleFullscreenChange();

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);


  useEffect(() => {
    // Update the testCases state when questionData changes
    if (questionData) {
      const extractedTestCases = questionData.testCases.map(
        ({ input, expectedOutput }) => ({
          input: input + '\n',
          expectedOutput: expectedOutput + '\n',
        }),
      )
      console.log(extractedTestCases)
      setTestCases(extractedTestCases)
      // console.log('question data', questionData.title);
    }
  }, [questionData])

  const submitCode = async () => {
    try {
      const response = await fetch('https://apptest-88ck.onrender.com/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          version,
          code: editorRef.current.getValue(),
          input,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setOutput(data.output)
      setError('')
    } catch (error) {
      console.error('Error:', error.message)
      setError(`Error: ${error.message}`)
    }
  }

  const runTestCases = async () => {
    try {
      // Reset output and error
      setOutput('')
      setError('')

      let passedCount = 0

      for (const testCase of testCases) {
        const testCaseData = {
          language,
          version,
          code: editorRef.current.getValue(),
          input: testCase.input,
        }

        try {
          const response = await fetch('https://apptest-88ck.onrender.com/compile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(testCaseData),
          })

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }

          const data = await response.json()

          const testCasePassed =
            testCase.expectedOutput.trim() === data.output.trim()

          if (testCasePassed) {
            passedCount++
          }
        } catch (error) {
          console.error('Error:', error.message)
        }
      }

      // Set the summary in the state
      setError(`${passedCount} Test Case Passed out of ${testCases.length}`)
      setTestPassed(passedCount)
    } catch (error) {
      console.error('Error:', error.message)
      setError(`Error: ${error.message}`)
    }
  }

  async function capturePicture() {
    console.log('Starting capture picture', videoRef);
    
    if (videoRef.current) {
      const video = videoRef.current;
  
      // Create a canvas element to capture the video frame
      const canvas = document.createElement('canvas');
      
      // Reduce canvas dimensions for smaller image size
      canvas.width = video.videoWidth / 2;
      canvas.height = video.videoHeight / 2;
  
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      // Convert the canvas content to a data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.5); // Convert to JPEG for smaller size
  
      // Convert the data URL to a Blob
      const blob = await fetch(dataUrl).then((res) => res.blob());
  
      console.log(blob);
  
      if (blob) {
        const formData = new FormData();
        formData.append('pictures', blob, 'image.jpeg'); // Change extension to .jpeg
        console.log(formData);
  
        // Update the pictures state
        setPictures((prevPictures) => [
          ...prevPictures,
          URL.createObjectURL(blob),
        ]);
  
        // Send the formData to the server
        savePicturesToDatabase(formData);
      } else {
        console.error('Error creating Blob');
      }
    } 
  }
  

  const savePicturesToDatabase = async (formData) => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const userId = urlParams.get('userId')

      // Send the formData to the server
      const response = await axios.post(
        `https://apptest-88ck.onrender.com/save-pictures/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      if (response && response.data && response.data.success) {
        console.log('Pictures saved successfully')
      } else {
        console.error('Error saving pictures - Unexpected response:', response)
      }
    } catch (error) {
      console.error('Error saving pictures:', error.message)
    }
  }

  const startCamera = async () => {
    try {
      console.log('Starting camera')
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // Attach video data to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      console.log('Starting camera end')
    } catch (error) {
      console.error('Error accessing camera:', error.message)
    }
  }

  useEffect(() => {
    startCamera()
    capturePicture()
    const pictureIntervalId = setInterval(() => {
      capturePicture()
    }, 10000) // 5000 milliseconds = 5 seconds

    return () => {
      // Cleanup: Stop the camera stream and clear the interval when the component unmounts
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
      clearInterval(pictureIntervalId)
    }
  }, []) // Run the effect only once when the component mounts

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        try {
          // Getting data from the URL
          const urlParams = new URLSearchParams(window.location.search)
          const userId = urlParams.get('userId')

          // Send a request to update the tabChange field
          const response = await fetch(
            'https://apptest-88ck.onrender.com/update-tab-change',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: userId }), // Replace with the actual userId
            },
          )

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
        } catch (error) {
          console.error('Error updating tabChange:', error.message)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, []) // Run the effect only once when the component mounts

  const handleSubmit = async (e) => {
    const date = new Date()
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('userId')
    if (testCases == 0) {
      runTestCases()
    }
    try {
      const response = await fetch('https://apptest-88ck.onrender.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endTime: date,
          givenQuestion: questionData._id,
          pasedTestCase: testPassed,
          code,
          userId,
          adminUser: questionData.adminUser,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      console.log(data)
      navigate('/thank-you')
    } catch (error) {
      console.error('Error:', error.message)
      setError(`Error: ${error.message}`)
    }
  }

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value
    let editorLanguageName = ''

    switch (selectedLanguage) {
      case 'c':
        editorLanguageName = 'c'
        break
      case 'cpp':
        editorLanguageName = 'c'
        break
      case 'java':
        editorLanguageName = 'java'
        break
      case 'nodejs':
        editorLanguageName = 'javascript'
        break
      case 'python3':
        editorLanguageName = 'python'
        break
      case 'csharp':
        editorLanguageName = 'c#'
        break
      default:
        editorLanguageName = 'c' // Default to C if language is not recognized
    }

    setLanguage(selectedLanguage)
    setEditorLanguage(editorLanguageName)
  }

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor
    setCode(editorRef.current.getValue())
  }

  return (
    <div className="compiler-container">
      {questionData ? (
        <div className="question">
          <h1>{questionData.title}</h1>
          <div
            id="questionContainer"
            dangerouslySetInnerHTML={{ __html: questionData.question }}
          ></div>
        </div>
      ) : (
        <h1>loading</h1>
      )}

      <div className="code">
        <div className="codeNav">
          <textarea
            value={input}
            placeholder="input....."
            onChange={(e) => setInput(e.target.value)}
          />
          <div id="time">
            <h5>Remaining Time: {formatTime(remainingTime)}</h5>
          </div>
          <label>Language:</label>
          <select value={language} onChange={handleLanguageChange}>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="nodejs">Node.js</option>
            <option value="python3">Python 3</option>
            <option value="csharp">C#</option>
          </select>
        </div>
        {/* <textarea id='textEditor' ref={codeTextAreaRef} value={code} onChange={(e) => setCode(e.target.value)}/> */}
        {/* <ReactMonacoEditor theme="vs-dark" ref={codeTextAreaRef} value={code} onChange={(e) => setCode(e.target.value)}/> */}

        <Editor
          language={editorLanguage}
          theme="vs-dark"
          defaultValue="// Write Your Code Here"
          onMount={handleEditorDidMount}
        />
      </div>
      <div className="output">
        <video ref={videoRef} autoPlay playsInline />
        <button onClick={submitCode}>Compile</button>
          <h2>Output:</h2>
          <textarea value={output} readOnly />

          <button onClick={runTestCases}>Run Test Cases</button>
          {/* <button onClick={showValue}>Show value</button> */}
          {error && <pre style={{ color: 'red' }}>{error}</pre>}
        
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  )
}

export default Compiler
