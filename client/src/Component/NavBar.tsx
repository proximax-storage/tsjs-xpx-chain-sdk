import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Drawer, MenuList, MenuItem, } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

const drawerWidth = "30%";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      backgroundColor: "#FFF",
    },
    drawerPaper: {
      width: drawerWidth,
      alignItems: "flex-end",
      paddingRight: "30px",
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: "#f5f9fb",
      padding: theme.spacing(3),
      marginRight: "20px",
    },
  }),
);

const NavBar: React.FC = (props: any) =>{
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <h1>Mass Check</h1>
        <div className={classes.toolbar} />
        <MenuList>
          <MenuItem>
            Sign In
          </MenuItem>
          <MenuItem>
            Sign Up
          </MenuItem>
          <MenuItem>
            FAQ
          </MenuItem>
        </MenuList>
      </Drawer>

      {/* This will be the main content to be displayed */}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {/* This is where the page component should be */}
      </main>
    </div>
  );
}

export default NavBar;
