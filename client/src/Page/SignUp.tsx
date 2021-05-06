import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useNotification } from '../Context/NotificationContext';

import './SignUp.scss';

// Custom type to hold the user registration info, to be used for validation
type User = {
  username: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
};

type signUpAuth = (email: string, password: string) => void;

const SignUp: React.FC = () => {
  // Store the password to be validated with the confirmation input
  const [password, setPassword] = useState();
  const { signUp } = useAuth();
  const history = useHistory();
  const { successToast } = useNotification();

  // Declare useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();

  // Route to server
  const onSubmit = handleSubmit(async (data) => {
    const { emailAddress, password } = data;

    await signUp(emailAddress, password);
    successToast('Sign Up Successfully');
    history.push('/');
    console.log('success');
  });

  // Update password state onChange
  const onChange = (e: any) => {
    setPassword(e.target.value);
  };

  return (
    // {...register())} registers inputs to be validated
    <form onSubmit={onSubmit} className='sign-up-form'>
      <div>
        <label htmlFor='username'>Username</label>
        <input
          {...register('username', { required: 'Required' })}
          name='username'
          placeholder='Username'
          type='text'
        />
        {errors.username && (
          <div className='error'>{errors.username.message}</div>
        )}
      </div>

      <div>
        <label htmlFor='emailAddress'>Email Address</label>
        <input
          {...register('emailAddress', {
            required: 'Required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'invalid email address',
            },
          })}
          name='emailAddress'
          type='emailAddress'
          placeholder='Email Address'
        />
        {errors.emailAddress && (
          <div className='error'>{errors.emailAddress.message}</div>
        )}
      </div>

      <br />

      <div>
        <label htmlFor='password'>Password</label>
        <input
          {...register('password', {
            required: 'Required',
            minLength: {
              value: 8,
              message: 'Password should have 8 to 30 characters',
            },
            maxLength: {
              value: 30,
              message: 'Password should have 8 to 30 characters',
            },
          })}
          name='password'
          type='password'
          placeholder='Password (8 - 30 characters)'
          onChange={onChange}
        />
        {errors.password && (
          <div className='error'>{errors.password.message}</div>
        )}
      </div>

      <div>
        <label htmlFor='confirmPassword'>Confirm Password</label>
        <input
          {...register('confirmPassword', {
            required: 'Required',
            validate: (v) => v === password || 'Password does not match',
          })}
          name='confirmPassword'
          type='password'
          placeholder='Re-enter Password'
        />
        {errors.confirmPassword && (
          <div className='error'>{errors.confirmPassword.message}</div>
        )}
      </div>

      <br />

      {/* Styling for submit button */}
      <button type='submit' className={`valid-button`}>
        Sign Up
      </button>
    </form>
  );
};

export default SignUp;
