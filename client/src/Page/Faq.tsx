import React from 'react';
import { useHistory } from 'react-router-dom';

const Error404: React.FC = () => {
  const history = useHistory();

  const onNext = () => {
    // history.push('/');
  };

  return <h1>FAQ Development in Progress</h1>;
};

export default Error404;
