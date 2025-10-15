import { useState, useEffect } from 'react';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Searchbar } from './Searchbar/Searchbar';
import { Loader } from './Loader/Loader';
import css from './App.module.css';
import { getAPI } from '../pixabay-api';
import toast, { Toaster } from 'react-hot-toast';

// refactored code -- useState
export const App = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (search === '') return;
    (async () => {
      await fetchImages(search, page);
    })();
  }, [search, page]);

  const fetchImages = async (search, page) => {
    try {
      setIsLoading(true);

      setIsEnd(false);

      const fetchedImages = await getAPI(search, page);
      const { hits, totalHits } = fetchedImages;

      if (hits.length === 0) {
        toast.error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      if (page === 1) {
        toast.success(`Hooray! We found ${totalHits} images!`);
      }

      if (page * 12 >= totalHits) {
        setIsEnd(true);
        toast("We're sorry, but you've reached the end of search results.", {
          icon: '👋',
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
          },
        });
      }

      setImages(prevState => [...prevState, ...hits]);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    const newSearch = e.target.search.value.trim().toLowerCase();

    if (newSearch === '') {
      toast.error('Please enter a search query.');
      return;
    }

    if (newSearch !== search) {
      setSearch(newSearch);
      setPage(1);
      setImages([]);
    }
  };

  const handleClick = () => {
    setPage(prevState => prevState + 1);
  };

  return (
    <div className={css.app}>
      <Searchbar onSubmit={handleSubmit} />
      {/*rendering */}
      {images.length >= 1 && <ImageGallery photos={images} />}

      {/*loadmore*/}
      {images.length >= 1 && !isEnd && <Button onClick={handleClick} />}
      {isLoading && <Loader />}
      {isError && toast.error('Oops, something went wrong! Reload this page!')}
      <Toaster position="top-right" />
    </div>
  );
};
