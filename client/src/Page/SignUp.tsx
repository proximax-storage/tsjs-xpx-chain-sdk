import React, { useState, useEffect } from 'react';
import Joi from 'joi';

import { useHistory } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useNotification } from '../Context/NotificationContext';
import { postCreateAcc } from '../Util/API/SignUpAPI';

import './SignUp.scss';

const signInSchema = Joi.object({
  username: Joi.string().alphanum().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).max(30).required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')),
});
interface validationErrorInterface {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasNoError, setHasNoError] = useState(false);
  const [validationError, setValidationError] =
    useState<validationErrorInterface>({});
  const history = useHistory();
  const { signUp } = useAuth();
  const { successToast, errorToast } = useNotification();

  useEffect(() => {
    setHasNoError(!!(username && email && password && confirmPassword));
  }, [username, email, password, confirmPassword]);

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const onEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validated = signInSchema.validate(
      { username, email, password, confirmPassword },
      { abortEarly: false }
    );

    // Check if the validation got error
    if (!!validated.error) {
      const { details } = validated.error;

      let errorArr = details.map((element) => {
        return [element.context.key, element.message];
      });

      const constructObject = (arr) => {
        return arr.reduce((acc, val) => {
          const [key, value] = val;
          acc[key] = value;
          return acc;
        }, {});
      };

      setValidationError(constructObject(errorArr));

      errorToast('Validation Error');

      return;
    }

    try {
      const uid = await signUp(email, password);

      console.log(uid);

      await postCreateAcc(uid, email, username);
      setTimeout(() => {}, 5000);
      history.push('/sign-up-success');

      successToast('Sign Up Successfully');
    } catch (err) {
      errorToast(err.message);
    }
  };

  return (
    <div className='sign-up'>
      <form
        className='sign-up__form'
        onSubmit={(e) => onEmailSignUp(e)}
        noValidate
      >
        <div>
          <label htmlFor='username'>Username</label>
          <input
            name='username'
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => onUsernameChange(e)}
          />
          {!!validationError.username && (
            <div className='sign-up__form--error'>{`Username can't contain special characters`}</div>
          )}
        </div>
        <div>
          <label htmlFor='email'>Email Address</label>
          <input
            name='email'
            type='email'
            placeholder='Email Address'
            value={email}
            onChange={(e) => onEmailChange(e)}
          />
          {!!validationError.email && (
            <div className='sign-up__form--error'>{`Invalid email address`}</div>
          )}
        </div>
        <div className='sign-up__form__password-group'></div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            name='password'
            type='password'
            placeholder='Password (8 - 30 characters)'
            value={password}
            onChange={(e) => onPasswordChange(e)}
          />
          {!!validationError.password && (
            <div className='sign-up__form--error'>{`Password should have 8 to 30 characters`}</div>
          )}
        </div>
        <div>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            name='confirmPassword'
            type='password'
            placeholder='Re-enter Password'
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e)}
          />
          {!!validationError.confirmPassword && (
            <div className='sign-up__form--error'>{`Password does not match`}</div>
          )}
        </div>
        <button
          type='submit'
          className='sign-up__form__submit-btn'
          disabled={!hasNoError}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
