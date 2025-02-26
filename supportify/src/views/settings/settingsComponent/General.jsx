import { Box, Button } from '@mui/material';
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../../store/slices/SettingSlice';
import { useFrappeUpdateDoc } from 'frappe-react-sdk';
import { debounce } from 'lodash';

export default function General() {

  const dispatch = useDispatch();
  const { updateDoc } = useFrappeUpdateDoc();
  const agent = useSelector((state) => state.agentReducer);

  const updateTheme = useCallback(
    debounce((themeName) => {
      try {
        updateDoc("Agent Profile", agent.agentEmail, {
          theme: themeName
        });
      } catch (err) {
        console.error("Error updating theme:", err);
      }
    }, 500),
    [agent.agentEmail]
  );

  const handleThemeChange = (themeName) => {
    dispatch(setTheme(themeName));
    updateTheme(themeName);
  };

  let themeButtons = [
    {
      name: "Default",
      color: "#00796B"
    },
    {
      name: "Cyan",
      color: "#00BCD4"
    },
    {
      name: "Blue",
      color: "#1E88E5"
    },
    {
      name: "Purple",
      color: "#9C27B0"
    },
    {
      name: "Dark",
      color: "#212121"
    },
    {
      name: "Amber",
      color: "#FFC107"
    },
    {
      name: "Pink",
      color: "#E91E63"
    },
    {
      name: "Red",
      color: "#F44336"
    },
  ]

  return (
    <div>
      <Box sx={{ p: 2, display: "grid", gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, justifyContent: "center" }}>
        {
          themeButtons.map((theme) => {
            return (
              <Button variant="contained"
                key={theme.name}
                onClick={() => handleThemeChange(theme.name.toLocaleLowerCase())}
                style={{ backgroundColor: `${theme.color}` }}
              >
                {theme.name}
              </Button>
            )
          })
        }
      </Box>
    </div>
  )
}
