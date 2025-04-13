import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  Divider,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const HomeScreen = () => {
  // Social media stats exactly as in the image
  const socialMedia = [
    { icon: <FacebookIcon sx={{ fontSize: 28, color: '#4267B2' }} />, count: '20.5k', label: 'likes' },
    { icon: <InstagramIcon sx={{ fontSize: 28, color: '#C13584' }} />, count: '20.5k', label: 'followers' },
    { icon: <TwitterIcon sx={{ fontSize: 28, color: '#1DA1F2' }} />, count: '20.5k', label: 'followers' },
    { icon: <YouTubeIcon sx={{ fontSize: 28, color: '#FF0000' }} />, count: '20.5k', label: 'subscribers' },
  ];

  // Category tabs data
  const categoryTabs = [
    { name: 'Active', count: '11' },
    { name: 'Business', count: '10' },
    { name: 'Crazy', count: '5' },
  ];

  // News card component (single card with specific styling)
  const NewsCard = ({ category, title, image, time, isLarge = false, categoryColor = '#FF5722' }) => {
    return (
      <Box
        component={Link}
        to={`/news/1`}
        sx={{
          display: 'block',
          height: isLarge ? { xs: 350, md: 400 } : { xs: 200, md: 240 },
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
          textDecoration: 'none',
          '&:hover': {
            '& .news-bg': {
              transform: 'scale(1.05)',
              transition: 'transform 0.5s ease'
            }
          }
        }}
      >
        {/* Background image */}
        <Box
          className="news-bg"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.3s ease',
          }}
        />
        
        {/* Dark overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 1,
          }}
        />
        
        {/* Category label */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: categoryColor,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.7rem',
              padding: '4px 12px',
              borderRadius: '4px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {category}
          </Box>
        </Box>
        
        {/* News content */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.9))',
            zIndex: 2,
          }}
        >
          <Typography
            variant={isLarge ? "h5" : "h6"}
            sx={{
              color: 'white',
              fontWeight: '600',
              mb: 2,
              lineHeight: 1.3,
              fontSize: isLarge ? '1.3rem' : '1rem',
            }}
          >
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon 
              sx={{ 
                fontSize: '16px', 
                mr: 1, 
                color: 'rgba(255,255,255,0.8)' 
              }} 
            />
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.8rem',
              }}
            >
              {time}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  // Category tab component
  const CategoryTab = ({ name, count }) => (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#000',
        color: 'white',
        p: 2,
        borderRadius: 2,
        mb: 2,
        cursor: 'pointer',
        '&:hover': {
          opacity: 0.9
        }
      }}
    >
      <Typography fontWeight="medium">{name}</Typography>
      <Box 
        sx={{ 
          backgroundColor: 'white', 
          color: 'black', 
          width: 30, 
          height: 30, 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}
      >
        {count}
      </Box>
    </Box>
  );

  // 970 x 100 Advertisement component
  const LargeAd = () => (
    <Box 
      sx={{ 
        width: '100%', 
        height: 100, 
        bgcolor: '#E0E0E0', 
        mb: 2, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        borderRadius: 1,
        position: 'relative',
      }}
    >
      970 x 100
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
        Powered by HTML.COM
      </Typography>
    </Box>
  );

  // 380 x 350 Advertisement component
  const SideAd = () => (
    <Box 
      sx={{ 
        width: '100%', 
        height: 350, 
        bgcolor: '#E0E0E0', 
        mb: 3, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        borderRadius: 1,
        position: 'relative',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      380 x 350
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
        Powered by HTML.COM
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, md: 4 } }}>
        {/* TRENDING SECTION - Moved to the top */}
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            position: 'relative',
            pl: 2,
            '&:before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 5,
              backgroundColor: '#FF5722',
              borderRadius: 1
            }
          }}
        >
          TRENDING NEWS
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 }, mb: 3 }}>
          {/* Left Side - News Cards */}
          <Box sx={{ flex: 7, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
            {/* First News Card */}
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                category="TRENDING"
                title="मौसम विभाग ने जारी किया अलर्ट, इन राज्यों में भारी बारिश की चेतावनी"
                image="https://static.toiimg.com/thumb/msid-101386088,width-1280,height-720,resizemode-4/101386088.jpg"
                time="April 10, 2025, 8:45 A.M."
                isLarge={true}
                categoryColor="#FF5722"
              />
            </Box>
            
            {/* Second News Card */}
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                category="TRENDING"
                title="पटना में अचानक बदला मौसम, तेज हवाओं के साथ बारिश का अनुमान"
                image="https://images.indianexpress.com/2023/06/weather-5.jpg"
                time="April 10, 2025, 8:30 A.M."
                isLarge={true}
                categoryColor="#FF5722"
              />
            </Box>
          </Box>
          
          {/* Right Side - Sidebar */}
          <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Advertisement */}
            <SideAd />
            
            {/* Category Tabs */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {categoryTabs.map((tab, index) => (
                <CategoryTab key={index} name={tab.name} count={tab.count} />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Advertisement after Trending */}
        <LargeAd />
        
        {/* First Section - Top Grid (First Image Layout) */}
        <Grid container spacing={2} sx={{ mb: 0 }}>
          {/* Large card on left */}
          <Grid item xs={12} md={6}>
            <NewsCard 
              category="TRENDING"
              title="जदयू नेता नायब गुलाम रसूल बलियावी भी पार्टी को कहेंगे अलविदा, कहा- सीएम नीतीश से हुई है चूक"
              image="https://images.indianexpress.com/2023/05/bihar-politics.jpg"
              time="April 10, 2025, 8:19 P.M."
              isLarge={true}
              categoryColor="#FF5722"
            />
          </Grid>
          
          {/* 2x2 grid on right */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <NewsCard 
                  category="SPORTS"
                  title="IPL 2025 में धोनी बने चेन्नई के कप्तान, हुआ ऐलान"
                  image="https://cdn.dnaindia.com/sites/default/files/styles/full/public/2023/05/23/2591711-2558075-ms-dhoni.jpg"
                  time="April 10, 2025, 7:48 P.M."
                  categoryColor="#4CAF50"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <NewsCard 
                  category="SPORTS"
                  title="ओलंपिक में 128 साल बाद क्रिकेट की वापसी, छह ..."
                  image="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1280,q_70/lsci/db/PICTURES/CMS/371800/371825.jpg"
                  time="April 10, 2025, 7:39 P.M."
                  categoryColor="#4CAF50"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <NewsCard 
                  category="TRENDING"
                  title="महाकुंभ में अपने सास-ससुर को स्नान कराने न ले ..."
                  image="https://images.news18.com/hindi/uploads/2023/12/indian-railway.jpg"
                  time="April 10, 2025, 7:11 P.M."
                  categoryColor="#FF5722"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <NewsCard 
                  category="NATIONAL"
                  title="भारत लाया गया मुंबई आतंकी हमले का मास्टरमाइंड तहव्वुर ..."
                  image="https://images.hindustantimes.com/img/2023/01/25/1600x900/tahawwur_rana_1674642197045_1674642197296_1674642197296.JPG"
                  time="April 10, 2025, 7:01 P.M."
                  categoryColor="#D32F2F"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* NATIONAL SECTION */}
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 2, 
            mt: -45,
            fontWeight: 'bold',
            position: 'relative',
            pl: 2,
            '&:before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 5,
              backgroundColor: '#D32F2F',
              borderRadius: 1
            }
          }}
        >
          NATIONAL NEWS
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 }, mb: 3 }}>
          {/* Left Side - News Cards */}
          <Box sx={{ flex: 7, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
            {/* First News Card */}
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                category="NATIONAL"
                title="पीएम मोदी ने की महाराष्ट्र विधानसभा चुनाव प्रचार की शुरुआत..."
                image="https://i.ibb.co/NtpjxXK/pm-modi.jpg"
                time="April 10, 2025, 6:30 P.M."
                isLarge={true}
                categoryColor="#D32F2F"
              />
            </Box>
            
            {/* Second News Card */}
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                category="NATIONAL"
                title="लखीमपुर खीरी के कबीरधाम सत्संग में बोले मोहन भागवत - 'महापुरुषों ने की भारतीय संस्कृति की रक्षा'"
                image="https://images.news18.com/hindi/uploads/2022/10/RSS-Chief-Mohan-Bhagwat.jpg"
                time="April 9, 2025, 10:07 A.M."
                isLarge={true}
                categoryColor="#D32F2F"
              />
            </Box>
          </Box>
          
          {/* Right Side - Social Media and Recent Posts */}
          <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Social Media Stats Box */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                border: '1px solid #eee',
                borderRadius: 1,
                overflow: 'hidden',
                mb: 3,
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              {socialMedia.map((item, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    width: '50%', 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRight: index % 2 === 0 ? '1px solid #eee' : 'none',
                    borderBottom: index < 2 ? '1px solid #eee' : 'none',
                  }}
                >
                  {item.icon}
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', mt: 1 }}>
                    {item.count}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Advertisement after National */}
        <LargeAd />

        {/* INTERNATIONAL SECTION */}
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            position: 'relative',
            pl: 2,
            '&:before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 5,
              backgroundColor: '#1976D2',
              borderRadius: 1
            }
          }}
        >
          INTERNATIONAL NEWS
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 }, mb: 3 }}>
          {/* Left Side - News Cards */}
          <Box sx={{ flex: 7, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
            {/* First News Card */}
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                category="INTERNATIONAL"
                title="अमेरिकी राष्ट्रपति ने किया नए विदेश नीति का ऐलान, चीन पर बढ़ाया दबाव..."
                image="https://i.ibb.co/XCkDXbL/us-president.jpg"
                time="April 10, 2025, 5:45 P.M."
                isLarge={true}
                categoryColor="#1976D2"
              />
            </Box>
            
            {/* Second News Card */}
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                category="INTERNATIONAL"
                title="रूस-यूक्रेन संघर्ष में नया मोड़, यूरोपीय संघ ने बताई शांति की शर्तें"
                image="https://static.toiimg.com/thumb/msid-100139171,width-1280,height-720,resizemode-4/100139171.jpg"
                time="April 10, 2025, 5:30 P.M."
                isLarge={true}
                categoryColor="#1976D2"
              />
            </Box>
          </Box>
          
          {/* Right Side - Advertisement */}
          <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <SideAd />
          </Box>
        </Box>

        {/* Advertisement after International */}
        <LargeAd />

        {/* SPORTS SECTION */}
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            position: 'relative',
            pl: 2,
            '&:before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 5,
              backgroundColor: '#4CAF50',
              borderRadius: 1
            }
          }}
        >
          SPORTS NEWS
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 }, mb: 3 }}>
          {/* Left Side - News Cards */}
          <Box sx={{ flex: 7, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
            {/* First News Card */}
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                category="SPORTS"
                title="IPL 2025 में धोनी बने चेन्नई के कप्तान, हुआ ऐलान"
                image="https://cdn.dnaindia.com/sites/default/files/styles/full/public/2023/05/23/2591711-2558075-ms-dhoni.jpg"
                time="April 10, 2025, 7:48 P.M."
                isLarge={true}
                categoryColor="#4CAF50"
              />
            </Box>
            
            {/* Second News Card */}
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                category="SPORTS"
                title="ओलंपिक में 128 साल बाद क्रिकेट की वापसी, छह टीमों के बीच होगा मुकाबला"
                image="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1280,q_70/lsci/db/PICTURES/CMS/371800/371825.jpg"
                time="April 10, 2025, 7:39 P.M."
                isLarge={true}
                categoryColor="#4CAF50"
              />
            </Box>
          </Box>
          
          {/* Right Side - Advertisement */}
          <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <SideAd />
          </Box>
        </Box>

        {/* Advertisement after Sports */}
        <LargeAd />

        {/* STATE NEWS SECTION */}
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            position: 'relative',
            pl: 2,
            '&:before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 5,
              backgroundColor: '#FFC107',
              borderRadius: 1
            }
          }}
        >
          STATE NEWS
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 }, mb: 3 }}>
          {/* Left Side - News Cards */}
          <Box sx={{ flex: 7, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
            {/* First News Card */}
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                category="STATE"
                title="बिहार: पटना में सड़क हादसा, दो की मौत, पांच घायल"
                image="https://images.news18.com/hindi/uploads/2023/07/Road-accident-3.jpg"
                time="April 10, 2025, 5:15 P.M."
                isLarge={true}
                categoryColor="#FFC107"
              />
            </Box>
            
            {/* Second News Card */}
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                category="STATE"
                title="बिहार के मुख्यमंत्री ने शुरू की नई योजना, युवाओं को मिलेगा रोजगार का अवसर"
                image="https://images.tv9hindi.com/wp-content/uploads/2023/03/bihar-cm-nitish-kumar.jpg"
                time="April 10, 2025, 5:00 P.M."
                isLarge={true}
                categoryColor="#FFC107"
              />
            </Box>
          </Box>
          
          {/* Right Side - Advertisement */}
          <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <SideAd />
          </Box>
        </Box>

        {/* Last Advertisement */}
        <LargeAd />

        {/* ENTERTAINMENT SECTION - Keeping as the last section */}
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            position: 'relative',
            pl: 2,
            '&:before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 5,
              backgroundColor: '#9C27B0',
              borderRadius: 1
            }
          }}
        >
          ENTERTAINMENT NEWS
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 }, mb: 3 }}>
          {/* Left Side - News Cards */}
          <Box sx={{ flex: 7, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
            {/* First News Card */}
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                category="ENTERTAINMENT"
                title="अनुष्का शर्मा और विराट कोहली ने शेयर की बेटी वामिका की पहली तस्वीर..."
                image="https://i.ibb.co/YQJTgqy/virat-anushka.jpg"
                time="April 10, 2025, 6:15 P.M."
                isLarge={true}
                categoryColor="#9C27B0"
              />
            </Box>
            
            {/* Second News Card */}
            <Box sx={{ flex: 1 }}>
              <NewsCard 
                category="ENTERTAINMENT"
                title="रणबीर कपूर की अगली फिल्म का हुआ ऐलान, निर्देशक संजय लीला भंसाली के साथ पहली बार करेंगे काम"
                image="https://i.ibb.co/3yqNRXd/ranbir-kapoor.jpg"
                time="April 10, 2025, 6:00 P.M."
                isLarge={true}
                categoryColor="#9C27B0"
              />
            </Box>
          </Box>
          
          {/* Right Side - Advertisement */}
          <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <SideAd />
          </Box>
        </Box>

        {/* Final Advertisement */}
        <LargeAd />
      </Container>
    </Box>
  );
};

export default HomeScreen; 