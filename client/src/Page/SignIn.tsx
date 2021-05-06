import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import AltSignIn from '../Component/AltSignIn';
import './SignIn.scss';

type User = {
  emailAddress: string;
  password: string;
};



const SignIn: React.FC = () => {
  // Store the password to be validated with the confirmation input
  const [password, setPassword] = useState();

  // Declare useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();
  
  // Dummy onSubmit function
   const onSubmit = handleSubmit((data) => {
    alert(JSON.stringify(data));
  });

  // Update password state onChange
  const onChange = (e: any) => {
    setPassword(e.target.value);
    console.log(password);
  };
  
  return (

    // {...register())} registers inputs to be validated
    <form onSubmit={onSubmit} className="sign-in-form">

      <div>
        <label htmlFor="emailAddress">Email Address</label>
        <input
          {...register('emailAddress', {
            required: 'Required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'invalid email address',
            },
          })}
          name="emailAddress"
          type="emailAddress"
          placeholder="Email Address"
        />
        {errors.emailAddress && (
          <div className="error">{errors.emailAddress.message}</div>
        )}
      </div>

      <br />

      <div>
        <label htmlFor="password">Password</label>
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
          name="password"
          type="password"
          placeholder="Password (8 - 30 characters)"
          onChange={onChange}
        />
        {errors.password && (
          <div className="error">{errors.password.message}</div>
        )}
      </div>

      <br />

      {/* Styling for submit button */}
      <button type="submit" className={`valid-button`}>
        Sign In
      </button>
          
      <br />
          
      <div>
      <AltSignIn />
      </div>

    </form>


    
    
  );
};

export default SignIn;
