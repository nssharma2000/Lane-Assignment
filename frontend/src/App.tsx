import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {

  const [title, setTitle] = useState<string | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [category, setCategory] = useState<string | null>("Bug")
  const [sortingOption, setSortingOption] = useState<string>("oldest")

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [groupBy, setGroupBy] = useState<boolean>(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const [areFeedbacksLoading, setAreFeedbacksLoading] = useState<boolean>(true)

  const [isSuccessToastVisible, setIsSuccessToastVisible] = useState<boolean>(false)

  const [isErrorToastVisible, setIsErrorToastVisible] = useState<boolean>(false)

  const [isIncompleteErrorToastVisible, setIsIncompleteErrorToastVisible] = useState<boolean>(false)

  const [allFeedback, setAllFeedback] = useState<any[]>([])
  

  const [bugExpanded, setBugExpanded] = useState<boolean>(true)
  const [featureExpanded, setFeatureExpanded] = useState<boolean>(true)
  const [improvementExpanded, setImprovementExpanded] = useState<boolean>(true)

  const [searchQuery, setSearchQuery] = useState<string>("")
  


  let nodeBackendUrl = import.meta.env.VITE_NODE_BACKEND_URL

  const handleTitleChange = (event: any) => {
    setTitle(event.target.value)
  }

  const handleDescriptionChange = (event: any) => {
    setDescription(event.target.value)
  }

  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value)
  }

  const handleSortingOptionChange = (event: any) => {
    setSortingOption(event.target.value)
  }

  const toggleGroupBy = () => {
    setGroupBy(!groupBy)
  }

  const handleSubmit = async (event: any) => {

    setIsErrorToastVisible(false)

    setIsIncompleteErrorToastVisible(false)

    event.preventDefault()

    if(!title?.trim() || !description?.trim() || !category?.trim())
    {
      setIsIncompleteErrorToastVisible(true)
      return
    }
    
    try {
      setIsSubmitting(true)
      const response = await axios.post(nodeBackendUrl + "/feedback", { title, description, category })
      console.log(response)
    }
    catch (error)
    {
      setIsErrorToastVisible(true)
      console.error(error)
    }
    finally
    {
      setIsSubmitting(false)
      setIsSuccessToastVisible(true)
      await getFeedback()
      setTimeout(() => {
        setIsSuccessToastVisible(false)
      }, 3000)
    }
  }

  async function getFeedback()
  {
    setAreFeedbacksLoading(true)

    try {
      const response = await axios.get(nodeBackendUrl + "/feedback")
      console.log(response.data)
      setAllFeedback(response.data)
    }
    catch (error)
    {
      console.error(error)
    }
    finally
    {
      setAreFeedbacksLoading(false)
    }
  }

  useEffect(() => {
    async function handleGetFeedback()
    {
      await getFeedback()
    }
    handleGetFeedback()
  }, [])

  function ErrorToast()
  {
    return (
      <div className="w-[80%] mx-auto md:w-[60%] p-4 bg-red-500 mb-4 text-white rounded-md text-center">
        <p className="text-lg">
          Error submitting feedback.
        </p>
      </div>
    )
  }

  function SuccessToast()
  {
    return (
      <div className="w-[80%] mx-auto md:w-[60%] p-4 bg-green-200 mb-4 text-green-600 rounded-md text-center">
        <p className="text-lg">
          Feedback submitted successfully!
        </p>
      </div>
    )
  }

  function IncompleteErrorToast()
  {
    return (
      <div className="w-[80%] mx-auto md:w-[60%] p-4 bg-red-500 mb-4 text-white rounded-md text-center">
        <p className="text-lg">
          Please fill all required fields.
        </p>
      </div>
    )
  }

  function GroupedFeedbackComponent()
  {
    return (
      <>
      <div className="flex justify-start items-center font-semibold">
        <h2 className="text-xl">Bugs</h2>
        <button className="text-md lg:text-lg flex justify-center rounded-full w-[30vw] lg:w-[10vw] p-2 bg-gray-200 hover:bg-gray-300 transition-all items-center hover:cursor-pointer"
        onClick={() => setBugExpanded(!bugExpanded) }>
        { bugExpanded ?  "Collapse" : "Expand" }
        </button>  
      </div>
      <div className={`w-[100%] mx-auto ${bugExpanded ? "flex" : "hidden" } flex-col justify-start items-center`}>
              {

                allFeedback.filter((item) => selectedFilters?.includes("Bug") && item.category === "Bug")
                .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .length > 0 ?
                (
                  
                  areFeedbacksLoading ?
                    <>
                      <div className="w-[90%] h-[30vh] md:h-[20vh] flex justify-center items-center p-4 mb-4 rounded-md bg-slate-200 animate-pulse">
                      </div>
                      <div className="w-[90%] h-[30vh] md:h-[20vh] flex justify-center items-center p-4 mb-4 rounded-md bg-slate-200 animate-pulse">
                      </div>
                      <div className="w-[90%] h-[30vh] md:h-[20vh] flex justify-center items-center p-4 mb-4 rounded-md bg-slate-200 animate-pulse">
                      </div>
                    </>
                
                    :   
                    allFeedback
                    .filter((item) => selectedFilters?.includes("Bug") && item.category === "Bug")
                    .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((feedback: any, index) =>
                        <div key={ index } className="w-[90%] flex flex-col justify-center items-center p-4 mb-4 bg-white rounded-md">
                          <h1 className="text-2xl w-[90%] font-bold text-center">
                            { feedback.title }
                          </h1>
                          <h3 className="text-lg w-[90%] text-ellipsis overflow-hidden whitespace-nowrap">
                            { feedback.description }
                          </h3>
                          <h3 className="text-md w-[90%]">
                            Category: { feedback.category }
                          </h3>
                          <div className="text-md w-[90%]">
                            { new Date(feedback.createdAt).toLocaleString() }
                          </div>
                        </div>
                      )
                  )
                :
                <h1 className="text-2xl font-semibold">
                  No feedback to show.
                </h1>
              }
    </div>
    <div className="flex justify-start items-center font-semibold">
        <h2 className="text-xl">Features</h2>
        <button className="text-md lg:text-lg flex justify-center rounded-full w-[30vw] lg:w-[10vw] p-2 bg-gray-200 hover:bg-gray-300 transition-all hover:cursor-pointer items-center"
        onClick={() => setFeatureExpanded(!featureExpanded) }>
        { featureExpanded ?  "Collapse" : "Expand" }
        </button>  
      </div>
      <div className={`w-[100%] mx-auto ${featureExpanded ? "flex" : "hidden"} flex-col justify-start items-center`}>
              {
                allFeedback.filter((item) => selectedFilters?.includes("Feature") && item.category === "Feature")
                .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .length > 0 ?
                (
                  areFeedbacksLoading ?
                    <>
                      <div className="w-[90%] h-[30vh] md:h-[20vh] flex justify-center items-center p-4 mb-4 rounded-md bg-slate-200 animate-pulse">
                      </div>
                      <div className="w-[90%] h-[30vh] md:h-[20vh] flex justify-center items-center p-4 mb-4 rounded-md bg-slate-200 animate-pulse">
                      </div>
                      <div className="w-[90%] h-[30vh] md:h-[20vh] flex justify-center items-center p-4 mb-4 rounded-md bg-slate-200 animate-pulse">
                      </div>
                    </>
                
                    :   
                    allFeedback
                    .filter((item) => selectedFilters?.includes("Feature") && item.category === "Feature")
                    .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((feedback: any, index) =>
                        <div key={ index } className="w-[90%] flex flex-col justify-center items-center p-4 mb-4 bg-white rounded-md">
                          <h1 className="text-2xl w-[90%] font-bold text-center">
                            { feedback.title }
                          </h1>
                          <h3 className="text-lg w-[90%] text-ellipsis overflow-hidden whitespace-nowrap">
                            { feedback.description }
                          </h3>
                          <h3 className="text-md w-[90%]">
                            Category: { feedback.category }
                          </h3>
                          <div className="text-md w-[90%]">
                            { new Date(feedback.createdAt).toLocaleString() }
                          </div>
                        </div>
                      )
                  )
                :
                <h1 className="text-2xl font-semibold">
                  No feedback to show.
                </h1>
              }
    </div>
    <div className="flex justify-start items-center font-semibold">
        <h2 className="text-xl">Improvement</h2>
        <button className="text-md lg:text-lg flex justify-center rounded-full w-[30vw] lg:w-[10vw] p-2 bg-gray-200 hover:bg-gray-300 transition-all items-center hover:cursor-pointer"
        onClick={() => setImprovementExpanded(!improvementExpanded) }>
        { improvementExpanded ?  "Collapse" : "Expand" }
        </button>  
      </div>
      <div className={`w-[100%] mx-auto ${improvementExpanded ? "flex" : "hidden" } flex-col justify-start items-center`}>
              {
                allFeedback.filter((item) => selectedFilters?.includes("Improvement") && item.category === "Improvement")
                .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .length > 0 ?
                (
                  areFeedbacksLoading ?
                    <>
                      <div className="w-[90%] h-[30vh] md:h-[20vh] flex justify-center items-center p-4 mb-4 rounded-md bg-slate-200 animate-pulse">
                      </div>
                      <div className="w-[90%] h-[30vh] md:h-[20vh] flex justify-center items-center p-4 mb-4 rounded-md bg-slate-200 animate-pulse">
                      </div>
                      <div className="w-[90%] h-[30vh] md:h-[20vh] flex justify-center items-center p-4 mb-4 rounded-md bg-slate-200 animate-pulse">
                      </div>
                    </>
                
                    :   
                    allFeedback
                    .filter((item) => selectedFilters?.includes("Improvement") && item.category === "Improvement")
                    .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((feedback: any, index) =>
                        <div key={ index } className="w-[90%] flex flex-col justify-center items-center p-4 mb-4 bg-white rounded-md">
                          <h1 className="text-2xl w-[90%] font-bold text-center">
                            { feedback.title }
                          </h1>
                          <h3 className="text-lg w-[90%] text-ellipsis overflow-hidden whitespace-nowrap">
                            { feedback.description }
                          </h3>
                          <h3 className="text-md w-[90%]">
                            Category: { feedback.category }
                          </h3>
                          <div className="text-md w-[90%]">
                            { new Date(feedback.createdAt).toLocaleString() }
                          </div>
                        </div>
                      )
                  )
                :
                <h1 className="text-2xl font-semibold">
                  No feedback to show.
                </h1>
              }
    </div>
    </>)
  }


  return (
    <>
     <div id="main_container" className="w-[100vw] mx-auto text-center">
        <div id="container" className="w-[100%] mx-auto text-center bg-slate-100">
          <div id="header" className="w-[100%] mx-auto h-[15vh] flex flex-col justify-center items-center bg-slate-300">
            <h1 className="text-3xl font-bold">
              Feedback App
            </h1>
            <h2 className="text-lg">
              Your feedback is important! 
            </h2>
          </div>
          <div id="add_feedback" className="w-[100%] mx-auto p-4 flex flex-col justify-center items-center bg-neutral-200">
            <h2 className="text-2xl font-semibold">
              Add Feedback
            </h2>
            <form onSubmit={ handleSubmit } className="w-[100%] mx-auto flex flex-col justify-center items-center p-4">
              <div className="w-[100%] p-2 gap-4 flex text-nowrap justify-center items-center">
                <label className="text-lg">
                  * Title:
                </label>
                <input required type="text" name="title" className="w-[90%] md:w-[40%] p-2 rounded-md outline-none bg-white" onChange={ handleTitleChange }>
                </input>
              </div>
              <div className="w-[100%] p-2 gap-4 flex flex-col text-nowrap justify-center items-center">
                <label className="text-lg">
                  * Description
                </label>
                <textarea required name="description" rows={3} cols={10} placeholder="Enter description here..." className="w-[90%] md:w-[40%] p-2 rounded-md outline-none bg-slate-100"
                onChange={ handleDescriptionChange }>
                </textarea>
              </div>
              <div className="w-[100%] p-2 gap-4 flex justify-center text-nowrap items-center">
                <label className="text-lg">
                  * Category:
                </label>
                <select name="category" className="w-[50%] md:w-[20%] p-2 rounded-md outline-none bg-slate-100" onChange={ handleCategoryChange }>
                  <option value="Bug">Bug</option>
                  <option value="Feature">Feature</option>
                  <option value="Improvement">Improvement</option>
                </select>
              </div>
              { isIncompleteErrorToastVisible && 
              <IncompleteErrorToast />
              }
              { isErrorToastVisible && 
              <ErrorToast />
              }
              { isSuccessToastVisible &&
              <SuccessToast />
              }
              <button type="submit" className="w-[40%] md:w-[10%] text-md md:text-lg font-semibold text-white p-2 flex justify-center items-center rounded-md bg-blue-500 hover:bg-blue-700 transition-all duration-300
              cursor-pointer">
                { isSubmitting ?
                  <div className="w-6 h-6 rounded-full border-t-2 border-white animate-spin">

                  </div>
                :
                <>
                Submit
                </>
                }
              </button>
            </form>
          </div>
          <div className="w-[100%] mx-auto p-4 flex justify-center items-center bg-neutral-200">
            <div className="w-[100%] flex flex-col justify-center items-center mb-4">
              <div className="grid grid-rows-2 grid-cols-2 place-content-center gap-2 mb-4">
                <div className="flex row-start-1 col-start-1 justify-center gap-2 items-center">
                  <h2 className="text-md lg:text-lg text-nowrap">
                    Sort by
                  </h2>
                  <select className="w-[70%] text-sm md:text-md bg-white p-2 rounded-md" onChange={ handleSortingOptionChange }>
                    <option value="oldest">Oldest first</option>
                    <option value="newest">Newest first</option>
                  </select>
                </div>
                <div className="flex row-start-1 col-start-2 justify-center gap-2 items-center">
                  <h2 className="text-lg text-nowrap">
                    Group by category
                  </h2>
                  <input type="checkbox" className="w-5 h-5 bg-gray-300 rounded-lg" onChange={ toggleGroupBy }>
                  </input>
                </div>
                <div className="flex row-start-2 col-start-1 justify-center gap-2 items-center">
                  <h2 className="text-lg text-nowrap">
                    Filter by:
                  </h2>
                  <div className="flex flex-col gap-2 justify-center items-center">
                    <div className="flex gap-2 justify-center items-center">
                      <input type="checkbox" className="w-5 h-5" onChange={ () => {
                        if(selectedFilters?.includes("Bug")){
                          setSelectedFilters([...selectedFilters].filter((item) => item !== "Bug"))
                        }
                        else
                        {
                          setSelectedFilters([...selectedFilters, "Bug"])
                        }
                      }}></input>
                      <p className="text-md lg:text-lg">
                        Bug
                      </p>
                    </div>
                     <div className="flex gap-2 justify-center items-center">
                      <input type="checkbox" className="w-5 h-5" onChange={ () => {
                        if(selectedFilters?.includes("Feature")){
                          setSelectedFilters([...selectedFilters].filter((item) => item !== "Feature"))
                        } 
                        else
                        {
                          setSelectedFilters([...selectedFilters, "Feature"])
                        }
                      }}></input>
                      <p className="text-md lg:text-lg">
                        Feature
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center items-center">
                      <input type="checkbox" className="w-5 h-5" onChange={ () => {
                        if(selectedFilters?.includes("Improvement")){
                          setSelectedFilters([...selectedFilters].filter((item) => item !== "Improvement"))
                        }
                        else
                        {
                          setSelectedFilters([...selectedFilters, "Improvement"])
                        }
                      }}></input>
                      <p className="text-md lg:text-lg">
                        Improvement
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex row-start-2 col-start-2 justify-center items-center">
                  <input type="text" placeholder="Search..." className="w-[30vw] p-2 rounded-md outline-none bg-white" onChange={ (e) => setSearchQuery(e.target.value) }></input>
                </div>
              </div>

            <div className="w-[100%] mx-auto flex flex-col justify-start items-center">
              {
                allFeedback ?
                ( groupBy ?
                  <GroupedFeedbackComponent /> :
                (
                  areFeedbacksLoading ?
                    <>
                      <div className="w-[90%] h-[30vh] md:h-[20vh] flex justify-center items-center p-4 mb-4 rounded-md bg-slate-200 animate-pulse">
                      </div>
                      <div className="w-[90%] h-[30vh] md:h-[20vh] flex justify-center items-center p-4 mb-4 rounded-md bg-slate-200 animate-pulse">
                      </div>
                      <div className="w-[90%] h-[30vh] md:h-[20vh] flex justify-center items-center p-4 mb-4 rounded-md bg-slate-200 animate-pulse">
                      </div>
                    </>
                    :   
                    allFeedback.sort((a, b) => sortingOption === "oldest" ?
                    (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) : (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
                    .filter((selectedFilters.length > 0 ? ((item) => (selectedFilters?.includes(item.category))) : (() => true)))  
                    .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((feedback: any, index) =>
                        <div key={ index } className="w-[90%] flex flex-col justify-center items-center p-4 mb-4 bg-white rounded-md">
                          <h1 className="text-2xl w-[90%] font-bold text-center">
                            { feedback.title }
                          </h1>
                          <h3 className="text-lg w-[90%] text-ellipsis overflow-hidden whitespace-nowrap">
                            { feedback.description }
                          </h3>
                          <h3 className="text-md w-[90%]">
                            Category: { feedback.category }
                          </h3>
                          <div className="text-md w-[90%]">
                            { new Date(feedback.createdAt).toLocaleString() }
                          </div>
                        </div>
                      )
                  )
                )
                :
                <h1 className="text-2xl font-semibold">
                  No feedback to show.
                </h1>
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
