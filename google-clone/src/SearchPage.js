import React from 'react'
import './SearchPage.css'
import { useStateValue } from './StateProvider';
import useGoogleSearch from './useGoogleSearch';
import { Link } from 'react-router-dom';
import Search from './Search';
import SearchIcon from '@material-ui/icons/Search';
import DescriptionIcon from '@material-ui/icons/Description';
import ImageIcon from '@material-ui/icons/Image';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import RoomIcon from '@material-ui/icons/Room';
import MoreVertIcon from '@material-ui/icons/MoreVert';

function SearchPage() {
    const [{ term },] = useStateValue();
    const { data } = useGoogleSearch(term);
    return (
        <div className='searchPage'>
            <div className='searchPage__header'>
                <Link to="/">
                    <img
                        className='searchPage__logo'
                        src={require('./bb.jpeg')}
                        alt='google'
                    />
                </Link>
                <div className='searchPage__headerBody'>
                    <Search hideButtons term={term} />

                    <div className='searchPage__options'>
                        <div className='searchPage__optionsLeft'>
                            <div className="searchPage_option">
                                <SearchIcon />
                                <Link to="/all">All</Link>
                            </div>
                            <div className="searchPage_option">
                                <DescriptionIcon />
                                <Link to="/news">News</Link>
                            </div>
                            <div className="searchPage_option">
                                <ImageIcon />
                                <Link to="/images">Images</Link>
                            </div>
                            <div className="searchPage_option">
                                <LocalOfferIcon />
                                <Link to="/shopping">Shopping</Link>
                            </div>
                            <div className="searchPage_option">
                                <RoomIcon />
                                <Link to="/maps">Maps</Link>
                            </div>
                            <div className="searchPage_option">
                                <MoreVertIcon />
                                <Link to="/more">More</Link>
                            </div>
                            <div className="searchPage_optionsRight">
                                <div className="searchPage_option">
                                    <Link to="/settings">Settings</Link>
                                </div>
                                <div className="searchPage_option">
                                    <Link to="/tools">Tools</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='searchPage__results'>
                {data && (
                    <div className='searchPage__results'>
                        <p className='searchPage__resultsCount'>
                            About{data?.searchInformation.formattedTotalResults} results({data?.searchInformation.formattedSearchTime}seconds) for {term}
                        </p>

                        {data?.items.map(item => (
                            <div className='searchPage__result' key={item.link} >
                                <a href={item.link} target="_blank">
                                    {item.pagemap?.cse_image?.length > 0 && item.pagemap?.cse_image[0]?.src && (
                                        <img
                                            className="searchPage_resultImage"
                                            src={item.pagemap?.cse_image?.length > 0 && item.pagemap?.cse_image[0]?.src}
                                            alt=''
                                        />
                                    )}
                                    {item.displayLink}
                                </a>
                                <a href={item.link}>
                                    <h2>{item.displayLink}</h2>
                                </a>
                                <a className='searchPage__resultTitle' href={item.link}><h2>{item.title}</h2> </a>
                                <p className='searchPage__resultSnippet'>{item.snippet} </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchPage
