import React from 'react';
import { AppBar, Toolbar,CssBaseline } from '@mui/material';
import { styled } from '@mui/system'; // Import styled from @mui/system

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `rgb(213, 238, 229)`,
  height: '13%', 
  
}));


const StyledLogo = styled('img')({
  width: '50px', // Reduce the size of the logo
});

const Navbar = () => {
  return (
    <>
      <CssBaseline />
      <StyledAppBar position="fixed">
      
          <StyledLogo src="https://cdn.nuawoman.com/global/img/header/NuaLogo2021-TM.png" alt="Nua Logo" />
        
      </StyledAppBar>
      <Toolbar /> {/* Add a blank toolbar to create spacing below the navbar */}
    </>
  );
};

export default Navbar;
