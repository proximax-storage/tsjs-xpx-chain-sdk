import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../Context/AuthContext';
import { useNotification } from '../Context/NotificationContext';
import { downloadPrivateKey } from '../Util/API/SignUpAPI';

import './SignUpSuccess.scss';

const SignUpSuccess: React.FC = () => {
  const [hasRemind, setHasRemind] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const history = useHistory();
  const { currentUser, setHasXpxAcc } = useAuth();
  const { warnToast } = useNotification();

  // Disable existing user to future access this page
  useEffect(() => {
    return () => {
      setHasXpxAcc(true);
    };
  }, []);

  const downloadFile = (filename: string, text: string) => {
    var element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    );
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  const onDownload = async () => {
    if (!hasRemind) {
      try {
        console.log(currentUser.uid);
        // const res = await axios.post('/api/download-private-key', {
        //   uid: currentUser.uid,
        // });

        const res = await downloadPrivateKey(currentUser.uid);

        downloadFile('xpx-private-key', res.data);

        setPrivateKey(res.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      downloadFile('xpx-private-key', privateKey);
    }

    setHasRemind(true);
  };

  const onGetStart = () => {
    if (!hasRemind) {
      warnToast('Please download your XPX private key before proceeding');
      return;
    }

    history.push('/');
  };

  return (
    <div className='sign-up-success'>
      <p className='sign-up-success__description'>
        You have successfully signed up for a MassCheck account! Before you
        proceed, please ensure to download your{' '}
        <strong>unique private key</strong> by clicking on the download button
        below.
      </p>
      <p className='sign-up-success__note'>
        Note: You will need your private key in the future when you check out
        your XPX rewards in your ProximaX wallet.{' '}
      </p>
      <div className='sign-up-success__btn-group'>
        <button className='sign-up-success__download-btn' onClick={onDownload}>
          Download
        </button>
        <button
          className='sign-up-success__get-started-btn'
          onClick={onGetStart}
        >
          Get Started Now
        </button>
      </div>
    </div>
  );
};

export default SignUpSuccess;
