import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      width: "70%",
      marginLeft: "30%",
      backgroundColor: "#f5f9fb",
      color: "#66757f",
    },
    page: {  
      marginLeft: `calc(30% + 50px)`,
      marginRight: "20%",
      marginTop: "10%",
    }
  }),
);

const Header: React.FC = () => {
  const classes = useStyles();
  
  return (
    <div>
      <AppBar position="fixed" elevation={0} className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Test
          </Typography>
        </Toolbar>
        <Divider />
      </AppBar>      
    </div>
  )
};

export default Header;