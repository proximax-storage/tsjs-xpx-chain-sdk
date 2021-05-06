import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Joi from 'joi';

import { useAuth } from '../Context/AuthContext';
import { useNotification } from '../Context/NotificationContext';

import './SignIn.scss';

const signInSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .min(8)
    .max(30)
    .required(),
});

const SignIn: React.FC = () => {
  // Store the password to be validated with the confirmation input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [counter, setCounter] = useState(0);
  const history = useHistory();
  const { googleSignIn, emailSignIn } = useAuth();
  const { successToast, errorToast } = useNotification();
  let hasNoError = false;

  useEffect(() => {
    setCounter(counter + 1);

    if (counter > 10) {
      hasNoError = true;
    }

    console.log(counter);
    console.log(hasNoError);
  }, [email, password]);

  const errors = {};

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    console.log(email);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    console.log(password);
  };

  const onEmailSignIn = async () => {
    try {
      await googleSignIn();
      // await emailSignIn(emailAddress, password);
      history.push('/');

      successToast('Sign Up Successfully');
    } catch (err) {
      errorToast(err.message);
    }
  };

  return (
    <div className='sign-in'>
      <form className='sign-in__form' noValidate>
        <div>
          <label htmlFor='email'>Email Address</label>
          <input
            name='email'
            type='email'
            placeholder='Email Address'
            value={email}
            onChange={(e) => onEmailChange(e)}
          />
          {/* {errors.emailAddress && (
            <div className='error'>{errors.emailAddress.message}</div>
          )} */}
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            name='password'
            type='password'
            placeholder='Password (8 - 30 characters)'
            value={password}
            onChange={(e) => onPasswordChange(e)}
          />
          {/* {errors.password && (
            <div className='error'>{errors.password.message}</div>
          )} */}
        </div>

        {/* Styling for submit button */}
        <button
          type='submit'
          className={`valid-button`}
          disabled={!hasNoError}
          onClick={onEmailSignIn}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
