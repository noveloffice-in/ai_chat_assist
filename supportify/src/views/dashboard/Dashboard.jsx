import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { Box, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import img1 from '../../assets/images/crousal/message.png';
import img2 from '../../assets/images/crousal/settings.png';
import img3 from '../../assets/images/crousal/agents.png';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PersonIcon from '@mui/icons-material/Person';
import DoneIcon from '@mui/icons-material/Done';

export default function Dashboard() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const cards = [
    {
      id: 1,
      title: 'Messages',
      content: `Supportify is an Online messaging apps are those apps which allow one to send and receive a message instantly. Popular messaging apps include Telegram, WhatsApp, Facebook Messenger, Google Chats, WeChat and Viber. They come with multiple features like location sharing, contact sharing, photo sharing, document sharing, and video and audio calls. These messaging apps can be installed on your smartphone, tablet or laptop for free.`,
      image: img1,
    },
    {
      id: 2,
      title: 'Settings',
      content: `Settings in Supportify is an Online messaging apps are those apps which allow one to send and receive a message instantly. Popular messaging apps include Telegram, WhatsApp, Facebook Messenger, Google Chats, WeChat and Viber. They come with multiple features like location sharing, contact sharing, photo sharing, document sharing, and video and audio calls. These messaging apps can be installed on your smartphone, tablet or laptop for free.`,
      image: img2,
    },
    {
      id: 3,
      title: 'Agents',
      content: `Agents in a chat component is an Online messaging apps are those apps which allow one to send and receive a message instantly. Popular messaging apps include Telegram, WhatsApp, Facebook Messenger, Google Chats, WeChat and Viber. They come with multiple features like location sharing, contact sharing, photo sharing, document sharing, and video and audio calls. These messaging apps can be installed on your smartphone, tablet or laptop for free. `,
      image: img3,
    },
  ];

  const dataCards = [
    {
      title: "AI conversations",
      count: 150,
      icon: <SwapHorizIcon />
    },
    {
      title: "Resolved by Chatbot",
      count: 400,
      icon: <DoneIcon />
    },
    {
      title: "Escalated to agents",
      count: 40,
      icon: <PersonIcon />
    }
  ];

  const extendedCards = [
    cards[cards.length - 1],
    ...cards,
    cards[0],
  ];

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex >= cards.length + 1) {
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      setCurrentIndex(cards.length);
    }
  };

  const nextCard = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(nextCard, 3000);
    return () => clearInterval(intervalId);
  }, [isTransitioning]); // Add isTransitioning as dependency

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h1" component="h2" sx={{
          background: 'linear-gradient(to right,rgb(28, 14, 221),rgb(53, 185, 135))',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}>
          Welcome to AI Chat Assistant
        </Typography>
      </Box>

      <Stack flexDirection='row' justifyContent='center' alignItems='center'>
        <Box
          sx={{
            position: 'relative',
            width: '1000px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(100, 55, 55, 0.5)',
            borderRadius: '8px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: isTransitioning ? 'transform 500ms ease-in-out' : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedCards.map((card, index) => (
              <Card
                key={`${card.id}-${index}`}
                sx={{
                  display: 'flex',
                  minWidth: '100%',
                  borderRadius: '20px',
                }}
              >
                <CardMedia
                  sx={{
                    width: '60%',
                    objectFit: 'cover',
                    borderRadius: '20px',
                    padding: "20px"
                  }}
                  component="img"
                  image={card.image}
                  alt={card.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {card.title}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                    {card.content}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Stack>

      <Stack pt={2} flexDirection="row" spacing={4} justifyContent="center">
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          {dataCards.map((data, index) => (
            <Box 
              key={index}
              sx={{ 
                width: "350px", 
                height: "140px", 
                padding: "30px", 
                backgroundColor: "#C6B8F6", 
                borderRadius: "10px", 
                boxShadow: '0 4px 12px rgba(100, 55, 55, 0.5)' 
              }}
            >
              <Typography variant='h5' component="h2" gutterBottom>{data.title}</Typography>
              <Stack flexDirection='row' gap={4}>
                <Box sx={{ 
                  width: "32px", 
                  height: "32px", 
                  borderRadius: "50%", 
                  backgroundColor: "#6E4EE7", 
                  color: "black", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}>
                  {data.icon}
                </Box>
                <Box sx={{ 
                  fontWeight: 600, 
                  fontSize: "20px", 
                  display: "flex", 
                  alignItems: "center" 
                }}>
                  {data.count}
                </Box>
              </Stack>
            </Box>
          ))}
        </Box>
      </Stack>
    </Stack>
  );
}