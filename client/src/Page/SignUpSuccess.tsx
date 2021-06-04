import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../Context/AuthContext';
import { useNotification } from '../Context/NotificationContext';
import { downloadPrivateKey, storeXpxAddress } from '../Util/API/SignUpAPI';
import downloadFile from '../Util/Useful/DownloadFile';

import './SignUpSuccess.scss';

const SignUpSuccess: React.FC = () => {
  const [hasRemind, setHasRemind] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [address, setAddress] = useState('');
  const history = useHistory();
  const { currentUser, setHasXpxAcc } = useAuth();
  const { warnToast } = useNotification();

  // Disable existing user to future access this page
  useEffect(() => {
    return () => {
      setHasXpxAcc(true);
    };
  }, []);

  const onDownload = async () => {
    if (!hasRemind) {
      try {
        console.log(currentUser.uid);

        const res = await downloadPrivateKey();

        const { address, privateKey } = res.data;

        console.log(res);

        downloadFile('xpx-private-key', privateKey);
        setPrivateKey(privateKey);
        setAddress(address);
      } catch (error) {
        console.log(error);
      }
    } else {
      downloadFile('xpx-private-key', privateKey);
    }

    setHasRemind(true);
  };

  const onGetStart = async () => {
    if (!hasRemind) {
      warnToast('Please download your XPX private key before proceeding');
      return;
    }
    try {
      const res = await storeXpxAddress(currentUser.uid, address);

      console.log(res);
    } catch (err) {
      console.log(err);
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
