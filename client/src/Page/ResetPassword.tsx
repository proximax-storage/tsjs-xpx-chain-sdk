import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Joi from 'joi';
import { useNotification } from '../Context/NotificationContext';
import { useAuth } from '../Context/AuthContext';

import './ResetPassword.scss';

const emailSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
});

interface validationErrorInterface {
  email?: string;
}

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [hasNoError, setHasNoError] = useState(false);
  const { successToast, errorToast, warnToast } = useNotification();
  const [validationError, setValidationError] =
    useState<validationErrorInterface>({});
  const { resetPassword } = useAuth();
  const history = useHistory();

  useEffect(() => {
    setHasNoError(!!email);
  }, [email]);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validated = emailSchema.validate({ email }, { abortEarly: false });

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

    const result: boolean = resetPassword(email);

    if (result) {
      successToast('Reset Password Succesfully. Please check your inbox.');
      history.push('/sign-in');
    } else {
      errorToast('Reset Password Failed. Please try again later.');
    }
  };

  return (
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
      <button
        type='submit'
        className='sign-in__form__submit-btn'
        disabled={!hasNoError}
      >
        Reset Password
      </button>
    </form>
  );
};

export default ResetPassword;
