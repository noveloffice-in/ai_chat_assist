import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { Box, Stack, styled } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import img1 from '../../assets/images/crousal/supportify.png';
import img2 from '../../assets/images/crousal/settings.png';
import img3 from '../../assets/images/crousal/agents.png';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PersonIcon from '@mui/icons-material/Person';
import DoneIcon from '@mui/icons-material/Done';

const CustomBox = styled(Box)(({ theme }) => ({
  width: "350px", height: "140px", padding: "30px", backgroundColor: "#C6B8F6", borderRadius: "10px", boxShadow: '0 4px 12px rgba(100, 55, 55, 0.5)'
}));

const CustomIconBox = styled(Box)(({ theme }) => ({
  width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#6E4EE7", color: "black", display: "flex", alignItems: "center", justifyContent: "center"
}))

export default function Dashboard() {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const cards = [
    {
      id: 1,
      title: 'Supportify',
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

  const extendedCards = [
    cards[cards.length - 1],
    ...cards,
    cards[0],
  ];

  const nextCard = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= cards.length) {
        // When we reach the cloned first slide
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(0);
        }, 0);
      }
      return nextIndex;
    });
  };

  useEffect(() => {
    const intervalId = setInterval(nextCard, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
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

        <Stack flexDirection='row' justifyContent='center' alignItems='center' >
          <Box
            sx={{
              position: 'relative',
              width: '900px',
              overflow: 'hidden',
              border: '1px solid gray',
              boxShadow: '0 4px 12px rgba(100, 55, 55, 0.5)',
              borderRadius: '8px',
              padding: "4px"
            }}
          >
            {/* Transition Effect using @keyframes */}
            <Box
              sx={{
                display: 'flex',
                transition: 'transform 1s ease',
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: isTransitioning ? 'transform 500ms ease-in-out' : 'none',
                padding: "1.5rem"
              }}
            >
              {extendedCards.map((card) => (
                <Card
                  key={card.id}
                  sx={{
                    display: 'flex',
                    minWidth: '100%',
                    transition: 'transform 1s ease', // Smooth transition on card change
                  }}
                >
                  <CardMedia
                    sx={{
                      width: '60%',
                      objectFit: 'cover',
                      transition: 'transform 1s ease', // Smooth image transition
                      boxShadow: '0 4px 12px rgb(73, 52, 57)',
                      borderRadius: '8px',
                    }}
                    component="img"
                    image={card.image}
                    alt={card.title}
                  />
                  <CardContent >
                    <Typography gutterBottom variant="h5" component="Box">
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

        <Stack pt={2} flexDirection="row" spacing={4} justifyContent="center" >
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <CustomBox>
              <Typography variant='h5' component="h2" gutterBottom>AI conversations</Typography>
              <Stack flexDirection='row' gap={4}>
                <CustomIconBox>
                  <SwapHorizIcon />
                </CustomIconBox>
                <Box sx={{ fontWeight: 600, fontSize: "20px", display: "flex", alignItems: "center" }}>
                  150
                </Box>
              </Stack>
            </CustomBox>

            <CustomBox>
              <Typography variant='h5' component="h2" gutterBottom>Resolved by Chatbot</Typography>
              <Stack flexDirection='row' gap={4}>
                <CustomIconBox>
                  <DoneIcon />
                </CustomIconBox>
                <Box sx={{ fontWeight: 600, fontSize: "20px", display: "flex", alignItems: "center" }}>
                  400
                </Box>
              </Stack>
            </CustomBox>

            <CustomBox>
              <Typography variant='h5' component="h2" gutterBottom>Escalated to agents</Typography>
              <Stack flexDirection='row' gap={4}>
                <CustomIconBox>
                  <PersonIcon />
                </CustomIconBox>
                <Box sx={{ fontWeight: 600, fontSize: "20px", display: "flex", alignItems: "center" }}>
                  40
                </Box>
              </Stack>

            </CustomBox>

          </Box >
        </Stack >
      </Stack>
    </>
  );
}
