import { useEffect, useRef, useState } from 'react';
import './App.css'
import { getPhotos, searchPhotos } from "./services";

const useAutoloadingObserver = ({ ref, action }) => {
  useEffect(() => {
    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        action();
      }
    }
    const options = {
      threshold: 1
    }

    const observer = new IntersectionObserver(callback, options);

    if (ref.current)
      observer.observe(ref.current);

    return () => {
      observer.disconnect();
    }
  }, [ref])
}
function App() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const currentRef = useRef(null);

  useAutoloadingObserver({
    ref: currentRef,
    action: () => {
      setPage(prev => prev + 1);
    }
  })

  useEffect(() => {
    setIsLoading(true);
    if (query !== "") {
      searchPhotos({
        query,
        page: page + 1,
        perPage: 9
      })
        .then(({ results }) => {
          setImages((prev) => [...prev, ...results]);
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      setTimeout(() => {
        getPhotos({ perPage: 9, page: page + 1 })
          .then(data => {
            setImages(prev => [...prev, ...data]);
            setIsLoading(false);
          })
          .catch(err => {
            console.log(err);
          })
      }, 1500)

    }
  }, [page])
  const handleSearch = () => {
    setPage(1);
    setIsLoading(true);
    searchPhotos({
      query,
      page: 1,
      perPage: 9
    })
      .then(({ results }) => {
        setImages(results);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
      })
  }
  return (
    <div className="container">
      <div className="container-form">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text" placeholder='search...'
          className='container-form-input' />
        <div
          onClick={() => handleSearch()}
          className="container-form-btn">Search</div>
      </div>
      <div className="container-gallery">
        {images.map((image, index) => {
          return (
            <div className="container-gallery-item" key={index}>
              <img src={image.urls.small} alt="" />
            </div>
          )
        })}
      </div>
      {isLoading && (<div className="donut"></div>)}
      <div ref={currentRef}></div>
    </div>
  )
}

export default App
