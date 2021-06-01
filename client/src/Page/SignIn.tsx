import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Joi from 'joi';

import { useAuth } from '../Context/AuthContext';
import { useNotification } from '../Context/NotificationContext';
import { postCreateAcc } from '../Util/API/SignUpAPI';
import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';

import './SignIn.scss';

const signInSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).max(30).required(),
});

interface validationErrorInterface {
  email?: string;
  password?: string;
}

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasNoError, setHasNoError] = useState(false);
  const [validationError, setValidationError] =
    useState<validationErrorInterface>({});
  const history = useHistory();
  const { googleSignIn, emailSignIn, currentUser, twitterSignIn } = useAuth();
  const { successToast, errorToast, warnToast } = useNotification();

  useEffect(() => {
    setHasNoError(!!(email && password));
  }, [email, password]);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onGoogleSignIn = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      const { uid, email, username, isNewUser } = await googleSignIn();

      if (isNewUser) {
        await postCreateAcc(uid, email, username);

        history.push('/sign-up-success');
        setTimeout(() => {}, 5000);
        successToast('Sign Up Successfully');
      } else {
        history.push('/');
        successToast('Sign In Successfully');
      }
    } catch (err) {
      console.log(err);
      errorToast(err.message);
    }
  };

  const onTwitterSignIn = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      const { uid, email, username, isNewUser } = await twitterSignIn();

      if (isNewUser) {
        await postCreateAcc(uid, email, username);
        setTimeout(() => {}, 5000);

        history.push('/sign-up-success');
        successToast('Sign Up Successfully');
      } else {
        history.push('/');
        successToast('Sign In Successfully');
      }
    } catch (err) {
      console.log(err);
      errorToast(err.message);
    }
  };

  const onEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validated = signInSchema.validate(
      { email, password },
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
      await emailSignIn(email, password);
      history.push('/');

      successToast('Sign In Successfully');
    } catch (err) {
      errorToast(err.message);
    }
  };

  return (
    <div className='sign-in'>
      <form
        className='sign-in__form'
        onSubmit={(e) => onEmailSignIn(e)}
        noValidate
      >
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
            <div className='sign-in__form--error'>{`Invalid email address`}</div>
          )}
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
          {!!validationError.password && (
            <div className='sign-in__form--error'>{`Password should have 8 to 30 characters`}</div>
          )}
        </div>
        <button
          type='submit'
          className='sign-in__form__submit-btn'
          disabled={!hasNoError}
        >
          Sign In
        </button>
      </form>
      <button
        className='sign-in__google-button'
        onClick={(e) => onGoogleSignIn(e)}
      >
        Sign In with <strong>Google</strong>
      </button>
      <button
        className='sign-in__twitter-button'
        onClick={(e) => onTwitterSignIn(e)}
      >
        Sign In with <strong>Twitter</strong>
      </button>
    </div>
  );
};

export default SignIn;
