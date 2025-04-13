import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  Divider,
  Button,
  Grid,
  Avatar,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';

const StateNewsDetails = () => {
  const { state, id } = useParams();
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [relatedNews, setRelatedNews] = useState([]);

  useEffect(() => {
    fetchStateNewsDetail();
    incrementViewCount();
    
    // Check if user has liked or bookmarked this article
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles')) || [];
    const bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
    
    setLiked(likedArticles.includes(id));
    setBookmarked(bookmarkedArticles.includes(id));
  }, [id, state]);

  const fetchStateNewsDetail = async () => {
    setLoading(true);
    
    // List of potential API endpoints to try
    const apiEndpoints = [
      `http://13.234.42.114:3333/api/news/${id}`,
      `http://13.234.42.114:3333/api/news/id/${id}`,
      `http://13.234.42.114:3333/api/news/state/${state}/${id}`
    ];
    
    let success = false;
    
    for (const endpoint of apiEndpoints) {
      try {
        const response = await axios.get(endpoint);
        console.log(`Success fetching state news data from ${endpoint}:`, response.data);
        
        // Extract data depending on API response structure
        let newsItem = null;
        if (response.data && response.data.data) {
          newsItem = response.data.data;
        } else if (response.data) {
          newsItem = response.data;
        }
        
        if (newsItem) {
          setNewsData(newsItem);
          setLikesCount(newsItem.likes || Math.floor(Math.random() * 100) + 10);
          setViewsCount(newsItem.views || Math.floor(Math.random() * 500) + 50);
          setComments(newsItem.comments || []);
          
          // Also fetch related news
          fetchRelatedNews(newsItem.state || state, newsItem.category);
          
          success = true;
          break;
        }
      } catch (err) {
        console.log(`Failed to fetch from ${endpoint}:`, err);
      }
    }
    
    // If all API calls failed, use mock data
    if (!success) {
      console.log('All API calls failed, using mock data');
      
      // Generate mock data
      const mockData = {
        id: id,
        title: `State News Article about ${state}`,
        content: `This is a sample content for the state news article from ${state}. The actual content would be loaded from the API.`,
        featuredImage: 'https://via.placeholder.com/1200x630?text=State+News+Image',
        state: state,
        district: '',
        category: 'Politics',
        author: 'John Doe',
        publishedAt: new Date().toISOString(),
        likes: Math.floor(Math.random() * 100) + 10,
        views: Math.floor(Math.random() * 500) + 50,
      };
      
      setNewsData(mockData);
      setLikesCount(mockData.likes);
      setViewsCount(mockData.views);
      
      // Generate mock comments
      const mockComments = [
        {
          id: '1',
          user: 'User1',
          text: 'Great article about this state news!',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '2',
          user: 'User2',
          text: 'I found this very informative, thanks for sharing.',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ];
      
      setComments(mockComments);
      
      // Generate mock related news
      const mockRelated = [
        {
          id: '101',
          title: `Another important news from ${state}`,
          featuredImage: 'https://via.placeholder.com/400x300?text=Related+News+1',
          state: state,
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '102',
          title: `Recent developments in ${state} politics`,
          featuredImage: 'https://via.placeholder.com/400x300?text=Related+News+2',
          state: state,
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: '103',
          title: `${state} infrastructure update`,
          featuredImage: 'https://via.placeholder.com/400x300?text=Related+News+3',
          state: state,
          publishedAt: new Date(Date.now() - 259200000).toISOString(),
        },
      ];
      
      setRelatedNews(mockRelated);
    }
    
    setLoading(false);
  };

  const fetchRelatedNews = async (stateName, category) => {
    try {
      // Try to fetch related news by state and category
      const response = await axios.get(`http://13.234.42.114:3333/api/news/category/district`);
      
      let relatedItems = [];
      if (response.data && Array.isArray(response.data)) {
        relatedItems = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        relatedItems = response.data.data;
      }
      
      // Filter by state
      if (stateName) {
        relatedItems = relatedItems.filter(item => 
          item.state && item.state.toLowerCase() === stateName.toLowerCase()
        );
      }
      
      // Filter by category if available
      if (category && relatedItems.length > 5) {
        const categoryItems = relatedItems.filter(item => 
          item.category && item.category === category
        );
        
        if (categoryItems.length >= 3) {
          relatedItems = categoryItems;
        }
      }
      
      // Exclude current article
      relatedItems = relatedItems.filter(item => item.id !== id);
      
      // Limit to 3 items
      setRelatedNews(relatedItems.slice(0, 3));
      
    } catch (err) {
      console.error('Error fetching related news:', err);
      // If API fails, we already have mock data from fetchStateNewsDetail
    }
  };

  const incrementViewCount = async () => {
    try {
      // Try to update view count on the server
      await axios.post(`http://13.234.42.114:3333/api/news/${id}/view`);
      
      // Update local view count
      setViewsCount(prev => prev + 1);
    } catch (err) {
      console.log('Error updating view count:', err);
      // Still increment the local count even if the API call fails
      setViewsCount(prev => prev + 1);
    }
  };

  const handleLikeToggle = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    
    // Update likes count
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    // Store liked state in localStorage
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles')) || [];
    
    if (newLikedState) {
      if (!likedArticles.includes(id)) {
        likedArticles.push(id);
      }
    } else {
      const index = likedArticles.indexOf(id);
      if (index > -1) {
        likedArticles.splice(index, 1);
      }
    }
    
    localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
    
    try {
      // Try to update like on the server
      await axios.post(`http://13.234.42.114:3333/api/news/${id}/like`, { 
        liked: newLikedState 
      });
    } catch (err) {
      console.log('Error updating like:', err);
      // The UI is already updated, so we don't revert on error
    }
  };

  const handleBookmarkToggle = () => {
    const newBookmarkState = !bookmarked;
    setBookmarked(newBookmarkState);
    
    // Store bookmarked state in localStorage
    const bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
    
    if (newBookmarkState) {
      if (!bookmarkedArticles.includes(id)) {
        bookmarkedArticles.push(id);
      }
    } else {
      const index = bookmarkedArticles.indexOf(id);
      if (index > -1) {
        bookmarkedArticles.splice(index, 1);
      }
    }
    
    localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarkedArticles));
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: newsData?.title,
        text: 'Check out this news article',
        url: window.location.href,
      })
      .catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.log('Error copying to clipboard:', err);
        });
    }
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      user: 'Guest User',
      text: comment,
      createdAt: new Date().toISOString(),
    };
    
    setComments(prev => [newComment, ...prev]);
    setComment('');
    
    // Try to post comment to server (this would normally be implemented)
    // For now we just update the local state
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Get full image URL (handling relative paths)
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/1200x630?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://13.234.42.114:3333${imagePath}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header with back button */}
      <Box 
        sx={{ 
          position: 'sticky', 
          top: 0, 
          backgroundColor: 'white', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 100,
          py: 1
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate(`/state/${state?.toLowerCase()}`)}
              sx={{ fontWeight: 'medium' }}
            >
              Back to {state} News
            </Button>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon fontSize="small" sx={{ color: '#666' }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {viewsCount}
                </Typography>
              </Box>
              
              <IconButton onClick={handleBookmarkToggle} size="small">
                {bookmarked ? 
                  <BookmarkIcon sx={{ color: '#673AB7' }} /> : 
                  <BookmarkBorderIcon />
                }
              </IconButton>
              
              <IconButton onClick={handleShareClick} size="small">
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Article Content */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              mb: 4, 
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              {/* Featured Image */}
              <CardMedia
                component="img"
                height="400"
                image={getFullImageUrl(newsData?.featuredImage || newsData?.image)}
                alt={newsData?.title}
                sx={{ objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1200x630?text=Error+Loading+Image';
                }}
              />
              
              <Box sx={{ p: 3 }}>
                {/* Category Tag */}
                <Box
                  sx={{
                    display: 'inline-block',
                    backgroundColor: '#673AB7',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    mb: 2
                  }}
                >
                  {newsData?.category || 'STATE'}
                </Box>
                
                {/* Title */}
                <Typography 
                  variant="h4" 
                  component="h1"
                  sx={{ 
                    fontWeight: 'bold',
                    mb: 2,
                    lineHeight: 1.3,
                  }}
                >
                  {newsData?.title}
                </Typography>
                
                {/* Metadata */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      src="https://i.pravatar.cc/150?img=12" 
                      alt={newsData?.author} 
                      sx={{ width: 36, height: 36, mr: 1 }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                        {newsData?.author || 'Unknown Author'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {formatDate(newsData?.publishedAt || newsData?.createdAt || newsData?.updatedAt)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#777',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#888888"/>
                      </svg>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#666',
                        fontSize: '0.8rem',
                      }}
                    >
                      {[newsData?.state, newsData?.district].filter(Boolean).join(', ')}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Article Content */}
                <Typography
                  variant="body1"
                  sx={{ 
                    mb: 4,
                    lineHeight: 1.7,
                    color: '#333',
                    fontSize: '1.1rem',
                    '& p': {
                      mb: 2
                    }
                  }}
                >
                  {/* If content has HTML, render it safely */}
                  {newsData?.content ? (
                    <div dangerouslySetInnerHTML={{ __html: newsData.content }} />
                  ) : (
                    'Content not available'
                  )}
                </Typography>
                
                {/* Social Interaction Bar */}
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      variant={liked ? "contained" : "outlined"}
                      startIcon={liked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                      onClick={handleLikeToggle}
                      sx={{ 
                        borderRadius: 8,
                        px: 2,
                        backgroundColor: liked ? '#673AB7' : 'transparent',
                        color: liked ? 'white' : '#673AB7',
                        borderColor: '#673AB7',
                        '&:hover': {
                          backgroundColor: liked ? '#5E35B1' : 'rgba(103, 58, 183, 0.08)',
                        }
                      }}
                    >
                      {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<ChatBubbleOutlineIcon />}
                      sx={{ 
                        borderRadius: 8,
                        px: 2,
                        color: '#666',
                        borderColor: '#ddd',
                      }}
                      onClick={() => document.getElementById('comments-section').scrollIntoView({ behavior: 'smooth' })}
                    >
                      {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                    </Button>
                  </Box>
                  
                  <Button
                    variant="outlined"
                    startIcon={<ShareIcon />}
                    onClick={handleShareClick}
                    sx={{ 
                      borderRadius: 8,
                      px: 2,
                      color: '#666',
                      borderColor: '#ddd',
                    }}
                  >
                    Share
                  </Button>
                </Box>
              </Box>
            </Card>
            
            {/* Comments Section */}
            <Box id="comments-section" sx={{ mb: 4 }}>
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 3
                }}
              >
                Comments ({comments.length})
              </Typography>
              
              {/* Comment Form */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4, gap: 2 }}>
                <Avatar 
                  sx={{ width: 40, height: 40 }}
                  src="https://i.pravatar.cc/150?img=5"
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton 
                        edge="end" 
                        onClick={handleCommentSubmit}
                        disabled={!comment.trim()}
                        sx={{ color: '#673AB7' }}
                      >
                        <SendIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
              
              {/* Comments List */}
              <Box>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <Box 
                      key={comment.id} 
                      sx={{ 
                        mb: 3,
                        p: 2,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar 
                          sx={{ width: 32, height: 32, mr: 1 }}
                          src={`https://i.pravatar.cc/150?img=${parseInt(comment.id) % 70}`}
                        />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                            {comment.user}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {formatDate(comment.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2">
                        {comment.text}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3, backgroundColor: 'white', borderRadius: 2 }}>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                      Be the first to comment on this article!
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
          
          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Related News */}
            <Card sx={{ 
              mb: 4, 
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#673AB7', 
                color: 'white',
                fontWeight: 'bold',
              }}>
                <Typography variant="h6">Related Articles</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                {relatedNews.length > 0 ? (
                  relatedNews.map((item) => (
                    <Box 
                      key={item.id} 
                      sx={{ 
                        mb: 2, 
                        '&:last-child': { mb: 0 },
                        '&:not(:last-child)': {
                          pb: 2,
                          borderBottom: '1px solid #eee'
                        }
                      }}
                    >
                      <Link 
                        to={`/state/${item.state ? item.state.toLowerCase() : 'all'}/${item.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box 
                            component="img"
                            src={getFullImageUrl(item.featuredImage || item.image)}
                            alt={item.title}
                            sx={{ 
                              width: 80, 
                              height: 60, 
                              objectFit: 'cover',
                              borderRadius: 1
                            }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80x60?text=No+Image';
                            }}
                          />
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 'medium',
                                lineHeight: 1.3,
                                mb: 0.5,
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#666',
                                display: 'block'
                              }}
                            >
                              {formatDate(item.publishedAt || item.createdAt || item.updatedAt)}
                            </Typography>
                          </Box>
                        </Box>
                      </Link>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      No related articles found
                    </Typography>
                  </Box>
                )}
              </Box>
            </Card>
            
            {/* Advertisement */}
            <Box 
              sx={{ 
                width: '100%', 
                height: 300, 
                bgcolor: '#E0E0E0', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                borderRadius: 2,
                position: 'relative',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                mb: 4
              }}
            >
              300 x 300
              <Typography 
                variant="caption" 
                sx={{ 
                  position: 'absolute', 
                  bottom: 5, 
                  right: 10, 
                  fontSize: '0.6rem',
                  color: '#AAA' 
                }}
              >
                Advertisement
              </Typography>
            </Box>
            
            {/* State Information */}
            <Card sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#673AB7', 
                color: 'white',
                fontWeight: 'bold',
              }}>
                <Typography variant="h6">About {state}</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {state === 'Bihar' && 'Bihar is a state in eastern India. It is the third-largest state by population and thirteenth-largest by territory, with an area of 94,163 km².'}
                  {state === 'Jharkhand' && 'Jharkhand is a state in eastern India. It was carved out of the southern part of Bihar on 15 November 2000.'}
                  {state === 'Uttar Pradesh' && 'Uttar Pradesh is a state in northern India. With over 200 million inhabitants, it is the most populated state in India.'}
                  {!['Bihar', 'Jharkhand', 'Uttar Pradesh'].includes(state) && `${state} is an important state in India with rich cultural heritage and diverse population.`}
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth
                  component={Link}
                  to={`/state/${state.toLowerCase()}`}
                  sx={{
                    borderRadius: 2,
                    color: '#673AB7',
                    borderColor: '#673AB7',
                  }}
                >
                  View All {state} News
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StateNewsDetails; 