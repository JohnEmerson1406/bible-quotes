import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../services/firebase'

function QuoteList() {

  const [quotesLoading, setQuotesLoading] = useState(true)
  const [quotes, setQuotes] = useState([])

  /* function to get all quotes from firestore in realtime */ 
  useEffect(() => {
    let isMounted = true;
    const quoteColRef = query(collection(db, 'quotes'), orderBy('created', 'desc'))
    onSnapshot(quoteColRef, (snapshot) => {
      if (isMounted) setQuotes(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
      if (isMounted) setQuotesLoading(false)
    })
    return () => { isMounted = false } // cleanup toggles value, if unmounted
  },[])

  let quoteList;
  if (quotesLoading) {
    quoteList = <div className='quote-list-empty'>Loading...</div>;
  } else if (quotes.length) {
    quoteList = (
      <ul className='quote-list'>
        {quotes.map(quote => (
          <div key={quote.id} className='quote-list-result'>
            <div className='quote-list-item'>
              <span className='quote-list-text'>
                {quote.data.text}
              </span>
              <div className='quote-list-buttons'>
                <button className='like-quote'>
                  <i className='fa fa-heart-o'></i>
                  <span className='owl-likes like-count'>12</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </ul>
    );
  } else {
    quoteList = <div className='quote-list-empty'>No quotes</div>;
  }

  return (
    <>{quoteList}</>
  )
}

export default QuoteList